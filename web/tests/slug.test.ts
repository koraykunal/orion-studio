import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

/**
 * The previous implementation was
 * `toLowerCase().replace(/[^a-z0-9]+/g, "-")`, which silently corrupted every
 * Turkish string the CMS handles. The admin auto-fills the slug from the client
 * name on each keystroke, so this is on the happy path for a Turkish studio.
 */
describe("slugify", () => {
    it("lowercases and hyphenates ASCII", () => {
        expect(slugify("Acme Corporation")).toBe("acme-corporation");
        expect(slugify("Hello   World")).toBe("hello-world");
    });

    it("keeps the dotted capital I", () => {
        // "İ" lowercases to a two-code-point sequence, and dropping the first
        // one used to produce "stanbul-studio".
        expect(slugify("İstanbul Studio")).toBe("istanbul-studio");
    });

    it("maps the dotless i correctly", () => {
        expect(slugify("Işık")).toBe("isik");
        expect(slugify("ışık")).toBe("isik");
        expect(slugify("IŞIK")).toBe("isik");
    });

    it("strips other diacritics", () => {
        expect(slugify("Müşteri Ajansı")).toBe("musteri-ajansi");
        expect(slugify("Élan")).toBe("elan");
        expect(slugify("ñandú")).toBe("nandu");
    });

    it("collapses separators and trims the edges", () => {
        expect(slugify("  a -- b  ")).toBe("a-b");
        expect(slugify("a___b")).toBe("a-b");
        expect(slugify("---")).toBe("");
    });

    it("collapses every non-alphanumeric character, including & and +", () => {
        // `&` and `+` were once preserved, which produced `acme-&-co` and then
        // failed the write-time validator. Generator and validator must agree.
        expect(slugify("Research & Development")).toBe("research-development");
        expect(slugify("C++ Basics")).toBe("c-basics");
    });

    it("produces output that passes the write-time slug validator", () => {
        const samples = ["İstanbul Studio", "Müşteri Ajansı", "Acme & Co.", "Işık", "Ñ Studio"];
        for (const sample of samples) {
            expect(slugify(sample)).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        }
    });

    it("bounds the length so a long title cannot exceed the column", () => {
        expect(slugify("a".repeat(500)).length).toBeLessThanOrEqual(120);
    });
});

describe("uniqueSlug", () => {
    it("returns the base when it is free", () => {
        expect(uniqueSlug("acme", ["other"])).toBe("acme");
    });

    it("appends a numeric suffix on collision", () => {
        expect(uniqueSlug("acme", ["acme"])).toBe("acme-2");
        expect(uniqueSlug("acme", ["acme", "acme-2"])).toBe("acme-3");
    });

    it("compares case-insensitively", () => {
        expect(uniqueSlug("acme", ["ACME"])).toBe("acme-2");
    });

    it("falls back when the base is empty", () => {
        expect(uniqueSlug("", [])).toBe("item");
    });
});
