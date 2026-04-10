"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { EASES, STAGGER } from "@/lib/animations/config";

function ServiceItem({
    title,
    description,
    index,
}: {
    title: string;
    description: string;
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useGSAP(() => {
        if (!ref.current || !lineRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ref.current,
                start: "top 88%",
                toggleActions: "play none none none",
            },
        });

        tl.from(lineRef.current, {
            drawSVG: "0%",
            duration: 1.2,
            ease: EASES.expo,
        }, 0);

        tl.from(ref.current, {
            opacity: 0,
            y: 32,
            duration: 0.8,
            ease: EASES.expo,
            delay: index * STAGGER.loose,
        }, 0);
    }, { scope: ref });

    return (
        <div
            ref={ref}
            className="group service-glow py-6 lg:py-8"

        >
            <svg
                viewBox="0 0 1000 2"
                preserveAspectRatio="none"
                style={{
                    width: "100%",
                    height: "1px",
                    display: "block",
                    overflow: "visible",
                    marginBottom: "1.5rem",
                }}
            >
                <line
                    ref={lineRef}
                    x1="0" y1="1" x2="1000" y2="1"
                    stroke="var(--border)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="text-index text-foreground-subtle">
                            0{index + 1}
                        </span>
                        <h3 className="text-heading group-hover:translate-x-2 transition-transform duration-300">
                            {title}
                        </h3>
                    </div>
                    <p className="text-body-lg text-foreground-muted max-w-[42ch] pl-10 lg:pl-12">
                        {description}
                    </p>
                </div>

                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-1 opacity-0 group-hover:opacity-60 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 shrink-0"
                >
                    <path
                        d="M1 15L15 1M15 1H5M15 1V11"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

export function ServicesSection() {
    const t = useTranslations("home");

    const services = [
        { title: t("service0Title"), description: t("service0Description") },
        { title: t("service1Title"), description: t("service1Description") },
        { title: t("service2Title"), description: t("service2Description") },
        { title: t("service3Title"), description: t("service3Description") },
    ];

    return (
        <section className="section-py bg-background" id="capabilities">
            <div className="grid-container gap-y-12">
                <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-6">
                    <span className="text-index text-foreground-subtle">
                        {t("servicesLabel")}
                    </span>

                    <TextReveal as="h2" type="lines" className="text-title">
                        {t("servicesTitle")}
                    </TextReveal>

                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted"
                        delay={0.2}
                    >
                        {t("servicesDescription")}
                    </TextReveal>
                </div>

                <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                    {services.map((service, i) => (
                        <ServiceItem
                            key={service.title}
                            title={service.title}
                            description={service.description}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
