"use client";

import {useTranslations, useLocale} from "next-intl";
import {TextReveal} from "@/components/motion/TextReveal";
import {LineReveal} from "@/components/motion/LineReveal";
import {OrionButton} from "@/components/common/OrionButton";
import {CaseStudyHero} from "@/components/sections/case-study/CaseStudyHero";
import {SectionRenderer} from "@/components/sections/case-study/SectionRenderer";
import type {Project} from "@/lib/project-types";

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
        <main id="main-content" className="relative bg-background overflow-hidden">
            <CaseStudyHero project={project}/>

            {/* Every section renders in the author's order, including the visual
                wall, which used to be hoisted into a fixed slot here. */}
            <SectionRenderer sections={project.sections}/>

            {nextProject && (
                <section className="relative overflow-hidden"
                         style={{paddingTop: "clamp(4rem, 8vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)"}}>
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse 46% 54% at 50% 50%, var(--glow-subtle), transparent 72%)",
                        }}
                    />
                    <div className="section-container">
                        <LineReveal className="mb-16"/>
                        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                            <div className="space-y-7 lg:col-span-8">
                                <span className="text-index text-foreground-muted">{t("nextProject")}</span>
                                <TextReveal as="h2" type="words"
                                            className="font-display text-[clamp(3.25rem,16vw,5.75rem)] uppercase leading-[0.82] tracking-[-0.07em] lg:text-[clamp(4rem,10vw,13rem)] lg:leading-[0.78] lg:tracking-[-0.08em]"
                                            disableOnMobile>
                                    {nextProject.client}
                                </TextReveal>
                            </div>
                            <div className="lg:col-span-4 lg:text-right">
                                <OrionButton href={`/${locale}/work/${nextProject.slug}`} withArrow>
                                    {t("viewProject")}
                                </OrionButton>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
