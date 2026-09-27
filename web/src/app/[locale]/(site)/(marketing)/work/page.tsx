export const dynamic = "force-dynamic";

import { getAllProjects } from "@/lib/projects";
import { WorkPageClient } from "./WorkPageClient";
import { toLocale } from "@/lib/locales";

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: rawLocale } = await params;
    const locale = toLocale(rawLocale);
    const projects = await getAllProjects(toLocale(locale));
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return <WorkPageClient featured={featured} others={others} />;
}
