import type { Metadata } from "next";
import { Inter, Space_Grotesk, Sora, Unica_One, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ViewTransitions } from "next-view-transitions";
import { routing } from "../../../i18n/routing";
import { rootGraph, buildLanguageAlternates } from "@/lib/schema";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["600", "700"] });
const unica = Unica_One({ variable: "--font-unica", display: "swap", weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", weight: ["400", "500", "600"], style: ["normal", "italic"] });
const myglaos = localFont({ src: "../../fonts/Myglaos.woff", variable: "--font-display-custom", display: "swap", weight: "400" });
const bechilo = localFont({ src: "../../fonts/bechilo.woff", variable: "--font-bechilo", display: "swap", weight: "400" });
const centralwell = localFont({ src: "../../fonts/Centralwell.ttf", variable: "--font-centralwell", display: "swap", weight: "400" });
const arcaneWhispers = localFont({ src: "../../fonts/ArcaneWhispers.ttf", variable: "--font-arcane", display: "swap", weight: "400" });

const BASE_URL = "https://orion-studio.net";

const fontVariables = [
    inter.variable, spaceGrotesk.variable, sora.variable, unica.variable,
    playfair.variable, myglaos.variable, bechilo.variable, centralwell.variable, arcaneWhispers.variable,
].join(" ");

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        metadataBase: new URL(BASE_URL),
        title: { default: t("homeTitle"), template: `%s | Orion Studio` },
        description: t("homeDescription"),
        keywords: ["digital agency", "web design", "brand identity", "UI/UX design", "frontend engineering", "design studio"],
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
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Orion Studio — Digital Agency" }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("homeTitle"),
            description: t("homeDescription"),
            images: ["/og-image.png"],
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
        other: { "theme-color": "#0a0a12", "msapplication-TileColor": "#0a0a12" },
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
                <head />
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
