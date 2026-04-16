export const revalidate = 300;

import { getAllProjects } from "@/lib/projects";
import { WorkPageClient } from "./WorkPageClient";

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const projects = await getAllProjects(locale);
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return <WorkPageClient featured={featured} others={others} />;
}
