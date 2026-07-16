"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { DrawLine } from "@/components/common/DrawLine";
import { ArrowUpRight } from "@/components/common/ArrowUpRight";
import { ServiceSymbol } from "@/components/effects/ServiceSymbol";
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
        tl.from(ref.current.querySelector(".service-symbol-wrap")!, {
            opacity: 0,
            y: 18,
            scale: 0.82,
            rotateX: -18,
            duration: 1,
            ease: EASES.expo,
            delay: index * STAGGER.tight,
        }, 0.08);
        tl.from(ref.current.querySelector(".service-content")!, {
            opacity: 0,
            y: 22,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.95,
            ease: EASES.expo,
            delay: index * STAGGER.tight,
        }, 0.16);
        tl.from(ref.current.querySelector(".service-arrow")!, {
            opacity: 0,
            x: -10,
            y: 10,
            duration: 0.7,
            ease: EASES.expo,
        }, 0.38 + index * STAGGER.tight);
    }, { scope: ref });

    return (
        <div
            ref={ref}
            className="group service-glow relative py-5 lg:py-7"
            onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
                event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
            }}
        >
            <DrawLine ref={lineRef} className="mb-5 lg:mb-6 opacity-80" />

            <Link
                href={`/${locale}/services/${slug}`}
                className="service-content relative flex min-h-[7.25rem] items-center gap-5 overflow-hidden py-2 lg:min-h-[8.75rem] lg:gap-8 lg:py-3"
                data-cursor="hover"
            >
                <span className="service-symbol-wrap pointer-events-none absolute left-0 top-1/2 h-28 w-28 -translate-y-1/2 opacity-18 transition-all duration-700 group-hover:opacity-28 md:h-36 md:w-36 lg:h-44 lg:w-44">
                    <span className="absolute inset-0 bg-[radial-gradient(circle,var(--glow-subtle),transparent_70%)] opacity-70" />
                    <ServiceSymbol
                        slug={slug}
                        tone="violet"
                        variant="ghost"
                        className="h-full w-full blur-[0.2px] transition-transform duration-700 group-hover:scale-105"
                    />
                </span>

                <div className="relative z-10 min-w-0 flex-1 pl-20 md:pl-28 lg:pl-36">
                    <h3 className="text-heading transition-colors duration-300 group-hover:text-accent-bright">{title}</h3>
                    <p className="mt-2 max-w-[46ch] text-body-lg text-foreground-readable">{description}</p>
                </div>

                <span className="service-arrow relative z-10 hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-border-bright/60 text-foreground-subtle transition-all duration-500 group-hover:border-accent-warm/35 group-hover:text-accent-warm md:grid">
                    <ArrowUpRight size={16} />
                </span>
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
                        <ArrowUpRight />
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
