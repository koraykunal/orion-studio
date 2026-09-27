/**
 * Turkish-aware slug generation.
 *
 * The previous implementation was `toLowerCase().replace(/[^a-z0-9]+/g, "-")`,
 * which silently destroyed Turkish input: "İstanbul Studio" became
 * "stanbul-studio" because the dotted capital İ is not in [a-z0-9] and is
 * dropped before any folding happens, and "Müşteri" became "m-teri". The CMS
 * auto-fills the slug from the client name on every keystroke, so this was on
 * the happy path for a Turkish-language studio.
 *
 * Order matters: normalise the dotted/dotless I pairs first, decompose, then
 * strip diacritics, and only then keep ASCII alphanumerics.
 */

/** Uppercase dotted I and its lowercase counterpart, the only pair that does not round-trip. */
const DOTTED_I = /[İıIi]/g;
const DOTLESS_I = "i";

const DECOMPOSE = /[̀-ͯ]/g;

/**
 * Only ASCII alphanumerics and the hyphen survive.
 *
 * An earlier version also preserved `&` and `+`, which produced slugs like
 * `acme-&-co` that the write-time validator in lib/validation.ts then rejected,
 * so every save failed with an opaque validation error. The generator and the
 * validator have to agree on the alphabet; this is the test that keeps them
 * honest.
 */
export function slugify(input: string): string {
    const withAsciiI = input.replace(DOTTED_I, DOTLESS_I);
    const decomposed = withAsciiI.normalize("NFKD");
    const withoutDiacritics = decomposed.replace(DECOMPOSE, "");

    let slug = "";
    for (const char of withoutDiacritics.toLowerCase()) {
        if (/[a-z0-9]/.test(char)) {
            slug += char;
            continue;
        }
        // Everything else, including spaces, underscores and existing hyphens,
        // collapses into a single separator.
        if (slug && !slug.endsWith("-")) slug += "-";
    }

    return slug.replace(/^-+|-+$/g, "").slice(0, 120);
}

/**
 * Appends a numeric suffix until the slug is unique, so saving a second project
 * for the same client does not fail on the unique index.
 */
export function uniqueSlug(base: string, taken: Iterable<string>): string {
    const existing = new Set<string>();
    for (const value of taken) existing.add(value.toLowerCase());

    const root = base || "item";
    if (!existing.has(root)) return root;

    for (let suffix = 2; suffix < 1000; suffix += 1) {
        const candidate = `${root}-${suffix}`;
        if (!existing.has(candidate)) return candidate;
    }

    return `${root}-${Date.now().toString(36)}`;
}
