import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "../src/lib/locales";

export const routing = defineRouting({
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    // Every URL carries its locale prefix, including the default. Canonical
    // URLs, hreflang and the sitemap all assume this, so it is stated
    // explicitly rather than relying on the library default.
    localePrefix: "always",
    localeDetection: true,
});
