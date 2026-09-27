/**
 * Shared input-normalisation primitives.
 *
 * Both project and post writes go through an allowlist builder plus a
 * validator. These helpers are the common half of that pair, extracted so the
 * two collections cannot drift on the rules that matter most: length caps,
 * slug shape, and the empty-string-versus-NULL distinction that localisation
 * depends on.
 */

/** URL-safe slug. Also the only shape we are willing to put in a path segment. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LIMITS = {
    slug: 120,
    shortText: 200,
    mediumText: 500,
    longText: 5000,
    richText: 200_000,
    tag: 40,
    tags: 20,
    sections: 60,
} as const;

export function stringValue(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value.trim() : fallback;
}

/**
 * Empty string and NULL mean the same thing for a localised column: "not
 * translated yet, fall back to the default locale". Collapsing them here is
 * what stops a blank `*_tr` value from rendering an empty heading.
 */
export function nullableStringValue(value: unknown): string | null {
    const text = stringValue(value);
    return text ? text : null;
}

export function stringArrayValue(value: unknown, options: { max?: number; itemMax?: number } = {}): string[] {
    if (!Array.isArray(value)) return [];
    const max = options.max ?? LIMITS.tags;
    const itemMax = options.itemMax ?? LIMITS.shortText;
    return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, itemMax))
        .filter(Boolean)
        .slice(0, max);
}

export function isValidSlug(value: string): boolean {
    return value.length > 0 && value.length <= LIMITS.slug && SLUG_RE.test(value);
}

/** Narrows an arbitrary value to a member of a closed set, with an explicit fallback. */
export function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
    return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** True when the value is a string with at least one non-whitespace character. */
export function hasText(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}
