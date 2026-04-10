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
        title: t("contactTitle"),
        description: t("contactDescription"),
        openGraph: {
            title: `${t("contactTitle")} — Orion Studio`,
            description: t("contactDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/contact`,
            languages: {
                en: `${BASE_URL}/en/contact`,
                tr: `${BASE_URL}/tr/contact`,
            },
        },
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
