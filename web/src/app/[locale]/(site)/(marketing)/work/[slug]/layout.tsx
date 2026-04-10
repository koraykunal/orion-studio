import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/projects";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const project = await getProjectBySlug(slug, locale);

    if (!project) {
        return { title: "Project Not Found — Orion Studio" };
    }

    return {
        title: `${project.client} — Orion Studio`,
        description: project.outcome,
    };
}

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
