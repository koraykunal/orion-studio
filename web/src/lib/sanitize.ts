import sanitizeHtml from "sanitize-html";

const BASE_CONFIG: sanitizeHtml.IOptions = {
    allowedTags: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr", "blockquote",
        "ul", "ol", "li",
        "strong", "em", "u", "s", "code", "pre", "mark",
        "a", "img",
        "table", "thead", "tbody", "tr", "th", "td",
        "figure", "figcaption",
        "iframe", "span", "div",
    ],
    allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        img: ["src", "alt", "title", "width", "height", "loading"],
        iframe: [
            "src", "width", "height", "frameborder", "allow",
            "allowfullscreen", "title",
        ],
        span: ["style"],
        div: ["style"],
        "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: [
        "www.youtube.com", "www.youtube-nocookie.com",
        "player.vimeo.com",
    ],
    allowedStyles: {
        "*": {
            "color": [/^#(0x)?[0-9a-f]+$/i, /^rgb\(.*\)$/, /^oklch\(.*\)$/],
            "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
            "background-color": [/^#(0x)?[0-9a-f]+$/i, /^rgb\(.*\)$/, /^oklch\(.*\)$/],
        },
    },
    transformTags: {
        a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
};

export function sanitizeRichHtml(html: string | null | undefined): string {
    if (!html) return "";
    return sanitizeHtml(html, BASE_CONFIG);
}
