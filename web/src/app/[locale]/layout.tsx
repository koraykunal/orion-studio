import type { Metadata, Viewport } from "next";
import { Red_Hat_Display, Bricolage_Grotesque, Red_Hat_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ViewTransitions } from "next-view-transitions";
import { routing } from "../../../i18n/routing";
import { rootGraph, buildLanguageAlternates } from "@/lib/schema";
import "../globals.css";

const redHatDisplay = Red_Hat_Display({ subsets: ["latin"], variable: "--font-rh-display", display: "swap", weight: ["400", "500", "600", "700"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", weight: ["400", "500", "600", "700"] });
const redHatMono = Red_Hat_Mono({ subsets: ["latin"], variable: "--font-rh-mono", display: "swap", weight: ["400", "500"] });

const BASE_URL = "https://orion-studio.net";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#0a0a12",
};

const fontVariables = [
    redHatDisplay.variable, bricolage.variable, redHatMono.variable,
].join(" ");

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    const keywords = locale === "tr"
        ? ["dijital stüdyo", "web tasarım", "kurumsal web sitesi", "mobil uygulama geliştirme", "ui ux tasarım", "yazılım ajansı", "dijital ajans", "işletmeler için dijital çözümler"]
        : ["digital studio", "web design", "corporate website", "mobile app development", "ui ux design", "software agency", "digital agency", "digital products for business"];

    return {
        metadataBase: new URL(BASE_URL),
        title: { default: t("homeTitle"), template: `%s | Orion Studio` },
        description: t("homeDescription"),
        keywords,
        authors: [{ name: "Orion Studio", url: BASE_URL }],
        creator: "Orion Studio",
        icons: {
            icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/logo.svg", type: "image/svg+xml" }],
            apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",
        openGraph: {
            title: t("homeTitle"),
            description: t("homeDescription"),
            url: BASE_URL,
            siteName: "Orion Studio",
            locale: locale === "tr" ? "tr_TR" : "en_US",
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Orion Studio · Digital Agency" }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("homeTitle"),
            description: t("homeDescription"),
            images: [{ url: "/og-image.png", alt: "Orion Studio · Digital Agency" }],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}`,
            languages: buildLanguageAlternates("/"),
        },
        other: { "msapplication-TileColor": "#0a0a12" },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "en" | "tr")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <ViewTransitions>
            <html lang={locale} className="dark">
                <head>
                    <link rel="preload" href="/star.svg" as="image" fetchPriority="high" />
                </head>
                <body className={fontVariables}>
                    <NextIntlClientProvider messages={messages}>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(rootGraph(locale)) }}
                        />
                        {children}
                    </NextIntlClientProvider>
                </body>
            </html>
        </ViewTransitions>
    );
}
