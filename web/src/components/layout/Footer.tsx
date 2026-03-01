"use client";

import {useRef} from "react";
import {Link} from "next-view-transitions";
import {gsap, useGSAP} from "@/lib/animations/gsap";
import {LineReveal} from "@/components/motion/LineReveal";
import {OrionMark} from "@/components/effects/OrionMark";
import {EASES, DURATIONS, STAGGER} from "@/lib/animations/config";

const navLinks = [
    {label: "Studio", href: "/#capabilities"},
    {label: "Work", href: "/#work"},
    {label: "Process", href: "/#process"},
    {label: "Contact", href: "/contact"},
];

const socials = [
    {label: "Instagram", href: "https://www.instagram.com/orionstud.io/"},
    {label: "LinkedIn", href: "https://www.linkedin.com/company/104592237"},
];

export function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const colRefs = useRef<(HTMLDivElement | null)[]>([]);
    const bottomBarRef = useRef<HTMLDivElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!footerRef.current) return;

        colRefs.current.forEach((col, i) => {
            if (!col) return;
            gsap.fromTo(col,
                {opacity: 0, y: 32, filter: "blur(4px)"},
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: DURATIONS.slow,
                    ease: EASES.expo,
                    delay: i * STAGGER.loose,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        if (bottomBarRef.current) {
            gsap.fromTo(bottomBarRef.current,
                {opacity: 0, y: 16},
                {
                    opacity: 1,
                    y: 0,
                    duration: DURATIONS.base,
                    ease: EASES.expo,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }

        if (brandRef.current) {
            gsap.fromTo(brandRef.current,
                {opacity: 0, y: 80, filter: "blur(10px)", scale: 0.95},
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 1.4,
                    ease: EASES.brand,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 95%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }
    }, {scope: footerRef});

    return (
        <footer ref={footerRef} className="relative bg-background overflow-hidden">
            <div className="absolute -right-[8%] top-[5%] w-[40%] h-[60%] pointer-events-none">
                <OrionMark variant="full" lineOpacity={0.05} globalOpacity={0.3} rotate={20}/>
            </div>

            <div className="relative z-10 section-container">
                <LineReveal/>
            </div>

            <div ref={topRef} className="section-container pt-16 lg:pt-24 pb-20 lg:pb-28">
                <div className="grid-container gap-y-10">
                    <div
                        ref={(el) => {
                            colRefs.current[0] = el;
                        }}
                        className="col-span-2 md:col-span-2 lg:col-span-2"
                    >
                        <p className="text-label text-foreground-subtle mb-5">Navigate</p>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                        data-cursor="hover"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        ref={(el) => {
                            colRefs.current[1] = el;
                        }}
                        className="col-span-2 md:col-span-2 lg:col-span-2"
                    >
                        <p className="text-label text-foreground-subtle mb-5">Social</p>
                        <ul className="space-y-3">
                            {socials.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                        data-cursor="hover"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        ref={(el) => {
                            colRefs.current[2] = el;
                        }}
                        className="col-span-4 md:col-span-2 lg:col-span-2"
                    >
                        <p className="text-label text-foreground-subtle mb-5">Get in touch</p>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:koraykunal85@outlook.com"
                                    className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    koraykunal85@outlook.com
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    Book a call
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-fit mx-auto px-4">
                <div
                    ref={brandRef}
                    className="overflow-hidden select-none pointer-events-none"
                >
                    <p
                        className="font-[var(--font-unica)] leading-[0.85] tracking-[-0.04em] text-foreground/55 whitespace-nowrap"
                        style={{fontSize: "clamp(3rem, 14vw, 18rem)"}}
                    >
                        ORION STUDIO
                    </p>
                </div>

                <div ref={bottomBarRef} className="pb-6 lg:pb-8 pt-6 lg:pt-0">
                    <div
                        className="flex items-center justify-between gap-4 py-5 border-t border-border-subtle">
                        <p className="text-caption">
                            &copy; {new Date().getFullYear()} Orion Studio
                        </p>
                        <p className="text-caption text-foreground-subtle">
                            Crafted with precision
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
