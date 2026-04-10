"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import { getCategoryLabel, type Project } from "@/lib/project-types";

export function CaseStudyHero({ project }: { project: Project }) {
    const t = useTranslations("work");
    const locale = useLocale();
    const heroRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!heroRef.current) return;

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
            ".cs-tagline",
            {
                opacity: 0,
                y: 30,
                duration: DURATIONS.slow,
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
        <section ref={heroRef} className="relative section-py pt-32 overflow-hidden">
            <div className="relative z-10 section-container">
                <Link
                    href={`/${locale}/work`}
                    className="cs-label inline-flex items-center gap-2 text-label text-foreground-muted hover:text-foreground transition-colors duration-300 mb-12"
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

                <div className="grid-container gap-y-10">
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-index text-foreground-muted">
                                {project.year}
                            </span>
                            <span className="px-2.5 py-1 rounded-full border border-accent/30 text-[0.6rem] uppercase tracking-[0.15em] text-accent">
                                {getCategoryLabel(project.category)}
                            </span>
                        </div>

                        <h1 className="cs-title text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                            {project.client}
                        </h1>

                        <p className="cs-tagline text-editorial !text-foreground-muted/80 max-w-[48ch]">
                            {project.tagline}
                        </p>
                    </div>

                    <div className="cs-meta col-span-12 lg:col-span-4 flex flex-col gap-6 lg:pt-2">
                        <div>
                            <span className="text-label text-foreground-muted block mb-2">
                                {t("servicesLabel")}
                            </span>
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
