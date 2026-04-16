import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { CaseStudyClient } from "./CaseStudyClient";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = true;
export const revalidate = 300;

export default async function CaseStudyPage({ params }: Props) {
    const { slug, locale } = await params;
    const project = await getProjectBySlug(slug, locale);

    if (!project) notFound();

    const allProjects = await getAllProjects(locale);
    const nextProject = allProjects.find((p) => p.sections && p.sections.length > 0 && p.slug !== slug) ?? null;

    return <CaseStudyClient project={project} nextProject={nextProject} />;
}
