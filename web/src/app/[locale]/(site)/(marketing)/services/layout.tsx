import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "services" });

    return {
        title: `${t("pageTitle")} · Orion Studio`,
        description: t("pageDescription"),
        openGraph: {
            title: `${t("pageTitle")} · Orion Studio`,
            description: t("pageDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/services`,
            languages: buildLanguageAlternates("/services"),
        },
    };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
