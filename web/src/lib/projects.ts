import { prisma } from "@/lib/prisma";
import type { Project, ProjectCategory, Section, SectionData, TextBlockData } from "@/lib/project-types";
import { sanitizeRichHtml } from "@/lib/sanitize";

export type { Project, ProjectCategory, Section };
export { getCategoryLabel } from "@/lib/project-types";

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
        image: string; category: string; featured: boolean; sections: unknown;
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
        category: p.category as ProjectCategory,
        featured: p.featured,
        sections: ((p.sections as Section[]) || []).map(sanitizeSection),
    };
}

export async function getAllProjects(locale: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { status: "published" },
        orderBy: { order: "asc" },
    });
    return projects.map((p) => mapProject(p, locale));
}

export async function getFeaturedProjects(locale: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { status: "published", featured: true },
        orderBy: { order: "asc" },
    });
    return projects.map((p) => mapProject(p, locale));
}

export async function getProjectBySlug(slug: string, locale: string): Promise<Project | undefined> {
    const p = await prisma.project.findFirst({
        where: { slug, status: "published" },
    });
    if (!p) return undefined;
    return mapProject(p, locale);
}
