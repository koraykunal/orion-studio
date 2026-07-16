"use client";

import { Link } from "next-view-transitions";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { ServiceSymbol } from "@/components/effects/ServiceSymbol";
import { ArrowUpRight } from "@/components/common/ArrowUpRight";
import type { ServiceSlug } from "@/lib/services";

type ServiceSummary = {
    slug: ServiceSlug;
    name: string;
    tagline: string;
};

export function ServicesPageClient({
    locale,
    pageLabel,
    pageTitle,
    pageDescription,
    services,
}: {
    locale: string;
    pageLabel: string;
    pageTitle: string;
    pageDescription: string;
    services: ServiceSummary[];
}) {
    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-28 lg:pt-32 overflow-hidden">
                <div className="absolute -left-[12%] top-[5%] w-[50%] h-[80%] pointer-events-none">
                    <OrionMark variant="full" lineOpacity={0.05} globalOpacity={0.32} rotate={-8} mirror />
                </div>
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 70% 25%, var(--glow-subtle), transparent 70%)" }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-12 lg:mb-24" />
                    <div className="grid-container gap-y-10">
                        <div className="col-span-12 lg:col-span-9 space-y-6 lg:space-y-8">
                            <span className="text-index text-foreground-muted">{pageLabel}</span>
                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]" disableOnMobile>
                                {pageTitle}
                            </TextReveal>
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-readable max-w-[56ch]" delay={0.2} disableOnMobile>
                                {pageDescription}
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-py pt-0">
                <div className="section-container">
                    <LineReveal className="mb-4" />
                    <div className="grid pb-8 md:grid-cols-2 md:pb-0 gap-x-12">
                        {services.map((service) => (
                            <Link
                                key={service.slug}
                                href={`/${locale}/services/${service.slug}`}
                                className="group flex items-start gap-4 border-b border-border-subtle py-7 pr-2 lg:gap-6 lg:py-10 hover:border-border-bright transition-colors duration-300"
                                data-cursor="hover"
                            >
                                <ServiceSymbol slug={service.slug} size="lg" />
                                <div className="flex-1 space-y-2.5">
                                    <h2 className="text-heading group-hover:text-accent transition-colors duration-300">{service.name}</h2>
                                    <p className="text-body-lg text-foreground-readable max-w-[42ch]">{service.tagline}</p>
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
