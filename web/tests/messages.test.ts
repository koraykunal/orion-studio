import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import tr from "@/messages/tr.json";

/**
 * Message catalogue parity.
 *
 * The i18n design document claimed next-intl's type augmentation was in place so
 * a missing key would be a compile error. It was not, which is how thirteen
 * dead keys survived in both catalogues after their only consumer was deleted.
 * The types now cover literal keys; this covers the computed ones.
 */

type Catalogue = Record<string, unknown>;

function flatten(value: unknown, prefix = ""): Map<string, string> {
    const out = new Map<string, string>();
    if (typeof value !== "object" || value === null) {
        out.set(prefix, String(value));
        return out;
    }
    for (const [key, child] of Object.entries(value as Catalogue)) {
        const path = prefix ? `${prefix}.${key}` : key;
        for (const [nested, text] of flatten(child, path)) out.set(nested, text);
    }
    return out;
}

const enFlat = flatten(en);
const trFlat = flatten(tr);

/**
 * Keys the source actually asks for via a template literal, with the suffixes
 * the templates append. TypeScript cannot narrow `value${number}Title` to a
 * literal union, so these are the keys the compiler never checks.
 */
const COMPUTED_KEYS: Array<{ namespace: string; prefix: string; suffixes: string[] }> = [
    { namespace: "about", prefix: "value", suffixes: ["0", "1", "2", "3"].flatMap((n) => [`${n}Title`, `${n}Body`]) },
    { namespace: "about", prefix: "cap", suffixes: ["0", "1", "2", "3", "4"] },
    { namespace: "contact", prefix: "budget", suffixes: ["0", "1", "2", "3", "4"] },
    { namespace: "contact", prefix: "timeline", suffixes: ["0", "1", "2", "3", "4"] },
    { namespace: "faq", prefix: "q", suffixes: ["0", "1", "2", "3", "4", "5"] },
    { namespace: "faq", prefix: "a", suffixes: ["0", "1", "2", "3", "4", "5"] },
];

describe("message catalogue parity", () => {
    it("has the same key set in both locales", () => {
        const enOnly = [...enFlat.keys()].filter((key) => !trFlat.has(key));
        const trOnly = [...trFlat.keys()].filter((key) => !enFlat.has(key));

        expect({ enOnly, trOnly }).toEqual({ enOnly: [], trOnly: [] });
    });

    it("has no empty strings", () => {
        const empty = [...enFlat.entries()]
            .filter(([, value]) => value.trim() === "")
            .map(([key]) => key);
        expect(empty).toEqual([]);
    });

    it("uses the same interpolation placeholders in both locales", () => {
        const placeholders = (text: string) => (text.match(/\{[a-zA-Z0-9_]+\}/g) ?? []).sort();

        const mismatched: string[] = [];
        for (const [key, enValue] of enFlat) {
            const trValue = trFlat.get(key);
            if (trValue === undefined) continue;
            if (placeholders(enValue).join(",") !== placeholders(trValue).join(",")) mismatched.push(key);
        }

        expect(mismatched).toEqual([]);
    });

    it("has a value for every computed key the templates can produce", () => {
        const missing: string[] = [];

        for (const { namespace, prefix, suffixes } of COMPUTED_KEYS) {
            for (const suffix of suffixes) {
                for (const [catalogue, name] of [
                    [enFlat, "en"],
                    [trFlat, "tr"],
                ] as const) {
                    const key = `${namespace}.${prefix}${suffix}`;
                    if (!catalogue.has(key)) missing.push(`${name}:${key}`);
                }
            }
        }

        expect(missing).toEqual([]);
    });
});

describe("locale coverage", () => {
    it("has no namespace that is empty in one locale only", () => {
        const namespaces = new Set([...enFlat.keys()].map((key) => key.split(".")[0]!));
        for (const namespace of namespaces) {
            const enCount = [...enFlat.keys()].filter((key) => key.startsWith(`${namespace}.`)).length;
            const trCount = [...trFlat.keys()].filter((key) => key.startsWith(`${namespace}.`)).length;
            expect({ namespace, enCount, trCount }).toEqual({ namespace, enCount, trCount });
        }
    });
});
