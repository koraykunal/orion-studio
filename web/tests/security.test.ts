import { describe, expect, it } from "vitest";
import { isValidEmailAddress, stripHeaderControl, SmtpError } from "@/lib/smtp";
import { escapeHtml } from "@/lib/html-escape";
import { sanitizeRichHtml } from "@/lib/sanitize";
import { getSafeVideoEmbedUrl } from "@/lib/video-embed";
import { getClientKey } from "@/lib/rate-limit";
import { isSection, SECTION_REGISTRY, SECTION_TYPES, createEmptySection, isSectionType } from "@/lib/project-types";

/**
 * Security boundaries.
 *
 * Every function here sits on a trust boundary: request data arriving from the
 * public contact form, request data arriving from an authenticated admin, or
 * attacker-chosen data arriving inside a mail header. The tests exist so a
 * future edit cannot quietly relax one of them.
 */

describe("isValidEmailAddress", () => {
    it("accepts ordinary addresses", () => {
        for (const address of ["a@b.co", "first.last@example.com", "x+tag@sub.domain.org"]) {
            expect(isValidEmailAddress(address)).toBe(true);
        }
    });

    it("rejects the shapes that address-parsing vulnerabilities exploit", () => {
        const rejected = [
            "",
            "no-at-sign",
            "@example.com",
            "user@",
            "user@localhost",
            "user@@example.com",
            "user name@example.com",
            // RFC 5322 comments, which a naive validator accepts and a naive
            // mailer then mis-parses into a different recipient.
            "victim@example.com (attacker@evil.com)",
            "user@evil.com, second@other.com",
            "Display Name <user@example.com>",
            "user@exаmple.com", // cyrillic homoglyph
            "a".repeat(250) + "@example.com",
        ];
        for (const address of rejected) {
            expect(isValidEmailAddress(address)).toBe(false);
        }
    });

    it("rejects a non-string", () => {
        expect(isValidEmailAddress(null)).toBe(false);
        expect(isValidEmailAddress(42)).toBe(false);
    });
});

describe("stripHeaderControl", () => {
    it("removes CRLF so a value cannot inject a header", () => {
        expect(stripHeaderControl("Acme\r\nBcc: victim@example.com")).toBe("Acme Bcc: victim@example.com");
        expect(stripHeaderControl("Acme\nBcc: victim@example.com")).toBe("Acme Bcc: victim@example.com");
        expect(stripHeaderControl("Acme\r\n\r\nbody")).toBe("Acme body");
    });

    it("removes NUL", () => {
        expect(stripHeaderControl("Acme\u0000Corp")).toBe("Acme Corp");
    });
});

describe("escapeHtml", () => {
    it("neutralises every character that can break out of text or an attribute", () => {
        expect(escapeHtml(`<script>alert('x')</script>`)).toBe(
            "&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;",
        );
        expect(escapeHtml('a" onload="x')).toBe("a&quot; onload=&quot;x");
        expect(escapeHtml("a & b")).toBe("a &amp; b");
    });

    it("handles non-strings and nullish values", () => {
        expect(escapeHtml(undefined)).toBe("");
        expect(escapeHtml(null)).toBe("");
        expect(escapeHtml(0)).toBe("0");
    });
});

describe("sanitizeRichHtml", () => {
    it("removes script tags and their contents", () => {
        expect(sanitizeRichHtml("<p>ok</p><script>alert(1)</script>")).toBe("<p>ok</p>");
    });

    it("removes event handlers", () => {
        expect(sanitizeRichHtml('<img src="x" onerror="alert(1)">')).not.toContain("onerror");
    });

    it("removes javascript: urls", () => {
        expect(sanitizeRichHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
    });

    it("strips the src of an iframe pointing at a host outside the allowlist", () => {
        // The element survives with its source removed, which is inert. What
        // matters is that the attacker-controlled URL does not.
        expect(sanitizeRichHtml('<iframe src="https://evil.example/x"></iframe>')).not.toContain("evil.example");
        expect(sanitizeRichHtml('<iframe src="https://www.youtube-nocookie.com/embed/x"></iframe>')).toContain(
            "youtube-nocookie.com",
        );
    });

    it("strips a src-less iframe that carries inline content", () => {
        expect(sanitizeRichHtml('<iframe srcdoc="<script>alert(1)</script>"></iframe>')).not.toContain("srcdoc");
    });

    it("keeps ordinary formatting", () => {
        const html = "<h2>Title</h2><p><strong>bold</strong> and <em>italic</em></p><ul><li>one</li></ul>";
        expect(sanitizeRichHtml(html)).toContain("<strong>bold</strong>");
        expect(sanitizeRichHtml(html)).toContain("<li>one</li>");
    });
});

describe("getSafeVideoEmbedUrl", () => {
    it("normalises YouTube and Vimeo to their privacy-preserving hosts", () => {
        expect(getSafeVideoEmbedUrl("https://www.youtube.com/watch?v=abc")).toContain("youtube-nocookie.com");
        expect(getSafeVideoEmbedUrl("https://youtu.be/abc")).toContain("youtube-nocookie.com");
        expect(getSafeVideoEmbedUrl("https://vimeo.com/123")).toContain("player.vimeo.com");
    });

    it("refuses anything else", () => {
        expect(getSafeVideoEmbedUrl("https://evil.example/embed")).toBeNull();
        expect(getSafeVideoEmbedUrl("javascript:alert(1)")).toBeNull();
        expect(getSafeVideoEmbedUrl("")).toBeNull();
    });
});

describe("getClientKey", () => {
    const requestWith = (headers: Record<string, string>) =>
        new Request("https://example.com", { headers });

    it("uses the last forwarded hop, which the edge controls", () => {
        // The old implementation took the first entry, which a client sets
        // directly, so a forged header minted a fresh rate-limit bucket.
        const key = getClientKey(
            requestWith({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }),
        );
        expect(key).toBe("5.6.7.8");
    });

    it("ignores a single forged value when the edge overwrites the header", () => {
        expect(getClientKey(requestWith({ "x-forwarded-for": "9.9.9.9" }))).toBe("9.9.9.9");
    });

    it("normalises the address so a port or brackets cannot mint a new bucket", () => {
        expect(getClientKey(requestWith({ "x-real-ip": "203.0.113.5:44321" }))).toBe("203.0.113.5");
        expect(getClientKey(requestWith({ "x-real-ip": "[2001:db8::1]" }))).toBe("2001:db8::1");
    });

    it("falls back to a single bucket when no headers are present", () => {
        // Fail-closed: everything shares one bucket rather than every request
        // getting a fresh one.
        expect(getClientKey(requestWith({}))).toBe("unknown");
    });
});

describe("section registry", () => {
    it("is the single source of the section type list", () => {
        expect(SECTION_TYPES.length).toBe(Object.keys(SECTION_REGISTRY).length);
        for (const type of SECTION_TYPES) expect(SECTION_REGISTRY[type]).toBeDefined();
    });

    it("gives every type a label and a default shape", () => {
        for (const type of SECTION_TYPES) {
            const definition = SECTION_REGISTRY[type];
            expect(definition.label.length).toBeGreaterThan(0);
            expect(definition.placement === "flow" || definition.placement === "full-bleed").toBe(true);
            expect(definition.createDefault()).toBeTypeOf("object");
        }
    });

    it("creates sections that pass the outer shape guard", () => {
        for (const type of SECTION_TYPES) {
            expect(isSection(createEmptySection(type))).toBe(true);
        }
    });

    it("rejects an unknown type", () => {
        expect(isSectionType("notASection")).toBe(false);
        expect(isSection({ id: "1", type: "notASection", data: {} })).toBe(false);
        expect(isSection({ id: "1", type: "quote", data: null })).toBe(false);
        expect(isSection(null)).toBe(false);
    });
});

describe("SmtpError", () => {
    it("carries a machine-readable code", () => {
        const error = new SmtpError("boom", "ECONNECT");
        expect(error).toBeInstanceOf(Error);
        expect(error.code).toBe("ECONNECT");
    });
});
