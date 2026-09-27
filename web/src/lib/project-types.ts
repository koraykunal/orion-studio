import type { Locale } from "@/lib/locales";

/**
 * Case-study section model.
 *
 * `Section` is a discriminated union keyed on `type`, so narrowing it in a
 * switch also narrows `data` with no casts. It used to be
 * `{ id, type, data: SectionData }`, which meant every renderer, editor and
 * validator had to write `section.data as GalleryData` and a renamed field
 * would compile fine in one place and fail at runtime in another.
 *
 * SECTION_REGISTRY below is the single declaration of the section set. The
 * editor's add-menu, the renderer's layout decision, the validator's type
 * guard and the default-data factory all read from it, so adding a section type
 * is one entry rather than five hand-maintained lists.
 */

export type ProjectCategory = "client" | "concept" | "studio";

export const PROJECT_CATEGORIES: ProjectCategory[] = ["client", "concept", "studio"];

export type ProjectServiceCategory =
    | "identity"
    | "web"
    | "apps"
    | "seo"
    | "social"
    | "ads"
    | "production"
    | "care";

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
    | "media"
    | "visualWall";

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
export type VisualWallItem = { src: string; alt: string };
export type VisualWallData = { items: VisualWallItem[] };

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
    | MediaData
    | VisualWallData;

/** Discriminated union: `section.data` is narrowed by `section.type`. */
export type Section =
    | { id: string; type: "fullImage"; data: FullImageData }
    | { id: string; type: "textBlock"; data: TextBlockData }
    | { id: string; type: "gallery"; data: GalleryData }
    | { id: string; type: "metrics"; data: MetricsData }
    | { id: string; type: "techStack"; data: TechStackData }
    | { id: string; type: "quote"; data: QuoteData }
    | { id: string; type: "beforeAfter"; data: BeforeAfterData }
    | { id: string; type: "videoEmbed"; data: VideoEmbedData }
    | { id: string; type: "deviceShowcase"; data: DeviceShowcaseData }
    | { id: string; type: "media"; data: MediaData }
    | { id: string; type: "visualWall"; data: VisualWallData };

/** Narrows an arbitrary value to a section, checking only the outer shape. */
export function isSection(value: unknown): value is Section {
    if (typeof value !== "object" || value === null) return false;
    const candidate = value as { id?: unknown; type?: unknown; data?: unknown };
    return (
        typeof candidate.id === "string" &&
        typeof candidate.type === "string" &&
        isSectionType(candidate.type) &&
        typeof candidate.data === "object" &&
        candidate.data !== null
    );
}

/**
 * How a section is laid out on the page.
 *
 * `full-bleed` sections render outside the case-study content container, which
 * is what visualWall needs. Previously visualWall was special-cased in three
 * places at once: the renderer returned null for it, the client filtered it out
 * of the array, and the client rendered it in a fixed slot directly under the
 * hero. That silently broke the "array order equals page order" invariant, so
 * dragging a visual wall to position three had no effect and the editor gave no
 * indication of that. Placement is now declared data, and ordering is honoured.
 */
export type SectionPlacement = "flow" | "full-bleed";

export type SectionDefinition = {
    label: string;
    placement: SectionPlacement;
    createDefault: () => SectionData;
};

export const SECTION_REGISTRY: Record<SectionType, SectionDefinition> = {
    fullImage: { label: "Full Image", placement: "full-bleed", createDefault: () => ({ image: "", alt: "" }) },
    textBlock: {
        label: "Text Block",
        placement: "flow",
        createDefault: () => ({ title: "", content: null, contentHtml: "", layout: "side" }),
    },
    gallery: { label: "Gallery", placement: "flow", createDefault: () => ({ columns: 2, images: [] }) },
    metrics: {
        label: "Metrics",
        placement: "flow",
        createDefault: () => ({ items: [{ value: "", label: "" }] }),
    },
    techStack: { label: "Tech Stack", placement: "flow", createDefault: () => ({ items: [] }) },
    quote: { label: "Quote", placement: "flow", createDefault: () => ({ text: "", author: "", role: "" }) },
    beforeAfter: {
        label: "Before / After",
        placement: "full-bleed",
        createDefault: () => ({
            before: { src: "", alt: "", label: "Before" },
            after: { src: "", alt: "", label: "After" },
            aspectRatio: "auto",
        }),
    },
    videoEmbed: { label: "Video Embed", placement: "full-bleed", createDefault: () => ({ url: "" }) },
    deviceShowcase: {
        label: "Device Showcase",
        placement: "full-bleed",
        createDefault: () => ({ devices: [{ type: "laptop", image: "", alt: "" }] }),
    },
    media: {
        label: "Media (Video / GIF)",
        placement: "flow",
        createDefault: () => ({ src: "", poster: "", alt: "", autoplay: true, loop: true, controls: false }),
    },
    visualWall: { label: "Visual Wall", placement: "full-bleed", createDefault: () => ({ items: [] }) },
};

/** Derived from the registry, so it can never drift out of sync with it. */
export const SECTION_TYPES = Object.keys(SECTION_REGISTRY) as SectionType[];

export function isSectionType(value: unknown): value is SectionType {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, value);
}

export const SECTION_TYPE_LABELS: Record<SectionType, string> = Object.fromEntries(
    SECTION_TYPES.map((type) => [type, SECTION_REGISTRY[type].label]),
) as Record<SectionType, string>;

export function isFullBleed(section: Section): boolean {
    return SECTION_REGISTRY[section.type].placement === "full-bleed";
}

export function createEmptySection(type: SectionType): Section {
    const id = crypto.randomUUID();
    // The cast is sound because the registry is keyed by SectionType, but the
    // union cannot be built generically without it.
    return { id, type, data: SECTION_REGISTRY[type].createDefault() } as Section;
}

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

const CATEGORY_LABELS: Record<ProjectCategory, Record<Locale, string>> = {
    client: { en: "Client Work", tr: "Müşteri Projesi" },
    concept: { en: "Design Exploration", tr: "Tasarım Keşfi" },
    studio: { en: "Studio Showcase", tr: "Stüdyo Projesi" },
};

export function getCategoryLabel(category: ProjectCategory, locale: Locale = "en"): string {
    return CATEGORY_LABELS[category][locale];
}

const SERVICE_CATEGORY_LABELS: Record<ProjectServiceCategory, Record<Locale, string>> = {
    identity: { en: "Brand Identity", tr: "Marka Kimliği" },
    web: { en: "Web Design and Development", tr: "Web Tasarım ve Geliştirme" },
    apps: { en: "Mobile and Web Apps", tr: "Mobil ve Web Uygulamalar" },
    seo: { en: "SEO and Visibility", tr: "SEO ve Görünürlük" },
    social: { en: "Social Media and Content", tr: "Sosyal Medya ve İçerik" },
    ads: { en: "Ad Management", tr: "Reklam Yönetimi" },
    production: { en: "Video and Creative Production", tr: "Video ve Kreatif Prodüksiyon" },
    care: { en: "Care and Growth", tr: "Bakım ve Büyüme" },
};

export function getServiceCategoryLabel(category: ProjectServiceCategory, locale: Locale = "en"): string {
    return SERVICE_CATEGORY_LABELS[category][locale];
}
