import { isPlainObject, LIMITS, nullableStringValue, stringArrayValue, stringValue, enumValue, isValidSlug } from "@/lib/validation";
import { sanitizeRichHtml } from "@/lib/sanitize";
import { Prisma } from "@prisma/client";

const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

/**
 * Rich text is sanitised on write rather than only on read.
 *
 * The previous arrangement sanitised in the blog read path but stored and
 * rendered the raw string in the admin preview, so the CMS origin rendered
 * unsanitised editor HTML from the same field the public site treated as
 * untrusted. Sanitising at the boundary means the database only ever contains
 * HTML that is safe to render anywhere.
 */
const MAX_HTML_BYTES = LIMITS.richText;

type PostInput = {
    slug?: unknown;
    title_en?: unknown;
    title_tr?: unknown;
    description?: unknown;
    description_en?: unknown;
    description_tr?: unknown;
    content?: unknown;
    contentHtml_en?: unknown;
    contentHtml_tr?: unknown;
    tags?: unknown;
    coverImage?: unknown;
    status?: unknown;
};

type ExistingPostInput = {
    slug: string;
    title_en: string;
    title_tr: string | null;
    description: string;
    description_en?: string | null;
    description_tr?: string | null;
    content: unknown;
    contentHtml_en: string;
    contentHtml_tr: string | null;
    tags: string[];
    coverImage: string | null;
    status: string;
};

export type PostWriteData = {
    slug: string;
    title_en: string;
    title_tr: string | null;
    description: string;
    description_en: string;
    description_tr: string | null;
    /** Tiptap document. Stored for round-tripping into the editor, never rendered. */
    content: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    contentHtml_en: string;
    contentHtml_tr: string | null;
    tags: string[];
    coverImage: string | null;
    status: PostStatus;
};

function richTextValue(value: unknown, fallback: string): string {
    if (typeof value !== "string") return fallback;
    if (value.length > MAX_HTML_BYTES) return fallback;
    return sanitizeRichHtml(value);
}

function jsonValue(
    value: unknown,
    fallback: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    if (value === undefined) return fallback;
    if (value === null) return Prisma.JsonNull;
    if (!isPlainObject(value) && !Array.isArray(value)) return fallback;
    // Tiptap document shape, kept loose on purpose: the editor is the only
    // producer and over-validating here would reject valid documents.
    return value as Prisma.InputJsonValue;
}

/**
 * Builds an explicit allowlist of writable fields.
 *
 * The previous PUT handler spread the request body straight into Prisma,
 * which let a client overwrite authorId, id or createdAt and would
 * automatically expose any column added to the model later. Nothing reaches
 * the database that is not named here.
 */
export function buildPostWriteData(input: PostInput, existing?: ExistingPostInput): PostWriteData {
    const en = richTextValue(input.contentHtml_en, existing?.contentHtml_en ?? "");
    return {
        slug: stringValue(input.slug, existing?.slug ?? ""),
        title_en: stringValue(input.title_en, existing?.title_en ?? ""),
        title_tr: input.title_tr === undefined ? existing?.title_tr ?? null : nullableStringValue(input.title_tr),
        description: stringValue(input.description, existing?.description ?? "").slice(0, LIMITS.mediumText),
        description_en: stringValue(
            input.description_en,
            existing?.description_en ?? existing?.description ?? "",
        ).slice(0, LIMITS.mediumText),
        description_tr:
            input.description_tr === undefined
                ? existing?.description_tr ?? null
                : nullableStringValue(input.description_tr)?.slice(0, LIMITS.mediumText) ?? null,
        content: jsonValue(input.content, (existing?.content ?? Prisma.JsonNull) as Prisma.InputJsonValue),
        contentHtml_en: en,
        contentHtml_tr:
            input.contentHtml_tr === undefined
                ? existing?.contentHtml_tr ?? null
                : nullableStringValue(sanitizeRichHtml(String(input.contentHtml_tr ?? ""))),
        tags:
            input.tags === undefined
                ? existing?.tags ?? []
                : stringArrayValue(input.tags, { max: LIMITS.tags, itemMax: LIMITS.tag }),
        coverImage:
            input.coverImage === undefined
                ? existing?.coverImage ?? null
                : nullableStringValue(input.coverImage)?.slice(0, LIMITS.mediumText) ?? null,
        status: enumValue(input.status ?? existing?.status, POST_STATUSES, "draft"),
    };
}

export function validatePostWrite(data: PostWriteData): string[] {
    const errors: string[] = [];

    if (!data.title_en) errors.push("English title is required");
    if (!data.slug) errors.push("Slug is required");
    else if (!isValidSlug(data.slug)) {
        errors.push("Slug must be lowercase letters, numbers and single hyphens");
    }

    if (data.status === "published") {
        if (!data.contentHtml_en) errors.push("English body content is required before publishing");
        if (!data.description_en) errors.push("English description is required before publishing");
    }

    return errors;
}
