"use client";

import type {
    Section,
    FullImageData,
    TextBlockData,
    GalleryData,
    MetricsData,
    TechStackData,
    QuoteData,
    BeforeAfterData,
    VideoEmbedData,
    DeviceShowcaseData,
} from "@/lib/project-types";
import { FullImageSection } from "./FullImageSection";
import { TextBlockSection } from "./TextBlockSection";
import { GallerySection } from "./GallerySection";
import { MetricsSection } from "./MetricsSection";
import { TechStackSection } from "./TechStackSection";
import { QuoteSection } from "./QuoteSection";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { VideoEmbedSection } from "./VideoEmbedSection";
import { DeviceShowcaseSection } from "./DeviceShowcaseSection";

function renderSection(section: Section) {
    switch (section.type) {
        case "fullImage":
            return <FullImageSection data={section.data as FullImageData} />;
        case "textBlock":
            return <TextBlockSection data={section.data as TextBlockData} />;
        case "gallery":
            return <GallerySection data={section.data as GalleryData} />;
        case "metrics":
            return <MetricsSection data={section.data as MetricsData} />;
        case "techStack":
            return <TechStackSection data={section.data as TechStackData} />;
        case "quote":
            return <QuoteSection data={section.data as QuoteData} />;
        case "beforeAfter":
            return <BeforeAfterSection data={section.data as BeforeAfterData} />;
        case "videoEmbed":
            return <VideoEmbedSection data={section.data as VideoEmbedData} />;
        case "deviceShowcase":
            return <DeviceShowcaseSection data={section.data as DeviceShowcaseData} />;
        default:
            return null;
    }
}

export function SectionRenderer({ sections }: { sections: Section[] }) {
    if (!sections.length) return null;

    return (
        <div className="cs-sections" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}>
            {sections.map((section) => (
                <div key={section.id} className="cs-section" style={{ paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
                    {renderSection(section)}
                </div>
            ))}
        </div>
    );
}
