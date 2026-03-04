import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NOCTIS — Case Study",
    description: "Annual electronic music and digital art festival in Berlin. Immersive web platform with phased lineup reveals, interactive venue map, and real-time ticket system.",
    openGraph: {
        title: "NOCTIS — Orion Studio Case Study",
        description: "Annual electronic music and digital art festival in Berlin. Immersive web platform with phased lineup reveals, interactive venue map, and real-time ticket system.",
    },
};

export default function NoctisLayout({ children }: { children: React.ReactNode }) {
    return children;
}
