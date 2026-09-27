import { SessionProvider } from "next-auth/react";
import "../globals.css";
import { allFontVariables } from "@/lib/fonts";


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
            <body className={allFontVariables}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    );
}
