const DEFAULT_SITE_URL = "https://orionstud.io";

function normalizeSiteUrl(value: string | undefined): string {
    const trimmed = value?.trim();
    if (!trimmed) return DEFAULT_SITE_URL;
    return trimmed.replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL,
);

export function absoluteUrl(path = "/"): string {
    if (/^https?:\/\//i.test(path)) return path;
    const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    return `${SITE_URL}${suffix}`;
}
