export const dynamic = "force-dynamic";

import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { BrandMapSection } from "@/components/sections/BrandMapSection";
import { ReelSection } from "@/components/sections/ReelSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { WhyOrionSection } from "@/components/sections/WhyOrionSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getFeaturedProjects } from "@/lib/projects";
import { faqSchema } from "@/lib/schema";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [featuredProjects, t] = await Promise.all([
        getFeaturedProjects(locale),
        getTranslations({ locale, namespace: "faq" }),
    ]);

    const faqEntries = [0, 1, 2, 3, 4, 5].map((i) => ({
        question: t(`q${i}`),
        answer: t(`a${i}`),
    }));

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqEntries)) }}
            />
            <HeroSection />
            <TrustStrip />
            <BrandMapSection />
            <ReelSection />
            <ServicesSection />
            <WorkSection projects={featuredProjects} />
            <WhyOrionSection />
            <PhilosophySection />
            <FaqSection />
            <ContactSection />
        </main>
    );
}
