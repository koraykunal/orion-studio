import { connect as connectTls, type TLSSocket } from "node:tls";
import { connect as connectTcp, type Socket } from "node:net";

/**
 * Minimal SMTP submission client.
 *
 * Why not nodemailer: Auth.js declares `nodemailer@^7 || ^8` as a peer
 * dependency and will not resolve against a non-vulnerable release, and the
 * 8.x line carries four open advisories. Every one of those advisories lives
 * in nodemailer's *inbound* handling (address parsing, recipient allow-lists,
 * resolveContent), none of which this application uses: the recipient is a
 * build-time constant and the only user-supplied address is passed through a
 * strict validator below before it ever reaches the wire.
 *
 * The protocol subset implemented here is deliberately small: single sender,
 * single recipient, no attachments, no MIME multipart, no URL or file
 * resolution. That is the whole feature set the contact form needs.
 */

const CRLF = "\r\n";

/**
 * Intentionally stricter than RFC 5322. We reject anything with comments,
 * quoted local parts, display names, or multiple addresses rather than trying
 * to parse it, which is where every published address-parsing bug lives.
 */
const ADDRESS_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export function isValidEmailAddress(value: unknown): value is string {
    if (typeof value !== "string") return false;
    const address = value.trim();
    if (address.length > 254) return false;
    if (address.includes("..")) return false;
    return ADDRESS_RE.test(address);
}

/**
 * Removes anything that could terminate a header line. A raw user string in a
 * mail header is a header-injection sink: `\r\n` lets an attacker append
 * arbitrary headers, and a bare `\n` is enough to desync naive parsers.
 */
export function stripHeaderControl(value: string): string {
    return value.replace(/[\r\n\u0000]+/g, " ").trim();
}

/** RFC 2047 base64 encoded-word, so non-ASCII header values survive. */
function encodeHeaderValue(value: string): string {
    const safe = stripHeaderControl(value);
    if (!safe) return "";
    if (!/[^\x20-\x7e]/.test(safe)) return safe;
    return `=?UTF-8?B?${Buffer.from(safe, "utf8").toString("base64")}?=`;
}

function formatAddress(address: string): string {
    return `<${address.trim()}>`;
}

export type SmtpConfig = {
    host: string;
    port: number;
    /** Implicit TLS (usually 465). When false, STARTTLS is attempted on 587. */
    secure: boolean;
    user?: string;
    password?: string;
    /** Envelope sender. Should be an address on the authenticated domain. */
    from: string;
    /** Value used for EHLO. Defaults to "localhost". */
    helo?: string;
    timeoutMs?: number;
};

export type SmtpMessage = {
    to: string;
    subject: string;
    /** Plain-text alternative. Rendered first so it survives text-only clients. */
    text: string;
    /** HTML alternative. Never interpolated without escaping first. */
    html: string;
};

export class SmtpError extends Error {
    constructor(
        message: string,
        readonly code: string,
    ) {
        super(message);
        this.name = "SmtpError";
    }
}

/**
 * Reads one complete SMTP reply, collapsing the multi-line `250-` continuation
 * form into a single string. Resolves on any 2xx/3xx, rejects otherwise.
 */
function readReply(socket: Socket | TLSSocket, timeoutMs: number): Promise<string> {
    return new Promise((resolve, reject) => {
        let buffer = "";
        let settled = false;

        const cleanup = () => {
            socket.off("data", onData);
            socket.off("error", onError);
            socket.off("timeout", onTimeout);
            socket.off("close", onClose);
            socket.setTimeout(0);
        };

        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(error);
        };

        const onTimeout = () => fail(new SmtpError("Timed out waiting for the SMTP server.", "ETIMEDOUT"));
        const onError = (error: Error) => fail(new SmtpError(`SMTP socket error: ${error.message}`, "ESOCKET"));
        const onClose = () => fail(new SmtpError("SMTP connection closed unexpectedly.", "ECONNCLOSED"));

        const onData = (chunk: Buffer) => {
            buffer += chunk.toString("utf8");

            // A reply ends with "NNN " (space) on the last line; "NNN-" continues it.
            const lines = buffer.split(CRLF);
            const last = lines[lines.length - 1] ?? "";
            if (!/^\d{3} /.test(last)) return;

            const status = Number.parseInt(last.slice(0, 3), 10);
            const text = lines
                .map((line) => line.slice(4))
                .join("\n")
                .trim();

            settled = true;
            cleanup();
            if (status >= 200 && status < 400) resolve(text);
            else reject(new SmtpError(`SMTP server replied ${status}: ${text}`, `ESMTP_${status}`));
        };

        socket.setTimeout(timeoutMs);
        socket.on("data", onData);
        socket.on("error", onError);
        socket.on("timeout", onTimeout);
        socket.on("close", onClose);
    });
}

/** Sends one command and resolves with the server's reply text. */
async function command(socket: Socket | TLSSocket, line: string, timeoutMs: number): Promise<string> {
    socket.write(line.endsWith(CRLF) ? line : line + CRLF);
    return readReply(socket, timeoutMs);
}

/** SMTP dot-stuffing: a line consisting of a single dot must become two. */
function dotStuff(body: string): string {
    return body
        .split(/\r?\n/)
        .map((line) => (line.startsWith(".") ? `.${line}` : line))
        .join(CRLF);
}

function buildMime(message: SmtpMessage, config: SmtpConfig, boundary: string): string {
    const headers = [
        `From: ${formatAddress(config.from)}`,
        `To: ${formatAddress(message.to)}`,
        `Subject: ${encodeHeaderValue(message.subject)}`,
        `Date: ${new Date().toUTCString()}`,
        `Message-ID: <${boundary}@${config.helo ?? "localhost"}>`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ];

    const body = [
        headers.join(CRLF),
        CRLF,
        `--${boundary}`,
        'Content-Type: text/plain; charset="utf-8"',
        "Content-Transfer-Encoding: base64",
        CRLF,
        wrap(Buffer.from(message.text, "utf8").toString("base64")),
        `--${boundary}`,
        'Content-Type: text/html; charset="utf-8"',
        "Content-Transfer-Encoding: base64",
        CRLF,
        wrap(Buffer.from(message.html, "utf8").toString("base64")),
        `--${boundary}--`,
    ].join(CRLF);

    return dotStuff(body);
}

function wrap(value: string, width = 76): string {
    return value.replace(new RegExp(`(.{${width}})(?=.)`, "g"), "$1" + CRLF);
}

function connect(config: SmtpConfig, timeoutMs: number): Promise<TLSSocket> {
    return new Promise((resolve, reject) => {
        const onError = (error: Error) => {
            socket.destroy();
            reject(new SmtpError(`Could not connect to SMTP host ${config.host}: ${config.port}: ${error.message}`, "ECONNECT"));
        };

        const socket = config.secure
            ? connectTls({ host: config.host, port: config.port, servername: config.host, rejectUnauthorized: true })
            : (connectTcp({ host: config.host, port: config.port }) as TLSSocket);

        socket.setTimeout(timeoutMs);
        socket.once("secureConnect", () => {
            socket.off("error", onError);
            resolve(socket as TLSSocket);
        });
        socket.once("error", onError);
    });
}

export async function sendMail(config: SmtpConfig, message: SmtpMessage): Promise<void> {
    if (!isValidEmailAddress(config.from)) {
        throw new SmtpError(`SMTP_FROM is not a valid address: ${config.from}`, "EINVALIDFROM");
    }
    if (!isValidEmailAddress(message.to)) {
        throw new SmtpError("Refusing to send: the recipient address is not valid.", "EINVALIDTO");
    }

    const timeoutMs = config.timeoutMs ?? 15_000;
    const helo = config.helo ?? "localhost";
    const boundary = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;

    let socket = await connect(config, timeoutMs);

    try {
        await readReply(socket, timeoutMs); // 220 greeting

        let capabilities = await command(socket, `EHLO ${helo}`, timeoutMs);

        if (!config.secure) {
            if (!/STARTTLS/i.test(capabilities)) {
                throw new SmtpError(
                    `The SMTP server does not offer STARTTLS on port ${config.port}. Use an implicit-TLS port (465) or a relay that supports STARTTLS.`,
                    "ENOSTARTTLS",
                );
            }
            await command(socket, "STARTTLS", timeoutMs);
            // The socket is plain TCP until this upgrade. EHLO must be repeated
            // afterwards because capabilities are negotiated per protocol layer.
            socket = await upgrade(socket, config.host);
            capabilities = await command(socket, `EHLO ${helo}`, timeoutMs);
        }

        await authenticate(socket, config, capabilities, timeoutMs);
        await deliver(socket, config, message, boundary, timeoutMs);
        await command(socket, "QUIT", timeoutMs).catch(() => undefined);
    } finally {
        socket.destroy();
    }
}

function upgrade(socket: Socket, servername: string): Promise<TLSSocket> {
    return new Promise((resolve, reject) => {
        const secured = connectTls({ socket, servername, rejectUnauthorized: true });
        secured.once("secureConnect", () => resolve(secured));
        secured.once("error", (error: Error) =>
            reject(new SmtpError(`STARTTLS upgrade failed: ${error.message}`, "ESTARTTLS")),
        );
    });
}

async function authenticate(
    socket: TLSSocket,
    config: SmtpConfig,
    capabilities: string,
    timeoutMs: number,
): Promise<void> {
    if (!config.user) return;
    if (!/AUTH[ =]/i.test(capabilities)) {
        throw new SmtpError("The SMTP server does not advertise AUTH but SMTP_USER is configured.", "ENOAUTH");
    }
    const token = Buffer.from(`\u0000${config.user}\u0000${config.password ?? ""}`, "utf8").toString("base64");
    await command(socket, `AUTH PLAIN ${token}`, timeoutMs);
}

async function deliver(
    socket: TLSSocket,
    config: SmtpConfig,
    message: SmtpMessage,
    boundary: string,
    timeoutMs: number,
): Promise<void> {
    await command(socket, `MAIL FROM:${formatAddress(config.from)}`, timeoutMs);
    await command(socket, `RCPT TO:${formatAddress(message.to)}`, timeoutMs);
    await command(socket, "DATA", timeoutMs);
    await command(socket, buildMime(message, config, boundary) + CRLF + ".", timeoutMs);
}
