import type {Metadata} from "next";
import {Inter, Space_Grotesk, Sora, Unica_One, Playfair_Display} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import {ViewTransitions} from "next-view-transitions";
import {SmoothScroll} from "@/components/system/SmoothScroll";
import {Navbar} from "@/components/layout/Navbar";
import {Footer} from "@/components/layout/Footer";


const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space",
    display: "swap",
});

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-sora",
    display: "swap",
    weight: ["600", "700"],
});

const unica = Unica_One({
    variable: "--font-unica",
    display: "swap",
    weight: "400",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
});

const myglaos = localFont({
    src: "../fonts/Myglaos.woff",
    variable: "--font-display-custom",
    display: "swap",
    weight: "400",
});


const bechilo = localFont({
    src: "../fonts/bechilo.woff",
    variable: "--font-bechilo",
    display: "swap",
    weight: "400",
});

const centralwell = localFont({
    src: "../fonts/Centralwell.ttf",
    variable: "--font-centralwell",
    display: "swap",
    weight: "400",
});

const arcaneWhispers = localFont({
    src: "../fonts/ArcaneWhispers.ttf",
    variable: "--font-arcane",
    display: "swap",
    weight: "400",
});

const BASE_URL = "https://orionstud.io";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Orion Studio — Digital Agency",
        template: "%s | Orion Studio",
    },
    description: "We design and engineer digital products for ambitious brands. Strategy, design, and engineering — from concept to launch.",
    keywords: ["digital agency", "web design", "brand identity", "UI/UX design", "frontend engineering", "design studio"],
    authors: [{ name: "Orion Studio", url: BASE_URL }],
    creator: "Orion Studio",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "48x48" },
            { url: "/logo.svg", type: "image/svg+xml" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Orion Studio — Digital Agency",
        description: "We design and engineer digital products for ambitious brands. Strategy, design, and engineering — from concept to launch.",
        url: BASE_URL,
        siteName: "Orion Studio",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Orion Studio — Digital Agency",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Orion Studio — Digital Agency",
        description: "We design and engineer digital products for ambitious brands.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    other: {
        "theme-color": "#0a0a12",
        "msapplication-TileColor": "#0a0a12",
    },
};

const fontVariables = [
    inter.variable,
    spaceGrotesk.variable,
    sora.variable,
    unica.variable,
    playfair.variable,
    myglaos.variable,
    bechilo.variable,
    centralwell.variable,
    arcaneWhispers.variable,
].join(" ");

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="en" className="dark">
            <body className={fontVariables}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Orion Studio",
                        url: BASE_URL,
                        logo: `${BASE_URL}/logo.svg`,
                        description: "We design and engineer digital products for ambitious brands.",
                        sameAs: [
                            "https://www.instagram.com/orionstud.io/",
                            "https://www.linkedin.com/company/104592237",
                        ],
                        contactPoint: {
                            "@type": "ContactPoint",
                            email: "koraykunal85@outlook.com",
                            contactType: "customer service",
                        },
                    }),
                }}
            />
            <SmoothScroll>
                <Navbar/>
                {children}
                <Footer/>
            </SmoothScroll>
            </body>
            </html>
        </ViewTransitions>
    );
}
