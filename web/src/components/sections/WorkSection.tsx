"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PortfolioPreviewMedia } from "@/components/common/PortfolioPreviewMedia";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import {
    getCategoryLabel,
    getServiceCategoryLabel,
    type Project,
    type Section,
} from "@/lib/project-types";

type WorkItem = {
    client: string;
    tagline: string;
    year: string;
    image: string;
    previewVideo: string;
    category: Project["category"];
    serviceCategory: Project["serviceCategory"];
    slug: string;
    sections: Section[];
};

function WorkCard({ item, index, locale }: { item: WorkItem; index: number; locale: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!imageWrapRef.current || !cardRef.current) return;

        gsap.fromTo(
            imageWrapRef.current,
            { clipPath: "inset(6% 6% 6% 6%)", scale: 1.06 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.4,
                ease: "orion.inOut",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, { scope: cardRef });

    const inner = (
        <div
            ref={cardRef}
            className="shrink-0 w-full md:w-[75vw] lg:w-[45vw] group transition-transform duration-500 ease-out hover:-translate-y-1"
        >
            <div
                ref={imageWrapRef}
                className="relative overflow-hidden rounded-lg lg:rounded-xl"
                style={{ aspectRatio: "6/3", clipPath: "inset(6% 6% 6% 6%)" }}
            >
                <PortfolioPreviewMedia
                    image={item.image}
                    video={item.previewVideo}
                    alt={`${item.client}, ${item.tagline}`}
                    sizes="(max-width: 1024px) 75vw, 45vw"
                    className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
            </div>

            <div className="mt-5 lg:mt-6 space-y-3">
                <div className="flex items-center gap-4 text-index">
                    <span className="text-foreground-subtle">0{index + 1}</span>
                    <span className="text-foreground-subtle">{item.year}</span>
                    <span className="text-foreground-muted">{getCategoryLabel(item.category, locale)}</span>
                </div>
                <p className="text-caption text-accent">
                    {getServiceCategoryLabel(item.serviceCategory, locale)}
                </p>
                <h3 className="text-heading">{item.client}</h3>
                <p className="text-body-lg text-foreground-muted max-w-[36ch]">{item.tagline}</p>
            </div>
        </div>
    );

    if (item.sections && item.sections.length > 0) {
        return <Link href={`/${locale}/work/${item.slug}`}>{inner}</Link>;
    }

    return inner;
}

export function WorkSection({ projects }: { projects: Project[] }) {
    const t = useTranslations("home");
    const locale = useLocale();
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const work: WorkItem[] = projects.map((p) => ({
        client: p.client,
        tagline: p.tagline,
        year: p.year,
        image: p.image,
        previewVideo: p.previewVideo,
        category: p.category,
        serviceCategory: p.serviceCategory,
        slug: p.slug,
        sections: p.sections,
    }));

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            if (!sectionRef.current || !trackRef.current) return;

            const track = trackRef.current;
            const totalScroll = track.scrollWidth - window.innerWidth;

            if (totalScroll <= 0) return;

            gsap.to(track, {
                x: -totalScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${totalScroll}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });
        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="bg-background overflow-hidden" id="work">
            <div
                ref={trackRef}
                className="flex flex-col gap-16 container-px py-24 md:flex-row md:items-start md:gap-8 lg:gap-12 md:px-0 md:py-0 md:pl-12 lg:pl-[max(3rem,calc((100vw-1400px)/2+3rem))] md:pt-24 lg:pt-32 md:pb-24 lg:pb-32"
            >
                <div className="shrink-0 w-full md:w-[75vw] lg:w-[30vw] flex flex-col justify-center md:pr-8 lg:pr-0">
                    <span className="text-index text-foreground-subtle mb-6">{t("workLabel")}</span>
                    <TextReveal as="h2" type="lines" className="text-title">
                        {t("workTitle")}
                    </TextReveal>
                    <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted mt-6" delay={0.15}>
                        {t("workDescription")}
                    </TextReveal>
                </div>

                {work.map((item, i) => (
                    <WorkCard key={item.client} item={item} index={i} locale={locale} />
                ))}

                <div className="hidden md:block shrink-0 w-[10vw]" />
            </div>
        </section>
    );
}
