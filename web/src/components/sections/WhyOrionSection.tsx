"use client";

import { useTranslations } from "next-intl";
import { TextReveal } from "@/components/motion/TextReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { useReveal } from "@/hooks/use-reveal";

const POINTS = [0, 1, 2, 3, 4, 5] as const;

export function WhyOrionSection() {
    const t = useTranslations("home");
    const scope = useReveal<HTMLDivElement>({ selector: ".why-card", stagger: 0.08, y: 32 });

    return (
        <section className="relative section-py bg-background overflow-hidden" id="why">
            <div className="absolute -right-[12%] top-[8%] w-[45%] h-[70%] pointer-events-none">
                <OrionMark variant="belt" lineOpacity={0.05} globalOpacity={0.35} rotate={8} />
            </div>

            <div className="relative z-10 section-container">
                <div className="max-w-2xl space-y-6 mb-14 lg:mb-20">
                    <span className="text-index text-foreground-subtle block">{t("whyLabel")}</span>
                    <TextReveal as="h2" type="lines" className="text-title">
                        {t("whyTitle")}
                    </TextReveal>
                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted max-w-[46ch]"
                        delay={0.15}
                    >
                        {t("whyDescription")}
                    </TextReveal>
                </div>

                <div ref={scope} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {POINTS.map((i) => (
                        <div
                            key={i}
                            className="why-card group rounded-lg lg:rounded-xl border border-border bg-surface-1 p-7 lg:p-8 hover:border-border-bright transition-colors duration-300"
                        >
                            <span className="text-index text-accent block mb-5">{String(i + 1).padStart(2, "0")}</span>
                            <h3 className="text-heading text-[1.25rem] lg:text-[1.375rem] mb-3">{t(`disc${i}`)}</h3>
                            <p className="text-body-lg text-foreground-muted">{t(`discDesc${i}`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
