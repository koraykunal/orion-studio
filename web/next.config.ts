import type { NextConfig } from "next";

const securityHeaders = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        viewTransition: true,
    },
    async redirects() {
        return [
            { source: "/personal", destination: "/work", permanent: true },
            { source: "/ecom", destination: "/work", permanent: true },
            { source: "/corporation", destination: "/work", permanent: true },
            { source: "/single-page", destination: "/work", permanent: true },
            { source: "/request", destination: "/contact", permanent: true },
            { source: "/work/forma", destination: "/work", permanent: true },
            { source: "/work/harlow-finch", destination: "/work", permanent: true },
            { source: "/work/noctis", destination: "/work", permanent: true },
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
