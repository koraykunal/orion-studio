"use client";

import {useTranslations, useLocale} from "next-intl";
import {TextReveal} from "@/components/motion/TextReveal";
import {LineReveal} from "@/components/motion/LineReveal";
import {OrionButton} from "@/components/common/OrionButton";
import {CaseStudyHero} from "@/components/sections/case-study/CaseStudyHero";
import {SectionRenderer} from "@/components/sections/case-study/SectionRenderer";
import type {
    Project,
    Section,
    VisualWallData,
    VisualWallItem,
} from "@/lib/project-types";

const IMAGE_FILE_RE = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const VIDEO_FILE_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function isRenderableVisual(src: string) {
    return IMAGE_FILE_RE.test(src) || VIDEO_FILE_RE.test(src);
}

function visualWallItems(project: Project) {
    const manual = project.sections.find((section) => section.type === "visualWall");
    if (!manual) return [];

    const data = manual.data as VisualWallData;
    return data.items.filter((item) => item.src && isRenderableVisual(item.src));
}

function contentSections(sections: Section[]) {
    return sections.filter((section) => section.type !== "visualWall");
}

function VisualWallMedia({item, priority}: { item: VisualWallItem; priority: boolean }) {
    const isVideo = VIDEO_FILE_RE.test(item.src);

    if (isVideo) {
        return (
            <video
                src={item.src}
                className="block h-auto w-full rounded-md"
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label={item.alt || undefined}
            />
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={item.src}
            alt={item.alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="block h-auto w-full rounded-md"
        />
    );
}

function VisualWall({project}: { project: Project }) {
    const items = visualWallItems(project);
    if (items.length < 1) return null;

    return (
        <section className="section-container pb-20 lg:pb-32">
            <div className="mx-auto max-w-352">
                <div className="columns-1 gap-4 md:columns-2 lg:columns-3 lg:gap-5">
                    {items.map((item, index) => (
                        <div
                            key={`${item.src}-${index}`}
                            className="mb-3 break-inside-avoid rounded-md bg-surface-1 lg:mb-5"
                        >
                            <VisualWallMedia item={item} priority={index < 2}/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

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
            <CaseStudyHero project={project}/>

            <VisualWall project={project}/>

            <SectionRenderer sections={contentSections(project.sections)}/>

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
