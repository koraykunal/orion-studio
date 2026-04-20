import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/projects";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const project = await getProjectBySlug(slug, locale);

    if (!project) {
        return { title: "Project Not Found — Orion Studio" };
    }

    const title = `${project.client} — Orion Studio`;
    const description = project.outcome;
    const image = project.image
        ? project.image.startsWith("http")
            ? project.image
            : `${BASE_URL}${project.image}`
        : `${BASE_URL}/og-image.png`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/${locale}/work/${slug}`,
            type: "article",
            locale: locale === "tr" ? "tr_TR" : "en_US",
            images: [{ url: image, width: 1200, height: 630, alt: project.client }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/work/${slug}`,
            languages: buildLanguageAlternates(`/work/${slug}`),
        },
    };
}

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
