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
   NOCTIS — Electronic Music & Digital Art Festival
   Case Study · Berlin · Est. 2023

   Design philosophy: monochrome restraint with a single
   accent color. Let typography and composition carry weight.
   ═══════════════════════════════════════════════════════════ */

const NC = {
    black: "#09090B",
    surface: "#18181B",
    surfaceLight: "#27272A",
    accent: "#818CF8",
    accentDeep: "#6366F1",
    signal: "#F87171",
    white: "#FAFAFA",
    warm: "#E2E0DC",
    muted: "#71717A",
    border: "#27272A",
};

const palette = [
    { name: "Void", hex: NC.black, dark: true },
    { name: "Surface", hex: NC.surface, dark: true },
    { name: "Indigo", hex: NC.accent, dark: true },
    { name: "Signal", hex: NC.signal, dark: true },
    { name: "Steel", hex: NC.muted, dark: false },
    { name: "Off-White", hex: NC.white, dark: false },
];

const services = [
    "Brand Identity",
    "Festival Website",
    "Motion Systems",
    "Ticket Platform",
    "After-movie Microsite",
];

const metrics = [
    { value: "8K", label: "Attendees across 3 nights" },
    { value: "72h", label: "Sold out — all tiers" },
    { value: "2.4M", label: "Social impressions in launch week" },
    { value: "340%", label: "Instagram growth YoY" },
];

const lineup = {
    headliners: ["KIRA NOVA", "VOID SEQUENCE"],
    abyss: ["AETHER", "PULSE THEORY", "NEON DRIFT"],
    void: ["LUMA", "RIFT", "ZERO KELVIN"],
};

const tickets = [
    { tier: "Early Bird", price: "\u20ac89", status: "SOLD OUT", soldOut: true },
    { tier: "Standard", price: "\u20ac129", status: "SOLD OUT", soldOut: true },
    { tier: "Final Release", price: "\u20ac149", status: "FEW LEFT", soldOut: false },
    { tier: "VIP All Access", price: "\u20ac299", status: "AVAILABLE", soldOut: false },
];

/* ── Helpers ── */
const sora = { fontFamily: "var(--font-sora), system-ui, sans-serif" };

/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */

export default function NoctisPage() {
    const heroRef = useRef<HTMLElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);
    const mockupRef = useRef<HTMLDivElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    /* ── Hero entrance ── */
    useGSAP(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline({ delay: 0.3 });

        tl.from(".nc-hero-grid", {
            opacity: 0,
            duration: 1.8,
            ease: "none",
        });

        tl.from(".nc-hero-title", {
            opacity: 0,
            scale: 0.9,
            filter: "blur(12px)",
            duration: 1.4,
            ease: EASES.brand,
        }, "-=1.2");

        tl.from(".nc-hero-tagline", {
            opacity: 0,
            y: 30,
            duration: DURATIONS.slow,
            ease: EASES.brand,
        }, "-=0.7");

        tl.from(".nc-hero-meta > *", {
            opacity: 0,
            y: 20,
            stagger: STAGGER.base,
            duration: DURATIONS.base,
            ease: EASES.brand,
        }, "-=0.4");

        tl.from(".nc-hero-tags > *", {
            opacity: 0,
            scale: 0.8,
            stagger: STAGGER.tight,
            duration: DURATIONS.fast,
            ease: EASES.brandSpring,
        }, "-=0.2");

        /* Subtle glow pulse */
        gsap.to(".nc-hero-title", {
            textShadow: `0 0 80px ${NC.accent}35, 0 0 160px ${NC.accent}10`,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2,
        });
    }, { scope: heroRef });

    /* ── Brand palette entrance ── */
    useGSAP(() => {
        if (!brandRef.current) return;

        gsap.from(".nc-palette-item", {
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

    /* ── Mockup entrance ── */
    useGSAP(() => {
        if (!mockupRef.current) return;

        gsap.fromTo(
            mockupRef.current,
            { clipPath: "inset(10% 10% 10% 10%)", scale: 1.06 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.8,
                ease: EASES.brandInOut,
                scrollTrigger: {
                    trigger: mockupRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, { scope: mockupRef });

    /* ── Metrics entrance ── */
    useGSAP(() => {
        if (!metricsRef.current) return;

        gsap.from(".nc-metric", {
            opacity: 0,
            y: 60,
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
                style={{ background: NC.black }}
            >
                {/* Subtle grid */}
                <div
                    className="nc-hero-grid absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(${NC.white}20 1px, transparent 1px),
                            linear-gradient(90deg, ${NC.white}20 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                    }}
                />

                {/* Single ambient glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 50% 50% at 50% 45%, ${NC.accent}08, transparent 70%)`,
                    }}
                />

                <div className="relative z-10 text-center px-6 space-y-8 max-w-6xl w-full">
                    <div className="nc-hero-meta flex items-center justify-center gap-6">
                        <span className="text-[0.65rem] uppercase tracking-[0.35em] font-mono" style={{ color: NC.muted }}>
                            Berlin
                        </span>
                        <span className="w-8 h-px" style={{ background: NC.border }} />
                        <span className="text-[0.65rem] uppercase tracking-[0.35em] font-mono" style={{ color: NC.muted }}>
                            15&mdash;17.08.2025
                        </span>
                    </div>

                    {/* Massive solid white title */}
                    <h1 className="nc-hero-title">
                        <span
                            className="block text-[clamp(5rem,18vw,16rem)] leading-[0.85] tracking-[0.06em] font-bold uppercase"
                            style={{
                                ...sora,
                                color: NC.white,
                                textShadow: `0 0 60px ${NC.accent}20, 0 0 120px ${NC.accent}08`,
                            }}
                        >
                            NOCTIS
                        </span>
                    </h1>

                    <p
                        className="nc-hero-tagline text-lg lg:text-xl tracking-wide max-w-md mx-auto"
                        style={{ color: NC.muted }}
                    >
                        Where Night Becomes Sound
                    </p>

                    <div className="nc-hero-tags flex flex-wrap items-center justify-center gap-3 pt-4">
                        {services.map((s) => (
                            <span
                                key={s}
                                className="px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.15em]"
                                style={{
                                    border: `1px solid ${NC.border}`,
                                    color: NC.muted,
                                    borderRadius: "2px",
                                }}
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: NC.border }}
                />
            </section>

            {/* ═══════════════════════════════════════
                THE BRIEF
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" color={NC.border} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-4 space-y-6">
                            <span className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.muted }}>
                                01 &mdash; The Brief
                            </span>
                            <TextReveal as="h2" type="words" className="text-heading">
                                From underground to unmissable
                            </TextReveal>
                        </div>

                        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.1}>
                                NOCTIS started as a warehouse rave in Kreuzberg — 200 people, one
                                turntable, zero permits. By year two, it had become Berlin&apos;s worst-kept
                                secret. Co-founders Lena Voss and Max Riedl needed a brand that could
                                scale to 8,000 without losing the raw energy of that first night.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                                The challenge: create a visual identity and digital platform that feels
                                both underground and world-class. No compromises. No daylight.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-editorial !text-foreground-muted/60" delay={0.3}>
                                Three nights. Four stages. One rule: no daylight.
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
                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1800&h=1000&fit=crop&q=80"
                    alt="Electronic music festival — crowd and stage lights at night"
                    aspect="21/9"
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            {/* ═══════════════════════════════════════
                OUR APPROACH
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" color={NC.border} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        <div className="lg:col-span-4 space-y-6">
                            <span className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.muted }}>
                                02 &mdash; Approach
                            </span>
                            <TextReveal as="h2" type="words" className="text-heading">
                                Controlled chaos as design language
                            </TextReveal>
                        </div>

                        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.1}>
                                We spent three nights on the warehouse floor — in the dark, in the
                                bass, in the sweat. The brand needed to feel like that. Not polished.
                                Not safe. Alive. We built a visual system from the tension between
                                precision and chaos: mathematical grids shattered by raw typography.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                                The digital platform mirrors the experience: a lineup reveal that
                                builds anticipation like a set building to a drop, ticket tiers that
                                create urgency, and an after-movie microsite that makes you feel
                                what you missed.
                            </TextReveal>

                            <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.3}>
                                Every element answers one question: does this make you want to
                                be there?
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                BRAND IDENTITY SYSTEM
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" color={NC.border} />

                    <div className="space-y-6 mb-20 lg:mb-28">
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.muted }}>
                            03 &mdash; Identity
                        </span>
                        <TextReveal as="h2" type="words" className="text-title">
                            A brand that pulses
                        </TextReveal>
                    </div>

                    {/* ── The Wordmark ── */}
                    <div className="mb-24 lg:mb-32">
                        <span className="text-label text-foreground-subtle mb-8 block">The Wordmark</span>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Primary — White on black */}
                            <div
                                className="rounded-xl p-12 lg:p-16 flex flex-col items-center justify-center text-center"
                                style={{ background: NC.black, border: `1px solid ${NC.border}` }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] tracking-[0.1em] font-bold uppercase"
                                    style={{ ...sora, color: NC.white }}
                                >
                                    NOCTIS
                                </p>
                                <p className="mt-3 text-[0.6rem] uppercase tracking-[0.4em] font-mono" style={{ color: NC.muted }}>
                                    Primary &mdash; Light on Dark
                                </p>
                            </div>

                            {/* Accent — Indigo on black */}
                            <div
                                className="rounded-xl p-12 lg:p-16 flex flex-col items-center justify-center text-center"
                                style={{ background: NC.black, border: `1px solid ${NC.border}` }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] tracking-[0.1em] font-bold uppercase"
                                    style={{
                                        ...sora,
                                        color: NC.accent,
                                        textShadow: `0 0 40px ${NC.accent}30`,
                                    }}
                                >
                                    NOCTIS
                                </p>
                                <p className="mt-3 text-[0.6rem] uppercase tracking-[0.4em] font-mono" style={{ color: NC.muted }}>
                                    Accent &mdash; Digital Application
                                </p>
                            </div>

                            {/* Reverse — Black on white */}
                            <div
                                className="rounded-xl p-12 lg:p-16 flex flex-col items-center justify-center text-center"
                                style={{ background: NC.white }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] tracking-[0.1em] font-bold uppercase"
                                    style={{ ...sora, color: NC.black }}
                                >
                                    NOCTIS
                                </p>
                                <p className="mt-3 text-[0.6rem] uppercase tracking-[0.4em] font-mono" style={{ color: NC.muted }}>
                                    Reverse &mdash; Print Application
                                </p>
                            </div>

                            {/* Mono — on surface */}
                            <div
                                className="rounded-xl p-12 lg:p-16 flex flex-col items-center justify-center text-center"
                                style={{ background: NC.surface, border: `1px solid ${NC.border}` }}
                            >
                                <p
                                    className="text-[clamp(2.5rem,5vw,4.5rem)] tracking-[0.1em] font-bold uppercase"
                                    style={{ ...sora, color: NC.muted }}
                                >
                                    NOCTIS
                                </p>
                                <p className="mt-3 text-[0.6rem] uppercase tracking-[0.4em] font-mono" style={{ color: NC.muted }}>
                                    Monotone &mdash; Secondary
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Colour Palette ── */}
                    <div ref={brandRef} className="mb-24 lg:mb-32">
                        <span className="text-label text-foreground-subtle mb-8 block">Colour System</span>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {palette.map((c) => (
                                <div key={c.hex} className="nc-palette-item space-y-3">
                                    <div
                                        className="aspect-square rounded-lg"
                                        style={{
                                            background: c.hex,
                                            border: `1px solid ${c.dark ? NC.border : `${NC.black}10`}`,
                                        }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                                        <p className="text-[0.65rem] text-foreground-muted font-mono">{c.hex}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Typography ── */}
                    <div>
                        <span className="text-label text-foreground-subtle mb-8 block">Typography</span>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div
                                className="space-y-4 p-8 rounded-xl"
                                style={{ background: NC.surface, border: `1px solid ${NC.border}` }}
                            >
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.accent }}>
                                    Display &mdash; Sora Bold
                                </p>
                                <p
                                    className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[0.06em] font-bold uppercase"
                                    style={{ ...sora, color: NC.white }}
                                >
                                    NO DAYLIGHT
                                </p>
                                <p className="text-sm font-mono" style={{ color: NC.muted }}>
                                    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                                </p>
                            </div>

                            <div
                                className="space-y-4 p-8 rounded-xl"
                                style={{ background: NC.surface, border: `1px solid ${NC.border}` }}
                            >
                                <p className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.accent }}>
                                    System &mdash; JetBrains Mono
                                </p>
                                <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.4] font-mono" style={{ color: NC.white }}>
                                    3 nights / 4 stages / 8000 souls
                                </p>
                                <p className="text-sm font-mono" style={{ color: NC.muted }}>
                                    abcdefghijklmnopqrstuvwxyz &#123; &#125; | &lt; &gt; _ ~ @
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                WEBSITE PREVIEW
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <div className="space-y-6 mb-16 lg:mb-24">
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.muted }}>
                            04 &mdash; Platform
                        </span>
                        <TextReveal as="h2" type="words" className="text-title">
                            A website that drops like a set
                        </TextReveal>
                        <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[52ch]" delay={0.15}>
                            Immersive festival platform with phased lineup reveals, real-time
                            ticket availability, interactive venue map, and after-movie experience.
                        </TextReveal>
                    </div>

                    {/* ── Browser Frame ── */}
                    <div
                        ref={mockupRef}
                        className="rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            border: `1px solid ${NC.border}`,
                            clipPath: "inset(10% 10% 10% 10%)",
                        }}
                    >
                        {/* Browser chrome */}
                        <div
                            className="flex items-center gap-2 px-4 py-3"
                            style={{ background: NC.surface, borderBottom: `1px solid ${NC.border}` }}
                        >
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${NC.white}12` }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${NC.white}12` }} />
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${NC.white}12` }} />
                            </div>
                            <div className="flex-1 mx-4">
                                <div
                                    className="max-w-sm mx-auto rounded-sm px-3 py-1 text-center text-[0.6rem] tracking-wider font-mono"
                                    style={{ background: `${NC.white}06`, color: `${NC.white}30` }}
                                >
                                    noctis.berlin
                                </div>
                            </div>
                        </div>

                        {/* ── Rendered Festival Website ── */}
                        <div style={{ background: NC.black, color: NC.white }}>

                            {/* Nav */}
                            <nav
                                className="flex items-center justify-between px-6 lg:px-12 py-4"
                                style={{ borderBottom: `1px solid ${NC.border}` }}
                            >
                                <p className="text-base tracking-[0.15em] font-bold uppercase" style={{ ...sora, color: NC.white }}>
                                    NOCTIS
                                </p>
                                <div className="hidden md:flex items-center gap-8 text-[0.6rem] uppercase tracking-[0.2em] font-mono" style={{ color: NC.muted }}>
                                    <span>Lineup</span>
                                    <span>Stages</span>
                                    <span>Experience</span>
                                    <span style={{ color: NC.accent }}>Tickets</span>
                                </div>
                                <div
                                    className="px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.15em] font-mono"
                                    style={{ background: NC.accent, color: NC.black, borderRadius: "2px" }}
                                >
                                    Get Tickets
                                </div>
                            </nav>

                            {/* Hero */}
                            <div className="relative px-6 lg:px-12 py-20 lg:py-32">
                                {/* Grid overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(${NC.white} 1px, transparent 1px),
                                            linear-gradient(90deg, ${NC.white} 1px, transparent 1px)
                                        `,
                                        backgroundSize: "60px 60px",
                                    }}
                                />

                                <div className="relative z-10 text-center space-y-6">
                                    <p className="text-[0.6rem] uppercase tracking-[0.4em] font-mono" style={{ color: NC.muted }}>
                                        Year Three &middot; Berlin &middot; August 2025
                                    </p>

                                    <h2
                                        className="text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-[0.06em] font-bold uppercase"
                                        style={{
                                            ...sora,
                                            color: NC.white,
                                            textShadow: `0 0 80px ${NC.accent}15`,
                                        }}
                                    >
                                        NOCTIS
                                    </h2>

                                    <p className="text-sm lg:text-base max-w-sm mx-auto" style={{ color: NC.muted }}>
                                        3 nights / 4 stages / no daylight
                                    </p>

                                    <div className="flex items-center justify-center gap-3 pt-4">
                                        <span
                                            className="px-6 py-2.5 text-[0.6rem] uppercase tracking-[0.15em] font-mono cursor-default"
                                            style={{ background: NC.accent, color: NC.black, borderRadius: "2px" }}
                                        >
                                            Get Tickets
                                        </span>
                                        <span
                                            className="px-6 py-2.5 text-[0.6rem] uppercase tracking-[0.15em] font-mono cursor-default"
                                            style={{ border: `1px solid ${NC.border}`, color: NC.muted, borderRadius: "2px" }}
                                        >
                                            View Lineup
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Lineup */}
                            <div className="px-6 lg:px-12 py-12 lg:py-20" style={{ borderTop: `1px solid ${NC.border}` }}>
                                <p className="text-[0.6rem] uppercase tracking-[0.3em] font-mono mb-6" style={{ color: NC.accent }}>
                                    Headliners
                                </p>
                                <div className="space-y-1 mb-12">
                                    {lineup.headliners.map((a) => (
                                        <p
                                            key={a}
                                            className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[0.04em] font-bold uppercase"
                                            style={{ ...sora, color: NC.white }}
                                        >
                                            {a}
                                        </p>
                                    ))}
                                </div>

                                <div className="h-px mb-12" style={{ background: NC.border }} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[0.6rem] uppercase tracking-[0.3em] font-mono mb-4" style={{ color: NC.accent }}>
                                            Stage: Abyss
                                        </p>
                                        <div className="space-y-1">
                                            {lineup.abyss.map((a) => (
                                                <p key={a} className="text-lg tracking-wide font-medium" style={{ color: NC.muted }}>
                                                    {a}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[0.6rem] uppercase tracking-[0.3em] font-mono mb-4" style={{ color: NC.accent }}>
                                            Stage: Void
                                        </p>
                                        <div className="space-y-1">
                                            {lineup.void.map((a) => (
                                                <p key={a} className="text-lg tracking-wide font-medium" style={{ color: NC.muted }}>
                                                    {a}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tickets */}
                            <div
                                className="px-6 lg:px-12 py-12 lg:py-16"
                                style={{ background: NC.surface, borderTop: `1px solid ${NC.border}` }}
                            >
                                <p className="text-[0.6rem] uppercase tracking-[0.3em] font-mono mb-8" style={{ color: NC.accent }}>
                                    Tickets
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {tickets.map((t) => (
                                        <div
                                            key={t.tier}
                                            className="p-4 rounded-lg"
                                            style={{
                                                background: NC.black,
                                                border: `1px solid ${t.soldOut ? NC.border : NC.accent}40`,
                                                opacity: t.soldOut ? 0.4 : 1,
                                            }}
                                        >
                                            <p className="text-[0.6rem] uppercase tracking-[0.2em] font-mono mb-2" style={{ color: NC.muted }}>
                                                {t.tier}
                                            </p>
                                            <p className="text-2xl font-bold font-mono mb-3" style={{ color: t.soldOut ? NC.muted : NC.white }}>
                                                {t.price}
                                            </p>
                                            <p
                                                className="text-[0.55rem] uppercase tracking-[0.2em] font-mono"
                                                style={{
                                                    color: t.soldOut
                                                        ? NC.muted
                                                        : t.status === "FEW LEFT"
                                                            ? NC.signal
                                                            : NC.accent,
                                                }}
                                            >
                                                {t.status}
                                            </p>
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
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&h=1000&fit=crop&q=80"
                    alt="Festival stage with dramatic lighting and crowd"
                    aspect="21/9"
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            {/* ═══════════════════════════════════════
                RESULTS
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" color={NC.border} />

                    <div className="space-y-6 mb-20 lg:mb-28">
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.muted }}>
                            05 &mdash; Impact
                        </span>
                        <TextReveal as="h2" type="words" className="text-title">
                            Numbers that hit different
                        </TextReveal>
                    </div>

                    <div ref={metricsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-28">
                        {metrics.map((m) => (
                            <div key={m.label} className="nc-metric space-y-3">
                                <span className="text-metric" style={{ color: NC.white }}>
                                    {m.value}
                                </span>
                                <p className="text-sm text-foreground-muted leading-relaxed">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <div className="space-y-6">
                            <span className="text-label text-foreground-subtle">Press Coverage</span>
                            <div className="flex flex-wrap gap-3">
                                {["Resident Advisor", "Mixmag", "DJ Mag", "Groove Magazine"].map((p) => (
                                    <span
                                        key={p}
                                        className="px-4 py-2 text-sm font-mono"
                                        style={{ border: `1px solid ${NC.border}`, color: NC.muted, borderRadius: "2px" }}
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
                                    <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ background: NC.accent }}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={NC.black} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Best Festival Digital Experience</p>
                                        <p className="text-[0.65rem] text-foreground-muted font-mono">IMS Awards 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-sm flex items-center justify-center" style={{ background: NC.accent }}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={NC.black} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Site of the Day</p>
                                        <p className="text-[0.65rem] text-foreground-muted font-mono">Awwwards &middot; July 2025</p>
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
            <section className="section-py overflow-hidden">
                <div className="section-container text-center max-w-4xl mx-auto px-6">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="w-16 h-px" style={{ background: NC.border }} />
                        <div className="w-2 h-2 rounded-sm" style={{ background: NC.accent }} />
                        <div className="w-16 h-px" style={{ background: NC.border }} />
                    </div>

                    <TextReveal
                        as="blockquote"
                        type="lines"
                        className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.4] tracking-[-0.01em] font-light text-foreground/80"
                    >
                        &ldquo;They turned sound into something you could see and feel.
                        The brand IS the experience. You don&apos;t attend NOCTIS —
                        you enter it.&rdquo;
                    </TextReveal>

                    <div className="mt-10 space-y-1">
                        <p className="text-sm font-medium text-foreground">Lena Voss</p>
                        <p className="text-[0.65rem] text-foreground-muted font-mono uppercase tracking-wider">
                            Co-founder, NOCTIS
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                CTA
               ═══════════════════════════════════════ */}
            <section className="section-py">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" color={NC.border} />

                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <span className="text-[0.65rem] uppercase tracking-[0.3em] font-mono" style={{ color: NC.muted }}>
                                Next project
                            </span>
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
