import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";
import { SERVICE_SLUGS } from "@/lib/services";
import { ServicesPageClient } from "./ServicesPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export const dynamic = "error";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "services" });

    const title = `${t("pageTitle")} | Orion Studio`;
    const description = t("pageDescription");

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/services`,
            languages: buildLanguageAlternates("/services"),
        },
    };
}

export default async function ServicesPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "services" });

    return (
        <ServicesPageClient
            locale={locale}
            pageLabel={t("pageLabel")}
            pageTitle={t("pageTitle")}
            pageDescription={t("pageDescription")}
            services={SERVICE_SLUGS.map((slug) => ({
                slug,
                name: t(`${slug}Name`),
                tagline: t(`${slug}Tagline`),
            }))}
        />
    );
}
