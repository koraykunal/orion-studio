/**
 * Helper for indexed message lookups.
 *
 * next-intl's compile-time key checking works by resolving `t("someKey")`
 * against a literal union derived from the message catalogue. TypeScript
 * cannot narrow a computed string such as `` `value${number}Title` `` to that
 * union, so every loop-generated key is invisible to the compiler. Rather than
 * scatter `as never` casts across the pages, they all go through here, and
 * `tests/messages.test.ts` asserts that every key this pattern can produce
 * actually exists in both locales.
 *
 * `t()` is the next-intl translator, so this is only a widening of the
 * parameter type, not a loss of the return type.
 */
type Translator = (key: never) => string;

/** Returns a translator that also accepts computed keys. */
export function keyed(t: Translator): (key: string) => string {
    return (key: string) => (t as (value: string) => string)(key);
}
