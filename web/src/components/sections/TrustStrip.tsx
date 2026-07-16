"use client";

import { useLocale, useTranslations } from "next-intl";
import { OrionButton } from "@/components/common/OrionButton";
import { useReveal } from "@/hooks/use-reveal";

const ITEMS = [0, 1, 2, 3] as const;

export function TrustStrip() {
    const t = useTranslations("home");
    const locale = useLocale();
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
                <div className="mt-12 border-t border-border-subtle pt-8 text-center lg:mt-14 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:text-left">
                    <div className="mx-auto max-w-[48ch] lg:mx-0">
                        <p className="text-heading text-[1.35rem] lg:text-[1.65rem]">
                            {t("trustCtaTitle")}
                        </p>
                        <p className="mt-3 text-body-lg text-foreground-readable">
                            {t("trustCtaBody")}
                        </p>
                    </div>
                    <div className="mt-7 flex justify-center lg:mt-0 lg:shrink-0 lg:justify-end">
                        <OrionButton href={`/${locale}/contact`} withArrow className="w-full max-w-[18rem] sm:w-auto">
                            {t("trustCtaButton")}
                        </OrionButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
