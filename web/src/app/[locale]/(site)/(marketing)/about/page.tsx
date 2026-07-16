import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";
import { AboutPageClient } from "./AboutPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    const title = t("aboutTitle");
    const description = t("aboutDescription");

    return {
        title,
        description,
        openGraph: {
            title: `${title} | Orion Studio`,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/about`,
            languages: buildLanguageAlternates("/about"),
        },
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "about" });

    return (
        <AboutPageClient
            locale={locale}
            copy={{
                heroLabel: t("heroLabel"),
                heroTitle: t("heroTitle"),
                heroDescription: t("heroDescription"),
                valuesLabel: t("valuesLabel"),
                valuesTitle: t("valuesTitle"),
                valuesDescription: t("valuesDescription"),
                values: [0, 1, 2, 3].map((i) => ({
                    index: String(i + 1).padStart(2, "0"),
                    title: t(`value${i}Title`),
                    body: t(`value${i}Body`),
                })),
                teamLabel: t("teamLabel"),
                teamTitle: t("teamTitle"),
                teamDescription: t("teamDescription"),
                team: [
                    { name: t("member0Name"), role: t("member0Role"), image: "/team/koray.png" },
                    { name: t("member1Name"), role: t("member1Role"), image: "/team/mecit.jpeg" },
                ],
                capsLabel: t("capsLabel"),
                capsTitle: t("capsTitle"),
                capsDescription: t("capsDescription"),
                capabilities: [0, 1, 2, 3, 4].map((i) => t(`cap${i}`)),
                availabilityLabel: t("availabilityLabel"),
                ctaTitle: t("ctaTitle"),
                ctaDescription: t("ctaDescription"),
                ctaButton: t("ctaButton"),
            }}
        />
    );
}
