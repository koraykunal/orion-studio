"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { OrionButton } from "@/components/common/OrionButton";
import { EASES } from "@/lib/animations/config";
import { useTranslations, useLocale } from "next-intl";
import {
    PROJECT_SERVICE_CATEGORIES,
    getCategoryLabel,
    getServiceCategoryLabel,
    type Project,
    type ProjectServiceCategory,
} from "@/lib/project-types";

function FeaturedCard({ project, index, locale }: { project: Project; index: number; locale: string }) {
    const t = useTranslations("work");
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

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

    const isEven = index % 2 === 0;

    const cardContent = (
        <div ref={cardRef} className="group">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start`}>
                <div className={`lg:col-span-7 ${isEven ? "" : "lg:order-2"}`}>
                    <div
                        ref={imageRef}
                        className="relative overflow-hidden rounded-lg lg:rounded-xl cursor-pointer"
                        style={{ aspectRatio: "3/2", clipPath: "inset(6% 6% 6% 6%)" }}
                    >
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={`${project.client}, ${project.tagline}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-surface-2" aria-hidden="true" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>

                <div className={`card-meta lg:col-span-5 ${isEven ? "" : "lg:order-1"} flex flex-col justify-between h-full py-2 lg:py-4`}>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 text-index">
                            <span className="text-foreground-subtle">0{index + 1}</span>
                            <span className="text-foreground-subtle">{project.year}</span>
                            <span className="text-foreground-muted">{getCategoryLabel(project.category, locale)}</span>
                        </div>
                        <span className="inline-flex w-fit rounded-full border border-accent/25 px-3 py-1 text-caption text-accent">
                            {getServiceCategoryLabel(project.serviceCategory, locale)}
                        </span>

                        <h2 className="text-title text-[clamp(1.75rem,3.5vw,3rem)]">{project.client}</h2>

                        <p className="text-editorial !text-foreground-muted/80 max-w-[42ch]">
                            {project.tagline}
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {project.services.map((s) => (
                                <span
                                    key={s}
                                    className="px-3 py-1.5 rounded-full border border-border text-[0.625rem] uppercase tracking-[0.15em] text-foreground-muted"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                        {project.sections && project.sections.length > 0 && (
                            <span
                                className="inline-flex items-center gap-2 text-label text-foreground-muted group-hover:text-accent transition-colors duration-300"
                                data-cursor="hover"
                            >
                                {t("viewCaseStudy")}
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <path d="M1 15L15 1M15 1H5M15 1V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (project.sections && project.sections.length > 0) {
        return <Link href={`/${locale}/work/${project.slug}`}>{cardContent}</Link>;
    }

    return cardContent;
}

export function WorkPageClient({ featured, others }: { featured: Project[]; others: Project[] }) {
    const t = useTranslations("work");
    const locale = useLocale();
    const [activeCategory, setActiveCategory] = useState<ProjectServiceCategory | "all">("all");
    const allProjects = useMemo(() => [...featured, ...others], [featured, others]);
    const visibleCategories = useMemo(
        () =>
            PROJECT_SERVICE_CATEGORIES.filter((category) =>
                allProjects.some((project) => project.serviceCategory === category),
            ),
        [allProjects],
    );
    const filteredFeatured =
        activeCategory === "all"
            ? featured
            : featured.filter((project) => project.serviceCategory === activeCategory);
    const filteredOthers =
        activeCategory === "all"
            ? others
            : others.filter((project) => project.serviceCategory === activeCategory);
    const hasProjects = filteredFeatured.length > 0 || filteredOthers.length > 0;

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -right-[10%] top-[5%] w-[45%] h-[75%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.05} globalOpacity={0.3} rotate={10} />
                </div>

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 60% 50% at 40% 35%, var(--glow-subtle), transparent 70%)",
                    }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="grid-container gap-y-10">
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            <span className="text-index text-foreground-muted">{t("pageLabel")}</span>

                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                                {t("pageTitle")}
                            </TextReveal>

                            <TextReveal
                                as="p"
                                type="lines"
                                className="text-body-lg text-foreground-muted max-w-[52ch]"
                                delay={0.2}
                            >
                                {t("pageDescription")}
                            </TextReveal>

                            {visibleCategories.length > 1 && (
                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <span className="mr-2 text-index text-foreground-subtle">
                                        {t("filterLabel")}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory("all")}
                                        className={`rounded-full border px-3.5 py-2 text-caption transition-colors duration-300 ${
                                            activeCategory === "all"
                                                ? "border-accent/40 bg-accent/10 text-accent"
                                                : "border-border text-foreground-muted hover:border-accent/30 hover:text-foreground"
                                        }`}
                                    >
                                        {t("filterAll")}
                                    </button>
                                    {visibleCategories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setActiveCategory(category)}
                                            className={`rounded-full border px-3.5 py-2 text-caption transition-colors duration-300 ${
                                                activeCategory === category
                                                    ? "border-accent/40 bg-accent/10 text-accent"
                                                    : "border-border text-foreground-muted hover:border-accent/30 hover:text-foreground"
                                            }`}
                                        >
                                            {getServiceCategoryLabel(category, locale)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {filteredFeatured.length > 0 && (
                <section className="section-container section-py space-y-16 lg:space-y-24">
                    {filteredFeatured.map((project, i) => (
                        <div key={project.slug}>
                            {i > 0 && <LineReveal className="mb-12 lg:mb-16" />}
                            <FeaturedCard project={project} index={i} locale={locale} />
                        </div>
                    ))}
                </section>
            )}

            {!hasProjects && (
                <section className="section-container section-py">
                    <p className="text-body-lg text-foreground-muted">{t("noProjects")}</p>
                </section>
            )}

            {filteredOthers.length > 0 && (
                <section className="section-py">
                    <div className="section-container">
                        <div className="space-y-6 mb-14 lg:mb-20">
                            <LineReveal />
                            <TextReveal as="h2" type="words" className="text-heading">
                                {t("moreProjects")}
                            </TextReveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-20">
                            {filteredOthers.map((project) => {
                                const hasCaseStudy = project.sections && project.sections.length > 0;
                                const card = (
                                    <div className={`group ${hasCaseStudy ? "cursor-pointer" : ""}`}>
                                        <div
                                            className="relative overflow-hidden rounded-lg"
                                            style={{ aspectRatio: "4/3" }}
                                        >
                                            {project.image ? (
                                                <Image
                                                    src={project.image}
                                                    alt={`${project.client}, ${project.tagline}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-surface-2" aria-hidden="true" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            <div className="flex items-center gap-4 text-index">
                                                <span className="text-foreground-subtle">{project.year}</span>
                                                <span className="text-foreground-muted">{getCategoryLabel(project.category, locale)}</span>
                                            </div>
                                            <span className="inline-flex w-fit rounded-full border border-accent/25 px-2.5 py-1 text-caption text-accent">
                                                {getServiceCategoryLabel(project.serviceCategory, locale)}
                                            </span>
                                            <h3 className="text-heading">{project.client}</h3>
                                            <p className="text-sm text-foreground-muted leading-relaxed max-w-[42ch]">{project.tagline}</p>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {project.services.map((s) => (
                                                    <span
                                                        key={s}
                                                        className="px-2.5 py-1 rounded-full border border-border-subtle text-[0.6rem] uppercase tracking-[0.12em] text-foreground-muted"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );

                                return hasCaseStudy ? (
                                    <Link
                                        key={project.slug}
                                        href={`/${locale}/work/${project.slug}`}
                                        data-cursor="hover"
                                    >
                                        {card}
                                    </Link>
                                ) : (
                                    <div key={project.slug}>{card}</div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section className="relative section-py overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 50% 60% at 50% 50%, var(--glow-subtle), transparent 70%)",
                    }}
                />
                <div className="absolute -left-[12%] bottom-[5%] w-[40%] h-[60%] pointer-events-none">
                    <OrionMark variant="belt" lineOpacity={0.04} globalOpacity={0.25} rotate={-15} mirror />
                </div>

                <div className="relative z-10 section-container text-center space-y-8">
                    <TextReveal as="h2" type="words" className="text-title">
                        {t("ctaTitle")}
                    </TextReveal>
                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted max-w-[44ch] mx-auto"
                        delay={0.15}
                    >
                        {t("ctaDescription")}
                    </TextReveal>
                    <div className="pt-4">
                        <OrionButton href={`/${locale}/contact`} withArrow>
                            {t("ctaButton")}
                        </OrionButton>
                    </div>
                </div>
            </section>
        </main>
    );
}
