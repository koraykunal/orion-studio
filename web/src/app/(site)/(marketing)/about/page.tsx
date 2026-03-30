"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { MaskImage } from "@/components/motion/MaskImage";
import { OrionMark } from "@/components/effects/OrionMark";
import { EASES, DURATIONS } from "@/lib/animations/config";

const values = [
    {
        index: "01",
        title: "Craft over convention",
        body: "Every detail serves a purpose. We obsess over typography, motion, and interaction until the experience feels inevitable — not designed.",
    },
    {
        index: "02",
        title: "Integrated delivery",
        body: "Strategy, design, and engineering operate on the same sprint. No handoffs, no lost context, no momentum breaks.",
    },
    {
        index: "03",
        title: "Launch-ready thinking",
        body: "We build with production in mind from day one. Analytics, performance, accessibility — baked in, not bolted on.",
    },
    {
        index: "04",
        title: "Transparent cadence",
        body: "Weekly updates, shared Figma files, documented decisions. You always know where the project stands.",
    },
];

const team = [
    {
        name: "Koray Kunal",
        role: "Co-Founder",
        image: "/team/koray.png",
    },
    {
        name: "Mecit Keskin",
        role: "Brand Strategist",
        image: "/team/mecit.jpeg",
    },
];

const capabilities = [
    "Web Design & Engineering",
    "Mobile Applications",
    "Product Design",
    "Brand Identity",
    "Design Systems",
];

function ValueItem({
    value,
}: {
    value: (typeof values)[number];
    isLast?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useGSAP(() => {
        if (!ref.current || !lineRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        tl.from(lineRef.current, {
            drawSVG: "0%",
            duration: 1.2,
            ease: EASES.expo,
        }, 0);

        tl.from(ref.current.querySelector(".value-content")!, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: EASES.expo,
        }, 0.15);
    }, { scope: ref });

    return (
        <div ref={ref} className={`py-8 lg:py-10`}>
            <svg
                viewBox="0 0 1000 2"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "1px", display: "block", overflow: "visible", marginBottom: "1.5rem" }}
            >
                <line
                    ref={lineRef}
                    x1="0" y1="1" x2="1000" y2="1"
                    stroke="var(--border)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className="value-content flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                <span className="text-index text-foreground-muted shrink-0 pt-1">{value.index}</span>
                <div className="flex-1">
                    <h3 className="text-heading mb-3">{value.title}</h3>
                    <p className="text-body-lg text-foreground-muted max-w-[50ch]">{value.body}</p>
                </div>
            </div>
        </div>
    );
}

function TeamCard({ member, index }: { member: (typeof team)[number]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current || !imageRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        tl.fromTo(
            imageRef.current,
            { clipPath: "inset(8% 8% 8% 8%)", scale: 1.08 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.2,
                ease: EASES.brandInOut,
            },
            index * 0.15
        );

        tl.from(
            ref.current.querySelector(".team-info")!,
            {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: EASES.expo,
            },
            index * 0.15 + 0.3
        );
    }, { scope: ref });

    return (
        <div ref={ref} className="group">
            <div
                ref={imageRef}
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "3/4", clipPath: "inset(8% 8% 8% 8%)" }}
            >
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 30vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="team-info mt-5 space-y-1.5">
                <h3 className="text-heading text-[1.125rem]">{member.name}</h3>
                <span className="text-label text-accent block">{member.role}</span>
            </div>
        </div>
    );
}

export default function AboutPage() {
    const capsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!capsRef.current) return;

        const pills = capsRef.current.querySelectorAll(".cap-pill");

        gsap.set(pills, { opacity: 0, y: 16, scale: 0.92 });

        gsap.to(pills, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DURATIONS.base,
            stagger: 0.05,
            ease: EASES.brand,
            scrollTrigger: {
                trigger: capsRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: capsRef });

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -left-[12%] top-[5%] w-[50%] h-[80%] pointer-events-none">
                    <OrionMark variant="full" lineOpacity={0.05} globalOpacity={0.35} rotate={-8} mirror />
                </div>

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 60% 50% at 70% 30%, oklch(0.72 0.15 295 / 0.04), transparent 70%)",
                    }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="grid-container gap-y-12">
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            <span className="text-index text-foreground-muted">About Orion</span>

                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                                A studio built for brands that refuse to blend in
                            </TextReveal>

                            <TextReveal
                                as="p"
                                type="lines"
                                className="text-body-lg text-foreground-muted max-w-[52ch]"
                                delay={0.2}
                            >
                                We are a multidisciplinary design and engineering studio. We partner
                                with ambitious companies to create digital experiences that are
                                visually striking, technically sound, and built for growth.
                            </TextReveal>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-container">
                <MaskImage
                    src="/desktop.png"
                    alt="Orion Studio workspace"
                    aspect="21/9"
                    inset={8}
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            <section className="relative section-py overflow-hidden">
                <div className="absolute -right-[15%] top-[10%] w-[45%] h-[70%] pointer-events-none">
                    <OrionMark variant="belt" lineOpacity={0.05} globalOpacity={0.3} rotate={12} />
                </div>

                <div className="relative z-10 grid-container gap-y-12">
                    <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-6">
                        <span className="text-index text-foreground-muted">Our values</span>
                        <TextReveal as="h2" type="lines" className="text-title">
                            What drives us
                        </TextReveal>
                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-muted max-w-[38ch]"
                            delay={0.15}
                        >
                            Principles that shape how we work, what we build, and who we partner with.
                        </TextReveal>
                    </div>

                    <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                        {values.map((value, i) => (
                            <ValueItem
                                key={value.index}
                                value={value}
                                isLast={i === values.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-py">
                <div className="section-container space-y-16 lg:space-y-20">
                    <div className="max-w-3xl space-y-6">
                        <span className="text-index text-foreground-muted">The team</span>
                        <TextReveal as="h2" type="lines" className="text-title">
                            The people behind the work
                        </TextReveal>
                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-muted max-w-[50ch]"
                            delay={0.15}
                        >
                            Senior-only, cross-functional, and fully committed. Every person on the
                            team ships — no account managers, no middlemen.
                        </TextReveal>
                    </div>

                    <div className="grid grid-cols-2 gap-8 lg:gap-12 max-w-3xl">
                        {team.map((member, i) => (
                            <TeamCard key={member.name} member={member} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-container">
                <MaskImage
                    src="/desktop.png"
                    alt="Orion Studio collaboration"
                    aspect="21/9"
                    inset={8}
                    className="rounded-lg lg:rounded-xl"
                />
            </section>

            <section className="section-py">
                <div className="relative section-container">
                    <div className="max-w-3xl space-y-6 mb-12 lg:mb-16">
                        <span className="text-index text-foreground-muted">Capabilities</span>
                        <TextReveal as="h2" type="lines" className="text-title">
                            End-to-end, by design
                        </TextReveal>
                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-muted max-w-[50ch]"
                            delay={0.15}
                        >
                            From brand strategy to production-grade code, we cover the full spectrum
                            so your project stays cohesive from concept to launch.
                        </TextReveal>
                    </div>

                    <LineReveal className="mb-10" />

                    <div ref={capsRef} className="flex flex-wrap gap-3">
                        {capabilities.map((cap) => (
                            <span
                                key={cap}
                                className="cap-pill px-5 py-3 rounded-full border border-border bg-surface-1 text-label text-foreground-muted hover:border-border-bright hover:text-foreground transition-all duration-300"
                            >
                                {cap}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative section-py overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 50% 60% at 50% 50%, oklch(0.72 0.15 295 / 0.05), transparent 70%)",
                    }}
                />

                <div className="relative z-10 section-container text-center space-y-8">
                    <TextReveal as="h2" type="words" className="text-title">
                        Ready to build something remarkable?
                    </TextReveal>
                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted max-w-[44ch] mx-auto"
                        delay={0.15}
                    >
                        We take on a limited number of projects each quarter to ensure every
                        engagement gets our full attention.
                    </TextReveal>
                    <div className="pt-4">
                        <a
                            href="/contact"
                            className="group relative inline-block px-10 py-4 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500 overflow-hidden"
                            data-cursor="hover"
                        >
                            <span className="relative z-10">Start a project</span>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]" />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
