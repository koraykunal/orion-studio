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

const IMAGE_FILE_RE = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;

function isRenderableImage(src: string) {
    return IMAGE_FILE_RE.test(src);
}

function projectImages(project: Project) {
    const images: string[] = [];
    const pushImage = (src?: string) => {
        if (src && isRenderableImage(src)) {
            images.push(src);
        }
    };

    project.sections.forEach((section) => {
        if (section.type === "fullImage") {
            pushImage((section.data as FullImageData).image);
        }
        if (section.type === "gallery") {
            (section.data as GalleryData).images.forEach((image) => pushImage(image.src));
        }
        if (section.type === "deviceShowcase") {
            (section.data as DeviceShowcaseData).devices.forEach((device) => pushImage(device.image));
        }
        if (section.type === "beforeAfter") {
            const data = section.data as BeforeAfterData;
            pushImage(data.before.src);
            pushImage(data.after.src);
        }
        if (section.type === "media") {
            const data = section.data as MediaData;
            pushImage(data.poster || data.src);
        }
    });

    return Array.from(new Set(images.filter(Boolean))).slice(0, 5);
}

function VisualWall({ project }: { project: Project }) {
    const images = projectImages(project);
    if (images.length < 2) return null;
    const bentoClasses = [
        "col-span-2 md:col-span-2 md:row-span-2 lg:col-span-7 lg:row-span-2 aspect-[16/10] md:aspect-auto min-h-[15rem] md:min-h-[28rem] lg:min-h-[44rem]",
        "col-span-1 md:col-span-1 lg:col-span-5 aspect-[1/1] md:aspect-[4/5] lg:min-h-[21rem]",
        "col-span-1 md:col-span-1 lg:col-span-5 aspect-[1/1] md:aspect-[4/5] lg:min-h-[21rem]",
        "col-span-1 md:col-span-1 lg:col-span-4 aspect-[1/1] lg:min-h-[18rem]",
        "col-span-1 md:col-span-1 lg:col-span-8 aspect-[1/1] md:aspect-[16/10] lg:min-h-[18rem]",
    ];

    return (
        <section className="section-container pb-20 lg:pb-32">
            <div className="mx-auto max-w-[88rem]">
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(9rem,auto)] lg:gap-5">
                    {images.map((src, index) => (
                        <div
                            key={`${src}-${index}`}
                            className={`relative overflow-hidden rounded-md bg-surface-1 ${bentoClasses[index] ?? "aspect-[4/3] lg:col-span-6"}`}
                        >
                            <Image
                                src={src}
                                alt={index === 0 ? `${project.client} visual direction` : ""}
                                fill
                                sizes={
                                    index === 0
                                        ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 58vw"
                                        : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                }
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
