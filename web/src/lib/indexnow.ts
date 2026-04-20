import { BASE_URL, LOCALES } from "@/lib/schema";

const ENDPOINT = "https://api.indexnow.org/IndexNow";

export function getIndexNowKey(): string | null {
    return process.env.INDEXNOW_KEY ?? null;
}

function localizedUrls(path: string): string[] {
    const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    return LOCALES.map((locale) => `${BASE_URL}/${locale}${suffix}`);
}

export async function pingIndexNow(paths: string[]): Promise<void> {
    const key = getIndexNowKey();
    if (!key) return;

    const urls = paths.flatMap((p) => localizedUrls(p));
    const host = new URL(BASE_URL).host;

    try {
        await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                host,
                key,
                keyLocation: `${BASE_URL}/api/indexnow-key`,
                urlList: urls,
            }),
        });
    } catch (error) {
        console.error("IndexNow ping failed:", error);
    }
}
