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
        title: t("blogTitle"),
        description: t("blogDescription"),
        openGraph: {
            title: `${t("blogTitle")} — Orion Studio`,
            description: t("blogDescription"),
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/blog`,
            languages: buildLanguageAlternates("/blog"),
        },
    };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
