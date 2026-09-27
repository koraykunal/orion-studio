import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "../src/lib/locales";

/**
 * Resolves the active locale and loads its catalogue.
 *
 * `locale` comes from next-intl's own routing and is already narrowed, but
 * `requestLocale` is whatever the URL carried and is typed as a plain string,
 * so it is validated rather than cast. The previous version used
 * `routing.locales.includes(locale as 'en' | 'tr')`, a cast that would have
 * accepted anything at compile time.
 */
export default getRequestConfig(async ({ locale, requestLocale }) => {
    const resolved = locale ?? (await requestLocale);

    const activeLocale = isLocale(resolved) ? resolved : DEFAULT_LOCALE;

    return {
        locale: activeLocale,
        messages: (await import(`../src/messages/${activeLocale}.json`)).default,
    };
});
