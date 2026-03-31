export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://orion-studio.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/work", priority: 0.9, changeFrequency: "weekly" as const },
        { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
        { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    ];

    const [projects, posts] = await Promise.all([
        prisma.project.findMany({
            where: { status: "published" },
            select: { slug: true },
        }),
        prisma.post.findMany({
            where: { status: "published" },
            select: { slug: true },
        }),
    ]);

    const projectRoutes = projects.map((p) => ({
        path: `/work/${p.slug}`,
        priority: 0.7,
        changeFrequency: "monthly" as const,
    }));

    const blogRoutes = posts.map((post) => ({
        path: `/blog/${post.slug}`,
        priority: 0.6,
        changeFrequency: "monthly" as const,
    }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes].map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
