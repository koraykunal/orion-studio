import type en from "../messages/en.json";
import type { Locale as AppLocale } from "../lib/locales";

/**
 * Compile-time message and locale typing for next-intl.
 *
 * The augmentation target is `use-intl`'s AppConfig, which is what
 * next-intl re-exports. Declaring `Messages` turns a missing or misspelled
 * `t()` key into a compile error; declaring `Locale` types `useLocale()` and
 * every prop that receives a locale.
 *
 * The i18n design spec asserted this was in place. It was not, which is how
 * thirteen dead keys survived in both catalogues after their only consumer was
 * deleted, and why every locale comparison in the read layer was an unchecked
 * `locale === "tr"`.
 *
 * Note: keys built with a template literal (`t(\`service${slug}Name\`)`) still
 * bypass this, because TypeScript cannot narrow a computed string to a union
 * of literal keys. Those call sites are covered by the key-parity test.
 */
type MessageCatalogue = typeof en;

declare module "use-intl" {
    interface AppConfig {
        Locale: AppLocale;
        Messages: MessageCatalogue;
    }
}
