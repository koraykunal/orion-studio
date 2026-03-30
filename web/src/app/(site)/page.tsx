import { HeroSection } from "@/components/sections/HeroSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { ReelSection } from "@/components/sections/ReelSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getFeaturedProjects } from "@/lib/projects";

export default async function Home() {
    const featuredProjects = await getFeaturedProjects();

    return (
        <main>
            <HeroSection />
            <ComparisonSection />
            <ReelSection />
            <ServicesSection />
            <WorkSection projects={featuredProjects} />
            <PhilosophySection />
            <ContactSection />
        </main>
    );
}
