"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { MaskImage } from "@/components/motion/MaskImage";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";

/* ═══════════════════════════════════════════════════════════
   HARLOW & FINCH — Heritage Botanical Apothecary
   Case Study · Est. 1891 · Bloomsbury, London
   ═══════════════════════════════════════════════════════════ */

const HF = {
    ivory: "#F5F0E8",
    green: "#1A3A2A",
    greenLight: "#24503A",
    gold: "#C4A265",
    goldLight: "#D4B97A",
    charcoal: "#2D2D2D",
    sage: "#7A8B6F",
    parchment: "#E8DFD0",
    amber: "#3D2B1F",
};

const palette = [
    { name: "Warm Ivory", hex: HF.ivory, dark: false },
    { name: "Botanical Green", hex: HF.green, dark: true },
    { name: "Aged Gold", hex: HF.gold, dark: false },
    { name: "Charcoal", hex: HF.charcoal, dark: true },
    { name: "Sage", hex: HF.sage, dark: false },
    { name: "Parchment", hex: HF.parchment, dark: false },
];

const services = [
    "Brand Revival",
    "Visual Identity",
    "E-Commerce Platform",
    "Storytelling Microsite",
    "AR Experience",
    "Editorial Engine",
];

const metrics = [
    { value: "340%", label: "Increase in online orders" },
    { value: "28K", label: "Newsletter subscribers in Q1" },
    { value: "4.8", label: "Average product rating", suffix: "\u2605" },
    { value: "2.4s", label: "Average page load time" },
];

const press = ["Vogue Living", "Monocle", "Kinfolk", "It\u2019s Nice That"];

const products = [
    { name: "Lavender & Chamomile Tincture", price: "\u00a338", color: `linear-gradient(135deg, ${HF.sage}40, ${HF.green}30)` },
    { name: "Wild Rose & Elderflower Elixir", price: "\u00a342", color: `linear-gradient(135deg, ${HF.gold}40, ${HF.amber}30)` },
    { name: "Woodland Sage Balm", price: "\u00a328", color: `linear-gradient(135deg, ${HF.green}30, ${HF.sage}40)` },
];

/* ── Serif font helper ── */
const serif = { fontFamily: "var(--font-playfair), Georgia, 'Times New Roman', serif" };

/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */

export default function HarlowFinchPage() {
    const heroRef = useRef<HTMLElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);
    const mockupRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    /* ── Hero entrance ── */
    useGSAP(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline({ delay: 0.4 });

        tl.from(".hf-hero-line", {
            scaleY: 0,
            duration: 1.2,
            ease: EASES.expo,
        });

        tl.from(".hf-hero-brand", {
            opacity: 0,
            y: 80,
            duration: 1.4,
            ease: EASES.brand,
        }, "-=0.7");

        tl.from(".hf-hero-tagline", {
            opacity: 0,
            y: 40,
            duration: DURATIONS.slow,
            ease: EASES.brand,
        }, "-=0.8");

        tl.from(".hf-hero-meta > *", {
            opacity: 0,
            y: 20,
            stagger: STAGGER.base,
            duration: DURATIONS.base,
            ease: EASES.brand,
        }, "-=0.5");

        tl.from(".hf-hero-tags > *", {
            opacity: 0,
            y: 16,
            stagger: STAGGER.tight,
            duration: DURATIONS.fast,
            ease: EASES.brand,
        }, "-=0.3");
    }, { scope: heroRef });

    /* ── Brand identity entrance ── */
    useGSAP(() => {
        if (!brandRef.current) return;

        gsap.from(".hf-palette-item", {
            opacity: 0,
            y: 32,
            scale: 0.9,
            stagger: STAGGER.base,
            duration: DURATIONS.base,
            ease: EASES.brand,
            scrollTrigger: {
                trigger: brandRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: brandRef });

    /* ── Mockup entrance ── */
    useGSAP(() => {
        if (!mockupRef.current) return;

        gsap.fromTo(
            mockupRef.current,
            { clipPath: "inset(8% 8% 8% 8%)", scale: 1.04 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.6,
                ease: EASES.brandInOut,
                scrollTrigger: {
                    trigger: mockupRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, { scope: mockupRef });

    /* ── Metrics counter ── */
    useGSAP(() => {
        if (!metricsRef.current) return;

        gsap.from(".hf-metric", {
            opacity: 0,
            y: 48,
            stagger: STAGGER.loose,
            duration: DURATIONS.slow,
            ease: EASES.brand,
            scrollTrigger: {
                trigger: metricsRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: metricsRef });

    return (
        <main className="relative bg-background overflow-hidden">

            {/* ═══════════════════════════════════════
                HERO
               ═══════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
                style={{
                    background: `
                        radial-gradient(ellipse 70% 50% at 50% 35%, ${HF.green}18, transparent 70%),
                        radial-gradient(ellipse 50% 70% at 30% 65%, ${HF.gold}08, transparent 60%),
                        var(--background)
                    `,
                }}
            >
                {/* Decorative vertical line */}
                <div
                    className="hf-hero-line absolute top-[12vh] left-1/2 -translate-x-1/2 w-px h-[14vh] origin-top"
                    style={{ background: `linear-gradient(to bottom, ${HF.gold}50, transparent)` }}
                />

                <div className="relative z-10 text-center px-6 space-y-8 max-w-4xl">
                    <div className="hf-hero-meta flex items-center justify-center gap-6 text-foreground-muted">
                        <span className="text-index">2025</span>
                        <span className="w-1 h-1 rounded-full bg-foreground-subtle" />
                        <span className="text-index">Brand Revival &middot; Digital Platform</span>
                    </div>

                    <h1
                        className="hf-hero-brand text-[clamp(3.5rem,9vw,9rem)] leading-[0.88] tracking-[-0.03em] font-light"
                        style={serif}
                    >
                        Harlow <span style={{ color: HF.gold }}>&amp;</span> Finch
                    </h1>

                    <p className="hf-hero-tagline text-editorial !text-foreground-muted/70 max-w-[44ch] mx-auto">
                        A 133-year-old botanical apothecary, reimagined for the modern world.
                    </p>

                    <div className="hf-hero-tags flex flex-wrap items-center justify-center gap-3 pt-4">
                        {services.map((s) => (
                            <span
                                key={s}
                                className="px-3 py-1.5 rounded-full border border-border text-[0.625rem] uppercase tracking-[0.15em] text-foreground-muted"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom decorative line */}
                <div
                    className="hf-hero-line absolute bottom-[6vh] left-1/2 -translate-x-1/2 w-px h-[8vh] origin-bottom"
                    style={{ background: `linear-gradient(to top, ${HF.gold}35, transparent)` }}
                />
            </section>

            {/* ═══════════════════════════════════════
                THE CHALLENGE
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-4 space-y-6">
                            <span className="text-index text-foreground-subtle">01 — The Challenge</span>
                            <TextReveal as="h2" type="words" className="text-heading">
                                Heritage is not a museum piece
                            </TextReveal>
                        </div>

                        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.1}>
                                When Eleanor Harlow discovered her great-grandmother&apos;s handwritten
                                remedy journals in the attic of their shuttered Bloomsbury shop, she knew
                                the recipes deserved more than a museum shelf.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                                But how do you translate 133 years of tactile, aromatic legacy into pixels
                                and clicks without losing the soul? How do you bottle — digitally — the
                                smell of century-old dried lavender and the texture of hand-pressed labels?
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-editorial !text-foreground-muted/60" delay={0.3}>
                                That was the question Eleanor brought to us.
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                ATMOSPHERIC IMAGE
               ═══════════════════════════════════════ */}
            <section className="section-container">
                <MaskImage
                    src="https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1800&h=1000&fit=crop&q=80"
                    alt="Botanical laboratory — vintage glass vessels and dried herbs"
                    aspect="21/9"
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            {/* ═══════════════════════════════════════
                OUR APPROACH
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-4 space-y-6">
                            <span className="text-index text-foreground-subtle">02 — Our Approach</span>
                            <TextReveal as="h2" type="words" className="text-heading">
                                Excavating a world, not designing one
                            </TextReveal>
                        </div>

                        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.1}>
                                We spent three weeks in the original shop on Lamb&apos;s Conduit Street.
                                We photographed faded labels, studied the patina on brass scales, and
                                traced Margaret Harlow&apos;s precise handwriting across 47 remedy journals.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                                Every digital decision was rooted in a physical artefact. The colour palette
                                came from oxidised brass and dried botanicals. The typography echoed
                                hand-lettered apothecary signs from the 1890s. Nothing was assumed;
                                everything was excavated.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.3}>
                                We then partnered with herbalist Daniel Finch to validate every recipe for
                                modern use, creating a bridge between Victorian-era wisdom and contemporary
                                wellness — the brand&apos;s beating heart.
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                BRAND IDENTITY SYSTEM
               ═══════════════════════════════════════ */}
            <section className="section-py" style={{ background: `linear-gradient(180deg, transparent, ${HF.green}06 30%, ${HF.green}06 70%, transparent)` }}>
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="space-y-6 mb-20 lg:mb-28">
                        <span className="text-index text-foreground-subtle">03 — Brand Identity</span>
                        <TextReveal as="h2" type="words" className="text-title">
                            A visual language rooted in remedy
                        </TextReveal>
                    </div>

                    {/* ── The Wordmark ── */}
                    <div className="mb-24 lg:mb-32">
                        <span className="text-label text-foreground-subtle mb-8 block">The Wordmark</span>

                        <div className="flex flex-col items-center gap-16">
                            {/* Light variant */}
                            <div
                                className="w-full rounded-xl p-16 lg:p-24 flex flex-col items-center justify-center text-center"
                                style={{ background: HF.ivory }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em] font-normal"
                                    style={{ ...serif, color: HF.green }}
                                >
                                    Harlow <span style={{ color: HF.gold }}>&amp;</span> Finch
                                </p>
                                <p
                                    className="mt-4 text-[0.65rem] uppercase tracking-[0.4em]"
                                    style={{ color: HF.sage }}
                                >
                                    Botanical Apothecary &middot; Est. 1891
                                </p>
                            </div>

                            {/* Dark variant */}
                            <div
                                className="w-full rounded-xl p-16 lg:p-24 flex flex-col items-center justify-center text-center"
                                style={{ background: HF.green }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em] font-normal"
                                    style={{ ...serif, color: HF.ivory }}
                                >
                                    Harlow <span style={{ color: HF.gold }}>&amp;</span> Finch
                                </p>
                                <p
                                    className="mt-4 text-[0.65rem] uppercase tracking-[0.4em]"
                                    style={{ color: HF.sage }}
                                >
                                    Botanical Apothecary &middot; Est. 1891
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Colour Palette ── */}
                    <div ref={brandRef} className="mb-24 lg:mb-32">
                        <span className="text-label text-foreground-subtle mb-8 block">Colour Palette</span>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {palette.map((c) => (
                                <div key={c.hex} className="hf-palette-item space-y-3">
                                    <div
                                        className="aspect-[4/3] rounded-lg border border-border-subtle"
                                        style={{ background: c.hex }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                                        <p className="text-index text-foreground-muted font-mono">{c.hex}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Typography ── */}
                    <div>
                        <span className="text-label text-foreground-subtle mb-8 block">Typography</span>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Display */}
                            <div className="space-y-4 p-8 rounded-xl border border-border-subtle bg-surface-1">
                                <p className="text-index text-foreground-subtle">Display — Playfair Display</p>
                                <p
                                    className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.02em]"
                                    style={serif}
                                >
                                    Rooted in Remedy
                                </p>
                                <p className="text-sm text-foreground-muted leading-relaxed" style={serif}>
                                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                                </p>
                                <p className="text-sm text-foreground-muted font-mono" style={serif}>
                                    0123456789 &amp; .,:;!?
                                </p>
                            </div>

                            {/* Body */}
                            <div className="space-y-4 p-8 rounded-xl border border-border-subtle bg-surface-1">
                                <p className="text-index text-foreground-subtle">Body — Space Grotesk</p>
                                <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.4]">
                                    Botanical wellness, crafted for the modern world
                                </p>
                                <p className="text-sm text-foreground-muted leading-relaxed">
                                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                                </p>
                                <p className="text-sm text-foreground-muted font-mono">
                                    0123456789 &amp; .,:;!?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                WEBSITE PREVIEW — "The Showstopper"
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <div className="space-y-6 mb-16 lg:mb-24">
                        <span className="text-index text-foreground-subtle">04 — The Digital Platform</span>
                        <TextReveal as="h2" type="words" className="text-title">
                            A digital home as rich as the physical one
                        </TextReveal>
                        <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[52ch]" delay={0.15}>
                            Headless e-commerce built on Shopify Hydrogen, with a storytelling-first
                            architecture that puts heritage and provenance at every touchpoint.
                        </TextReveal>
                    </div>

                    {/* ── Browser Frame ── */}
                    <div
                        ref={mockupRef}
                        className="rounded-xl lg:rounded-2xl overflow-hidden border border-border-subtle shadow-2xl"
                        style={{ clipPath: "inset(8% 8% 8% 8%)" }}
                    >
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: HF.charcoal, borderColor: `${HF.charcoal}80` }}>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="max-w-sm mx-auto rounded-md px-3 py-1 text-center text-[0.6rem] tracking-wider text-white/40" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    harlowandfinch.com
                                </div>
                            </div>
                        </div>

                        {/* ── Rendered Website Content ── */}
                        <div style={{ background: HF.ivory, color: HF.green }}>

                            {/* Fictional Nav */}
                            <nav className="flex items-center justify-between px-6 lg:px-12 py-5 border-b" style={{ borderColor: `${HF.green}12` }}>
                                <p className="text-lg tracking-[-0.01em] font-medium" style={serif}>
                                    H<span style={{ color: HF.gold }}>&amp;</span>F
                                </p>
                                <div className="hidden md:flex items-center gap-8 text-[0.7rem] uppercase tracking-[0.15em]" style={{ color: HF.sage }}>
                                    <span>Shop</span>
                                    <span>Our Story</span>
                                    <span>The Journal</span>
                                    <span>Find Us</span>
                                </div>
                                <div className="flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.15em]" style={{ color: HF.sage }}>
                                    <span>Bag (0)</span>
                                </div>
                            </nav>

                            {/* Fictional Hero */}
                            <div className="relative px-6 lg:px-12 py-24 lg:py-40 text-center">
                                {/* Decorative top flourish */}
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <div className="w-12 h-px" style={{ background: HF.gold }} />
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={HF.gold} />
                                    </svg>
                                    <div className="w-12 h-px" style={{ background: HF.gold }} />
                                </div>

                                <p className="text-[0.65rem] uppercase tracking-[0.35em] mb-6" style={{ color: HF.sage }}>
                                    Est. 1891 &middot; Bloomsbury, London
                                </p>

                                <h2
                                    className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.02em] font-normal mb-6"
                                    style={{ ...serif, color: HF.green }}
                                >
                                    Rooted in<br />Remedy
                                </h2>

                                <p className="text-base lg:text-lg leading-relaxed max-w-md mx-auto mb-10" style={{ color: HF.sage }}>
                                    Botanical wellness crafted from 133 years of
                                    hand-blended wisdom. Every drop tells a story.
                                </p>

                                <button
                                    className="inline-block px-8 py-3.5 text-[0.65rem] uppercase tracking-[0.2em] rounded-full border transition-colors cursor-default"
                                    style={{
                                        borderColor: HF.green,
                                        color: HF.green,
                                        background: "transparent",
                                    }}
                                >
                                    Explore the Collection
                                </button>

                                {/* Bottom flourish */}
                                <div className="flex items-center justify-center gap-4 mt-12">
                                    <div className="w-8 h-px" style={{ background: `${HF.gold}60` }} />
                                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={`${HF.gold}60`} />
                                    </svg>
                                    <div className="w-8 h-px" style={{ background: `${HF.gold}60` }} />
                                </div>
                            </div>

                            {/* Fictional Product Grid */}
                            <div className="px-6 lg:px-12 py-16 lg:py-24" style={{ background: HF.parchment }}>
                                <div className="text-center mb-12">
                                    <p className="text-[0.65rem] uppercase tracking-[0.3em] mb-3" style={{ color: HF.sage }}>
                                        Handcrafted
                                    </p>
                                    <h3
                                        className="text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.01em]"
                                        style={{ ...serif, color: HF.green }}
                                    >
                                        The Remedy Collection
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                    {products.map((p) => (
                                        <div key={p.name} className="group cursor-default">
                                            <div
                                                className="aspect-[3/4] rounded-lg mb-4 flex items-end justify-center pb-6"
                                                style={{ background: p.color }}
                                            >
                                                {/* Stylised bottle silhouette */}
                                                <svg width="40" height="80" viewBox="0 0 40 80" fill="none" opacity={0.25}>
                                                    <rect x="14" y="0" width="12" height="12" rx="2" stroke={HF.green} strokeWidth="1.5" />
                                                    <path d="M14 12 C14 20 8 28 8 36 L8 72 C8 76 12 80 20 80 C28 80 32 76 32 72 L32 36 C32 28 26 20 26 12" stroke={HF.green} strokeWidth="1.5" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium mb-1" style={{ color: HF.green }}>{p.name}</p>
                                            <p className="text-sm" style={{ color: HF.sage }}>{p.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fictional Story Teaser */}
                            <div className="px-6 lg:px-12 py-16 lg:py-24 text-center">
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] mb-6" style={{ color: HF.sage }}>
                                    The Remedy Journal
                                </p>
                                <h3
                                    className="text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.01em] mb-4 italic"
                                    style={{ ...serif, color: HF.green }}
                                >
                                    &ldquo;The Lost Art of Botanical Wellness&rdquo;
                                </h3>
                                <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: HF.sage }}>
                                    In 1891, Margaret Harlow believed that every ailment had a botanical
                                    answer. A century later, science is proving her right.
                                </p>
                                <p className="mt-6 text-[0.65rem] uppercase tracking-[0.2em] underline underline-offset-4" style={{ color: HF.green }}>
                                    Read the story
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECOND ATMOSPHERIC IMAGE
               ═══════════════════════════════════════ */}
            <section className="section-container">
                <MaskImage
                    src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1800&h=1000&fit=crop&q=80"
                    alt="Dried botanicals and heritage ingredients"
                    aspect="21/9"
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            {/* ═══════════════════════════════════════
                RESULTS
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="space-y-6 mb-20 lg:mb-28">
                        <span className="text-index text-foreground-subtle">05 — Results</span>
                        <TextReveal as="h2" type="words" className="text-title">
                            Heritage meets growth
                        </TextReveal>
                    </div>

                    {/* Metrics */}
                    <div ref={metricsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-28">
                        {metrics.map((m) => (
                            <div key={m.label} className="hf-metric space-y-3">
                                <span className="text-metric" style={{ color: HF.gold }}>
                                    {m.value}
                                    {m.suffix && <span className="text-[0.5em]">{m.suffix}</span>}
                                </span>
                                <p className="text-sm text-foreground-muted leading-relaxed">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Press & Awards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <div className="space-y-6">
                            <span className="text-label text-foreground-subtle">Featured In</span>
                            <div className="flex flex-wrap gap-4">
                                {press.map((p) => (
                                    <span
                                        key={p}
                                        className="px-5 py-2.5 rounded-full border border-border text-sm text-foreground-muted"
                                        style={serif}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <span className="text-label text-foreground-subtle">Recognition</span>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 1L12.5 7L19 7.5L14 12L15.5 19L10 15.5L4.5 19L6 12L1 7.5L7.5 7L10 1Z" fill={HF.gold} />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Best Heritage Brand Revival</p>
                                        <p className="text-index text-foreground-muted">Brand New Awards 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 1L12.5 7L19 7.5L14 12L15.5 19L10 15.5L4.5 19L6 12L1 7.5L7.5 7L10 1Z" fill={HF.gold} />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Site of the Day</p>
                                        <p className="text-index text-foreground-muted">Awwwards &middot; March 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                TESTIMONIAL
               ═══════════════════════════════════════ */}
            <section
                className="section-py overflow-hidden"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 50% at 50% 50%, ${HF.green}08, transparent 70%),
                        linear-gradient(180deg, transparent, ${HF.gold}04 50%, transparent)
                    `,
                }}
            >
                <div className="section-container text-center max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="w-12 h-px" style={{ background: `${HF.gold}40` }} />
                        <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={`${HF.gold}60`} />
                        </svg>
                        <div className="w-12 h-px" style={{ background: `${HF.gold}40` }} />
                    </div>

                    <div style={serif}>
                        <TextReveal
                            as="blockquote"
                            type="lines"
                            className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.4] tracking-[-0.01em] font-light italic text-foreground/80"
                        >
                            &ldquo;Orion didn&apos;t just design a website — they excavated a world.
                            Every pixel feels like it was always there, waiting to be found.&rdquo;
                        </TextReveal>
                    </div>

                    <div className="mt-10 space-y-1">
                        <p className="text-sm font-medium text-foreground">Eleanor Harlow</p>
                        <p className="text-index text-foreground-muted">Founder, Harlow &amp; Finch</p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                CTA — NEXT PROJECT
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <span className="text-index text-foreground-subtle">Next project</span>
                            <TextReveal as="h2" type="words" className="text-title">
                                Your project could be next
                            </TextReveal>
                            <TextReveal
                                as="p"
                                type="lines"
                                className="text-body-lg text-foreground-muted max-w-[44ch]"
                                delay={0.15}
                            >
                                We partner with teams that care about quality as much as we do.
                                Let&apos;s talk about what you&apos;re building.
                            </TextReveal>
                        </div>

                        <Link
                            href="/contact"
                            className="group relative inline-block px-10 py-4 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500 overflow-hidden shrink-0"
                        >
                            <span className="relative z-10">Start a project</span>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
