"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionButton } from "@/components/common/OrionButton";
import { CaseStudyHero } from "@/components/sections/case-study/CaseStudyHero";
import { SectionRenderer } from "@/components/sections/case-study/SectionRenderer";
import type {
    BeforeAfterData,
    DeviceShowcaseData,
    FullImageData,
    GalleryData,
    MediaData,
    Project,
} from "@/lib/project-types";

function projectImages(project: Project) {
    const images: string[] = [];

    project.sections.forEach((section) => {
        if (section.type === "fullImage") {
            images.push((section.data as FullImageData).image);
        }
        if (section.type === "gallery") {
            images.push(...(section.data as GalleryData).images.map((image) => image.src));
        }
        if (section.type === "deviceShowcase") {
            images.push(...(section.data as DeviceShowcaseData).devices.map((device) => device.image));
        }
        if (section.type === "beforeAfter") {
            const data = section.data as BeforeAfterData;
            images.push(data.before.src, data.after.src);
        }
        if (section.type === "media") {
            const data = section.data as MediaData;
            images.push(data.poster || data.src);
        }
    });

    return Array.from(new Set(images.filter(Boolean))).slice(0, 5);
}

function VisualWall({ project }: { project: Project }) {
    const images = projectImages(project);
    if (images.length < 2) return null;

    return (
        <section className="section-container pb-20 lg:pb-32">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
                <div className="relative min-h-[28rem] overflow-hidden rounded-md bg-surface-1 md:min-h-[44rem] lg:col-span-7">
                    <Image
                        src={images[0]}
                        alt={`${project.client} visual direction`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-5">
                    {images.slice(1, 5).map((src, index) => (
                        <div
                            key={src}
                            className={`relative overflow-hidden rounded-md bg-surface-1 ${
                                index === 0 ? "aspect-[4/5] lg:-translate-y-16" : "aspect-[5/4]"
                            } ${index === 2 ? "lg:-translate-y-8" : ""}`}
                        >
                            <Image
                                src={src}
                                alt=""
                                fill
                                sizes="(max-width: 1024px) 50vw, 22vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5" />
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
            <CaseStudyHero project={project} />

            <VisualWall project={project} />

            <SectionRenderer sections={project.sections} />

            {nextProject && (
                <section className="relative overflow-hidden" style={{ paddingTop: "clamp(4rem, 8vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)" }}>
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse 46% 54% at 50% 50%, var(--glow-subtle), transparent 72%)",
                        }}
                    />
                    <div className="section-container">
                        <LineReveal className="mb-16" />
                        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                            <div className="space-y-7 lg:col-span-8">
                                <span className="text-index text-foreground-muted">{t("nextProject")}</span>
                                <TextReveal as="h2" type="words" className="font-display text-[clamp(4rem,10vw,13rem)] uppercase leading-[0.78] tracking-[-0.08em]">
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
