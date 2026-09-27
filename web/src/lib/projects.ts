import { prisma } from "@/lib/prisma";
import type { Project as PrismaProject } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getDevProjectBySlug, getDevProjects } from "@/lib/dev-projects";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { enumValue } from "@/lib/validation";
import { localizedValue, type Locale } from "@/lib/locales";
import {
    PROJECT_CATEGORIES,
    PROJECT_SERVICE_CATEGORIES,
    type Project,
    type ProjectCategory,
    type ProjectServiceCategory,
    type Section,
} from "@/lib/project-types";
import { sanitizeRichHtml } from "@/lib/sanitize";

export type { Project, ProjectCategory, ProjectServiceCategory, Section };
export { getCategoryLabel, getServiceCategoryLabel } from "@/lib/project-types";

/**
 * Development-only fixture fallback.
 *
 * Opt-in rather than automatic. It used to fire on any empty result or any
 * thrown error whenever NODE_ENV was "development", which meant a genuinely
 * broken database query was indistinguishable from an empty one and both were
 * silently masked by fixture content. Set DEV_PROJECT_FALLBACK=1 to enable it.
 */
const useDevFallback = process.env.DEV_PROJECT_FALLBACK === "1" && process.env.NODE_ENV !== "production";

const REVALIDATE_SECONDS = 60 * 60;

const getCachedPublishedProjects = unstable_cache(
    async () =>
        prisma.project.findMany({
            where: { status: "published" },
            orderBy: { order: "asc" },
        }),
    ["published-projects"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.projects] },
);

const getCachedFeaturedProjects = unstable_cache(
    async () =>
        prisma.project.findMany({
            where: { status: "published", featured: true },
            orderBy: { order: "asc" },
        }),
    ["featured-projects"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.projects] },
);

const getCachedPublishedProjectBySlug = unstable_cache(
    async (slug: string) =>
        prisma.project.findFirst({
            where: { slug, status: "published" },
        }),
    ["published-project-by-slug"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.projects, CACHE_TAGS.projectSlugs] },
);

const getCachedPublishedProjectSlugs = unstable_cache(
    async () =>
        prisma.project.findMany({
            where: { status: "published" },
            orderBy: { order: "asc" },
            select: { slug: true },
        }),
    ["published-project-slugs"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.projectSlugs] },
);

function sanitizeSection(section: Section): Section {
    // The discriminant narrows `data` to TextBlockData here, so the result is
    // still a member of the union and no cast is needed.
    if (section.type === "textBlock") {
        return {
            ...section,
            data: { ...section.data, contentHtml: sanitizeRichHtml(section.data.contentHtml) },
        };
    }
    return section;
}

function isSectionArray(value: unknown): value is Section[] {
    return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null);
}

/**
 * Typed against the generated Prisma model rather than a hand-written
 * structural interface, which used to drift silently: adding a column to
 * schema.prisma did not break this signature, it just quietly stopped being
 * mapped.
 */
function mapProject(record: PrismaProject, locale: Locale): Project {
    return {
        slug: record.slug,
        client: record.client,
        tagline: localizedValue(record.tagline_tr, record.tagline_en, locale),
        year: record.year,
        services: record.services,
        outcome: localizedValue(record.outcome_tr, record.outcome_en, locale),
        image: record.image,
        previewVideo: record.previewVideo,
        category: enumValue(record.category, PROJECT_CATEGORIES, "client"),
        serviceCategory: enumValue(record.serviceCategory, PROJECT_SERVICE_CATEGORIES, "web"),
        featured: record.featured,
        sections: (isSectionArray(record.sections) ? record.sections : []).map(sanitizeSection),
    };
}

export async function getAllProjects(locale: Locale): Promise<Project[]> {
    try {
        const projects = await getCachedPublishedProjects();
        if (projects.length === 0 && useDevFallback) return getDevProjects(locale);
        return projects.map((project) => mapProject(project, locale));
    } catch (error) {
        if (useDevFallback) {
            console.warn("Using development project fallback:", error);
            return getDevProjects(locale);
        }
        throw error;
    }
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
    try {
        const projects = await getCachedFeaturedProjects();
        if (projects.length === 0 && useDevFallback) return getDevProjects(locale).filter((p) => p.featured);
        return projects.map((project) => mapProject(project, locale));
    } catch (error) {
        if (useDevFallback) {
            console.warn("Using development featured project fallback:", error);
            return getDevProjects(locale).filter((p) => p.featured);
        }
        throw error;
    }
}

export async function getProjectBySlug(slug: string, locale: Locale): Promise<Project | undefined> {
    try {
        const record = await getCachedPublishedProjectBySlug(slug);
        if (!record) {
            return useDevFallback ? getDevProjectBySlug(slug, locale) : undefined;
        }
        return mapProject(record, locale);
    } catch (error) {
        if (useDevFallback) {
            console.warn("Using development project detail fallback:", error);
            return getDevProjectBySlug(slug, locale);
        }
        throw error;
    }
}

/** Used by generateStaticParams and the sitemap. */
export async function getPublishedProjectSlugs(): Promise<string[]> {
    try {
        const projects = await getCachedPublishedProjectSlugs();
        if (projects.length === 0 && useDevFallback) return getDevProjects("en").map((p) => p.slug);
        return projects.map((project) => project.slug);
    } catch (error) {
        if (useDevFallback) {
            console.warn("Using development project slug fallback:", error);
            return getDevProjects("en").map((p) => p.slug);
        }
        throw error;
    }
}
