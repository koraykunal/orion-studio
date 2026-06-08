export type ProjectCategory = "client" | "concept" | "studio";
export type ProjectServiceCategory =
    | "identity"
    | "web"
    | "apps"
    | "seo"
    | "social"
    | "ads"
    | "production"
    | "care";

export type SectionType =
    | "fullImage"
    | "textBlock"
    | "gallery"
    | "metrics"
    | "techStack"
    | "quote"
    | "beforeAfter"
    | "videoEmbed"
    | "deviceShowcase"
    | "media";

export type DeviceType = "phone" | "tablet" | "laptop" | "desktop";
export type DeviceItem = { type: DeviceType; image: string; alt: string };

export type FullImageData = { image: string; alt: string };
export type TextBlockLayout = "side" | "stackedLeft" | "stackedCenter" | "stackedRight";
export type TextBlockData = {
    title: string;
    content: object | null;
    contentHtml: string;
    layout?: TextBlockLayout;
};
export type GalleryData = { columns: 1 | 2 | 3; images: { src: string; alt: string }[] };
export type MetricsData = { items: { value: string; label: string }[] };
export type TechStackData = { items: string[] };
export type QuoteData = { text: string; author: string; role: string };
export type BeforeAfterAspect = "auto" | "4/3" | "16/9" | "1/1" | "3/2";
export type BeforeAfterData = {
    before: { src: string; alt: string; label: string };
    after: { src: string; alt: string; label: string };
    aspectRatio?: BeforeAfterAspect;
};
export type VideoEmbedData = { url: string };
export type DeviceShowcaseData = { devices: DeviceItem[] };
export type MediaData = {
    src: string;
    poster?: string;
    alt: string;
    autoplay: boolean;
    loop: boolean;
    controls: boolean;
    aspectRatio?: string;
};

export type SectionData =
    | FullImageData
    | TextBlockData
    | GalleryData
    | MetricsData
    | TechStackData
    | QuoteData
    | BeforeAfterData
    | VideoEmbedData
    | DeviceShowcaseData
    | MediaData;

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
    previewVideo: string;
    category: ProjectCategory;
    serviceCategory: ProjectServiceCategory;
    featured: boolean;
    sections: Section[];
};

export function getCategoryLabel(category: ProjectCategory, locale = "en"): string {
    if (locale === "tr") {
        const labels: Record<ProjectCategory, string> = {
            client: "Müşteri Projesi",
            concept: "Tasarım Keşfi",
            studio: "Stüdyo Projesi",
        };
        return labels[category];
    }
    const labels: Record<ProjectCategory, string> = {
        client: "Client Work",
        concept: "Design Exploration",
        studio: "Studio Showcase",
    };
    return labels[category];
}

export const PROJECT_SERVICE_CATEGORIES: ProjectServiceCategory[] = [
    "identity",
    "web",
    "apps",
    "seo",
    "social",
    "ads",
    "production",
    "care",
];

export function getServiceCategoryLabel(category: ProjectServiceCategory, locale = "en"): string {
    if (locale === "tr") {
        const labels: Record<ProjectServiceCategory, string> = {
            identity: "Marka Kimliği",
            web: "Web Tasarım ve Geliştirme",
            apps: "Mobil ve Web Uygulamalar",
            seo: "SEO ve Görünürlük",
            social: "Sosyal Medya ve İçerik",
            ads: "Reklam Yönetimi",
            production: "Video ve Kreatif Prodüksiyon",
            care: "Bakım ve Büyüme",
        };
        return labels[category];
    }
    const labels: Record<ProjectServiceCategory, string> = {
        identity: "Brand Identity",
        web: "Web Design and Development",
        apps: "Mobile and Web Apps",
        seo: "SEO and Visibility",
        social: "Social Media and Content",
        ads: "Ad Management",
        production: "Video and Creative Production",
        care: "Care and Growth",
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
    media: "Media (Video / GIF)",
};

export function createEmptySection(type: SectionType): Section {
    const id = crypto.randomUUID();
    const defaults: Record<SectionType, SectionData> = {
        fullImage: { image: "", alt: "" },
        textBlock: { title: "", content: null, contentHtml: "", layout: "side" },
        gallery: { columns: 2, images: [] },
        metrics: { items: [{ value: "", label: "" }] },
        techStack: { items: [] },
        quote: { text: "", author: "", role: "" },
        beforeAfter: {
            before: { src: "", alt: "", label: "Before" },
            after: { src: "", alt: "", label: "After" },
            aspectRatio: "auto",
        },
        videoEmbed: { url: "" },
        deviceShowcase: { devices: [{ type: "laptop", image: "", alt: "" }] },
        media: {
            src: "",
            poster: "",
            alt: "",
            autoplay: true,
            loop: true,
            controls: false,
        },
    };
    return { id, type, data: defaults[type] };
}
