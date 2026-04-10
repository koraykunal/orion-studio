import { Inter, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./components/Sidebar";
import { auth } from "@/lib/auth";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata = {
    title: "Admin — Orion Studio",
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
