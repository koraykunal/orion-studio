"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import { isExternalImageSrc } from "@/lib/image-source";
import { getServiceCategoryLabel, type Project } from "@/lib/project-types";

export function CaseStudyHero({ project }: { project: Project }) {
    const t = useTranslations("work");
    const locale = useLocale();
    const heroRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!heroRef.current) return;
        if (window.matchMedia("(max-width: 767px)").matches) return;

        const tl = gsap.timeline({ delay: 0.4 });

        tl.from(".cs-label", {
            opacity: 0,
            x: -30,
            duration: DURATIONS.slow,
            ease: EASES.brand,
        });

        tl.from(
            ".cs-title",
            {
                opacity: 0,
                y: 60,
                duration: 1.2,
                ease: EASES.brand,
            },
            "-=0.6"
        );

        tl.from(
            ".cs-meta > *",
            {
                opacity: 0,
                y: 16,
                stagger: STAGGER.base,
                duration: DURATIONS.base,
                ease: EASES.brand,
            },
            "-=0.3"
        );
    }, { scope: heroRef });

    return (
        <section ref={heroRef} className="relative overflow-hidden pb-16 pt-28 lg:pb-28 lg:pt-32">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 54% 48% at 24% 20%, var(--glow-subtle), transparent 70%)",
                }}
            />

            <div className="relative z-10 section-container">
                <Link
                    href={`/${locale}/work`}
                    className="cs-label inline-flex items-center gap-2 text-label text-foreground-muted hover:text-foreground transition-colors duration-300 mb-10 lg:mb-12"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M10 12L6 8L10 4"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {t("allLabel")}
                </Link>

                <div className="grid grid-cols-4 gap-x-4 gap-y-9 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
                    <div className="col-span-12 lg:col-span-10">
                        <h1 className="cs-title relative z-10 font-display text-[clamp(3.25rem,17vw,5.8rem)] uppercase leading-[0.82] tracking-[-0.07em] lg:text-[clamp(4.5rem,13vw,17rem)] lg:leading-[0.76] lg:tracking-[-0.085em]">
                            {project.client}
                        </h1>
                    </div>

                    <div className="cs-meta col-span-12 grid gap-5 border-y border-border-subtle py-5 md:grid-cols-3 lg:gap-6 lg:py-6">
                        <div className="space-y-2">
                            <span className="block text-index text-foreground-subtle">{t("yearLabel")}</span>
                            <span className="block text-caption text-foreground">{project.year}</span>
                        </div>
                        <div className="space-y-2">
                            <span className="block text-index text-foreground-subtle">{t("servicesLabel")}</span>
                            <span className="block text-caption text-foreground">
                                {getServiceCategoryLabel(project.serviceCategory, locale)}
                            </span>
                        </div>
                        {project.outcome && (
                            <div className="space-y-2 md:col-span-1">
                                <span className="block text-index text-foreground-subtle">{t("outcomeLabel")}</span>
                                <p className="max-w-md text-sm leading-relaxed text-foreground-muted">
                                    {project.outcome}
                                </p>
                            </div>
                        )}
                    </div>

                    {project.image && (
                        <div className="col-span-12">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-1 md:aspect-[16/9] lg:aspect-[21/10]">
                                <Image
                                    src={project.image}
                                    alt={project.client}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 88rem"
                                    unoptimized={isExternalImageSrc(project.image)}
                                    className="object-cover object-left"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5" />
                            </div>
                        </div>
                    )}

                    {!project.image && (
                        <div className="col-span-12">
                            <div className="aspect-[16/9] border border-border-subtle bg-surface-1/50 lg:aspect-[21/10]" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
