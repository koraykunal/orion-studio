import { CONTACT_EMAIL } from "@/lib/socials";

export const BASE_URL = "https://orion-studio.net";
export const LOCALES = ["en", "tr"] as const;
export const DEFAULT_LOCALE = "en";

export function buildLanguageAlternates(path: string): Record<string, string> {
    const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = `${BASE_URL}/${locale}${suffix}`;
    languages["x-default"] = `${BASE_URL}/${DEFAULT_LOCALE}${suffix}`;
    return languages;
}

const SAME_AS = [
    "https://www.instagram.com/orionstud.io/",
    "https://www.linkedin.com/company/104592237",
];

export function organizationSchema() {
    return {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Orion Studio",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.svg`,
        description: "We design and engineer digital products for ambitious brands.",
        sameAs: SAME_AS,
        contactPoint: {
            "@type": "ContactPoint",
            email: CONTACT_EMAIL,
            contactType: "customer service",
            availableLanguage: ["en", "tr"],
        },
    };
}

export function professionalServiceSchema() {
    return {
        "@type": "ProfessionalService",
        "@id": `${BASE_URL}/#service`,
        name: "Orion Studio",
        url: BASE_URL,
        image: `${BASE_URL}/og-image.png`,
        priceRange: "$$$",
        description:
            "Digital design and engineering studio specializing in brand identity, UI/UX design, and frontend engineering.",
        areaServed: "Worldwide",
        serviceType: [
            "Brand Identity",
            "Web Design",
            "UI/UX Design",
            "Frontend Engineering",
            "Creative Direction",
        ],
        provider: { "@id": `${BASE_URL}/#organization` },
    };
}

export function websiteSchema(locale: string) {
    return {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Orion Studio",
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
        publisher: { "@id": `${BASE_URL}/#organization` },
    };
}

export function rootGraph(locale: string) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            organizationSchema(),
            professionalServiceSchema(),
            websiteSchema(locale),
        ],
    };
}

export function articleSchema(args: {
    title: string;
    description: string;
    slug: string;
    locale: string;
    datePublished?: string;
    image?: string | null;
    tags?: string[];
}) {
    const url = `${BASE_URL}/${args.locale}/blog/${args.slug}`;
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: args.title,
        description: args.description,
        url,
        mainEntityOfPage: url,
        inLanguage: args.locale === "tr" ? "tr-TR" : "en-US",
        datePublished: args.datePublished,
        dateModified: args.datePublished,
        image: args.image ? [args.image.startsWith("http") ? args.image : `${BASE_URL}${args.image}`] : [`${BASE_URL}/og-image.png`],
        keywords: args.tags?.join(", "),
        author: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
    };
}

export function creativeWorkSchema(args: {
    client: string;
    tagline: string;
    outcome: string;
    slug: string;
    locale: string;
    image?: string | null;
    year?: string;
    services?: string[];
}) {
    const url = `${BASE_URL}/${args.locale}/work/${args.slug}`;
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: `${args.client} — ${args.tagline}`,
        description: args.outcome,
        url,
        inLanguage: args.locale === "tr" ? "tr-TR" : "en-US",
        dateCreated: args.year,
        image: args.image ? (args.image.startsWith("http") ? args.image : `${BASE_URL}${args.image}`) : `${BASE_URL}/og-image.png`,
        creator: { "@id": `${BASE_URL}/#organization` },
        about: { "@type": "Organization", name: args.client },
        keywords: args.services?.join(", "),
    };
}
