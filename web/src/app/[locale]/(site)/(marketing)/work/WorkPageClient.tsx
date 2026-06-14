"use client";

import {useMemo, useRef} from "react";
import Link from "next/link";
import {gsap, useGSAP} from "@/lib/animations/gsap";
import {TextReveal} from "@/components/motion/TextReveal";
import {LineReveal} from "@/components/motion/LineReveal";
import {OrionMark} from "@/components/effects/OrionMark";
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
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const hasCaseStudy = project.sections && project.sections.length > 0;
    const layout = getTileLayout(index, featured);

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
                    <h2 className={`font-display uppercase leading-[0.82] tracking-[-0.07em] text-foreground ${layout.title}`}>
                        {project.client}
                    </h2>
                </div>
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
            <section className="relative overflow-hidden pt-32">
                <div className="absolute -right-[18%] top-[2%] h-[78%] w-[62%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.04} globalOpacity={0.26} rotate={10}/>
                </div>

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 52% 44% at 28% 24%, var(--glow-subtle), transparent 72%), radial-gradient(ellipse 42% 50% at 82% 72%, var(--glow-warm-subtle), transparent 72%)",
                    }}
                />

                <div className="relative z-10 section-container pb-16 lg:pb-24">
                    <LineReveal className="mb-12 lg:mb-20"/>

                    <div className="grid-container gap-y-10">
                        <div className="col-span-12 lg:col-span-11">
                            <TextReveal as="h1" type="words"
                                        className="font-display text-[clamp(5.5rem,18vw,24rem)] uppercase leading-[0.72] tracking-[-0.09em] text-foreground">
                                {t("pageTitle")}
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            {hasProjects && (
                <section className="section-container pb-[clamp(6rem,12vw,14rem)]">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-20 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-28">
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
                <section className="section-container section-py">
                    <p className="text-body-lg text-foreground-muted">{t("noProjects")}</p>
                </section>
            )}

        </main>
    );
}
