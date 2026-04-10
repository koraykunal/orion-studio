"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { TextReveal } from "@/components/motion/TextReveal";
import { MaskImage } from "@/components/motion/MaskImage";
import { LineReveal } from "@/components/motion/LineReveal";
import { CaseStudyHero } from "@/components/sections/case-study/CaseStudyHero";
import { SectionRenderer } from "@/components/sections/case-study/SectionRenderer";
import type { Project } from "@/lib/project-types";

export function CaseStudyClient({
    project,
    nextProject,
}: {
    project: Project;
    nextProject: Project | null;
}) {
    const t = useTranslations("work");
    const locale = useLocale();
    return (
        <main className="relative bg-background overflow-hidden">
            <CaseStudyHero project={project} />

            {project.image && (
                <div className="section-container" style={{ paddingBottom: "clamp(2rem, 4vw, 3rem)" }}>
                    <MaskImage
                        src={project.image}
                        alt={`${project.client} — ${project.tagline}`}
                        aspect="21/9"
                        inset={8}
                        className="rounded-lg lg:rounded-xl"
                    />
                </div>
            )}

            <SectionRenderer sections={project.sections} />

            {nextProject && (
                <section className="relative overflow-hidden" style={{ paddingTop: "clamp(4rem, 8vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)" }}>
                    <div className="section-container">
                        <LineReveal className="mb-16" />
                        <div className="text-center space-y-8">
                            <span className="text-index text-foreground-muted">{t("nextProject")}</span>
                            <TextReveal as="h2" type="words" className="text-title">
                                {nextProject.client}
                            </TextReveal>
                            <div className="pt-4">
                                <Link
                                    href={`/${locale}/work/${nextProject.slug}`}
                                    className="group relative inline-block px-10 py-4 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500 overflow-hidden"
                                >
                                    <span className="relative z-10">View project</span>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
