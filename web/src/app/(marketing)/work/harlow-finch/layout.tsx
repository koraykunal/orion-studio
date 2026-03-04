import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Harlow & Finch — Case Study",
    description: "133-year-old botanical apothecary reimagined for the digital age. Brand revival, visual identity, and headless e-commerce on Shopify Hydrogen.",
    openGraph: {
        title: "Harlow & Finch — Orion Studio Case Study",
        description: "133-year-old botanical apothecary reimagined for the digital age. Brand revival, visual identity, and headless e-commerce on Shopify Hydrogen.",
    },
};

export default function HarlowFinchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
