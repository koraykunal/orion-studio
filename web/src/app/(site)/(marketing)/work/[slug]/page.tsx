import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { CaseStudyClient } from "./CaseStudyClient";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function CaseStudyPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) notFound();

    const allProjects = await getAllProjects();
    const nextProject = allProjects.find((p) => p.sections && p.sections.length > 0 && p.slug !== slug) ?? null;

    return <CaseStudyClient project={project} nextProject={nextProject} />;
}
