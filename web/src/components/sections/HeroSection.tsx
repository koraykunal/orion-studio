"use client";

import { useRef } from "react";
import { Link } from "next-view-transitions";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { Marquee } from "@/components/motion/Marquee";
import { OrionConstellation } from "@/components/effects/OrionConstellation";

const TICKER_ITEMS = [
    "Brand Strategy",
    "Web Design",
    "Digital Products",
    "Motion Design",
    "Creative Direction",
    "Development",
];

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const tickerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!titleRef.current) return;

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

        if (ctaChildren) {
            tl.to(ctaRef.current, {
                opacity: 1, y: 0, scale: 1, visibility: "visible",
                duration: 0.8,
            }, ">-0.5");
            tl.to(ctaChildren, {
                opacity: 1, y: 0, visibility: "visible",
                duration: 0.7, stagger: 0.12,
            }, "<0.05");
        }

        tl.to(tickerRef.current, {
            opacity: 1, y: 0, visibility: "visible",
            duration: 0.7,
        }, "<0.15");

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=80%",
                pin: true,
                scrub: 1.4,
                anticipatePin: 1,
            },
        });

        scrollTl
            .fromTo(titleRef.current,
                { scale: 1, y: 0, opacity: 1 },
                { scale: 1.1, y: "-5vh", opacity: 0, duration: 1, ease: "power2.in" },
                0
            )
            .fromTo(ctaRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: -15, duration: 0.4, ease: "power1.in" }, 0.1)
            .fromTo(tickerRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: 10, duration: 0.4, ease: "power1.in" }, 0)
            .fromTo(bgRef.current, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "power1.in" }, 0.4);

        return () => split.revert();
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
                <div className="flex-1 flex flex-col items-center justify-center gap-8 lg:gap-10 px-6">
                    <h1
                        ref={titleRef}
                        className="text-display text-center select-none"
                    >
                        ORION
                    </h1>

                    <div ref={ctaRef} className="flex items-center gap-8">
                        <Link
                            href="/contact"
                            className="group flex items-center gap-3 text-label border-b border-border pb-1 hover:border-accent transition-colors duration-350"
                        >
                            Start a project
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-350">
                                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link
                            href="/#work"
                            className="text-label text-foreground-muted hover:text-foreground transition-colors duration-350"
                        >
                            View work
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
