export const revalidate = 300;

import { HeroSection } from "@/components/sections/HeroSection";
import { BrandMapSection } from "@/components/sections/BrandMapSection";
import { ReelSection } from "@/components/sections/ReelSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getFeaturedProjects } from "@/lib/projects";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const featuredProjects = await getFeaturedProjects(locale);

    return (
        <main>
            <HeroSection />
            <BrandMapSection />
            <ReelSection />
            <ServicesSection />
            <WorkSection projects={featuredProjects} />
            <PhilosophySection />
            <ContactSection />
        </main>
    );
}
