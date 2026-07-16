"use client";

import { useRef, useCallback } from "react";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { gsap, SplitText, DrawSVGPlugin, useGSAP } from "@/lib/animations/gsap";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionButton } from "@/components/common/OrionButton";
import { SocialIcon } from "@/components/common/SocialIcon";
import { EASES, DURATIONS } from "@/lib/animations/config";
import { PRIMARY_SOCIALS, CONTACT_EMAIL, WHATSAPP_HREF, PHONE_HREF } from "@/lib/socials";

export function ContactSection() {
    const t = useTranslations("home");
    const locale = useLocale();
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLAnchorElement>(null);
    const charsRef = useRef<HTMLElement[]>([]);
    const metaRef = useRef<HTMLDivElement>(null);
    const arcRef = useRef<SVGPathElement>(null);
    const bloomRef = useRef<SVGGElement>(null);

    useGSAP(() => {
        if (!headingRef.current) return;

        gsap.registerPlugin(DrawSVGPlugin);

        if (arcRef.current && bloomRef.current) {
            const bloomPaths = Array.from(bloomRef.current.querySelectorAll("path"));

            gsap.set(arcRef.current, { drawSVG: "0% 0%", opacity: 0 });
            gsap.set(bloomRef.current, {
                opacity: 0,
                transformOrigin: "50% 50%",
            });
            gsap.set(bloomPaths, { drawSVG: "0% 0%" });

            const arcTl = gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
            });

            arcTl.to(arcRef.current, {
                drawSVG: "0% 100%",
                opacity: 1,
                duration: 2.8,
                ease: EASES.brand,
            }, 0);

            arcTl.to(bloomPaths, {
                drawSVG: "0% 100%",
                duration: 3.05,
                ease: EASES.brand,
                stagger: 0.04,
            }, 0.16);

            arcTl.to(bloomRef.current, {
                opacity: 1,
                duration: 1.9,
                ease: "sine.inOut",
            }, 0.24);

            arcTl.to(bloomRef.current, {
                opacity: 0.92,
                duration: 1.2,
                ease: "sine.inOut",
            }, 2.2);
        }

        const split = SplitText.create(headingRef.current, {
            type: "chars",
            charsClass: "split-char",
        });

        charsRef.current = split.chars as HTMLElement[];

        (split.chars as HTMLElement[]).forEach((char) => {
            char.style.display = "inline-block";
            char.style.transition = "none";
            char.style.willChange = "transform";
        });

        gsap.set(split.chars, {
            y: "110%",
            opacity: 0,
            rotateX: -60,
            filter: "blur(8px)",
            transformOrigin: "50% 100%",
        });

        gsap.set(metaRef.current, { opacity: 0, y: 20, filter: "blur(4px)" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
                toggleActions: "play none none none",
            },
        });

        tl.to(split.chars, {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.06,
            ease: EASES.brand,
        }, 0);

        tl.to(metaRef.current, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: DURATIONS.slow,
            ease: EASES.expo,
        }, 0.8);

        return () => split.revert();
    }, { scope: sectionRef });

    const handleCharMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const char = e.currentTarget;
        gsap.to(char, {
            y: -8,
            scale: 1.06,
            textShadow: "0 0 18px rgba(195, 183, 255, 0.34), 0 0 42px rgba(172, 143, 248, 0.16)",
            duration: 0.42,
            ease: EASES.brand,
        });
    }, []);

    const handleCharMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const char = e.currentTarget;
        gsap.to(char, {
            y: 0,
            scale: 1,
            textShadow: "0 0 0 rgba(195, 183, 255, 0)",
            duration: 0.62,
            ease: EASES.expo,
            clearProps: "textShadow",
        });
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative section-py bg-background overflow-hidden"
            id="contact"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
                <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 72% 55% at 50% 46%, var(--glow-subtle), transparent 72%)" }}
                />

                <div className="absolute inset-x-0 bottom-[14%] h-[64%]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax meet" fill="none">
                        <defs>
                            <linearGradient id="orion-arc" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="oklch(0.80 0.13 80)" stopOpacity="0" />
                                <stop offset="0.5" stopColor="oklch(0.94 0.11 88)" stopOpacity="0.9" />
                                <stop offset="1" stopColor="oklch(0.80 0.13 80)" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="orion-glow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="oklch(0.85 0.15 74)" stopOpacity="0" />
                                <stop offset="0.5" stopColor="oklch(0.88 0.15 78)" stopOpacity="1" />
                                <stop offset="1" stopColor="oklch(0.85 0.15 74)" stopOpacity="0" />
                            </linearGradient>
                            <filter id="orion-arc-halo" x="-20%" y="-160%" width="140%" height="300%">
                                <feGaussianBlur stdDeviation="40" />
                            </filter>
                            <filter id="orion-arc-blur" x="-20%" y="-120%" width="140%" height="260%">
                                <feGaussianBlur stdDeviation="15" />
                            </filter>
                            <filter id="orion-arc-blur-tight" x="-20%" y="-80%" width="140%" height="220%">
                                <feGaussianBlur stdDeviation="5" />
                            </filter>
                        </defs>
                        <g ref={bloomRef}>
                            <path d="M -120 320 Q 600 60 1320 320" stroke="url(#orion-glow)" strokeWidth="70" strokeLinecap="round" opacity="0.18" filter="url(#orion-arc-halo)" />
                            <path d="M -120 320 Q 600 70 1320 320" stroke="url(#orion-glow)" strokeWidth="34" strokeLinecap="round" opacity="0.26" filter="url(#orion-arc-blur)" />
                            <path d="M -120 320 Q 600 70 1320 320" stroke="url(#orion-glow)" strokeWidth="10" strokeLinecap="round" opacity="0.5" filter="url(#orion-arc-blur-tight)" />
                        </g>
                        <path ref={arcRef} d="M -120 320 Q 600 70 1320 320" stroke="url(#orion-arc)" strokeWidth="1.25" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 section-container">
                <LineReveal className="mb-16 lg:mb-24" />

                <div className="flex flex-col items-center text-center">
                    <span className="text-index text-foreground-subtle mb-10 lg:mb-14">
                        {t("contactLabel")}
                    </span>

                    <Link
                        ref={headingRef}
                        href={`/${locale}/contact`}
                        className="text-hero block cursor-pointer select-none"
                        data-cursor="hover"
                        onMouseOver={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.classList.contains("split-char")) {
                                handleCharMouseEnter({
                                    ...e,
                                    currentTarget: target,
                                } as React.MouseEvent<HTMLElement>);
                            }
                        }}
                        onMouseOut={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.classList.contains("split-char")) {
                                handleCharMouseLeave({
                                    ...e,
                                    currentTarget: target,
                                } as React.MouseEvent<HTMLElement>);
                            }
                        }}
                    >
                        {t("contactHeading")}
                    </Link>

                    <div ref={metaRef} className="mt-12 lg:mt-16 flex flex-col items-center gap-7">
                        {WHATSAPP_HREF && (
                            <div className="flex w-full max-w-[22rem] flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
                                <OrionButton href={WHATSAPP_HREF} external className="w-full sm:w-auto">
                                    {t("quickContactWhatsapp")}
                                </OrionButton>
                                {PHONE_HREF && (
                                    <OrionButton href={PHONE_HREF} external variant="ghost" className="w-full sm:w-auto">
                                        {t("quickContactCall")}
                                    </OrionButton>
                                )}
                            </div>
                        )}

                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="text-body-lg text-foreground-muted hover:text-accent transition-colors duration-350"
                            data-cursor="hover"
                        >
                            {CONTACT_EMAIL}
                        </a>

                        <div className="flex items-center gap-6">
                            {PRIMARY_SOCIALS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="text-foreground-subtle hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    <SocialIcon name={social.icon} size={22} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
