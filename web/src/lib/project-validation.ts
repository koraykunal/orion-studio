import {
    PROJECT_SERVICE_CATEGORIES,
    type BeforeAfterData,
    type DeviceShowcaseData,
    type FullImageData,
    type GalleryData,
    type MediaData,
    type MetricsData,
    type ProjectCategory,
    type ProjectServiceCategory,
    type QuoteData,
    type Section,
    type SectionType,
    type TechStackData,
    type TextBlockData,
    type VideoEmbedData,
} from "@/lib/project-types";
import { getSafeVideoEmbedUrl } from "@/lib/video-embed";

const PROJECT_CATEGORIES: ProjectCategory[] = ["client", "concept", "studio"];
const PROJECT_STATUSES = ["draft", "published"] as const;
const VIDEO_FILE_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;
const SECTION_TYPES: SectionType[] = [
    "fullImage",
    "textBlock",
    "gallery",
    "metrics",
    "techStack",
    "quote",
    "beforeAfter",
    "videoEmbed",
    "deviceShowcase",
    "media",
];

type ProjectStatus = (typeof PROJECT_STATUSES)[number];

type ProjectInput = {
    slug?: unknown;
    client?: unknown;
    tagline_en?: unknown;
    tagline_tr?: unknown;
    year?: unknown;
    services?: unknown;
    outcome_en?: unknown;
    outcome_tr?: unknown;
    image?: unknown;
    previewVideo?: unknown;
    category?: unknown;
    serviceCategory?: unknown;
    sections?: unknown;
    featured?: unknown;
    status?: unknown;
};

type ExistingProjectInput = {
    slug: string;
    client: string;
    tagline_en: string;
    tagline_tr: string | null;
    year: string;
    services: string[];
    outcome_en: string;
    outcome_tr: string | null;
    image: string;
    previewVideo?: string | null;
    category: string;
    serviceCategory?: string | null;
    sections: unknown;
    featured: boolean;
    status: string;
};

export type ProjectWriteData = {
    slug: string;
    client: string;
    tagline_en: string;
    tagline_tr: string | null;
    year: string;
    services: string[];
    outcome_en: string;
    outcome_tr: string | null;
    image: string;
    previewVideo: string;
    category: ProjectCategory;
    serviceCategory: ProjectServiceCategory;
    sections: Section[];
    featured: boolean;
    status: ProjectStatus;
};

function stringValue(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value.trim() : fallback;
}

function nullableStringValue(value: unknown): string | null {
    const text = stringValue(value);
    return text ? text : null;
}

function stringArrayValue(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
}

function sectionArrayValue(value: unknown): Section[] {
    if (!Array.isArray(value)) return [];
    return value.filter((section): section is Section => {
        if (!section || typeof section !== "object") return false;
        const candidate = section as Partial<Section>;
        return (
            typeof candidate.id === "string" &&
            typeof candidate.type === "string" &&
            SECTION_TYPES.includes(candidate.type as SectionType) &&
            candidate.data !== null &&
            typeof candidate.data === "object"
        );
    });
}

function categoryValue(value: unknown): ProjectCategory {
    return PROJECT_CATEGORIES.includes(value as ProjectCategory)
        ? (value as ProjectCategory)
        : "client";
}

function serviceCategoryValue(value: unknown): ProjectServiceCategory {
    return PROJECT_SERVICE_CATEGORIES.includes(value as ProjectServiceCategory)
        ? (value as ProjectServiceCategory)
        : "web";
}

function statusValue(value: unknown): ProjectStatus {
    return PROJECT_STATUSES.includes(value as ProjectStatus)
        ? (value as ProjectStatus)
        : "draft";
}

export function buildProjectWriteData(
    input: ProjectInput,
    existing?: ExistingProjectInput,
): ProjectWriteData {
    return {
        slug: stringValue(input.slug, existing?.slug ?? ""),
        client: stringValue(input.client, existing?.client ?? ""),
        tagline_en: stringValue(input.tagline_en, existing?.tagline_en ?? ""),
        tagline_tr:
            input.tagline_tr === undefined
                ? existing?.tagline_tr ?? null
                : nullableStringValue(input.tagline_tr),
        year: stringValue(input.year, existing?.year ?? ""),
        services:
            input.services === undefined
                ? existing?.services ?? []
                : stringArrayValue(input.services),
        outcome_en: stringValue(input.outcome_en, existing?.outcome_en ?? ""),
        outcome_tr:
            input.outcome_tr === undefined
                ? existing?.outcome_tr ?? null
                : nullableStringValue(input.outcome_tr),
        image: stringValue(input.image, existing?.image ?? ""),
        previewVideo: stringValue(input.previewVideo, existing?.previewVideo ?? ""),
        category: categoryValue(input.category ?? existing?.category),
        serviceCategory: serviceCategoryValue(input.serviceCategory ?? existing?.serviceCategory),
        sections:
            input.sections === undefined
                ? sectionArrayValue(existing?.sections)
                : sectionArrayValue(input.sections),
        featured:
            typeof input.featured === "boolean"
                ? input.featured
                : existing?.featured ?? false,
        status: statusValue(input.status ?? existing?.status),
    };
}

export function validateProjectWrite(data: ProjectWriteData): string[] {
    const errors: string[] = [];

    if (!data.client) errors.push("Client name is required");
    if (!data.slug) errors.push("Slug is required");
    if (data.previewVideo && !VIDEO_FILE_RE.test(data.previewVideo)) {
        errors.push("Preview video must be an MP4, WebM, MOV, or M4V file");
    }

    if (data.status === "published") {
        if (!data.tagline_en) errors.push("English tagline is required before publishing");
        if (!data.year) errors.push("Year is required before publishing");
        if (!data.outcome_en) errors.push("English outcome is required before publishing");
        if (!data.image) errors.push("Hero image is required before publishing");
        if (data.services.length === 0) errors.push("At least one service is required before publishing");
        errors.push(...validatePublishedSections(data.sections));
    }

    return errors;
}

function hasText(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function validatePublishedSections(sections: Section[]): string[] {
    const errors: string[] = [];

    sections.forEach((section, index) => {
        const label = `Section ${index + 1}`;

        switch (section.type) {
            case "fullImage": {
                const data = section.data as FullImageData;
                if (!hasText(data.image)) errors.push(`${label}: image is required`);
                if (!hasText(data.alt)) errors.push(`${label}: alt text is required`);
                break;
            }
            case "textBlock": {
                const data = section.data as TextBlockData;
                if (!hasText(data.title)) errors.push(`${label}: title is required`);
                if (!hasText(data.contentHtml)) errors.push(`${label}: content is required`);
                break;
            }
            case "gallery": {
                const data = section.data as GalleryData;
                if (!Array.isArray(data.images) || data.images.length === 0) {
                    errors.push(`${label}: at least one gallery image is required`);
                    break;
                }
                data.images.forEach((image, imageIndex) => {
                    if (!hasText(image.src)) errors.push(`${label}, image ${imageIndex + 1}: source is required`);
                    if (!hasText(image.alt)) errors.push(`${label}, image ${imageIndex + 1}: alt text is required`);
                });
                break;
            }
            case "metrics": {
                const data = section.data as MetricsData;
                if (!Array.isArray(data.items) || data.items.length === 0) {
                    errors.push(`${label}: at least one metric is required`);
                    break;
                }
                data.items.forEach((item, itemIndex) => {
                    if (!hasText(item.value)) errors.push(`${label}, metric ${itemIndex + 1}: value is required`);
                    if (!hasText(item.label)) errors.push(`${label}, metric ${itemIndex + 1}: label is required`);
                });
                break;
            }
            case "techStack": {
                const data = section.data as TechStackData;
                if (!Array.isArray(data.items) || data.items.filter(hasText).length === 0) {
                    errors.push(`${label}: at least one technology is required`);
                }
                break;
            }
            case "quote": {
                const data = section.data as QuoteData;
                if (!hasText(data.text)) errors.push(`${label}: quote text is required`);
                if (!hasText(data.author)) errors.push(`${label}: quote author is required`);
                break;
            }
            case "beforeAfter": {
                const data = section.data as BeforeAfterData;
                if (!hasText(data.before?.src)) errors.push(`${label}: before image is required`);
                if (!hasText(data.before?.alt)) errors.push(`${label}: before alt text is required`);
                if (!hasText(data.after?.src)) errors.push(`${label}: after image is required`);
                if (!hasText(data.after?.alt)) errors.push(`${label}: after alt text is required`);
                break;
            }
            case "videoEmbed": {
                const data = section.data as VideoEmbedData;
                if (!hasText(data.url) || !getSafeVideoEmbedUrl(data.url)) {
                    errors.push(`${label}: supported YouTube or Vimeo URL is required`);
                }
                break;
            }
            case "deviceShowcase": {
                const data = section.data as DeviceShowcaseData;
                if (!Array.isArray(data.devices) || data.devices.length === 0) {
                    errors.push(`${label}: at least one device is required`);
                    break;
                }
                data.devices.forEach((device, deviceIndex) => {
                    if (!hasText(device.image)) errors.push(`${label}, device ${deviceIndex + 1}: image is required`);
                    if (!hasText(device.alt)) errors.push(`${label}, device ${deviceIndex + 1}: alt text is required`);
                });
                break;
            }
            case "media": {
                const data = section.data as MediaData;
                if (!hasText(data.src)) errors.push(`${label}: media source is required`);
                if (!hasText(data.alt)) errors.push(`${label}: alt text is required`);
                break;
            }
        }
    });

    return errors;
}
