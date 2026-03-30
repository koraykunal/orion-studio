export type ProjectCategory = "client" | "concept" | "studio";

export type SectionType =
    | "fullImage"
    | "textBlock"
    | "gallery"
    | "metrics"
    | "techStack"
    | "quote"
    | "beforeAfter"
    | "videoEmbed"
    | "deviceShowcase";

export type DeviceType = "phone" | "tablet" | "laptop" | "desktop";
export type DeviceItem = { type: DeviceType; image: string; alt: string };

export type FullImageData = { image: string; alt: string };
export type TextBlockData = { title: string; content: object | null; contentHtml: string };
export type GalleryData = { columns: 1 | 2 | 3; images: { src: string; alt: string }[] };
export type MetricsData = { items: { value: string; label: string }[] };
export type TechStackData = { items: string[] };
export type QuoteData = { text: string; author: string; role: string };
export type BeforeAfterData = {
    before: { src: string; alt: string; label: string };
    after: { src: string; alt: string; label: string };
};
export type VideoEmbedData = { url: string };
export type DeviceShowcaseData = { devices: DeviceItem[] };

export type SectionData =
    | FullImageData
    | TextBlockData
    | GalleryData
    | MetricsData
    | TechStackData
    | QuoteData
    | BeforeAfterData
    | VideoEmbedData
    | DeviceShowcaseData;

export type Section = {
    id: string;
    type: SectionType;
    data: SectionData;
};

export type Project = {
    slug: string;
    client: string;
    tagline: string;
    year: string;
    services: string[];
    outcome: string;
    image: string;
    category: ProjectCategory;
    featured: boolean;
    sections: Section[];
};

export function getCategoryLabel(category: ProjectCategory): string {
    const labels: Record<ProjectCategory, string> = {
        client: "Client Work",
        concept: "Design Exploration",
        studio: "Studio Showcase",
    };
    return labels[category];
}

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
    fullImage: "Full Image",
    textBlock: "Text Block",
    gallery: "Gallery",
    metrics: "Metrics",
    techStack: "Tech Stack",
    quote: "Quote",
    beforeAfter: "Before / After",
    videoEmbed: "Video Embed",
    deviceShowcase: "Device Showcase",
};

export function createEmptySection(type: SectionType): Section {
    const id = crypto.randomUUID();
    const defaults: Record<SectionType, SectionData> = {
        fullImage: { image: "", alt: "" },
        textBlock: { title: "", content: null, contentHtml: "" },
        gallery: { columns: 2, images: [] },
        metrics: { items: [{ value: "", label: "" }] },
        techStack: { items: [] },
        quote: { text: "", author: "", role: "" },
        beforeAfter: {
            before: { src: "", alt: "", label: "Before" },
            after: { src: "", alt: "", label: "After" },
        },
        videoEmbed: { url: "" },
        deviceShowcase: { devices: [{ type: "laptop", image: "", alt: "" }] },
    };
    return { id, type, data: defaults[type] };
}
