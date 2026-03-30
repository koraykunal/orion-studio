import { prisma } from "@/lib/prisma";
import type { Project, ProjectCategory, Section } from "@/lib/project-types";

export type { Project, ProjectCategory, Section };
export { getCategoryLabel } from "@/lib/project-types";

function mapProject(p: {
    slug: string; client: string; tagline: string; year: string;
    services: string[]; outcome: string; image: string;
    category: string; featured: boolean; sections: unknown;
}): Project {
    return {
        slug: p.slug,
        client: p.client,
        tagline: p.tagline,
        year: p.year,
        services: p.services,
        outcome: p.outcome,
        image: p.image,
        category: p.category as ProjectCategory,
        featured: p.featured,
        sections: (p.sections as Section[]) || [],
    };
}

export async function getAllProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { status: "published" },
        orderBy: { order: "asc" },
    });
    return projects.map(mapProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { status: "published", featured: true },
        orderBy: { order: "asc" },
    });
    return projects.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    const p = await prisma.project.findFirst({
        where: { slug, status: "published" },
    });
    if (!p) return undefined;
    return mapProject(p);
}
