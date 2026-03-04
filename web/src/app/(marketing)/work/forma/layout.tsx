import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forma — Case Study",
    description: "Contemporary ceramics studio in Copenhagen. Gallery-like e-commerce with wabi-sabi editorial engine and exhibition booking system.",
    openGraph: {
        title: "Forma — Orion Studio Case Study",
        description: "Contemporary ceramics studio in Copenhagen. Gallery-like e-commerce with wabi-sabi editorial engine and exhibition booking system.",
    },
};

export default function FormaLayout({ children }: { children: React.ReactNode }) {
    return children;
}
