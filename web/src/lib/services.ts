export const SERVICE_SLUGS = [
    "identity",
    "web",
    "apps",
    "seo",
    "social",
    "ads",
    "production",
    "care",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceSlug(value: string): value is ServiceSlug {
    return (SERVICE_SLUGS as readonly string[]).includes(value);
}
