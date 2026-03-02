"use client";

import { useRef } from "react";
import { gsap, useGSAP, DrawSVGPlugin } from "@/lib/animations/gsap";
import { EASES, DURATIONS } from "@/lib/animations/config";
import { OrionMark } from "@/components/effects/OrionMark";

/* ── Data ───────────────────────────────────────────── */

const COMPARISONS = [
    {
        index: "01",
        them: { label: "Generic design", desc: "Templates stretched thin, blending into the crowd." },
        us:   { label: "Bespoke craft", desc: "Every pixel from zero, rooted in your DNA." },
    },
    {
        index: "02",
        them: { label: "Disconnected pages", desc: "Inconsistent spacing, clashing type, no shared logic." },
        us:   { label: "Unified system", desc: "Tokens, components, motion\u2009\u2014\u2009one system that scales." },
    },
    {
        index: "03",
        them: { label: "Decorative noise", desc: "Ornaments with no purpose or direction." },
        us:   { label: "Intentional detail", desc: "Every decision traces back to strategy." },
    },
];

/* ── Abstract Mockup Sub-components ─────────────────── */

function ThemMockup1() {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-surface-1 border border-border-subtle overflow-hidden grayscale opacity-80">
            <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-3 border-b border-border-subtle">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                </div>
                <div className="flex-1 flex justify-center gap-3 md:gap-4">
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-foreground-muted/30" />
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-foreground-muted/30" />
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-foreground-muted/30" />
                </div>
            </div>
            <div className="mx-3 md:mx-5 mt-3 md:mt-4 h-[35%] rounded bg-foreground-muted/15" />
            <div className="grid grid-cols-3 gap-2 md:gap-3 mx-3 md:mx-5 mt-2 md:mt-3">
                <div className="h-8 md:h-12 lg:h-14 rounded bg-foreground-muted/12" />
                <div className="h-8 md:h-12 lg:h-14 rounded bg-foreground-muted/12" />
                <div className="h-8 md:h-12 lg:h-14 rounded bg-foreground-muted/12" />
            </div>
            <div className="mx-3 md:mx-5 mt-2 md:mt-3 space-y-1 md:space-y-1.5">
                <div className="w-3/4 h-1.5 md:h-2 rounded-full bg-foreground-muted/15" />
                <div className="w-1/2 h-1.5 md:h-2 rounded-full bg-foreground-muted/12" />
            </div>
        </div>
    );
}

function UsMockup1() {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-surface-1 border border-border-bright overflow-hidden relative glow-accent">
            <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-3 border-b border-border">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-accent/60" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-muted/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-muted/40" />
                </div>
                <div className="flex-1 flex justify-center gap-3 md:gap-4">
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-foreground/40" />
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-foreground/25" />
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-foreground/25" />
                </div>
            </div>
            <div className="mx-3 md:mx-5 mt-3 md:mt-4 h-[35%] rounded-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface-2 to-accent-warm/15" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] md:text-sm font-medium tracking-[0.3em] uppercase text-foreground/70">ORION</span>
                </div>
            </div>
            <div className="flex gap-2 md:gap-3 mx-3 md:mx-5 mt-2 md:mt-3">
                <div className="flex-[2] h-8 md:h-12 lg:h-14 rounded-md bg-accent/12 border border-accent/20" />
                <div className="flex-[1] h-8 md:h-12 lg:h-14 rounded-md bg-surface-2 border border-border-subtle" />
            </div>
            <div className="flex gap-2 md:gap-3 mx-3 md:mx-5 mt-1.5 md:mt-2">
                <div className="flex-[1] h-6 md:h-8 lg:h-10 rounded-md bg-surface-2 border border-border-subtle" />
                <div className="flex-[3] h-6 md:h-8 lg:h-10 rounded-md bg-accent/8 border border-accent/15" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 opacity-[0.08]">
                <OrionMark variant="minimal" lineOpacity={0.4} globalOpacity={1} bgStarCount={0} />
            </div>
        </div>
    );
}

function ThemMockup2() {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-surface-1 border border-border-subtle overflow-hidden grayscale opacity-80">
            <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-3 border-b border-border-subtle">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                </div>
                <div className="flex-1 flex justify-center gap-4 md:gap-5">
                    <div className="w-10 md:w-14 h-1.5 md:h-2 rounded-full bg-foreground-muted/30" />
                    <div className="w-6 md:w-10 h-1.5 md:h-2 rounded-full bg-foreground-muted/25" />
                </div>
            </div>
            <div className="mx-3 md:mx-5 mt-3 md:mt-4 space-y-2 md:space-y-2.5">
                <div className="h-4 md:h-6 w-2/3 rounded bg-foreground-muted/18" />
                <div className="h-3 md:h-4 w-full rounded bg-foreground-muted/10" />
                <div className="h-3 md:h-4 w-5/6 rounded bg-foreground-muted/10" />
                <div className="mt-3 md:mt-5 h-4 md:h-5 w-1/2 rounded bg-foreground-muted/15" />
                <div className="h-3 md:h-4 w-3/4 rounded bg-foreground-muted/10" />
                <div className="mt-1 md:mt-1.5 h-5 md:h-8 w-full rounded bg-foreground-muted/12" />
                <div className="h-2.5 md:h-4 w-2/5 rounded bg-foreground-muted/8" />
            </div>
        </div>
    );
}

function UsMockup2() {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-surface-1 border border-border-bright overflow-hidden relative glow-accent">
            <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-3 border-b border-border">
                <span className="text-[7px] md:text-[9px] font-mono tracking-wider text-foreground-muted uppercase">Design System</span>
            </div>
            <div className="mx-3 md:mx-5 mt-2 md:mt-3">
                <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/80 mb-1 md:mb-1.5 tracking-wider">COLOR</div>
                <div className="flex gap-1 md:gap-2">
                    <div className="w-5 h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded bg-accent" />
                    <div className="w-5 h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded bg-accent-warm/80" />
                    <div className="w-5 h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded bg-accent-bright/70" />
                    <div className="w-5 h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded bg-surface-2 border border-border-subtle" />
                    <div className="w-5 h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded bg-surface-3 border border-border-subtle" />
                    <div className="w-5 h-5 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded bg-foreground/30 border border-border-subtle" />
                </div>
            </div>
            <div className="mx-3 md:mx-5 mt-2 md:mt-3">
                <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/80 mb-1 md:mb-1.5 tracking-wider">SPACING</div>
                <div className="flex items-end gap-1 md:gap-1.5">
                    <div className="w-2.5 md:w-4 h-1 md:h-2 bg-accent/40 rounded-sm" />
                    <div className="w-2.5 md:w-4 h-2 md:h-3.5 bg-accent/40 rounded-sm" />
                    <div className="w-2.5 md:w-4 h-3 md:h-5 bg-accent/50 rounded-sm" />
                    <div className="w-2.5 md:w-4 h-4 md:h-6 bg-accent/50 rounded-sm" />
                    <div className="w-2.5 md:w-4 h-5 md:h-8 bg-accent/60 rounded-sm" />
                    <div className="w-2.5 md:w-4 h-7 md:h-12 bg-accent/70 rounded-sm" />
                </div>
            </div>
            <div className="mx-3 md:mx-5 mt-2 md:mt-3">
                <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/80 mb-1 md:mb-1.5 tracking-wider">TYPE</div>
                <div className="space-y-0.5 md:space-y-1">
                    <div className="h-2.5 md:h-3.5 w-3/4 rounded bg-foreground/25" />
                    <div className="h-2 md:h-3 w-2/3 rounded bg-foreground/18" />
                    <div className="h-1.5 md:h-2.5 w-1/2 rounded bg-foreground/14" />
                    <div className="h-1 md:h-2 w-2/5 rounded bg-foreground/10" />
                </div>
            </div>
            <div className="mx-3 md:mx-5 mt-2 md:mt-3">
                <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/80 mb-1 md:mb-1.5 tracking-wider">COMPONENTS</div>
                <div className="flex gap-1.5 md:gap-2">
                    <div className="px-2 md:px-3 py-0.5 md:py-1 rounded bg-accent/20 border border-accent/30">
                        <div className="w-5 md:w-10 h-1 md:h-1.5 bg-accent/70 rounded-full" />
                    </div>
                    <div className="px-2 md:px-3 py-0.5 md:py-1 rounded bg-surface-2 border border-border">
                        <div className="w-5 md:w-10 h-1 md:h-1.5 bg-foreground/35 rounded-full" />
                    </div>
                    <div className="w-4 h-4 md:w-7 md:h-7 rounded-full bg-accent/15 border border-accent/25" />
                </div>
            </div>
        </div>
    );
}

function ThemMockup3() {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-surface-1 border border-border-subtle overflow-hidden grayscale opacity-80 relative">
            <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-3 border-b border-border-subtle">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-foreground-subtle/40" />
                </div>
            </div>
            <div className="absolute top-[25%] left-[10%] w-14 h-14 md:w-24 md:h-24 rounded-full bg-foreground-muted/12 blur-lg" />
            <div className="absolute top-[40%] right-[12%] w-10 h-10 md:w-20 md:h-20 rounded-full bg-foreground-muted/10 blur-md" />
            <div className="absolute bottom-[18%] left-[28%] w-16 h-8 md:w-28 md:h-14 rounded-full bg-foreground-muted/8 blur-lg" />
            <div className="absolute top-[30%] right-[28%] w-7 h-7 md:w-12 md:h-12 rounded-full border-2 border-foreground-muted/15" />
            <div className="absolute bottom-[32%] left-[12%] w-5 h-5 md:w-10 md:h-10 rounded-full border-2 border-foreground-muted/12" />
            <div className="absolute top-[50%] left-[18%] w-14 md:w-24 h-px bg-foreground-muted/15 rotate-[30deg]" />
            <div className="absolute top-[65%] right-[18%] w-10 md:w-20 h-px bg-foreground-muted/12 -rotate-[15deg]" />
            <div className="absolute bottom-[14%] left-[10%] right-[10%] space-y-1 md:space-y-1.5">
                <div className="w-2/3 h-2 md:h-3 rounded-full bg-foreground-muted/12" />
                <div className="w-1/2 h-2 md:h-3 rounded-full bg-foreground-muted/10" />
            </div>
        </div>
    );
}

function UsMockup3() {
    return (
        <div className="w-full aspect-[4/3] rounded-lg bg-surface-1 border border-border-bright overflow-hidden relative glow-accent">
            <div className="flex items-center gap-2.5 px-3 md:px-4 py-2 md:py-3 border-b border-border">
                <span className="text-[7px] md:text-[9px] font-mono tracking-wider text-foreground-muted uppercase">Interaction</span>
            </div>
            <div className="flex flex-col items-center justify-center h-[calc(100%-36px)] md:h-[calc(100%-44px)] gap-2.5 md:gap-4">
                <div className="flex items-center gap-2.5 md:gap-4">
                    <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/60 uppercase w-9 md:w-12 text-right">Default</div>
                    <div className="px-3 md:px-6 py-1.5 md:py-2.5 rounded-md bg-surface-2 border border-border">
                        <div className="w-8 md:w-14 h-1.5 md:h-2 rounded-full bg-foreground/30" />
                    </div>
                </div>
                <div className="w-px h-2.5 md:h-4 bg-accent/40" />
                <div className="flex items-center gap-2.5 md:gap-4">
                    <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/60 uppercase w-9 md:w-12 text-right">Hover</div>
                    <div className="px-3 md:px-6 py-1.5 md:py-2.5 rounded-md bg-accent/20 border border-accent/40 shadow-[0_0_16px_var(--glow)]">
                        <div className="w-8 md:w-14 h-1.5 md:h-2 rounded-full bg-accent/70" />
                    </div>
                </div>
                <div className="w-px h-2.5 md:h-4 bg-accent/40" />
                <div className="flex items-center gap-2.5 md:gap-4">
                    <div className="text-[6px] md:text-[8px] font-mono text-foreground-muted/60 uppercase w-9 md:w-12 text-right">Active</div>
                    <div className="px-3 md:px-6 py-1.5 md:py-2.5 rounded-md bg-accent/30 border border-accent/50 scale-[0.97] shadow-[0_0_24px_var(--glow-strong)]">
                        <div className="w-8 md:w-14 h-1.5 md:h-2 rounded-full bg-accent" />
                    </div>
                </div>
                <svg className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-10 h-10 md:w-14 md:h-14 opacity-30" viewBox="0 0 40 40">
                    <path d="M5 35 Q20 5 35 20" fill="none" stroke="var(--accent)" strokeWidth="0.7" strokeDasharray="2 2" />
                    <circle cx="35" cy="20" r="2" fill="var(--accent)" />
                </svg>
            </div>
        </div>
    );
}

const THEM_MOCKUPS = [ThemMockup1, ThemMockup2, ThemMockup3];
const US_MOCKUPS = [UsMockup1, UsMockup2, UsMockup3];

/* ── Main Section ───────────────────────────────────── */

export function ComparisonSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<SVGLineElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !stickyRef.current) return;

        gsap.registerPlugin(DrawSVGPlugin);

        const section = sectionRef.current;
        const sticky = stickyRef.current;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        const sectionLabel = sticky.querySelector<HTMLElement>(".comp-section-label");

        if (sectionLabel) gsap.set(sectionLabel, { opacity: 0, y: 12 });

        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none none",
            },
        });

        /* ── Scrub timeline ── */
        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
            },
        });

        if (isMobile) {
            /* ═══ MOBILE ═══ */
            const mobileWrap = sticky.querySelector<HTMLElement>(".comp-mobile");
            if (!mobileWrap) return;
            const pairs = mobileWrap.querySelectorAll<HTMLElement>(".comp-pair");
            if (!pairs.length) return;

            pairs.forEach((p, i) => {
                gsap.set(p, {
                    zIndex: pairs.length - i,
                    clipPath: "inset(0 0 0 0)",
                });
            });

            gsap.set(mobileWrap, { opacity: 0, yPercent: 8 });

            mainTl.to(mobileWrap, {
                opacity: 1, yPercent: 0,
                duration: 0.18,
                ease: "none",
            }, 0);

            if (sectionLabel) {
                mainTl.fromTo(sectionLabel,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.12, ease: "none" },
                    0.04,
                );
            }

            for (let i = 0; i < pairs.length - 1; i++) {
                const transStart = 0.22 + i * 0.28;
                const transDur = 0.16;

                mainTl.to(pairs[i], {
                    clipPath: "inset(0 0 100% 0)",
                    duration: transDur,
                    ease: "none",
                }, transStart);
            }

            mainTl.to(mobileWrap, {
                scale: 0.95, opacity: 0, filter: "blur(4px)",
                duration: 0.12, ease: "none",
            }, 0.84);

            if (sectionLabel) {
                mainTl.to(sectionLabel, { opacity: 0, duration: 0.06, ease: "none" }, 0.84);
            }

        } else {
            /* ═══ DESKTOP ═══ */
            const leftScenes = sticky.querySelectorAll<HTMLElement>(".comp-left .comp-scene");
            const rightScenes = sticky.querySelectorAll<HTMLElement>(".comp-right .comp-scene");
            const leftPanel = sticky.querySelector<HTMLElement>(".comp-left");
            const rightPanel = sticky.querySelector<HTMLElement>(".comp-right");
            const headers = sticky.querySelector<HTMLElement>(".comp-headers");
            const dividerLine = dividerRef.current;

            const numScenes = Math.min(leftScenes.length, rightScenes.length);
            if (!numScenes || !leftPanel || !rightPanel) return;

            // Stack order: first scene on top, rest clipped below
            leftScenes.forEach((s, i) => {
                gsap.set(s, {
                    zIndex: leftScenes.length - i,
                    clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                });
            });
            rightScenes.forEach((s, i) => {
                gsap.set(s, {
                    zIndex: rightScenes.length - i,
                    clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                });
            });

            gsap.set(leftPanel, { clipPath: "inset(0 100% 0 0)" });
            gsap.set(rightPanel, { clipPath: "inset(0 0 0 100%)" });

            if (dividerLine) gsap.set(dividerLine, { drawSVG: "50% 50%" });
            if (headers) gsap.set(headers, { opacity: 0, y: 8 });

            // Entrance
            if (dividerLine) {
                entranceTl.to(dividerLine, {
                    drawSVG: "0% 100%",
                    duration: 1.2,
                    ease: EASES.brand,
                }, 0);
            }

            entranceTl.to(leftPanel, {
                clipPath: "inset(0 0% 0 0)",
                duration: DURATIONS.slow,
                ease: EASES.brand,
            }, 0.3);

            entranceTl.to(rightPanel, {
                clipPath: "inset(0 0 0 0%)",
                duration: DURATIONS.slow,
                ease: EASES.brand,
            }, 0.3);

            if (headers) {
                entranceTl.to(headers, {
                    opacity: 1, y: 0,
                    duration: DURATIONS.base,
                    ease: EASES.expo,
                }, 0.5);
            }

            // Scene transitions — current clips up to reveal next underneath
            for (let i = 0; i < numScenes - 1; i++) {
                const transStart = 0.22 + i * 0.28;
                const transDur = 0.16;

                // Unclip next scenes right before transition
                mainTl.set(leftScenes[i + 1], { clipPath: "inset(0 0 0 0)" }, transStart - 0.001);
                mainTl.set(rightScenes[i + 1], { clipPath: "inset(0 0 0 0)" }, transStart - 0.001);

                // Current scenes clip upward
                mainTl.to(leftScenes[i], { clipPath: "inset(0 0 100% 0)", duration: transDur, ease: "none" }, transStart);
                mainTl.to(rightScenes[i], { clipPath: "inset(0 0 100% 0)", duration: transDur, ease: "none" }, transStart);
            }

            // Exit
            const exitStart = 0.84;

            mainTl.to(leftPanel, {
                scale: 0.92, opacity: 0, filter: "blur(8px)",
                duration: 0.12, ease: "none",
            }, exitStart);

            if (dividerLine) {
                mainTl.to(dividerLine, { opacity: 0, duration: 0.08, ease: "none" }, exitStart);
            }

            if (sectionLabel) {
                mainTl.to(sectionLabel, { opacity: 0, y: -10, duration: 0.06, ease: "none" }, exitStart);
            }

            if (headers) {
                mainTl.to(headers, { opacity: 0, duration: 0.06, ease: "none" }, exitStart);
            }

            mainTl.to(rightPanel, {
                scale: 0.95, opacity: 0, filter: "blur(4px)",
                duration: 0.12, ease: "none",
            }, exitStart + 0.04);
        }

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative h-[300svh] bg-background">
            <div ref={stickyRef} className="sticky top-0 h-svh w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Ambient glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.72 0.15 295 / 0.025), transparent 70%)",
                    }}
                />

                {/* Section label */}
                <div className="comp-section-label absolute top-24 left-1/2 -translate-x-1/2 z-20 md:hidden">
                    <span className="text-label text-foreground-subtle">The difference</span>
                </div>

                {/* ═══ MOBILE layout ═══ */}
                <div className="comp-mobile md:hidden relative w-full h-full">
                    {COMPARISONS.map((comp, i) => {
                        const ThemMockup = THEM_MOCKUPS[i];
                        const UsMockup = US_MOCKUPS[i];
                        return (
                            <div key={`pair-${i}`}
                                 className="comp-pair absolute inset-0 flex flex-col justify-center px-5 pt-28 pb-6 gap-3 overflow-hidden bg-background">

                                <span className="text-index">{comp.index}</span>

                                {/* THEM */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-foreground-muted/60">THEM</span>
                                        <span className="text-sm text-foreground-muted font-medium">{comp.them.label}</span>
                                    </div>
                                    <ThemMockup />
                                </div>

                                {/* Divider */}
                                <div className="w-10 h-px bg-border-subtle mx-auto" />

                                {/* ORION */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-accent/80">ORION</span>
                                        <span className="text-sm text-foreground font-medium">{comp.us.label}</span>
                                    </div>
                                    <UsMockup />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ═══ DESKTOP layout ═══ */}
                <div className="comp-headers absolute top-24 left-0 right-0 z-20 hidden md:flex">
                    <div className="w-1/2 flex justify-center">
                        <span className="text-label text-foreground-muted tracking-[0.25em]">THEM</span>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <span className="text-label text-accent tracking-[0.25em]">ORION</span>
                    </div>
                </div>

                <div className="relative w-full h-full hidden md:flex">
                    {/* Left: THEM */}
                    <div className="comp-left w-1/2 h-full flex items-center justify-center relative"
                         style={{ transformOrigin: "center center" }}>
                        {COMPARISONS.map((comp, i) => {
                            const ThemMockup = THEM_MOCKUPS[i];
                            return (
                                <div key={`them-${i}`}
                                     className="comp-scene absolute inset-0 flex flex-col items-center justify-center px-6 lg:px-12 xl:px-16 pt-32 pb-8 bg-background">
                                    <div className="w-full max-w-[520px]">
                                        <span className="comp-index text-index block mb-3">{comp.index}</span>
                                        <div className="comp-mockup mb-4">
                                            <ThemMockup />
                                        </div>
                                        <h3 className="comp-them-label text-heading text-foreground-muted mb-1">{comp.them.label}</h3>
                                        <p className="comp-them-desc text-body-lg text-foreground-subtle max-w-[36ch]">
                                            {comp.them.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Divider */}
                    <div className="absolute left-1/2 top-[8%] bottom-[8%] -translate-x-1/2 z-10 pointer-events-none">
                        <svg className="w-px h-full overflow-visible" preserveAspectRatio="none">
                            <line
                                ref={dividerRef}
                                x1="0.5" y1="0"
                                x2="0.5" y2="100%"
                                stroke="var(--border-subtle)"
                                strokeWidth="1"
                            />
                        </svg>
                    </div>

                    {/* Right: ORION */}
                    <div className="comp-right w-1/2 h-full flex items-center justify-center relative"
                         style={{ transformOrigin: "center center" }}>
                        {COMPARISONS.map((comp, i) => {
                            const UsMockup = US_MOCKUPS[i];
                            return (
                                <div key={`us-${i}`}
                                     className="comp-scene absolute inset-0 flex flex-col items-center justify-center px-6 lg:px-12 xl:px-16 pt-32 pb-8 bg-background">
                                    <div className="w-full max-w-[520px]">
                                        <span className="comp-index text-index block mb-3 invisible">{comp.index}</span>
                                        <div className="comp-mockup mb-4">
                                            <UsMockup />
                                        </div>
                                        <h3 className="comp-us-label text-heading text-foreground mb-1">{comp.us.label}</h3>
                                        <p className="comp-us-desc text-body-lg text-foreground-muted max-w-[36ch]">
                                            {comp.us.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
