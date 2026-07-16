import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { LOCALES } from "@/lib/locales";
import { SERVICE_SLUGS, isServiceSlug, type ServiceSlug } from "@/lib/services";
import { BASE_URL, buildLanguageAlternates, serviceSchema } from "@/lib/schema";
import { ServiceDetailClient } from "./ServiceDetailClient";

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return LOCALES.flatMap((locale) =>
        SERVICE_SLUGS.map((slug) => ({
            locale,
            slug,
        })),
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    if (!isServiceSlug(slug)) return { title: "Orion Studio" };

    const t = await getTranslations({ locale, namespace: "services" });
    const title = `${t(`${slug}Name`)} | Orion Studio`;
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

export default async function ServiceDetailPage({ params }: Props) {
    const { slug, locale } = await params;

    if (!isServiceSlug(slug)) notFound();

    const [t, tNav] = await Promise.all([
        getTranslations({ locale, namespace: "services" }),
        getTranslations({ locale, namespace: "nav" }),
    ]);

    const otherServices = SERVICE_SLUGS
        .filter((otherSlug) => otherSlug !== slug)
        .map((otherSlug) => ({
            slug: otherSlug,
            name: t(`${otherSlug}Name`),
        }));

    const jsonLd = serviceSchema({
        name: t(`${slug}Name`),
        description: t(`${slug}Tagline`),
        slug,
        locale,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ServiceDetailClient
                slug={slug}
                locale={locale}
                copy={{
                    pageLabel: t("pageLabel"),
                    serviceName: t(`${slug}Name`),
                    tagline: t(`${slug}Tagline`),
                    problemLabel: t("problemLabel"),
                    problem: t(`${slug}Problem`),
                    allDeliverablesLabel: t("allDeliverablesLabel"),
                    deliverables: t.raw(`${slug}Deliverables`) as string[],
                    approachLabel: t("approachLabel"),
                    approach: [0, 1, 2].map((i) => ({
                        title: t(`approach${i}Title`),
                        desc: t(`approach${i}Desc`),
                    })),
                    otherServicesLabel: t("otherServicesLabel"),
                    otherServices: otherServices as { slug: ServiceSlug; name: string }[],
                    ctaTitle: t("ctaTitle"),
                    ctaDescription: t("ctaDescription"),
                    startProject: tNav("startProject"),
                }}
            />
        </>
    );
}
