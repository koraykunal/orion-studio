'use client'

import { useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";

const CYCLE_INTERVAL = 4;
const FLIP_DURATION = 0.6;

export function Navbar() {
    const rawPathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("nav");
    const tHome = useTranslations("home");
    const [menuOpen, setMenuOpen] = useState(false);

    const localePath = rawPathname.replace(/^\/(en|tr)/, "") || "/";

    const routes = [
        { labelKey: "studio" as const, link: `/${locale}/#capabilities` },
        { labelKey: "work"   as const, link: `/${locale}/work` },
        { labelKey: "blog"   as const, link: `/${locale}/blog` },
        { labelKey: "about"  as const, link: `/${locale}/about` },
        { labelKey: "contact"as const, link: `/${locale}/contact` },
    ];

    const handleClick = (e: React.MouseEvent, href: string) => {
        if (rawPathname === href) e.preventDefault();
        setMenuOpen(false);
    };

    const toggleMenu = useCallback(() => {
        setMenuOpen((prev) => !prev);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const dreamRef = useRef<HTMLSpanElement>(null);
    const orionRef = useRef<HTMLSpanElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

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

            gsap.timeline({ onComplete: () => { current = next; } })
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
        textTransform: "none" as const,
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="section-container flex items-center justify-between h-20">
                    <Link href={`/${locale}`} onClick={(e) => handleClick(e, `/${locale}`)} className="block" aria-label="Orion Studio">
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
                                {tHome("heroTagline")}
                            </span>
                            <span ref={orionRef} className="absolute top-0 left-0 block">
                                ORION STUDIO
                            </span>
                            <div ref={logoRef} className="absolute top-0 left-0 flex items-center h-full">
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
                                <li key={route.labelKey}>
                                    <Link
                                        href={route.link}
                                        onClick={(e) => handleClick(e, route.link)}
                                        className="nav-link text-label text-foreground-muted hover:text-foreground transition-colors"
                                        style={{ transitionDuration: "350ms" }}
                                    >
                                        {t(route.labelKey)}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="hidden md:flex items-center gap-2 text-label">
                            <Link
                                href={`/en${localePath}`}
                                className={locale === "en" ? "font-semibold text-foreground" : "text-foreground-muted hover:text-foreground transition-colors"}
                                style={{ transitionDuration: "350ms" }}
                            >
                                EN
                            </Link>
                            <span className="text-foreground-subtle opacity-40">|</span>
                            <Link
                                href={`/tr${localePath}`}
                                className={locale === "tr" ? "font-semibold text-foreground" : "text-foreground-muted hover:text-foreground transition-colors"}
                                style={{ transitionDuration: "350ms" }}
                            >
                                TR
                            </Link>
                        </div>

                        <Link
                            href={`/${locale}/contact`}
                            onClick={(e) => handleClick(e, `/${locale}/contact`)}
                            className="hidden md:block text-label border-b border-border pb-0.5 hover:border-foreground transition-colors"
                            style={{ transitionDuration: "350ms" }}
                        >
                            {t("startProject")}
                        </Link>

                        <button
                            onClick={toggleMenu}
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                            aria-expanded={menuOpen}
                        >
                            <span
                                className="block w-5 h-px bg-foreground transition-all duration-300"
                                style={{ transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none" }}
                            />
                            <span
                                className="block w-5 h-px bg-foreground transition-all duration-300"
                                style={{ opacity: menuOpen ? 0 : 1 }}
                            />
                            <span
                                className="block w-5 h-px bg-foreground transition-all duration-300"
                                style={{ transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden">
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {routes.map((route) => (
                            <Link
                                key={route.labelKey}
                                href={route.link}
                                onClick={(e) => handleClick(e, route.link)}
                                className="text-title text-foreground hover:text-accent transition-colors duration-300"
                            >
                                {t(route.labelKey)}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4 text-label mt-2">
                            <Link
                                href={`/en${localePath}`}
                                className={locale === "en" ? "font-semibold text-foreground" : "text-foreground-muted"}
                            >
                                EN
                            </Link>
                            <span className="text-foreground-subtle opacity-40">|</span>
                            <Link
                                href={`/tr${localePath}`}
                                className={locale === "tr" ? "font-semibold text-foreground" : "text-foreground-muted"}
                            >
                                TR
                            </Link>
                        </div>
                        <Link
                            href={`/${locale}/contact`}
                            onClick={(e) => handleClick(e, `/${locale}/contact`)}
                            className="mt-4 px-8 py-3 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500"
                        >
                            {t("startProject")}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
