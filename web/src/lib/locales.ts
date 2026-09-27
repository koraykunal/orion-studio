/**
 * Single source of truth for the supported locales.
 *
 * Previously this list was duplicated in i18n/routing.ts, lib/schema.ts and
 * lib/locales.ts, which meant adding a locale meant editing three files with
 * nothing enforcing that they agreed. Hreflang correctness and IndexNow
 * fan-out both depend on this list, so it is now derived in one place and
 * everything else imports it.
 */
export const LOCALES = ["en", "tr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
    return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Narrows a raw route param to a Locale.
 *
 * `[locale]/layout.tsx` already calls notFound() for an unsupported locale, so
 * by the time a page runs this cannot fail. It exists so read helpers can take
 * a real `Locale` instead of a bare `string`; that type change is what
 * surfaced every place a locale was being compared positionally.
 */
export function toLocale(value: string): Locale {
    return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Picks the best value for a localised column pair. An absent, null or
 * blank-string translation falls back to the default-locale value, which is
 * what stops a missing `*_tr` column from rendering an empty heading.
 */
export function localizedValue(
    localized: string | null | undefined,
    fallback: string,
    locale: Locale,
): string {
    if (locale !== DEFAULT_LOCALE && typeof localized === "string" && localized.trim().length > 0) {
        return localized;
    }
    return fallback;
}
