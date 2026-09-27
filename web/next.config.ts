import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Security headers.
 *
 * These are declared here as the single source of truth. nginx repeats them
 * in its own `server` block because `add_header` in a child `location` block
 * replaces rather than inherits the parent set, which means nginx-served paths
 * such as /uploads/ would otherwise get no headers at all. Keep both lists in
 * sync, and prefer adding a new header to the nginx `include` snippet.
 */
const securityHeaders = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    { key: "X-Download-Options", value: "noopen" },
];

/**
 * Long-lived immutable caching for fingerprinted build output is configured in
 * nginx (see the `location ^~ /_next/static/` block) rather than here, so the
 * asset-serving policy lives in one place.
 */

const nextConfig: NextConfig = {
    output: "standalone",
    poweredByHeader: false,
    reactStrictMode: true,

    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30,
        // AVIF encoding is a documented RCE vector; keep the optimizer reachable
        // only for the formats this site actually serves.
        dangerouslyAllowSVG: false,
        contentDispositionType: "attachment",
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },

    async redirects() {
        return [
            { source: "/personal", destination: "/en/work", permanent: true },
            { source: "/ecom", destination: "/en/work", permanent: true },
            { source: "/corporation", destination: "/en/work", permanent: true },
            { source: "/single-page", destination: "/en/work", permanent: true },
            { source: "/request", destination: "/en/contact", permanent: true },
            { source: "/work/forma", destination: "/en/work", permanent: true },
            { source: "/work/harlow-finch", destination: "/en/work", permanent: true },
            { source: "/work/noctis", destination: "/en/work", permanent: true },
        ];
    },

    async headers() {
        return [
            { source: "/(.*)", headers: securityHeaders },
            // Cache-Control for fingerprinted output is set in nginx, which is
            // where asset serving is actually decided. Setting it here as well
            // makes Next warn that it overrides its own defaults.
        ];
    },
};

export default withNextIntl(nextConfig);
