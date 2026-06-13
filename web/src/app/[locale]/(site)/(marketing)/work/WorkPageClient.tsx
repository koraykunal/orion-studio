"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { PortfolioPreviewMedia } from "@/components/common/PortfolioPreviewMedia";
import { EASES } from "@/lib/animations/config";
import { useLocale, useTranslations } from "next-intl";
import { getServiceCategoryLabel, type Project } from "@/lib/project-types";

function ProjectTile({ project, locale }: { project: Project; locale: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const hasCaseStudy = project.sections && project.sections.length > 0;

    useGSAP(() => {
        if (!cardRef.current || !imageRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        tl.fromTo(
            imageRef.current,
            { clipPath: "inset(6% 6% 6% 6%)", scale: 1.08 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.4,
                ease: EASES.brandInOut,
            },
            0.1
        );

        tl.from(
            cardRef.current.querySelector(".card-meta")!,
            { opacity: 0, y: 32, duration: 0.8, ease: EASES.expo },
            0.4
        );
    }, { scope: cardRef });

    const cardContent = (
        <article ref={cardRef} className="group relative">
            <div
                ref={imageRef}
                className="relative aspect-video overflow-hidden rounded-md bg-surface-1"
                style={{ clipPath: "inset(6% 6% 6% 6%)" }}
            >
                <PortfolioPreviewMedia
                    image={project.image}
                    video={project.previewVideo}
                    alt={project.client}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 66vw"
                    className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    videoMode="always"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,var(--background)_122%)] opacity-65 transition-opacity duration-500 group-hover:opacity-80" />
            </div>

            <div className="card-meta mt-5 flex items-end justify-between gap-6">
                <div className="min-w-0">
                    <span className="block text-caption text-foreground-muted">
                        {getServiceCategoryLabel(project.serviceCategory, locale)}
                    </span>
                    <h2 className="mt-2 text-heading leading-none tracking-[-0.035em] text-foreground">
                        {project.client}
                    </h2>
                </div>
            </div>
        </article>
    );

    if (hasCaseStudy) {
        return (
            <Link href={`/${locale}/work/${project.slug}`}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}

export function WorkPageClient({ featured, others }: { featured: Project[]; others: Project[] }) {
    const locale = useLocale();
    const t = useTranslations("work");
    const visibleProjects = [...featured, ...others];
    const hasProjects = visibleProjects.length > 0;

    return (
        <main className="relative overflow-hidden bg-background">
            <section className="relative overflow-hidden pt-32">
                <div className="absolute -right-[18%] top-[2%] h-[78%] w-[62%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.04} globalOpacity={0.26} rotate={10} />
                </div>

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 52% 44% at 28% 24%, var(--glow-subtle), transparent 72%), radial-gradient(ellipse 42% 50% at 82% 72%, var(--glow-warm-subtle), transparent 72%)",
                    }}
                />

                <div className="relative z-10 section-container pb-16 lg:pb-24">
                    <LineReveal className="mb-12 lg:mb-20" />

                    <div className="grid-container gap-y-10">
                        <div className="col-span-12 lg:col-span-11">
                            <TextReveal as="h1" type="words" className="font-display text-[clamp(5.5rem,18vw,24rem)] uppercase leading-[0.72] tracking-[-0.09em] text-foreground">
                                {t("pageTitle")}
                            </TextReveal>
                        </div>

                    </div>
                </div>
            </section>

            {hasProjects && (
                <section className="w-full px-4 pb-[clamp(6rem,12vw,14rem)] md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-14 md:grid-cols-2 lg:gap-x-6 lg:gap-y-18">
                    {visibleProjects.map((project) => (
                        <ProjectTile key={project.slug} project={project} locale={locale} />
                    ))}
                    </div>
                </section>
            )}

            {!hasProjects && (
                <section className="section-container section-py">
                    <p className="text-body-lg text-foreground-muted">{t("noProjects")}</p>
                </section>
            )}

        </main>
    );
}
