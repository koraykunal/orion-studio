import { SmoothScroll } from "@/components/system/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Persistent site chrome.
 *
 * This layout deliberately renders no landmarks of its own. The main region
 * belongs to each page so a page that renders more than one region can control
 * its own outline, and the header and footer live in Navbar and Footer.
 *
 * The skip link is here rather than in Navbar because it is the first focusable
 * element on every page and must exist before the navigation is rendered. The
 * marketing site had no skip link at all, which meant a keyboard user had to
 * tab through the entire navigation on every page before reaching any content.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <SmoothScroll>
            <a
                href="#main-content"
                className="sr-only rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
            >
                Skip to content
            </a>
            <Navbar />
            {children}
            <Footer />
        </SmoothScroll>
    );
}
