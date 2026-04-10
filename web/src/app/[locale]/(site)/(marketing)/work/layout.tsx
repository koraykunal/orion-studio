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
        title: t("workTitle"),
        description: t("workDescription"),
        openGraph: {
            title: `${t("workTitle")} — Orion Studio`,
            description: t("workDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/work`,
            languages: {
                en: `${BASE_URL}/en/work`,
                tr: `${BASE_URL}/tr/work`,
            },
        },
    };
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
    return children;
}
