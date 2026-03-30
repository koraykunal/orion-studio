import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description: "Start a project with Orion Studio. Tell us about your vision and we'll reply within 48 hours with a tailored roadmap.",
    openGraph: {
        title: "Contact — Orion Studio",
        description: "Start a project with Orion Studio. Tell us about your vision and we'll reply within 48 hours with a tailored roadmap.",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
