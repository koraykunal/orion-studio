import type { MetadataRoute } from "next";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";
import { LOCALES } from "@/lib/locales";
import { getPublishedProjectSlugs } from "@/lib/projects";
import { getPublishedPostSlugs } from "@/lib/blog";
import { prisma } from "@/lib/prisma";

/**
 * Rendered per request so a newly published case study appears immediately.
 * The nginx edge cache holds this for 60 seconds, and revalidateContent()
 * purges that path on every write.
 */
export const dynamic = "force-dynamic";

type Route = {
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    lastModified: Date;
};

const STATIC_ROUTES: Omit<Route, "lastModified">[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
];

/** Service detail pages come from a fixed slug list rather than the database. */
const SERVICE_SLUGS = [
    "identity",
    "web",
    "apps",
    "seo",
    "social",
    "ads",
    "production",
    "care",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [projectSlugs, postSlugs, projectUpdates, postUpdates] = await Promise.all([
        getPublishedProjectSlugs(),
        getPublishedPostSlugs(),
        prisma.project.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } }),
        prisma.post.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } }),
    ]);

    const now = new Date();
    const projectUpdatedAt = new Map(projectUpdates.map((p) => [p.slug, p.updatedAt]));
    const postUpdatedAt = new Map(postUpdates.map((p) => [p.slug, p.updatedAt]));

    const routes: Route[] = [
        ...STATIC_ROUTES.map((route) => ({ ...route, lastModified: now })),
        ...projectSlugs.map((slug) => ({
            path: `/work/${slug}`,
            priority: 0.7,
            changeFrequency: "monthly" as const,
            lastModified: projectUpdatedAt.get(slug) ?? now,
        })),
        ...postSlugs.map((slug) => ({
            path: `/blog/${slug}`,
            priority: 0.6,
            changeFrequency: "monthly" as const,
            lastModified: postUpdatedAt.get(slug) ?? now,
        })),
        ...SERVICE_SLUGS.map((slug) => ({
            path: `/services/${slug}`,
            priority: 0.6,
            changeFrequency: "monthly" as const,
            lastModified: now,
        })),
    ];

    return routes.flatMap((route) =>
        LOCALES.map((locale) => ({
            url: `${BASE_URL}/${locale}${route.path === "/" ? "" : route.path}`,
            lastModified: route.lastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
            alternates: { languages: buildLanguageAlternates(route.path) },
        })),
    );
}
