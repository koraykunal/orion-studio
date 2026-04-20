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
        title: t("contactTitle"),
        description: t("contactDescription"),
        openGraph: {
            title: `${t("contactTitle")} — Orion Studio`,
            description: t("contactDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/contact`,
            languages: buildLanguageAlternates("/contact"),
        },
    };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
