import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BASE_URL, buildLanguageAlternates } from "@/lib/schema";
import { SERVICE_SLUGS } from "@/lib/services";
import { ContactPageClient } from "./ContactPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    const title = t("contactTitle");
    const description = t("contactDescription");

    return {
        title,
        description,
        openGraph: {
            title: `${title} | Orion Studio`,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/contact`,
            languages: buildLanguageAlternates("/contact"),
        },
    };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    const [t, tServices] = await Promise.all([
        getTranslations({ locale, namespace: "contact" }),
        getTranslations({ locale, namespace: "services" }),
    ]);

    return (
        <ContactPageClient
            copy={{
                pageLabel: t("pageLabel"),
                pageTitle: t("pageTitle"),
                pageDescription: t("pageDescription"),
                directLabel: t("directLabel"),
                socialLabel: t("socialLabel"),
                servicesLabel: t("servicesLabel"),
                servicesHint: t("servicesHint"),
                budgetLabel: t("budgetLabel"),
                budgetHint: t("budgetHint"),
                timelineLabel: t("timelineLabel"),
                timelineHint: t("timelineHint"),
                fieldName: t("fieldName"),
                fieldNamePlaceholder: t("fieldNamePlaceholder"),
                fieldCompany: t("fieldCompany"),
                fieldCompanyPlaceholder: t("fieldCompanyPlaceholder"),
                fieldEmail: t("fieldEmail"),
                fieldEmailPlaceholder: t("fieldEmailPlaceholder"),
                fieldBrief: t("fieldBrief"),
                fieldBriefPlaceholder: t("fieldBriefPlaceholder"),
                fieldReferral: t("fieldReferral"),
                fieldReferralPlaceholder: t("fieldReferralPlaceholder"),
                submit: t("submit"),
                sending: t("sending"),
                successTitle: t("successTitle"),
                successBody: t("successBody"),
                errorTitle: t("errorTitle"),
                errorBody: t("errorBody"),
            }}
            services={[...SERVICE_SLUGS.map((slug) => tServices(`${slug}Name`)), t("servicesUnknown")]}
            budgets={[0, 1, 2, 3, 4].map((i) => t(`budget${i}`)).concat(t("budgetUnknown"))}
            timelines={[0, 1, 2, 3, 4].map((i) => t(`timeline${i}`)).concat(t("timelineUnknown"))}
        />
    );
}
