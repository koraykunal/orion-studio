import {SmoothScroll} from "@/components/system/SmoothScroll";
import {Navbar} from "@/components/layout/Navbar";
import {Footer} from "@/components/layout/Footer";

export default function SiteLayout({children}: { children: React.ReactNode }) {
    return (
        <SmoothScroll>
            <Navbar/>
            {children}
            <Footer/>
        </SmoothScroll>
    );
}
