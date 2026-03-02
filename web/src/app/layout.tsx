import type {Metadata} from "next";
import {Inter, Space_Grotesk, Sora, Unica_One} from "next/font/google";
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

export const metadata: Metadata = {
    title: "Orion Studio — Digital Agency",
    description: "We design and engineer digital products for ambitious brands.",
    icons: {
        icon: "/logo.svg",
    },
    openGraph: {
        title: "Orion Studio — Digital Agency",
        description: "We design and engineer digital products for ambitious brands.",
        type: "website",
    },
};

const fontVariables = [
    inter.variable,
    spaceGrotesk.variable,
    sora.variable,
    unica.variable,
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
