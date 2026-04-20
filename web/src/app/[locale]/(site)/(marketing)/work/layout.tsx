import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";

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
            languages: buildLanguageAlternates("/work"),
        },
    };
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
    return children;
}
