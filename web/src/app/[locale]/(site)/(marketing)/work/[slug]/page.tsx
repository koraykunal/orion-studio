import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { creativeWorkSchema } from "@/lib/schema";
import { CaseStudyClient } from "./CaseStudyClient";
import { toLocale } from "@/lib/locales";

type Props = { params: Promise<{ slug: string; locale: string }> };

/**
 * Rendered per request rather than prerendered, so a newly published case study
 * is live immediately. The underlying reads are tag-cached, and
 * revalidateContent("projects") purges those tags on every write.
 */
export const dynamicParams = true;
export const dynamic = "force-dynamic";

/**
 * Returning an empty array tells Next there is nothing to prerender, while
 * dynamicParams still allows any slug at request time. This previously returned
 * real slugs and then combined it with force-dynamic, which meant the list was
 * computed and thrown away.
 */
export async function generateStaticParams() {
    return [];
}

export default async function CaseStudyPage({ params }: Props) {
    const { slug, locale: rawLocale } = await params;
    const locale = toLocale(rawLocale);
    const project = await getProjectBySlug(slug, toLocale(locale));

    if (!project) notFound();

    const allProjects = await getAllProjects(toLocale(locale));
    const nextProject = allProjects.find((p) => p.sections && p.sections.length > 0 && p.slug !== slug) ?? null;

    const jsonLd = creativeWorkSchema({
        client: project.client,
        tagline: project.tagline,
        outcome: project.outcome,
        slug: project.slug,
        locale,
        image: project.image,
        year: project.year,
        services: project.services,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseStudyClient project={project} nextProject={nextProject} />
        </>
    );
}
