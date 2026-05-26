import { Red_Hat_Display, Bricolage_Grotesque, Red_Hat_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./components/Sidebar";
import { auth } from "@/lib/auth";
import "../globals.css";

const redHatDisplay = Red_Hat_Display({ subsets: ["latin"], variable: "--font-rh-display", display: "swap", weight: ["400", "500", "600", "700", "800", "900"], style: ["normal", "italic"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap", weight: ["400", "500", "600", "700"] });
const redHatMono = Red_Hat_Mono({ subsets: ["latin"], variable: "--font-rh-mono", display: "swap", weight: ["400", "500"] });

export const metadata = {
    title: "Admin — Orion Studio",
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <html lang="en" className="dark">
            <body className={`${redHatDisplay.variable} ${bricolage.variable} ${redHatMono.variable}`}>
                <SessionProvider session={session}>
                    {isLoggedIn ? (
                        <div className="flex min-h-screen bg-background">
                            <Sidebar />
                            <main className="flex-1 overflow-y-auto">
                                <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
                                    {children}
                                </div>
                            </main>
                        </div>
                    ) : (
                        children
                    )}
                </SessionProvider>
            </body>
        </html>
    );
}
