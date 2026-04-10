import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const securityHeaders = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
    output: "standalone",
    images: { unoptimized: true },
    experimental: { viewTransition: true },
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
        return [{ source: "/(.*)", headers: securityHeaders }];
    },
};

export default withNextIntl(nextConfig);
