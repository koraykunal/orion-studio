import "../globals.css";
import { allFontVariables } from "@/lib/fonts";


export const metadata = {
    title: "Design System · Orion Studio",
    robots: { index: false, follow: false },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={allFontVariables}>
                {children}
            </body>
        </html>
    );
}
