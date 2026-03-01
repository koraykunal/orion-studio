'use client'

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { gsap, useGSAP } from "@/lib/animations/gsap";

const routes = [
    { label: "Studio",  link: "/#studio" },
    { label: "Work",    link: "/work" },
    { label: "About",   link: "/about" },
    { label: "Contact", link: "/contact" },
]

export function Navbar() {
    const pathname = usePathname()
    const isHome = pathname === "/"
    const logoWrapRef = useRef<HTMLDivElement>(null)
    const dreamRef = useRef<HTMLSpanElement>(null)
    const orionRef = useRef<HTMLSpanElement>(null)

    const handleClick = (e: React.MouseEvent, href: string) => {
        if (pathname === href) e.preventDefault()
    }

    useGSAP(() => {
        if (!isHome || !logoWrapRef.current || !dreamRef.current || !orionRef.current) return;

        gsap.set(orionRef.current, { yPercent: 100 });
        gsap.set(dreamRef.current, { yPercent: 0 });

        gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "+=600",
                scrub: 0.6,
            },
        })
            .to(dreamRef.current, {
                yPercent: -100,
                duration: 1,
                ease: "none",
            }, 0)
            .to(orionRef.current, {
                yPercent: 0,
                duration: 1,
                ease: "none",
            }, 0);
    }, { scope: logoWrapRef, dependencies: [isHome] });

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="section-container flex items-center justify-between h-20">
                <Link href="/" onClick={(e) => handleClick(e, "/")} className="block" aria-label="Orion Studio">
                    <div
                        ref={logoWrapRef}
                        className="relative overflow-hidden"
                        style={{ height: "1.2em" }}
                    >
                        {isHome ? (
                            <>
                                <span
                                    ref={dreamRef}
                                    className="block whitespace-nowrap"
                                    style={{
                                        fontFamily: "var(--font-unica)",
                                        fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
                                        letterSpacing: "0.08em",
                                        lineHeight: "1.2",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Digital dreams designed for you
                                </span>
                                <span
                                    ref={orionRef}
                                    className="block absolute top-0 left-0"
                                    style={{
                                        fontFamily: "var(--font-unica)",
                                        fontSize: "clamp(0.75rem, 1.1vw, 1.95rem)",
                                        letterSpacing: "0.12em",
                                        lineHeight: "1.2",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Orion Studio
                                </span>
                            </>
                        ) : (
                            <span
                                className="block"
                                style={{
                                    fontFamily: "var(--font-unica)",
                                    fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
                                    letterSpacing: "0.12em",
                                    lineHeight: "1.2",
                                    textTransform: "uppercase",
                                }}
                            >
                                Orion
                            </span>
                        )}
                    </div>
                </Link>

                <div className="flex items-center gap-8">
                    <ul className="hidden md:flex items-center gap-8">
                        {routes.map((route) => (
                            <li key={route.label}>
                                <Link
                                    href={route.link}
                                    onClick={(e) => handleClick(e, route.link)}
                                    className="nav-link text-label text-foreground-muted hover:text-foreground transition-colors"
                                    style={{ transitionDuration: "350ms" }}
                                >
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/contact"
                        onClick={(e) => handleClick(e, "/contact")}
                        className="text-label border-b border-border pb-0.5 hover:border-foreground transition-colors"
                        style={{ transitionDuration: "350ms" }}
                    >
                        Start a project
                    </Link>
                </div>
            </div>
        </nav>
    )
}
