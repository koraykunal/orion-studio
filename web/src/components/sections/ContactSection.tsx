"use client";

import { useRef, useCallback } from "react";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { LineReveal } from "@/components/motion/LineReveal";
import { EASES, DURATIONS } from "@/lib/animations/config";
import { PRIMARY_SOCIALS, CONTACT_EMAIL } from "@/lib/socials";

export function ContactSection() {
    const t = useTranslations("home");
    const locale = useLocale();
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLAnchorElement>(null);
    const charsRef = useRef<HTMLElement[]>([]);
    const metaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!headingRef.current) return;

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
            y: -12,
            scale: 1.15,
            color: "oklch(0.72 0.15 295)",
            duration: 0.35,
            ease: EASES.brandSpring,
        });
    }, []);

    const handleCharMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const char = e.currentTarget;
        gsap.to(char, {
            y: 0,
            scale: 1,
            color: "",
            duration: 0.5,
            ease: EASES.expo,
        });
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative section-py bg-background overflow-hidden"
            id="contact"
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.72 0.15 295 / 0.03), transparent 70%)",
                }}
            />

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
                        onMouseMove={(e) => {
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

                    <div ref={metaRef} className="mt-12 lg:mt-16 flex flex-col items-center gap-6">
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="text-body-lg text-foreground-muted hover:text-accent transition-colors duration-350"
                            data-cursor="hover"
                        >
                            {CONTACT_EMAIL}
                        </a>

                        <div className="flex items-center gap-8">
                            {PRIMARY_SOCIALS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-label text-foreground-subtle hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
