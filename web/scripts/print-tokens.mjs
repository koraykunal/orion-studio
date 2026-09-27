import fs from "node:fs";

/**
 * The design-system page was the fourth copy of the token values and it had
 * drifted: it printed hex/oklch strings that no longer matched globals.css.
 * This reads the live values out of the stylesheet instead of restating them,
 * so the page can no longer disagree with the code.
 *
 * Run from the web directory: node scripts/sync-design-system.mjs
 */
const css = fs.readFileSync("src/app/globals.css", "utf8");

/** Extracts `--token: value;` declarations from the :root block. */
function readTokens() {
    const rootStart = css.indexOf(":root {");
    const rootEnd = css.indexOf("\n}", rootStart);
    const root = css.slice(rootStart, rootEnd);

    const tokens = {};
    for (const match of root.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
        tokens[match[1]] = match[2].trim();
    }
    return tokens;
}

const tokens = readTokens();

/** Approximate sRGB hex for an oklch() value, good enough for a swatch label. */
function oklchToHex(value) {
    const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    if (!match) return value;

    const L = Number(match[1]);
    const C = Number(match[2]);
    const H = (Number(match[3]) * Math.PI) / 180;

    const a = C * Math.cos(H);
    const b = C * Math.sin(H);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    const to255 = (channel) => {
        const c = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
        return Math.max(0, Math.min(255, Math.round(c * 255)));
    };

    return `#${[to255(r), to255(g), to255(bl)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const NAMED = {
    background: "--background",
    "surface 1": "--surface-1",
    "surface 2": "--surface-2",
    "surface 3": "--surface-3",
    foreground: "--foreground",
    "foreground readable": "--foreground-readable",
    "foreground muted": "--foreground-muted",
    "foreground subtle": "--foreground-subtle",
    "foreground atmospheric": "--foreground-atmospheric",
    accent: "--accent",
    "accent warm": "--accent-warm",
    "accent bright": "--accent-bright",
    border: "--border",
    "border subtle": "--border-subtle",
    "border bright": "--border-bright",
    "border interactive": "--border-interactive",
    "device body": "--device-body",
    "device edge": "--device-edge",
    "device screen top": "--device-screen-top",
    "device screen bottom": "--device-screen-bottom",
    "device lens": "--device-lens",
};

console.log("| Token | Value | Approx. hex |");
console.log("|---|---|---|");
for (const [label, token] of Object.entries(NAMED)) {
    const value = tokens[token];
    if (!value) {
        console.log(`| ${label} | **missing: ${token}** | |`);
        continue;
    }
    const hex = value.startsWith("oklch") ? oklchToHex(value) : value;
    console.log(`| \`${token}\` | \`${value}\` | \`${hex}\` |`);
}

const missing = Object.values(NAMED).filter((token) => !tokens[token]);
if (missing.length) {
    console.error(`\nMissing tokens in globals.css: ${missing.join(", ")}`);
    process.exit(1);
}
