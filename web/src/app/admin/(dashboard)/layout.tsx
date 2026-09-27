import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "../components/Sidebar";

export const metadata = {
    robots: { index: false, follow: false },
};

/**
 * Authenticated shell for the CMS.
 *
 * `(dashboard)` contributes no URL segment, so these routes keep their existing
 * paths (/admin, /admin/posts, /admin/projects, /admin/messages) while being
 * structurally separated from /admin/login. Every page under this group is
 * therefore unreachable without a session, enforced here rather than by
 * conditionally hiding the chrome.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userId = session?.user?.id;

    if (typeof userId !== "string" || userId.length === 0) {
        redirect("/admin/login");
    }

    return (
        <div className="flex min-h-screen bg-background">
            <a
                href="#admin-main"
                className="sr-only rounded-md bg-accent px-4 py-2 text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
            >
                Skip to content
            </a>
            <Sidebar />
            <main className="flex-1 overflow-y-auto" id="admin-main">
                <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">{children}</div>
            </main>
        </div>
    );
}
