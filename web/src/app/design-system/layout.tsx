import { Red_Hat_Display, Bricolage_Grotesque, Red_Hat_Mono } from "next/font/google";
import "../globals.css";

const redHatDisplay = Red_Hat_Display({ subsets: ["latin"], variable: "--font-rh-display", display: "swap", weight: ["400", "500", "600", "700", "800", "900"], style: ["normal", "italic"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", weight: ["400", "500", "600", "700"] });
const redHatMono = Red_Hat_Mono({ subsets: ["latin"], variable: "--font-rh-mono", display: "swap", weight: ["400", "500"] });

export const metadata = {
    title: "Design System · Orion Studio",
    robots: { index: false, follow: false },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${redHatDisplay.variable} ${bricolage.variable} ${redHatMono.variable}`}>
                {children}
            </body>
        </html>
    );
}
