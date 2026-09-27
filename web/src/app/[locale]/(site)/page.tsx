export const dynamic = "force-dynamic";

import { getTranslations } from "next-intl/server";
import { keyed } from "@/lib/i18n";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import nextDynamic from "next/dynamic";
const BrandMapSection = nextDynamic<Record<string, never>>(
    () => import("@/components/sections/BrandMapSection").then((module) => module.BrandMapSection),
    {
        loading: () => <div className="min-h-[60vh]" aria-hidden="true" />,
    },
);
import { ReelSection } from "@/components/sections/ReelSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { WhyOrionSection } from "@/components/sections/WhyOrionSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getFeaturedProjects } from "@/lib/projects";
import { faqSchema } from "@/lib/schema";
import { toLocale } from "@/lib/locales";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: rawLocale } = await params;
    const locale = toLocale(rawLocale);
    const [featuredProjects, t] = await Promise.all([
        getFeaturedProjects(toLocale(locale)),
        getTranslations({ locale, namespace: "faq" }),
    ]);
    const tk = keyed(t);

    const faqEntries = [0, 1, 2, 3, 4, 5].map((i) => ({
        question: tk(`q${i}`),
        answer: tk(`a${i}`),
    }));

    return (
        <main id="main-content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqEntries)) }}
            />
            <HeroSection />
            <TrustStrip />
            <WorkSection projects={featuredProjects} />
            <BrandMapSection />
            <ReelSection />
            <ServicesSection />
            <WhyOrionSection />
            <PhilosophySection />
            <FaqSection />
            <ContactSection />
        </main>
    );
}
