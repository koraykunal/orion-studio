"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import { getServiceCategoryLabel, type Project } from "@/lib/project-types";

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
        <section ref={heroRef} className="relative overflow-hidden pb-20 pt-32 lg:pb-28">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 54% 48% at 24% 20%, var(--glow-subtle), transparent 70%)",
                }}
            />

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

                <div className="grid-container gap-y-12">
                    <div className="col-span-12 lg:col-span-10">
                        <h1 className="cs-title relative z-10 font-display text-[clamp(4.5rem,13vw,17rem)] uppercase leading-[0.76] tracking-[-0.085em]">
                            {project.client}
                        </h1>
                    </div>

                    <div className="cs-meta col-span-12 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-foreground-muted lg:col-span-8 lg:col-start-4">
                        <span>{getServiceCategoryLabel(project.serviceCategory, locale)}</span>
                        {project.services.slice(0, 3).map((s) => (
                            <span key={s}>{s}</span>
                        ))}
                    </div>

                    {project.image && (
                        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                            <div className="relative min-h-112 overflow-hidden rounded-md bg-surface-1 md:min-h-176">
                                <Image
                                    src={project.image}
                                    alt={project.client}
                                    fill
                                    priority
                                    className="object-cover object-left"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5" />
                            </div>
                        </div>
                    )}

                    {!project.image && (
                        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
                            <div className="h-168 border border-border-subtle bg-surface-1/50" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
