const DEFAULT_SITE_URL = "https://orionstud.io";

function normalizeSiteUrl(value: string | undefined): string {
    const trimmed = value?.trim();
    if (!trimmed) return DEFAULT_SITE_URL;
    return trimmed.replace(/\/+$/, "");
}

/**
 * Single source for the canonical origin. Used by metadata, canonical URLs,
 * hreflang alternates, the sitemap, JSON-LD and the IndexNow key location.
 *
 * `absoluteUrl` was removed from here: it had no callers, and twenty call
 * sites were hand-building `${BASE_URL}${path}` instead. Callers that need a
 * joined URL use `absoluteUrl` from lib/schema.ts, which lives next to the
 * JSON-LD builders that already speak in absolute URLs.
 */
export const SITE_URL = normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL,
);
