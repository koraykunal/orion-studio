"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { ServiceMark } from "@/components/effects/ServiceMark";
import { OrionButton } from "@/components/common/OrionButton";
import { ArrowUpRight } from "@/components/common/ArrowUpRight";
import { SERVICE_SLUGS, isServiceSlug, type ServiceSlug } from "@/lib/services";

export default function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug } = use(params);
    if (!isServiceSlug(slug)) notFound();
    const t = useTranslations("services");
    const tNav = useTranslations("nav");
    const locale = useLocale();

    const s = slug as ServiceSlug;
    const index = SERVICE_SLUGS.indexOf(s) + 1;
    const deliverables = t.raw(`${s}Deliverables`) as string[];
    const others = SERVICE_SLUGS.filter((x) => x !== s);
    const approach = [0, 1, 2].map((i) => ({ title: t(`approach${i}Title`), desc: t(`approach${i}Desc`) }));

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative pt-28 lg:pt-32 pb-14 lg:pb-16 overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 68% 58% at 78% 32%, var(--glow-subtle), transparent 70%)" }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />
                    <div className="grid-container items-center gap-y-14">
                        <div className="col-span-12 lg:col-span-7 space-y-7">
                            <span className="text-index text-accent">
                                {String(index).padStart(2, "0")} / {t("pageLabel")}
                            </span>
                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.25rem,4vw,3.5rem)] lg:leading-[1.02]">
                                {t(`${s}Name`)}
                            </TextReveal>
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[46ch]" delay={0.2}>
                                {t(`${s}Tagline`)}
                            </TextReveal>
                        </div>

                        <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end">
                            <div className="relative w-[15rem] sm:w-[19rem] lg:w-[24rem] aspect-square">
                                <div
                                    className="absolute inset-[12%] rounded-full"
                                    style={{ background: "radial-gradient(circle, var(--glow) 0%, transparent 62%)" }}
                                />
                                <ServiceMark slug={s} className="relative z-10 w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="section-container grid-container gap-y-8">
                    <div className="col-span-12 lg:col-span-3">
                        <span className="text-index text-foreground-muted">{t("problemLabel")}</span>
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                        <TextReveal as="p" type="lines" className="text-editorial text-foreground">
                            {t(`${s}Problem`)}
                        </TextReveal>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="grid-container gap-y-12 section-container">
                    <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-5">
                        <span className="text-index text-foreground-subtle">{t("pageLabel")}</span>
                        <TextReveal as="h2" type="lines" className="text-heading">
                            {t("allDeliverablesLabel")}
                        </TextReveal>
                    </div>

                    <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                        {deliverables.map((d, i) => (
                            <div key={d} className="group flex items-baseline gap-5 border-b border-border-subtle py-4 lg:py-5">
                                <span className="text-index text-foreground-subtle shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                <span className="text-body-lg text-foreground group-hover:text-accent transition-colors duration-300">{d}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative py-16 lg:py-24 overflow-hidden">
                <div className="absolute -left-[10%] top-[12%] w-[38%] max-w-[28rem] aspect-square pointer-events-none opacity-[0.05]">
                    <Image src={`/marketing/services/${s}.svg`} alt="" fill sizes="28rem" className="object-contain" />
                </div>
                <div className="relative z-10 section-container">
                    <span className="text-index text-foreground-muted mb-12 lg:mb-16 block">{t("approachLabel")}</span>
                    <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
                        {approach.map((a, i) => (
                            <div key={a.title} className="space-y-5">
                                <span className="text-index text-accent">{String(i + 1).padStart(2, "0")}</span>
                                <div className="h-px w-full bg-border" />
                                <h3 className="text-heading">{a.title}</h3>
                                <p className="text-body-lg text-foreground-muted">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="section-container">
                    <LineReveal className="mb-12" />
                    <span className="text-index text-foreground-muted mb-8 block">{t("otherServicesLabel")}</span>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {others.map((o) => (
                            <Link
                                key={o}
                                href={`/${locale}/services/${o}`}
                                className="group flex items-center gap-4 border border-border rounded-lg lg:rounded-xl p-5 hover:border-border-bright transition-colors duration-300"
                                data-cursor="hover"
                            >
                                <div className="relative w-10 h-10 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                    <Image src={`/marketing/services/${o}.svg`} alt="" fill sizes="40px" className="object-contain" />
                                </div>
                                <span className="text-heading text-[1rem] flex-1">{t(`${o}Name`)}</span>
                                <ArrowUpRight size={14} className="text-foreground-subtle group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative py-16 lg:py-24 overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, var(--glow-subtle), transparent 70%)" }}
                />
                <div className="relative z-10 section-container text-center space-y-8">
                    <TextReveal as="h2" type="words" className="text-title max-w-[20ch] mx-auto">
                        {t("ctaTitle")}
                    </TextReveal>
                    <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[46ch] mx-auto" delay={0.15}>
                        {t("ctaDescription")}
                    </TextReveal>
                    <div className="pt-4">
                        <OrionButton href={`/${locale}/contact`} withArrow>
                            {tNav("startProject")}
                        </OrionButton>
                    </div>
                </div>
            </section>
        </main>
    );
}
