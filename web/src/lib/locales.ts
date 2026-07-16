export const LOCALES = ["en", "tr"] as const;

export type Locale = (typeof LOCALES)[number];

