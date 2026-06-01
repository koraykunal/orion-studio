import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";
import { isServiceSlug } from "@/lib/services";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    if (!isServiceSlug(slug)) return { title: "Orion Studio" };
    const t = await getTranslations({ locale, namespace: "services" });

    const title = `${t(`${slug}Name`)} · Orion Studio`;
    const description = t(`${slug}Tagline`);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/${locale}/services/${slug}`,
            locale: locale === "tr" ? "tr_TR" : "en_US",
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/services/${slug}`,
            languages: buildLanguageAlternates(`/services/${slug}`),
        },
    };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    return children;
}
