"use client";

import { useRef } from "react";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { Marquee } from "@/components/motion/Marquee";
import { OrionConstellation } from "@/components/effects/OrionConstellation";
import { ArrowUpRight } from "@/components/common/ArrowUpRight";

export function HeroSection() {
    const t = useTranslations("home");
    const locale = useLocale();

    const TICKER_ITEMS = [
        t("heroTicker0"), t("heroTicker1"), t("heroTicker2"),
        t("heroTicker3"), t("heroTicker4"), t("heroTicker5"),
    ];
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const tickerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!titleRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const split = SplitText.create(titleRef.current, {
            type: "chars",
            charsClass: "split-char",
        });

        gsap.set(split.chars, {
            y: "120%",
            opacity: 0,
            rotateX: -90,
            transformOrigin: "50% 100% -40px",
        });

        const subSplit = subtitleRef.current
            ? SplitText.create(subtitleRef.current, { type: "lines,words", mask: "lines" })
            : null;
        gsap.set(subtitleRef.current, { visibility: "hidden" });
        if (subSplit) gsap.set(subSplit.words, { yPercent: 120 });

        gsap.set(ctaRef.current, { opacity: 0, y: 28, scale: 0.96, visibility: "hidden" });
        gsap.set(tickerRef.current, { opacity: 0, y: 14, visibility: "hidden" });
        gsap.set(bgRef.current, { opacity: 0, scale: 1.05 });

        const ctaChildren = ctaRef.current?.children;
        if (ctaChildren) {
            gsap.set(ctaChildren, { opacity: 0, y: 20, visibility: "hidden" });
        }

        const tl = gsap.timeline({
            defaults: { ease: "orion.out" },
            delay: 0.2,
        });

        tl.to(bgRef.current, { opacity: 1, scale: 1, duration: 3, ease: "power1.out" }, 0);

        tl.to(split.chars, {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            duration: 1.3,
            stagger: 0.08,
            ease: "orion.out",
        }, 0.2);

        if (subSplit) {
            tl.set(subtitleRef.current, { visibility: "visible" }, 0.85);
            tl.to(subSplit.words, {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.045,
                ease: "orion.out",
            }, 0.85);
        }

        if (ctaChildren) {
            tl.to(ctaRef.current, {
                opacity: 1, y: 0, scale: 1, visibility: "visible",
                duration: 0.8,
            }, ">-0.45");
            tl.to(ctaChildren, {
                opacity: 1, y: 0, visibility: "visible",
                duration: 0.7, stagger: 0.12,
            }, "<0.05");
        }

        tl.to(tickerRef.current, {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.7,
        }, "<0.15");

        return () => {
            split.revert();
            subSplit?.revert();
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative w-full h-[100svh] overflow-hidden bg-background">
            <div ref={bgRef} className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 0%, var(--background) 100%)",
                    }}
                />
                <div className="absolute inset-0 opacity-60">
                    <OrionConstellation />
                </div>
            </div>

            <div className="relative z-10 w-full h-full flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 lg:gap-8 px-6">
                    <h1 className="sr-only">{t("heroH1")}</h1>
                    <div
                        ref={titleRef}
                        aria-hidden="true"
                        className="text-display text-center select-none"
                    >
                        ORION
                    </div>

                    <p
                        ref={subtitleRef}
                        className="text-body-lg text-foreground-muted text-center text-balance max-w-[46ch]"
                    >
                        {t("heroSubtitle")}
                    </p>

                    <div ref={ctaRef} className="flex items-center gap-8">
                        <Link
                            href={`/${locale}/contact`}
                            className="group flex items-center gap-3 text-label border-b border-border pb-1 hover:border-accent transition-colors duration-350"
                        >
                            {t("heroStartProject")}
                            <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-350" />
                        </Link>
                        <Link
                            href={`/${locale}/#work`}
                            className="text-label text-foreground-muted hover:text-foreground transition-colors duration-350"
                        >
                            {t("heroViewWork")}
                        </Link>
                    </div>
                </div>

                <div ref={tickerRef} className="border-t border-border-subtle">
                    <Marquee items={TICKER_ITEMS} speed={25} separator="dot" />
                </div>
            </div>
        </section>
    );
}
