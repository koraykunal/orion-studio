"use client";

import {useMemo, useRef} from "react";
import Link from "next/link";
import {gsap, useGSAP} from "@/lib/animations/gsap";
import {PortfolioPreviewMedia} from "@/components/common/PortfolioPreviewMedia";
import {EASES} from "@/lib/animations/config";
import {useLocale, useTranslations} from "next-intl";
import {type Project} from "@/lib/project-types";

function getTileLayout(index: number, featured: boolean) {
    if (featured) {
        return {
            wrapper: "lg:col-span-12",
            frame: "aspect-[16/11] md:aspect-[16/9] lg:aspect-[21/10]",
            sizes: "(max-width: 768px) 100vw, 92vw",
            title: "text-[clamp(2.5rem,7vw,8rem)]",
        };
    }

    const pattern = index % 5;
    if (pattern === 0) {
        return {
            wrapper: "lg:col-span-7",
            frame: "aspect-[4/5] md:aspect-[16/11] lg:aspect-[5/4]",
            sizes: "(max-width: 768px) 100vw, 58vw",
            title: "text-[clamp(2rem,4.5vw,4.5rem)]",
        };
    }
    if (pattern === 1) {
        return {
            wrapper: "lg:col-span-5 lg:translate-y-24",
            frame: "aspect-[4/5]",
            sizes: "(max-width: 768px) 100vw, 42vw",
            title: "text-[clamp(2rem,4vw,4rem)]",
        };
    }
    if (pattern === 2) {
        return {
            wrapper: "lg:col-span-5 lg:col-start-2",
            frame: "aspect-[3/4]",
            sizes: "(max-width: 768px) 100vw, 42vw",
            title: "text-[clamp(2rem,4vw,4rem)]",
        };
    }
    if (pattern === 3) {
        return {
            wrapper: "lg:col-span-6 lg:col-start-7 lg:-translate-y-16",
            frame: "aspect-[16/10]",
            sizes: "(max-width: 768px) 100vw, 50vw",
            title: "text-[clamp(2rem,4.2vw,4.25rem)]",
        };
    }
    return {
        wrapper: "lg:col-span-10 lg:col-start-2",
        frame: "aspect-[16/9]",
        sizes: "(max-width: 768px) 100vw, 76vw",
        title: "text-[clamp(2.25rem,5.5vw,6rem)]",
    };
}

function ProjectTile({
                         project,
                         locale,
                         index,
                         featured = false,
                     }: {
    project: Project;
    locale: string;
    index: number;
    featured?: boolean;
}) {
    const t = useTranslations("work");
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const hasCaseStudy = project.sections && project.sections.length > 0;
    const layout = getTileLayout(index, featured);

    useGSAP(() => {
        if (!cardRef.current || !imageRef.current) return;
        if (window.matchMedia("(max-width: 767px)").matches) {
            gsap.set(imageRef.current, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
            gsap.set(cardRef.current.querySelector(".card-meta"), { opacity: 1, y: 0 });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        tl.fromTo(
            imageRef.current,
            {clipPath: "inset(6% 6% 6% 6%)", scale: 1.08},
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
            {opacity: 0, y: 32, duration: 0.8, ease: EASES.expo},
            0.4
        );
    }, {scope: cardRef});

    const cardContent = (
        <article ref={cardRef} className="group relative">
            <div
                ref={imageRef}
                className={`relative overflow-hidden rounded-md bg-surface-1 ${layout.frame}`}
                style={{clipPath: "inset(6% 6% 6% 6%)"}}
            >
                <PortfolioPreviewMedia
                    image={project.image}
                    video={project.previewVideo}
                    alt={project.client}
                    sizes={layout.sizes}
                    className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    videoMode="hover"
                />
                <div
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgb(0_0_0/0.72)_112%)] opacity-65 transition-opacity duration-500 group-hover:opacity-80"/>
                <div className="absolute left-4 top-4 flex gap-2 text-index text-foreground md:left-6 md:top-6">
                    <span
                        className="rounded-full text-foreground bg-background/10 px-3 py-1 backdrop-blur-md">
                        {project.year}
                    </span>
                </div>
            </div>

            <div className="card-meta mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.38fr)] md:items-start">
                <div className="min-w-0 space-y-3">
                    <h2 className={`font-display uppercase leading-[0.9] tracking-[-0.055em] text-foreground md:leading-[0.82] md:tracking-[-0.07em] ${layout.title}`}>
                        {project.client}
                    </h2>
                    <p className="max-w-[34ch] text-body-lg text-foreground-readable md:hidden">
                        {project.tagline}
                    </p>
                </div>
                {hasCaseStudy && (
                    <span className="hidden text-label text-foreground-subtle md:block">
                        {t("viewCaseStudy")}
                    </span>
                )}
            </div>
        </article>
    );

    if (hasCaseStudy) {
        return (
            <Link href={`/${locale}/work/${project.slug}`} className={`block ${layout.wrapper}`}>
                {cardContent}
            </Link>
        );
    }

    return <div className={layout.wrapper}>{cardContent}</div>;
}

export function WorkPageClient({featured, others}: { featured: Project[]; others: Project[] }) {
    const locale = useLocale();
    const t = useTranslations("work");
    const visibleProjects = useMemo(() => [...featured, ...others], [featured, others]);
    const hasProjects = visibleProjects.length > 0;

    return (
        <main className="relative overflow-hidden bg-background">
            {hasProjects && (
                <section className="section-container pt-28 pb-[clamp(5rem,16vw,10rem)] lg:pt-32 lg:pb-[clamp(6rem,12vw,14rem)]">
                    <div className="mb-12 max-w-[42rem] space-y-5 lg:mb-20">
                        <span className="text-index text-foreground-muted">{t("pageLabel")}</span>
                        <h1 className="text-title">{t("pageTitle")}</h1>
                        <p className="text-body-lg text-foreground-readable">{t("pageDescription")}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-14 md:gap-y-20 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-28">
                        {featured.map((project, index) => (
                            <ProjectTile
                                key={project.slug}
                                project={project}
                                locale={locale}
                                index={index}
                                featured
                            />
                        ))}
                        {others.map((project, index) => (
                            <ProjectTile
                                key={project.slug}
                                project={project}
                                locale={locale}
                                index={index}
                            />
                        ))}
                    </div>
                </section>
            )}

            {!hasProjects && (
                <section className="section-container pt-32 pb-[clamp(6rem,12vw,14rem)]">
                    <p className="text-body-lg text-foreground-muted">{t("noProjects")}</p>
                </section>
            )}

        </main>
    );
}
