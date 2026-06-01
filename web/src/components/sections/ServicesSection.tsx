"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { EASES, STAGGER } from "@/lib/animations/config";
import { SERVICE_SLUGS } from "@/lib/services";

function ServiceItem({
    slug,
    title,
    description,
    index,
    locale,
}: {
    slug: string;
    title: string;
    description: string;
    index: number;
    locale: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useGSAP(() => {
        if (!ref.current || !lineRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ref.current,
                start: "top 90%",
                toggleActions: "play none none none",
            },
        });

        tl.from(lineRef.current, { drawSVG: "0%", duration: 1.2, ease: EASES.expo }, 0);
        tl.from(ref.current.querySelector(".service-content")!, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: EASES.expo,
            delay: index * STAGGER.tight,
        }, 0);
    }, { scope: ref });

    return (
        <div ref={ref} className="group service-glow py-5 lg:py-6">
            <svg
                viewBox="0 0 1000 2"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "1px", display: "block", overflow: "visible", marginBottom: "1.5rem" }}
            >
                <line ref={lineRef} x1="0" y1="1" x2="1000" y2="1" stroke="var(--border)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>

            <Link
                href={`/${locale}/services/${slug}`}
                className="service-content flex items-center gap-5 lg:gap-7"
                data-cursor="hover"
            >
                <div className="relative w-14 h-14 lg:w-[4.5rem] lg:h-[4.5rem] shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-500">
                    <Image src={`/images/services/${slug}.svg`} alt="" fill sizes="72px" className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-heading group-hover:text-accent transition-colors duration-300">{title}</h3>
                    <p className="text-body-lg text-foreground-muted max-w-[44ch] mt-1.5">{description}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="text-foreground-subtle group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}

export function ServicesSection() {
    const tHome = useTranslations("home");
    const t = useTranslations("services");
    const locale = useLocale();

    return (
        <section className="section-py bg-background" id="capabilities">
            <div className="grid-container gap-y-12">
                <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-6">
                    <span className="text-index text-foreground-subtle">{tHome("servicesLabel")}</span>

                    <TextReveal as="h2" type="lines" className="text-title">
                        {tHome("servicesTitle")}
                    </TextReveal>

                    <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                        {tHome("servicesDescription")}
                    </TextReveal>

                    <Link
                        href={`/${locale}/services`}
                        className="inline-flex items-center gap-2 text-label border-b border-border pb-1 hover:border-accent transition-colors duration-300"
                        data-cursor="hover"
                    >
                        {t("pageLabel")}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>

                <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                    {SERVICE_SLUGS.map((slug, i) => (
                        <ServiceItem
                            key={slug}
                            slug={slug}
                            index={i}
                            locale={locale}
                            title={t(`${slug}Name`)}
                            description={t(`${slug}Tagline`)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
