import { Red_Hat_Display, Bricolage_Grotesque, Red_Hat_Mono } from "next/font/google";

/**
 * The three typefaces this site uses, declared exactly once.
 *
 * These used to be declared separately in [locale]/layout.tsx,
 * admin/layout.tsx and design-system/layout.tsx, each requesting the same
 * families with a different set of weights and styles. Turbopack keys its
 * font import map by query, so three different queries for one family produced
 * a map with more than one entry per family and the build failed with
 *
 *     Module not found: Can't resolve
 *     '@vercel/turbopack-next/internal/font/google/font'
 *     next/font/google queries have exactly one entry
 *
 * One declaration per family is what the import map expects, and it also means
 * a weight change lands everywhere instead of in one of three copies.
 *
 * The weight lists are the union of what the three layouts asked for, so no
 * call site loses a weight it was previously rendering.
 */
export const redHatDisplay = Red_Hat_Display({
    subsets: ["latin", "latin-ext"],
    variable: "--font-rh-display",
    display: "swap",
    weight: ["400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
});

export const bricolage = Bricolage_Grotesque({
    subsets: ["latin", "latin-ext"],
    variable: "--font-bricolage",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const redHatMono = Red_Hat_Mono({
    subsets: ["latin", "latin-ext"],
    variable: "--font-rh-mono",
    display: "swap",
    weight: ["400", "500"],
});

export const fontVariables = [
    redHatDisplay.variable,
    bricolage.variable,
    redHatMono.variable,
].join(" ");

/** Every typeface in one string, for the `<body className>`. */
export const allFontVariables = `${redHatDisplay.variable} ${bricolage.variable} ${redHatMono.variable}`;
