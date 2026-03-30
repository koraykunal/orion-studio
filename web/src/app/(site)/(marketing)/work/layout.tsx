import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Work",
    description: "Selected projects from Orion Studio — brand identity, web design, motion systems, and frontend engineering for ambitious brands.",
    openGraph: {
        title: "Our Work — Orion Studio",
        description: "Selected projects from Orion Studio — brand identity, web design, motion systems, and frontend engineering for ambitious brands.",
    },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
    return children;
}
