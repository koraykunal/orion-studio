export function escapeHtml(input: unknown): string {
    if (input == null) return "";
    const str = typeof input === "string" ? input : String(input);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
