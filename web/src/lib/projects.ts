import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getDevProjectBySlug, getDevProjects } from "@/lib/dev-projects";
import type {
    Project,
    ProjectCategory,
    ProjectServiceCategory,
    Section,
    SectionData,
    TextBlockData,
} from "@/lib/project-types";
import { sanitizeRichHtml } from "@/lib/sanitize";

export type { Project, ProjectCategory, ProjectServiceCategory, Section };
export { getCategoryLabel, getServiceCategoryLabel } from "@/lib/project-types";

const shouldUseDevProjectFallback = () => process.env.NODE_ENV === "development";

const getCachedPublishedProjects = unstable_cache(
    async () =>
        prisma.project.findMany({
            where: { status: "published" },
            orderBy: { order: "asc" },
        }),
    ["published-projects"],
    { revalidate: 300 },
);

const getCachedFeaturedProjects = unstable_cache(
    async () =>
        prisma.project.findMany({
            where: { status: "published", featured: true },
            orderBy: { order: "asc" },
        }),
    ["featured-projects"],
    { revalidate: 300 },
);

const getCachedPublishedProjectBySlug = unstable_cache(
    async (slug: string) =>
        prisma.project.findFirst({
            where: { slug, status: "published" },
        }),
    ["published-project-by-slug"],
    { revalidate: 300 },
);

function sanitizeSection(section: Section): Section {
    if (section.type === "textBlock") {
        const data = section.data as TextBlockData;
        return {
            ...section,
            data: {
                ...data,
                contentHtml: sanitizeRichHtml(data.contentHtml),
            } satisfies TextBlockData as SectionData,
        };
    }
    return section;
}

function getLocalizedStr(en: string, tr: string | null | undefined, locale: string): string {
    if (locale === "tr" && tr) return tr;
    return en;
}

function mapProject(
    p: {
        slug: string; client: string; tagline_en: string; tagline_tr: string | null;
        year: string; services: string[]; outcome_en: string; outcome_tr: string | null;
        image: string; previewVideo?: string | null; category: string; serviceCategory?: string | null; featured: boolean; sections: unknown;
    },
    locale: string
): Project {
    return {
        slug: p.slug,
        client: p.client,
        tagline: getLocalizedStr(p.tagline_en, p.tagline_tr, locale),
        year: p.year,
        services: p.services,
        outcome: getLocalizedStr(p.outcome_en, p.outcome_tr, locale),
        image: p.image,
        previewVideo: p.previewVideo ?? "",
        category: p.category as ProjectCategory,
        serviceCategory: (p.serviceCategory ?? "web") as ProjectServiceCategory,
        featured: p.featured,
        sections: ((p.sections as Section[]) || []).map(sanitizeSection),
    };
}

export async function getAllProjects(locale: string): Promise<Project[]> {
    try {
        const projects = await getCachedPublishedProjects();
        if (projects.length === 0 && shouldUseDevProjectFallback()) {
            return getDevProjects(locale);
        }
        return projects.map((p) => mapProject(p, locale));
    } catch (error) {
        if (shouldUseDevProjectFallback()) {
            console.warn("Using development project fallback:", error);
            return getDevProjects(locale);
        }
        throw error;
    }
}

export async function getFeaturedProjects(locale: string): Promise<Project[]> {
    try {
        const projects = await getCachedFeaturedProjects();
        if (projects.length === 0 && shouldUseDevProjectFallback()) {
            return getDevProjects(locale).filter((project) => project.featured);
        }
        return projects.map((p) => mapProject(p, locale));
    } catch (error) {
        if (shouldUseDevProjectFallback()) {
            console.warn("Using development featured project fallback:", error);
            return getDevProjects(locale).filter((project) => project.featured);
        }
        throw error;
    }
}

export async function getProjectBySlug(slug: string, locale: string): Promise<Project | undefined> {
    try {
        const p = await getCachedPublishedProjectBySlug(slug);
        if (!p && shouldUseDevProjectFallback()) {
            return getDevProjectBySlug(slug, locale);
        }
        if (!p) return undefined;
        return mapProject(p, locale);
    } catch (error) {
        if (shouldUseDevProjectFallback()) {
            console.warn("Using development project detail fallback:", error);
            return getDevProjectBySlug(slug, locale);
        }
        throw error;
    }
}
