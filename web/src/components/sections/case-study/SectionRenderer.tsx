"use client";

import type { Section } from "@/lib/project-types";
import { isFullBleed } from "@/lib/project-types";
import { FullImageSection } from "./FullImageSection";
import { TextBlockSection } from "./TextBlockSection";
import { GallerySection } from "./GallerySection";
import { MetricsSection } from "./MetricsSection";
import { TechStackSection } from "./TechStackSection";
import { QuoteSection } from "./QuoteSection";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { VideoEmbedSection } from "./VideoEmbedSection";
import { DeviceShowcaseSection } from "./DeviceShowcaseSection";
import { MediaSection } from "./MediaSection";
import { VisualWallSection } from "./VisualWallSection";

/**
 * Renders one section. The switch is exhaustive over the discriminated union,
 * so `section.data` is already narrowed in every branch and adding a new
 * section type is a compile error here rather than a blank block in
 * production.
 *
 * There is no `default` branch on purpose: an unknown type stored in the
 * database is a data problem, and silently rendering nothing hides it.
 */
function renderSection(section: Section) {
    switch (section.type) {
        case "fullImage":
            return <FullImageSection data={section.data} />;
        case "textBlock":
            return <TextBlockSection data={section.data} />;
        case "gallery":
            return <GallerySection data={section.data} />;
        case "metrics":
            return <MetricsSection data={section.data} />;
        case "techStack":
            return <TechStackSection data={section.data} />;
        case "quote":
            return <QuoteSection data={section.data} />;
        case "beforeAfter":
            return <BeforeAfterSection data={section.data} />;
        case "videoEmbed":
            return <VideoEmbedSection data={section.data} />;
        case "deviceShowcase":
            return <DeviceShowcaseSection data={section.data} />;
        case "media":
            return <MediaSection data={section.data} />;
        case "visualWall":
            return <VisualWallSection data={section.data} />;
    }
}

/**
 * Renders sections in the author's order.
 *
 * visualWall used to be filtered out of this array by the page component and
 * rendered in a hard-coded slot directly under the hero, so its position in the
 * editor had no effect on the page and the editor gave no hint of that. Every
 * section now renders where it sits in the array; `isFullBleed` only decides
 * whether the wrapper is width-constrained, which is the only thing placement
 * was ever actually for.
 */
export function SectionRenderer({ sections }: { sections: Section[] }) {
    if (!sections.length) return null;

    return (
        <div className="cs-sections" style={{ paddingTop: "clamp(4rem, 7vw, 6.5rem)" }}>
            {sections.map((section) => (
                <div
                    key={section.id}
                    className={isFullBleed(section) ? "cs-section cs-section-full" : "cs-section"}
                    style={{ paddingBottom: "clamp(4rem, 7vw, 6.5rem)" }}
                >
                    {renderSection(section)}
                </div>
            ))}
        </div>
    );
}
