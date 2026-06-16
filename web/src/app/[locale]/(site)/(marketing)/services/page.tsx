"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { ArrowUpRight } from "@/components/common/ArrowUpRight";
import { SERVICE_SLUGS } from "@/lib/services";

export default function ServicesPage() {
    const t = useTranslations("services");
    const locale = useLocale();

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -left-[12%] top-[5%] w-[50%] h-[80%] pointer-events-none">
                    <OrionMark variant="full" lineOpacity={0.05} globalOpacity={0.32} rotate={-8} mirror />
                </div>
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 70% 25%, var(--glow-subtle), transparent 70%)" }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />
                    <div className="grid-container gap-y-10">
                        <div className="col-span-12 lg:col-span-9 space-y-8">
                            <span className="text-index text-foreground-muted">{t("pageLabel")}</span>
                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                                {t("pageTitle")}
                            </TextReveal>
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[56ch]" delay={0.2}>
                                {t("pageDescription")}
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-py pt-0">
                <div className="section-container">
                    <LineReveal className="mb-4" />
                    <div className="grid md:grid-cols-2 gap-x-12">
                        {SERVICE_SLUGS.map((slug) => (
                            <Link
                                key={slug}
                                href={`/${locale}/services/${slug}`}
                                className="group flex items-start gap-6 border-b border-border-subtle py-8 lg:py-10 hover:border-border-bright transition-colors duration-300"
                                data-cursor="hover"
                            >
                                <div className="relative w-12 h-12 lg:w-16 lg:h-16 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-500">
                                    <Image src={`/marketing/services/${slug}.svg`} alt="" fill sizes="64px" className="object-contain" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h2 className="text-heading group-hover:text-accent transition-colors duration-300">{t(`${slug}Name`)}</h2>
                                    <p className="text-body-lg text-foreground-muted max-w-[42ch]">{t(`${slug}Tagline`)}</p>
                                </div>
                                <ArrowUpRight size={16} className="text-foreground-subtle group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 mt-2 shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
