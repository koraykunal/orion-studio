import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://orion-studio.net";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        title: t("aboutTitle"),
        description: t("aboutDescription"),
        openGraph: {
            title: `${t("aboutTitle")} — Orion Studio`,
            description: t("aboutDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/about`,
            languages: {
                en: `${BASE_URL}/en/about`,
                tr: `${BASE_URL}/tr/about`,
            },
        },
    };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
