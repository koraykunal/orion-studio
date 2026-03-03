"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { MaskImage } from "@/components/motion/MaskImage";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";

/* ═══════════════════════════════════════════════════════════
   FORMA — Contemporary Ceramics & Objects
   Case Study · Copenhagen · Est. 2022

   Design philosophy: gallery-like restraint. Warm neutrals,
   generous whitespace, let the craft speak.
   ═══════════════════════════════════════════════════════════ */

const FM = {
    canvas: "#FAF8F5",
    stone: "#E8E3DC",
    earth: "#C67B5C",
    earthDeep: "#A85D3F",
    ink: "#1A1A1A",
    graphite: "#6B6B6B",
    chalk: "#FFFFFF",
    border: "#E0DAD2",
    borderLight: "#F0ECE6",
};

const palette = [
    { name: "Canvas", hex: FM.canvas, dark: false },
    { name: "Stone", hex: FM.stone, dark: false },
    { name: "Earth", hex: FM.earth, dark: false },
    { name: "Ink", hex: FM.ink, dark: true },
    { name: "Graphite", hex: FM.graphite, dark: true },
    { name: "Chalk", hex: FM.chalk, dark: false },
];

const services = [
    "Brand Identity",
    "E-Commerce Platform",
    "Editorial Design",
    "360\u00b0 Product Viewer",
    "Art Direction",
];

const metrics = [
    { value: "280%", label: "Increase in gallery partnership inquiries" },
    { value: "\u20ac1.2M", label: "Online store revenue in year one" },
    { value: "14", label: "Museum exhibitions featuring the brand" },
    { value: "46s", label: "Average time on product pages" },
];

const products = [
    { name: "Tsuki Bowl", price: "\u20ac180", shape: "bowl" },
    { name: "Onda Vase", price: "\u20ac320", shape: "vase" },
    { name: "Sabi Tea Set", price: "\u20ac470", shape: "set" },
];

const journal = [
    { title: "The Space Between: On Wabi-Sabi and Modern Form", tag: "Essay" },
    { title: "A Week in Tokoname \u2014 Studio Diary", tag: "Journal" },
    { title: "Earth, Water, Fire: Material as Memory", tag: "Process" },
];

/* ── Ceramic silhouettes ── */
function CeramicShape({ shape, color }: { shape: string; color: string }) {
    if (shape === "bowl") {
        return (
            <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
                <path d="M10 25 C10 25 20 70 60 70 C100 70 110 25 110 25" stroke={color} strokeWidth="1.5" fill="none" />
                <ellipse cx="60" cy="25" rx="50" ry="8" stroke={color} strokeWidth="1.5" fill={`${color}08`} />
            </svg>
        );
    }
    if (shape === "vase") {
        return (
            <svg viewBox="0 0 80 120" fill="none" className="w-full h-full">
                <path d="M32 10 C32 10 30 15 30 20 C30 25 22 40 18 55 C14 70 16 95 20 105 C24 112 56 112 60 105 C64 95 66 70 62 55 C58 40 50 25 50 20 C50 15 48 10 48 10" stroke={color} strokeWidth="1.5" fill={`${color}06`} />
                <ellipse cx="40" cy="10" rx="8" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
            <path d="M15 45 C15 25 25 15 35 15 C40 15 42 20 42 25 L42 50" stroke={color} strokeWidth="1.5" fill={`${color}06`} />
            <ellipse cx="28" cy="50" rx="14" ry="5" stroke={color} strokeWidth="1.5" fill="none" />
            <path d="M65 40 C65 22 78 12 90 22 C95 27 92 40 85 45" stroke={color} strokeWidth="1.5" fill={`${color}06`} />
            <rect x="60" y="40" width="35" height="3" rx="1.5" stroke={color} strokeWidth="1" fill="none" />
        </svg>
    );
}

/* serif helper — reuse Playfair from layout */
const serif = { fontFamily: "var(--font-playfair), Georgia, serif" };

/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */

export default function FormaPage() {
    const heroRef = useRef<HTMLElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);
    const mockupRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    /* ── Hero ── */
    useGSAP(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline({ delay: 0.4 });

        tl.from(".fm-hero-label", {
            opacity: 0,
            x: -30,
            duration: DURATIONS.slow,
            ease: EASES.brand,
        });

        tl.from(".fm-hero-title", {
            opacity: 0,
            y: 60,
            duration: 1.2,
            ease: EASES.brand,
        }, "-=0.6");

        tl.from(".fm-hero-tagline", {
            opacity: 0,
            y: 30,
            duration: DURATIONS.slow,
            ease: EASES.brand,
        }, "-=0.6");

        tl.from(".fm-hero-meta > *", {
            opacity: 0,
            y: 16,
            stagger: STAGGER.base,
            duration: DURATIONS.base,
            ease: EASES.brand,
        }, "-=0.3");
    }, { scope: heroRef });

    /* ── Brand palette ── */
    useGSAP(() => {
        if (!brandRef.current) return;

        gsap.from(".fm-palette-item", {
            opacity: 0,
            y: 24,
            stagger: STAGGER.tight,
            duration: DURATIONS.base,
            ease: EASES.brand,
            scrollTrigger: {
                trigger: brandRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: brandRef });

    /* ── Mockup ── */
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

    /* ── Metrics ── */
    useGSAP(() => {
        if (!metricsRef.current) return;

        gsap.from(".fm-metric", {
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
                HERO — Editorial, asymmetric
               ═══════════════════════════════════════ */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-end overflow-hidden pb-20 lg:pb-28"
            >
                {/* Warm ambient wash */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 60% 50% at 70% 30%, ${FM.earth}06, transparent 70%)`,
                    }}
                />

                <div className="relative z-10 section-container w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
                        {/* Left — Brand name */}
                        <div className="lg:col-span-8 space-y-6">
                            <span className="fm-hero-label text-index text-foreground-subtle block">
                                2024 &middot; Brand + E-Commerce + Editorial
                            </span>

                            <h1
                                className="fm-hero-title text-[clamp(4rem,12vw,12rem)] leading-[0.88] tracking-[-0.04em] font-light"
                                style={serif}
                            >
                                <span style={{ color: FM.earth }}>F</span>orma
                            </h1>

                            <p className="fm-hero-tagline text-editorial !text-foreground-muted/60 max-w-[42ch]">
                                Where form follows feeling. Contemporary ceramics
                                from Copenhagen, rooted in Japanese craft.
                            </p>
                        </div>

                        {/* Right — Services */}
                        <div className="lg:col-span-3 lg:col-start-10">
                            <div className="fm-hero-meta space-y-3">
                                {services.map((s) => (
                                    <span
                                        key={s}
                                        className="block text-[0.625rem] uppercase tracking-[0.15em] text-foreground-muted"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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
                                Translating touch to screen
                            </TextReveal>
                        </div>

                        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.1}>
                                Yuki Moretti&apos;s ceramics are meant to be held. The weight of a tea bowl
                                in your palms, the way a glaze catches morning light, the slight asymmetry
                                that proves a human hand was here — none of that translates to a flat screen.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                                She needed a digital presence that didn&apos;t compete with the objects.
                                A space so quiet that the work could breathe. Not a website that
                                sells ceramics — a gallery you happen to be able to buy from.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-editorial !text-foreground-muted/60" delay={0.3}>
                                &ldquo;Make the screen disappear.&rdquo;
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
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1800&h=1000&fit=crop&q=80"
                    alt="Handmade ceramic vessels in a sunlit studio"
                    aspect="21/9"
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            {/* ═══════════════════════════════════════
                APPROACH
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-4 space-y-6">
                            <span className="text-index text-foreground-subtle">02 — Approach</span>
                            <TextReveal as="h2" type="words" className="text-heading">
                                Silence as design language
                            </TextReveal>
                        </div>

                        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.1}>
                                We spent a week in Yuki&apos;s Nordhavn studio, watching her work. No
                                briefs, no moodboards — just observation. We noticed: she never fills
                                a shelf completely. There&apos;s always space around each piece. That
                                became our design principle.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                                Every pixel of whitespace is intentional. The colour palette was mixed
                                from photographs of her raw materials — Shigaraki clay, kiln ash,
                                Copenhagen sandstone. The typography steps back: clean, almost invisible,
                                so the eye goes to the object, not the label.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.3}>
                                We built a 360° product viewer that lets you rotate each piece as if
                                turning it in your hands — the closest a screen can get to touch.
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                BRAND IDENTITY
               ═══════════════════════════════════════ */}
            <section
                className="section-py"
                style={{ background: `linear-gradient(180deg, transparent, ${FM.earth}04 30%, ${FM.earth}04 70%, transparent)` }}
            >
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="space-y-6 mb-20 lg:mb-28">
                        <span className="text-index text-foreground-subtle">03 — Identity</span>
                        <TextReveal as="h2" type="words" className="text-title">
                            Form reduced to essence
                        </TextReveal>
                    </div>

                    {/* ── The Wordmark ── */}
                    <div className="mb-24 lg:mb-32">
                        <span className="text-label text-foreground-subtle mb-8 block">The Wordmark</span>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Light — primary */}
                            <div
                                className="rounded-xl p-16 lg:p-20 flex flex-col items-center justify-center text-center"
                                style={{ background: FM.canvas, border: `1px solid ${FM.border}` }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.03em] font-light"
                                    style={{ ...serif, color: FM.ink }}
                                >
                                    <span style={{ color: FM.earth }}>F</span>orma
                                </p>
                                <p className="mt-4 text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: FM.graphite }}>
                                    Ceramics &amp; Objects &middot; Copenhagen
                                </p>
                            </div>

                            {/* Dark — reverse */}
                            <div
                                className="rounded-xl p-16 lg:p-20 flex flex-col items-center justify-center text-center"
                                style={{ background: FM.ink }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.03em] font-light"
                                    style={{ ...serif, color: FM.canvas }}
                                >
                                    <span style={{ color: FM.earth }}>F</span>orma
                                </p>
                                <p className="mt-4 text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: FM.graphite }}>
                                    Reverse Application
                                </p>
                            </div>

                            {/* Earth tone — brand */}
                            <div
                                className="rounded-xl p-16 lg:p-20 flex flex-col items-center justify-center text-center"
                                style={{ background: FM.stone }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.03em] font-light"
                                    style={{ ...serif, color: FM.earthDeep }}
                                >
                                    Forma
                                </p>
                                <p className="mt-4 text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: FM.graphite }}>
                                    Tonal Application
                                </p>
                            </div>

                            {/* Minimal — just the F mark */}
                            <div
                                className="rounded-xl p-16 lg:p-20 flex flex-col items-center justify-center text-center"
                                style={{ background: FM.chalk, border: `1px solid ${FM.border}` }}
                            >
                                <p
                                    className="text-[clamp(4rem,8vw,7rem)] leading-[0.85] tracking-[-0.02em] font-light"
                                    style={{ ...serif, color: FM.earth }}
                                >
                                    F
                                </p>
                                <p className="mt-4 text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: FM.graphite }}>
                                    Monogram &mdash; Mark
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Colour Palette ── */}
                    <div ref={brandRef} className="mb-24 lg:mb-32">
                        <span className="text-label text-foreground-subtle mb-8 block">Colour Palette</span>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {palette.map((c) => (
                                <div key={c.hex} className="fm-palette-item space-y-3">
                                    <div
                                        className="aspect-[4/3] rounded-lg"
                                        style={{
                                            background: c.hex,
                                            border: `1px solid ${c.dark ? "transparent" : FM.border}`,
                                        }}
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4 p-8 rounded-xl border border-border-subtle bg-surface-1">
                                <p className="text-index text-foreground-subtle">Display — Playfair Display Light</p>
                                <p
                                    className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.03em] font-light"
                                    style={serif}
                                >
                                    Where Form Follows Feeling
                                </p>
                                <p className="text-sm text-foreground-muted" style={serif}>
                                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn
                                </p>
                            </div>

                            <div className="space-y-4 p-8 rounded-xl border border-border-subtle bg-surface-1">
                                <p className="text-index text-foreground-subtle">Body — Space Grotesk</p>
                                <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.5]">
                                    Handmade ceramics rooted in wabi-sabi
                                </p>
                                <p className="text-sm text-foreground-muted">
                                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                WEBSITE PREVIEW — Light, gallery-like
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <div className="space-y-6 mb-16 lg:mb-24">
                        <span className="text-index text-foreground-subtle">04 — The Digital Gallery</span>
                        <TextReveal as="h2" type="words" className="text-title">
                            A screen that disappears
                        </TextReveal>
                        <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[52ch]" delay={0.15}>
                            Headless e-commerce on Shopify Hydrogen with 360° product viewer,
                            editorial journal, and gallery partnership portal. Every detail
                            calibrated to let the ceramics speak.
                        </TextReveal>
                    </div>

                    {/* ── Browser Frame ── */}
                    <div
                        ref={mockupRef}
                        className="rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            border: `1px solid var(--border-subtle)`,
                            clipPath: "inset(8% 8% 8% 8%)",
                        }}
                    >
                        {/* Browser chrome — light */}
                        <div
                            className="flex items-center gap-2 px-4 py-3"
                            style={{ background: FM.stone, borderBottom: `1px solid ${FM.border}` }}
                        >
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: FM.earth }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${FM.ink}10` }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${FM.ink}10` }} />
                            </div>
                            <div className="flex-1 mx-4">
                                <div
                                    className="max-w-sm mx-auto rounded-md px-3 py-1 text-center text-[0.6rem] tracking-wider"
                                    style={{ background: `${FM.ink}06`, color: FM.graphite }}
                                >
                                    formaceramics.com
                                </div>
                            </div>
                        </div>

                        {/* ── Rendered FORMA Website ── */}
                        <div style={{ background: FM.canvas, color: FM.ink }}>

                            {/* Nav */}
                            <nav
                                className="flex items-center justify-between px-6 lg:px-12 py-5"
                                style={{ borderBottom: `1px solid ${FM.borderLight}` }}
                            >
                                <p
                                    className="text-xl tracking-[-0.02em] font-light"
                                    style={serif}
                                >
                                    <span style={{ color: FM.earth }}>F</span>orma
                                </p>
                                <div
                                    className="hidden md:flex items-center gap-8 text-[0.65rem] uppercase tracking-[0.15em]"
                                    style={{ color: FM.graphite }}
                                >
                                    <span>Objects</span>
                                    <span>Studio</span>
                                    <span>Journal</span>
                                    <span>Stockists</span>
                                </div>
                                <div
                                    className="text-[0.65rem] uppercase tracking-[0.15em]"
                                    style={{ color: FM.graphite }}
                                >
                                    Cart (0)
                                </div>
                            </nav>

                            {/* Hero — large text, minimal */}
                            <div className="px-6 lg:px-12 py-24 lg:py-36 text-center">
                                <p
                                    className="text-[0.6rem] uppercase tracking-[0.4em] mb-8"
                                    style={{ color: FM.graphite }}
                                >
                                    New Collection &middot; Autumn 2025
                                </p>

                                <h2
                                    className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.0] tracking-[-0.03em] font-light mb-8"
                                    style={{ ...serif, color: FM.ink }}
                                >
                                    Where Form<br />Follows Feeling
                                </h2>

                                <p
                                    className="text-base leading-relaxed max-w-sm mx-auto mb-10"
                                    style={{ color: FM.graphite }}
                                >
                                    Handmade ceramics and objects from our Copenhagen
                                    studio. Each piece shaped by hand, fired in small batches.
                                </p>

                                <span
                                    className="inline-block px-8 py-3 text-[0.6rem] uppercase tracking-[0.2em] cursor-default"
                                    style={{
                                        border: `1px solid ${FM.ink}`,
                                        color: FM.ink,
                                        borderRadius: "0",
                                    }}
                                >
                                    View the Collection
                                </span>
                            </div>

                            {/* Product Grid */}
                            <div
                                className="px-6 lg:px-12 py-16 lg:py-24"
                                style={{ borderTop: `1px solid ${FM.borderLight}` }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
                                    {products.map((p) => (
                                        <div key={p.name} className="text-center cursor-default">
                                            {/* Ceramic silhouette */}
                                            <div
                                                className="aspect-[3/4] rounded-sm mb-6 flex items-center justify-center p-12"
                                                style={{ background: FM.stone }}
                                            >
                                                <CeramicShape shape={p.shape} color={FM.earth} />
                                            </div>
                                            <p className="text-sm tracking-wide mb-1" style={{ color: FM.ink }}>
                                                {p.name}
                                            </p>
                                            <p className="text-sm" style={{ color: FM.graphite }}>
                                                {p.price}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Journal Teaser */}
                            <div
                                className="px-6 lg:px-12 py-16 lg:py-20"
                                style={{ background: FM.chalk, borderTop: `1px solid ${FM.borderLight}` }}
                            >
                                <p
                                    className="text-[0.6rem] uppercase tracking-[0.35em] mb-8"
                                    style={{ color: FM.graphite }}
                                >
                                    From the Journal
                                </p>

                                <div className="space-y-0">
                                    {journal.map((j) => (
                                        <div
                                            key={j.title}
                                            className="flex items-center justify-between py-5 cursor-default"
                                            style={{ borderBottom: `1px solid ${FM.borderLight}` }}
                                        >
                                            <p
                                                className="text-base lg:text-lg tracking-[-0.01em] font-light"
                                                style={{ ...serif, color: FM.ink }}
                                            >
                                                {j.title}
                                            </p>
                                            <span
                                                className="text-[0.55rem] uppercase tracking-[0.2em] shrink-0 ml-4"
                                                style={{ color: FM.graphite }}
                                            >
                                                {j.tag}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                SECOND IMAGE
               ═══════════════════════════════════════ */}
            <section className="section-container">
                <MaskImage
                    src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=1800&h=1000&fit=crop&q=80"
                    alt="Ceramics workshop — warm light, raw materials, handmade objects"
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
                            Quiet things, loud numbers
                        </TextReveal>
                    </div>

                    <div ref={metricsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-28">
                        {metrics.map((m) => (
                            <div key={m.label} className="fm-metric space-y-3">
                                <span className="text-metric" style={{ color: FM.earth }}>
                                    {m.value}
                                </span>
                                <p className="text-sm text-foreground-muted leading-relaxed">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <div className="space-y-6">
                            <span className="text-label text-foreground-subtle">Stockists &amp; Exhibitions</span>
                            <div className="flex flex-wrap gap-3">
                                {["Louisiana Museum", "Designmuseum Danmark", "Mjölk Toronto", "Analogue Life Tokyo"].map((p) => (
                                    <span
                                        key={p}
                                        className="px-4 py-2 rounded-full border border-border text-sm text-foreground-muted"
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
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: FM.earth }}>
                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={FM.canvas} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Best E-Commerce Experience</p>
                                        <p className="text-index text-foreground-muted">Danish Design Awards 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: FM.earth }}>
                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={FM.canvas} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Site of the Day</p>
                                        <p className="text-index text-foreground-muted">Awwwards &middot; November 2024</p>
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
                    background: `linear-gradient(180deg, transparent, ${FM.earth}03 50%, transparent)`,
                }}
            >
                <div className="section-container text-center max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="w-12 h-px" style={{ background: `${FM.earth}30` }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: FM.earth }} />
                        <div className="w-12 h-px" style={{ background: `${FM.earth}30` }} />
                    </div>

                    <div style={serif}>
                        <TextReveal
                            as="blockquote"
                            type="lines"
                            className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.4] tracking-[-0.01em] font-light italic text-foreground/80"
                        >
                            &ldquo;They understood that the best design for craft is no design
                            at all — just enough structure to hold the silence around each piece.
                            The website feels like walking into my studio.&rdquo;
                        </TextReveal>
                    </div>

                    <div className="mt-10 space-y-1">
                        <p className="text-sm font-medium text-foreground">Yuki Moretti</p>
                        <p className="text-index text-foreground-muted">Founder, Forma Ceramics</p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                CTA
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
