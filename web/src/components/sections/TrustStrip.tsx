"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "@/hooks/use-reveal";

const ITEMS = [0, 1, 2, 3] as const;

export function TrustStrip() {
    const t = useTranslations("home");
    const scope = useReveal<HTMLDivElement>({ selector: ".trust-item", stagger: 0.1 });

    return (
        <section className="relative bg-background border-y border-border-subtle" aria-label={t("trustLabel")}>
            <div ref={scope} className="section-container py-12 lg:py-16">
                <span className="text-index text-foreground-subtle block mb-8 lg:mb-10">{t("trustLabel")}</span>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                    {ITEMS.map((i) => (
                        <div key={i} className="trust-item space-y-2">
                            <p className="text-heading text-[1.5rem] lg:text-[1.75rem] text-foreground">
                                {t(`trust${i}Value`)}
                            </p>
                            <p className="text-body-lg text-foreground-muted max-w-[24ch]">
                                {t(`trust${i}Label`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
