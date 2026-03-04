import type { MetadataRoute } from "next";

const BASE_URL = "https://orionstud.io";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/work", priority: 0.9, changeFrequency: "weekly" as const },
        { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/work/harlow-finch", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/work/noctis", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/work/forma", priority: 0.7, changeFrequency: "monthly" as const },
    ];

    return routes.map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
