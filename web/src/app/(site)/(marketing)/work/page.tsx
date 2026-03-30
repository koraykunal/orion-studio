import { getAllProjects } from "@/lib/projects";
import { WorkPageClient } from "./WorkPageClient";

export default async function WorkPage() {
    const projects = await getAllProjects();
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return <WorkPageClient featured={featured} others={others} />;
}
