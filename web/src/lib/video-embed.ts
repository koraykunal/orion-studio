export function getSafeVideoEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, "");

        if (host === "youtube.com" || host === "youtube-nocookie.com") {
            const videoId = parsed.searchParams.get("v");
            if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}`;
            if (parsed.pathname.startsWith("/embed/")) {
                return `https://www.youtube-nocookie.com${parsed.pathname}`;
            }
        }

        if (host === "youtu.be") {
            const videoId = parsed.pathname.replace("/", "");
            if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}`;
        }

        if (host === "vimeo.com") {
            const videoId = parsed.pathname.split("/").filter(Boolean)[0];
            if (videoId && /^\d+$/.test(videoId)) {
                return `https://player.vimeo.com/video/${videoId}`;
            }
        }

        if (host === "player.vimeo.com" && parsed.pathname.startsWith("/video/")) {
            return `https://player.vimeo.com${parsed.pathname}`;
        }
    } catch {
        return null;
    }

    return null;
}
