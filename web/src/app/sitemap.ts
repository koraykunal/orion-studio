export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "../../i18n/routing";

const BASE_URL = "https://orion-studio.net";

type Route = {
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

function buildAlternates(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
        languages[locale] = `${BASE_URL}/${locale}${path === "/" ? "" : path}`;
    }
    languages["x-default"] = `${BASE_URL}/${routing.defaultLocale}${path === "/" ? "" : path}`;
    return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: Route[] = [
        { path: "/", priority: 1.0, changeFrequency: "weekly" },
        { path: "/about", priority: 0.8, changeFrequency: "monthly" },
        { path: "/work", priority: 0.9, changeFrequency: "weekly" },
        { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
        { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    ];

    const [projects, posts] = await Promise.all([
        prisma.project.findMany({
            where: { status: "published" },
            select: { slug: true, updatedAt: true },
        }),
        prisma.post.findMany({
            where: { status: "published" },
            select: { slug: true, updatedAt: true },
        }),
    ]);

    const projectRoutes: (Route & { lastModified: Date })[] = projects.map((p) => ({
        path: `/work/${p.slug}`,
        priority: 0.7,
        changeFrequency: "monthly",
        lastModified: p.updatedAt,
    }));

    const blogRoutes: (Route & { lastModified: Date })[] = posts.map((post) => ({
        path: `/blog/${post.slug}`,
        priority: 0.6,
        changeFrequency: "monthly",
        lastModified: post.updatedAt,
    }));

    const all = [
        ...staticRoutes.map((r) => ({ ...r, lastModified: new Date() })),
        ...projectRoutes,
        ...blogRoutes,
    ];

    return all.flatMap((route) =>
        routing.locales.map((locale) => ({
            url: `${BASE_URL}/${locale}${route.path === "/" ? "" : route.path}`,
            lastModified: route.lastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
            alternates: { languages: buildAlternates(route.path) },
        })),
    );
}
