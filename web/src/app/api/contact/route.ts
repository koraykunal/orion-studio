import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/html-escape";
import { getClientKey, rateLimit } from "@/lib/rate-limit";
import { CONTACT_EMAIL } from "@/lib/socials";
import { isValidEmailAddress, sendMail, SmtpError } from "@/lib/smtp";

export const dynamic = "force-dynamic";

/**
 * Per-field caps. Every column behind these is an unbounded TEXT column, so
 * the route is the only place the length is enforced.
 */
const LIMITS = {
    name: 120,
    email: 254,
    company: 160,
    budget: 80,
    timeline: 80,
    brief: 5000,
    referral: 160,
    services: 20,
} as const;

const SERVICE_MAX_LEN = 60;

const SCALAR_FIELDS = ["name", "email", "company", "budget", "timeline", "brief", "referral"] as const;

type ScalarField = (typeof SCALAR_FIELDS)[number];

type ContactPayload = Record<ScalarField, string> & { services: string[] };

function trimmedString(value: unknown, field: ScalarField): string | null {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (trimmed.length > LIMITS[field]) return null;
    return trimmed;
}

function readContactPayload(body: unknown): ContactPayload | null {
    if (typeof body !== "object" || body === null) return null;
    const source = body as Record<string, unknown>;

    const payload = {} as ContactPayload;
    for (const field of SCALAR_FIELDS) {
        const value = trimmedString(source[field], field);
        if (value === null) return null;
        payload[field] = value;
    }

    if (!payload.name || !payload.email || !payload.brief) return null;
    if (!isValidEmailAddress(payload.email)) return null;

    payload.services = Array.isArray(source.services)
        ? source.services
              .filter((value): value is string => typeof value === "string")
              .map((value) => value.trim().slice(0, SERVICE_MAX_LEN))
              .filter(Boolean)
              .slice(0, LIMITS.services)
        : [];

    return payload;
}

function formatNotification(payload: ContactPayload): { text: string; html: string } {
    const orDash = (value: string) => value || "Not specified";
    const rows: Array<[string, string]> = [
        ["Name", payload.name],
        ["Email", payload.email],
        ["Company", orDash(payload.company)],
        ["Services", payload.services.length ? payload.services.join(", ") : "Not specified"],
        ["Budget", orDash(payload.budget)],
        ["Timeline", orDash(payload.timeline)],
        ["Referral", orDash(payload.referral)],
    ];

    const text = [
        "New project inquiry",
        ...rows.map(([label, value]) => `${label}: ${value}`),
        "",
        "Project brief",
        "----------",
        payload.brief,
    ].join("\n");

    const html = [
        "<h2>New project inquiry</h2>",
        '<table style="border-collapse:collapse;width:100%;max-width:640px;">',
        ...rows.map(
            ([label, value]) =>
                `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>` +
                `<td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`,
        ),
        "</table>",
        '<h3 style="margin-top:24px;">Project brief</h3>',
        `<div style="white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px;">${escapeHtml(payload.brief)}</div>`,
    ].join("");

    return { text, html };
}

export async function POST(request: Request) {
    const limit = await rateLimit({
        key: `contact:${getClientKey(request)}`,
        windowMs: 60_000,
        max: 3,
    });

    if (!limit.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please try again shortly." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)),
                    "X-RateLimit-Limit": String(limit.max),
                    "X-RateLimit-Remaining": "0",
                },
            },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
    }

    // Honeypot. Real users never see or fill this field; bots that fill every
    // input they find get a success response and an empty inbox.
    if (typeof (body as Record<string, unknown>)?.website === "string" && (body as Record<string, unknown>).website) {
        return NextResponse.json({ success: true });
    }

    const fields = readContactPayload(body);
    if (!fields) {
        return NextResponse.json(
            { error: "Please provide a valid name, email address and project brief." },
            { status: 400 },
        );
    }

    try {
        await prisma.message.create({
            data: {
                name: fields.name,
                email: fields.email,
                company: fields.company || null,
                services: fields.services,
                budget: fields.budget || null,
                timeline: fields.timeline || null,
                brief: fields.brief,
                referral: fields.referral || null,
            },
        });
    } catch (error) {
        console.error("Contact form persistence failed:", error);
        return NextResponse.json({ error: "Could not save your message. Please try again." }, { status: 500 });
    }

    // The database write above is the durable record. Mail is a convenience
    // notification, so a delivery failure must not tell the visitor their
    // message was lost, but it must be loud in the logs.
    const smtpHost = process.env.SMTP_HOST;
    if (!smtpHost) {
        console.warn("SMTP_HOST is not configured. Inquiry stored but no notification was sent.");
        return NextResponse.json({ success: true });
    }

    const port = Number(process.env.SMTP_PORT) || 587;
    const notification = formatNotification(fields);

    try {
        await sendMail(
            {
                host: smtpHost,
                port,
                secure: port === 465,
                user: process.env.SMTP_USER,
                password: process.env.SMTP_PASS,
                from: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER || CONTACT_EMAIL,
                helo: process.env.SMTP_HELO ?? "orionstud.io",
            },
            {
                to: CONTACT_EMAIL,
                subject: `New inquiry from ${fields.name}${fields.company ? ` (${fields.company})` : ""}`,
                text: notification.text,
                html: notification.html,
            },
        );
    } catch (error) {
        if (error instanceof SmtpError) {
            console.error(`Contact notification failed [${error.code}]: ${error.message}`);
        } else {
            console.error("Contact notification failed:", error);
        }
    }

    return NextResponse.json({ success: true });
}
