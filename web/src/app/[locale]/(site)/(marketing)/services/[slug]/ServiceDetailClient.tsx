"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { ServiceMark } from "@/components/effects/ServiceMark";
import { ServiceSymbol } from "@/components/effects/ServiceSymbol";
import { OrionButton } from "@/components/common/OrionButton";
import { ArrowUpRight } from "@/components/common/ArrowUpRight";
import { SERVICE_SLUGS, type ServiceSlug } from "@/lib/services";

type ServiceDetailCopy = {
    pageLabel: string;
    serviceName: string;
    tagline: string;
    problemLabel: string;
    problem: string;
    allDeliverablesLabel: string;
    deliverables: string[];
    approachLabel: string;
    approach: { title: string; desc: string }[];
    otherServicesLabel: string;
    otherServices: { slug: ServiceSlug; name: string }[];
    ctaTitle: string;
    ctaDescription: string;
    startProject: string;
};

export function ServiceDetailClient({
    slug,
    locale,
    copy,
}: {
    slug: ServiceSlug;
    locale: string;
    copy: ServiceDetailCopy;
}) {
    const index = SERVICE_SLUGS.indexOf(slug) + 1;

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative pt-28 lg:pt-32 pb-12 lg:pb-16 overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 68% 58% at 78% 32%, var(--glow-subtle), transparent 70%)" }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-12 lg:mb-24" />
                    <div className="grid-container items-center gap-y-10 lg:gap-y-14">
                        <div className="col-span-12 lg:col-span-7 space-y-6 lg:space-y-7">
                            <span className="text-index text-accent">
                                {String(index).padStart(2, "0")} / {copy.pageLabel}
                            </span>
                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.25rem,4vw,3.5rem)] lg:leading-[1.02]" disableOnMobile>
                                {copy.serviceName}
                            </TextReveal>
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-readable max-w-[46ch]" delay={0.2} disableOnMobile>
                                {copy.tagline}
                            </TextReveal>
                        </div>

                        <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
                            <div className="relative aspect-square lg:w-[24rem]">
                                <div
                                    className="absolute inset-[12%] rounded-full"
                                    style={{ background: "radial-gradient(circle, var(--glow) 0%, transparent 62%)" }}
                                />
                                <ServiceMark slug={slug} className="relative z-10 w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10 lg:py-20">
                <div className="grid-container gap-y-7 border-y border-border-subtle py-10 lg:gap-y-8 lg:py-16">
                    <div className="col-span-12 lg:col-span-3">
                        <span className="text-index text-accent">{copy.problemLabel}</span>
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                        <TextReveal
                            as="p"
                            type="lines"
                            className="max-w-[30ch] text-[clamp(1.75rem,9vw,2.65rem)] leading-[1.08] tracking-[-0.025em] text-foreground lg:text-[clamp(1.75rem,3.4vw,3.65rem)]"
                            disableOnMobile
                        >
                            {copy.problem}
                        </TextReveal>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="grid-container gap-y-12 section-container">
                    <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-5">
                        <span className="text-index text-foreground-subtle">{copy.pageLabel}</span>
                        <TextReveal as="h2" type="lines" className="text-heading">
                            {copy.allDeliverablesLabel}
                        </TextReveal>
                    </div>

                    <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                        {copy.deliverables.map((d, i) => (
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
                    <Image src={`/marketing/services/${slug}.svg`} alt="" fill sizes="28rem" className="object-contain" />
                </div>
                <div className="relative z-10 section-container">
                    <span className="text-index text-foreground-muted mb-12 lg:mb-16 block">{copy.approachLabel}</span>
                    <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
                        {copy.approach.map((a, i) => (
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
                    <span className="text-index text-foreground-muted mb-8 block">{copy.otherServicesLabel}</span>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {copy.otherServices.map((service) => (
                            <Link
                                key={service.slug}
                                href={`/${locale}/services/${service.slug}`}
                                className="group flex items-center gap-4 border border-border rounded-lg lg:rounded-xl p-5 hover:border-border-bright transition-colors duration-300"
                                data-cursor="hover"
                            >
                                <ServiceSymbol slug={service.slug} size="sm" />
                                <span className="text-heading text-[1rem] flex-1">{service.name}</span>
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
                        {copy.ctaTitle}
                    </TextReveal>
                    <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[46ch] mx-auto" delay={0.15}>
                        {copy.ctaDescription}
                    </TextReveal>
                    <div className="pt-4">
                        <OrionButton href={`/${locale}/contact`} withArrow>
                            {copy.startProject}
                        </OrionButton>
                    </div>
                </div>
            </section>
        </main>
    );
}
