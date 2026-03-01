import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        viewTransition: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
