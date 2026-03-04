import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "A multidisciplinary design and engineering studio. We partner with ambitious companies to create digital experiences that are visually striking and built for growth.",
    openGraph: {
        title: "About Orion Studio",
        description: "A multidisciplinary design and engineering studio. We partner with ambitious companies to create digital experiences that are visually striking and built for growth.",
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
