'use client'

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";

const routes = [
    { label: "Studio",  link: "/#studio" },
    { label: "Work",    link: "/work" },
    { label: "About",   link: "/about" },
    { label: "Contact", link: "/contact" },
]

const CYCLE_INTERVAL = 4;
const FLIP_DURATION = 0.6;

export function Navbar() {
    const pathname = usePathname()
    const handleClick = (e: React.MouseEvent, href: string) => {
        if (pathname === href) e.preventDefault()
    }

    const containerRef = useRef<HTMLDivElement>(null)
    const dreamRef = useRef<HTMLSpanElement>(null)
    const orionRef = useRef<HTMLSpanElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!containerRef.current || !dreamRef.current || !orionRef.current || !logoRef.current) return;

        const items = [dreamRef.current, orionRef.current, logoRef.current];
        let current = 0;

        items.forEach(el => el.style.transform = "");
        gsap.set(items[0], { yPercent: 0 });
        gsap.set(items[1], { yPercent: 100 });
        gsap.set(items[2], { yPercent: 100 });

        const flip = () => {
            const outEl = items[current];
            const next = (current + 1) % items.length;
            const inEl = items[next];

            gsap.timeline({
                onComplete: () => { current = next; },
            })
                .to(outEl, { yPercent: -100, duration: FLIP_DURATION, ease: "orion.inOut" })
                .fromTo(inEl, { yPercent: 100 }, { yPercent: 0, duration: FLIP_DURATION, ease: "orion.inOut" }, 0);
        };

        gsap.delayedCall(CYCLE_INTERVAL, function repeat() {
            flip();
            gsap.delayedCall(CYCLE_INTERVAL, repeat);
        });
    }, { scope: containerRef });

    const textStyle = {
        fontFamily: "var(--font-unica)",
        fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
        letterSpacing: "0.12em",
        lineHeight: "1.2",
        textTransform: "uppercase" as const,
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="section-container flex items-center justify-between h-20">
                <Link href="/" onClick={(e) => handleClick(e, "/")} className="block" aria-label="Orion Studio">
                    <div
                        ref={containerRef}
                        className="relative overflow-hidden"
                        style={{ ...textStyle, height: "1.2em" }}
                    >
                        <span
                            ref={dreamRef}
                            className="block whitespace-nowrap"
                            style={{ letterSpacing: "0.08em" }}
                        >
                            Digital dreams designed for you
                        </span>
                        <span
                            ref={orionRef}
                            className="absolute top-0 left-0 block"
                        >
                            Orion Studio
                        </span>
                        <div
                            ref={logoRef}
                            className="absolute top-0 left-0 flex items-center h-full"
                        >
                            <Image
                                src="/logo.svg"
                                alt="Orion Studio"
                                width={60}
                                height={60}
                                className="w-[1.2em] h-[1.2em]"
                            />
                        </div>
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
