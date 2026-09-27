import { Red_Hat_Display, Bricolage_Grotesque, Red_Hat_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "../globals.css";

const redHatDisplay = Red_Hat_Display({ subsets: ["latin"], variable: "--font-rh-display", display: "swap", weight: ["400", "500", "600", "700", "800", "900"], style: ["normal", "italic"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", weight: ["400", "500", "600", "700"] });
const redHatMono = Red_Hat_Mono({ subsets: ["latin"], variable: "--font-rh-mono", display: "swap", weight: ["400", "500"] });

export const metadata = {
    title: "Admin · Orion Studio",
    robots: { index: false, follow: false },
};

/**
 * Document shell for everything under /admin. It deliberately performs no
 * authorisation: the login form has to render for anonymous visitors.
 *
 * The authenticated shell, including the redirect for unauthenticated
 * requests, lives in (dashboard)/layout.tsx so that /admin/login is the only
 * route reachable without a session.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${redHatDisplay.variable} ${bricolage.variable} ${redHatMono.variable}`}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
