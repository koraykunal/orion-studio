import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Orion Studio",
    description: "Insights on design, engineering, and building digital products.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
