import { describe, expect, it } from "vitest";
import { buildPostWriteData, validatePostWrite } from "@/lib/post-validation";
import { buildProjectWriteData, validateProjectWrite } from "@/lib/project-validation";
import { enumValue, isValidSlug, nullableStringValue, stringArrayValue } from "@/lib/validation";

/**
 * Write-path validation.
 *
 * PUT /api/admin/posts/[id] used to spread the request body straight into
 * Prisma, which let a client overwrite authorId, id and createdAt, and would
 * automatically expose any column added to the model later. These tests pin the
 * allowlist behaviour that replaced it.
 */

describe("buildPostWriteData", () => {
    it("ignores fields that are not on the allowlist", () => {
        // The declared input type has no such keys, so the cast is what a
        // hostile request looks like once it crosses the network boundary.
        const hostile = {
            slug: "a-post",
            title_en: "Title",
            authorId: "attacker-controlled",
            id: "attacker-controlled",
            createdAt: "1999-01-01T00:00:00.000Z",
            publishedAt: "1999-01-01T00:00:00.000Z",
        } as unknown as Parameters<typeof buildPostWriteData>[0];

        const data = buildPostWriteData(hostile);

        expect(data).not.toHaveProperty("authorId");
        expect(data).not.toHaveProperty("id");
        expect(data).not.toHaveProperty("createdAt");
        expect(data).not.toHaveProperty("publishedAt");
    });

    it("emits exactly the known keys", () => {
        const data = buildPostWriteData({ slug: "a-post", title_en: "Title" });
        expect(Object.keys(data).sort()).toEqual(
            [
                "content",
                "contentHtml_en",
                "contentHtml_tr",
                "coverImage",
                "description",
                "description_en",
                "description_tr",
                "slug",
                "status",
                "tags",
                "title_en",
                "title_tr",
            ].sort(),
        );
    });

    it("collapses an empty localised string to null so the fallback applies", () => {
        const data = buildPostWriteData({ slug: "a-post", title_en: "Title", title_tr: "   " });
        expect(data.title_tr).toBeNull();
    });

    it("inherits from the existing row when a field is absent", () => {
        const existing = {
            slug: "old",
            title_en: "Old title",
            title_tr: "Eski başlık",
            description: "d",
            description_en: "d",
            description_tr: null,
            content: null,
            contentHtml_en: "<p>old</p>",
            contentHtml_tr: null,
            tags: ["a"],
            coverImage: null,
            status: "draft",
        };

        const data = buildPostWriteData({ title_en: "New title" }, existing);

        expect(data.slug).toBe("old");
        expect(data.title_tr).toBe("Eski başlık");
        expect(data.tags).toEqual(["a"]);
        expect(data.contentHtml_en).toBe("<p>old</p>");
    });

    it("sanitises rich text on write, not only on read", () => {
        const data = buildPostWriteData({
            slug: "a-post",
            title_en: "Title",
            contentHtml_en: '<p>ok</p><script>alert(1)</script><img src=x onerror=alert(1)>',
        });

        expect(data.contentHtml_en).not.toContain("<script");
        expect(data.contentHtml_en).not.toContain("onerror");
        expect(data.contentHtml_en).toContain("<p>ok</p>");
    });

    it("rejects a non-string status instead of passing it to Prisma", () => {
        const data = buildPostWriteData({ slug: "a-post", title_en: "Title", status: "deleted" });
        expect(data.status).toBe("draft");
    });

    it("drops a non-array tags value rather than throwing", () => {
        expect(buildPostWriteData({ slug: "a", title_en: "T", tags: "not-an-array" }).tags).toEqual([]);
    });

    it("caps the number and length of tags", () => {
        const data = buildPostWriteData({
            slug: "a",
            title_en: "T",
            tags: Array.from({ length: 50 }, (_, index) => `tag-${"x".repeat(200)}-${index}`),
        });
        expect(data.tags.length).toBeLessThanOrEqual(20);
        expect(data.tags[0]!.length).toBeLessThanOrEqual(40);
    });
});

describe("validatePostWrite", () => {
    const base = { slug: "a-post", title_en: "Title", status: "draft" as const };

    it("requires a slug and an English title", () => {
        expect(validatePostWrite(buildPostWriteData({ slug: "", title_en: "" })).length).toBeGreaterThan(0);
    });

    it("rejects a slug that is not url-safe", () => {
        const errors = validatePostWrite(buildPostWriteData({ ...base, slug: "../../etc/passwd" }));
        expect(errors.join(" ")).toContain("lowercase letters");
    });

    it("requires body content before publishing", () => {
        const errors = validatePostWrite(buildPostWriteData({ ...base, status: "published" }));
        expect(errors.join(" ")).toContain("body content");
    });

    it("accepts a complete published post", () => {
        const errors = validatePostWrite(
            buildPostWriteData({
                ...base,
                status: "published",
                contentHtml_en: "<p>Body</p>",
                description_en: "Summary",
            }),
        );
        expect(errors).toEqual([]);
    });
});

describe("buildProjectWriteData", () => {
    it("ignores unknown keys", () => {
        const hostile = { slug: "acme", client: "Acme", order: 999 } as unknown as Parameters<
            typeof buildProjectWriteData
        >[0];
        const data = buildProjectWriteData(hostile);
        expect(data).not.toHaveProperty("order");
    });

    it("requires a tagline before publishing", () => {
        const errors = validateProjectWrite(
            buildProjectWriteData({ slug: "acme", client: "Acme", status: "published" }),
        );
        expect(errors).toContain("Tagline is required before publishing");
    });

    it("rejects a malformed slug", () => {
        expect(isValidSlug("Acme Corp")).toBe(false);
        expect(isValidSlug("acme--corp")).toBe(false);
        expect(isValidSlug("acme-corp")).toBe(true);
        expect(isValidSlug("")).toBe(false);
    });
});

describe("validation primitives", () => {
    it("nullableStringValue treats blank as absent", () => {
        expect(nullableStringValue("  ")).toBeNull();
        expect(nullableStringValue("x")).toBe("x");
        expect(nullableStringValue(undefined)).toBeNull();
    });

    it("stringArrayValue filters, trims, caps and de-duplicates empties", () => {
        expect(stringArrayValue([" a ", "", "b", 3, null])).toEqual(["a", "b"]);
        expect(stringArrayValue("nope")).toEqual([]);
    });

    it("enumValue falls back for anything outside the set", () => {
        expect(enumValue("b", ["a", "b"] as const, "a")).toBe("b");
        expect(enumValue("z", ["a", "b"] as const, "a")).toBe("a");
        expect(enumValue(undefined, ["a", "b"] as const, "a")).toBe("a");
    });
});
