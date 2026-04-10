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
        title: t("blogTitle"),
        description: t("blogDescription"),
        openGraph: {
            title: `${t("blogTitle")} — Orion Studio`,
            description: t("blogDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/blog`,
            languages: {
                en: `${BASE_URL}/en/blog`,
                tr: `${BASE_URL}/tr/blog`,
            },
        },
    };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
