"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, DrawSVGPlugin, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";

/* ── Project Data ── */

type Project = {
    slug: string;
    client: string;
    tagline: string;
    year: string;
    services: string[];
    outcome: string;
    image: string;
    featured?: boolean;
    caseStudy?: boolean;
};

const projects: Project[] = [
    {
        slug: "harlow-finch",
        client: "Harlow & Finch",
        tagline: "Rooted in Remedy. Revived for Now.",
        year: "2025",
        services: ["Brand Revival", "Visual Identity", "E-Commerce Platform", "Storytelling Microsite"],
        outcome: "133-year-old botanical apothecary reimagined for the digital age. Headless e-commerce on Shopify Hydrogen with heritage storytelling, AR ingredient explorer, and editorial engine. 340% increase in online orders.",
        image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1400&h=900&fit=crop&q=80",
        featured: true,
        caseStudy: true,
    },
    {
        slug: "noctis",
        client: "NOCTIS",
        tagline: "Where Night Becomes Sound",
        year: "2025",
        services: ["Brand Identity", "Festival Website", "Motion Systems", "Ticket Platform"],
        outcome: "Annual electronic music and digital art festival in Berlin. Immersive web platform with phased lineup reveals, interactive venue map, and real-time ticket system. Sold out in 72 hours — 8,000 attendees.",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=900&fit=crop&q=80",
        featured: true,
        caseStudy: true,
    },
    {
        slug: "forma",
        client: "Forma",
        tagline: "Silence as Design Language",
        year: "2025",
        services: ["Brand Identity", "Editorial E-Commerce", "Motion Systems", "Exhibition Design"],
        outcome: "Contemporary ceramics studio in Copenhagen. Gallery-like e-commerce with wabi-sabi editorial engine, exhibition booking system, and artisan process documentation. 280% increase in direct sales, €1.2M first-year revenue.",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&h=900&fit=crop&q=80",
        featured: true,
        caseStudy: true,
    },
    {
        slug: "aksis-erp",
        client: "Aksis ERP",
        tagline: "End-to-end manufacturing intelligence",
        year: "2025",
        services: ["Product Design", "Full-Stack Engineering", "ERP Systems"],
        outcome: "Modular ERP platform for manufacturing companies. Production planning, procurement, inventory, and real-time analytics — from raw material to shipment.",
        image: "https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?w=1400&h=900&fit=crop&q=80",
    },
    {
        slug: "maison-verre",
        client: "Maison Verre",
        tagline: "Every stay, a story",
        year: "2024",
        services: ["Brand Strategy", "Web Design", "Booking Platform"],
        outcome: "Boutique hotel group across Paris, Lisbon, and Copenhagen. Immersive booking experience with virtual room tours, seasonal editorial, and loyalty program integration.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&h=900&fit=crop&q=80",
    },
    {
        slug: "kuro-supply",
        client: "Kuro Supply",
        tagline: "Wear the city",
        year: "2024",
        services: ["E-Commerce", "Motion Systems", "Visual Identity"],
        outcome: "Japanese-inspired streetwear label. Headless storefront with drop countdown system, lookbook engine, and limited-edition subscription management. Sold out 3 consecutive drops.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=900&fit=crop&q=80",
    },
];

/* ── Featured Project Card (large) ── */

function FeaturedCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useGSAP(() => {
        if (!cardRef.current || !imageRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });

        if (lineRef.current) {
            tl.from(lineRef.current, {
                drawSVG: "0%",
                duration: 1.4,
                ease: EASES.expo,
            }, 0);
        }

        tl.fromTo(
            imageRef.current,
            { clipPath: "inset(6% 6% 6% 6%)", scale: 1.08 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.4,
                ease: EASES.brandInOut,
            },
            0.1
        );

        tl.from(
            cardRef.current.querySelector(".card-meta")!,
            { opacity: 0, y: 32, duration: 0.8, ease: EASES.expo },
            0.4
        );
    }, { scope: cardRef });

    const isEven = index % 2 === 0;

    return (
        <div ref={cardRef} className="group">
            <svg
                viewBox="0 0 1000 2"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "1px", display: "block", overflow: "visible", marginBottom: "2rem" }}
            >
                <line
                    ref={lineRef}
                    x1="0" y1="1" x2="1000" y2="1"
                    stroke="var(--border)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start`}>
                {/* Image */}
                <div className={`lg:col-span-7 ${isEven ? "" : "lg:order-2"}`}>
                    <div
                        ref={imageRef}
                        className="relative overflow-hidden rounded-lg lg:rounded-xl cursor-pointer"
                        style={{ aspectRatio: "3/2", clipPath: "inset(6% 6% 6% 6%)" }}
                    >
                        <Image
                            src={project.image}
                            alt={`${project.client} — ${project.tagline}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 58vw"
                            className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>

                {/* Meta */}
                <div className={`card-meta lg:col-span-5 ${isEven ? "" : "lg:order-1"} flex flex-col justify-between h-full py-2 lg:py-4`}>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <span className="text-index text-foreground-muted">0{index + 1}</span>
                            <span className="text-index text-foreground-muted">{project.year}</span>
                        </div>

                        <h2 className="text-title text-[clamp(1.75rem,3.5vw,3rem)]">{project.client}</h2>

                        <p className="text-editorial !text-foreground-muted/80 max-w-[36ch]">
                            {project.tagline}
                        </p>

                        <p className="text-body-lg text-foreground-muted max-w-[42ch]">
                            {project.outcome}
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {project.services.map((s) => (
                                <span
                                    key={s}
                                    className="px-3 py-1.5 rounded-full border border-border text-[0.625rem] uppercase tracking-[0.15em] text-foreground-muted"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                        {project.caseStudy ? (
                            <Link
                                href={`/work/${project.slug}`}
                                className="inline-flex items-center gap-2 text-label text-foreground-muted group-hover:text-accent transition-colors duration-300"
                                data-cursor="hover"
                            >
                                View case study
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <path d="M1 15L15 1M15 1H5M15 1V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        ) : (
                            <span
                                className="inline-flex items-center gap-2 text-label text-foreground-muted group-hover:text-accent transition-colors duration-300 cursor-pointer"
                                data-cursor="hover"
                            >
                                View case study
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <path d="M1 15L15 1M15 1H5M15 1V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Grid Project Card (smaller) ── */

function GridCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!cardRef.current || !imageRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        tl.fromTo(
            imageRef.current,
            { clipPath: "inset(8% 8% 8% 8%)", scale: 1.1 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.2,
                ease: EASES.brandInOut,
            },
            index * 0.12
        );

        tl.from(
            cardRef.current.querySelector(".grid-meta")!,
            { opacity: 0, y: 24, duration: 0.7, ease: EASES.expo },
            index * 0.12 + 0.3
        );
    }, { scope: cardRef });

    return (
        <div ref={cardRef} className="group cursor-pointer">
            <div
                ref={imageRef}
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "4/3", clipPath: "inset(8% 8% 8% 8%)" }}
            >
                <Image
                    src={project.image}
                    alt={`${project.client} — ${project.tagline}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="grid-meta mt-5 space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-heading">{project.client}</h3>
                    <span className="text-index text-foreground-muted shrink-0">{project.year}</span>
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed max-w-[42ch]">{project.tagline}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {project.services.map((s) => (
                        <span
                            key={s}
                            className="px-2.5 py-1 rounded-full border border-border-subtle text-[0.6rem] uppercase tracking-[0.12em] text-foreground-muted"
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Page ── */

export default function WorkPage() {
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return (
        <main className="relative bg-background overflow-hidden">
            {/* ────────────────────── Hero ────────────────────── */}
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -right-[10%] top-[5%] w-[45%] h-[75%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.05} globalOpacity={0.3} rotate={10} />
                </div>

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 60% 50% at 40% 35%, oklch(0.72 0.15 295 / 0.04), transparent 70%)",
                    }}
                />

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="grid-container gap-y-10">
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            <span className="text-index text-foreground-muted">Selected Work</span>

                            <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                                Projects that define our craft
                            </TextReveal>

                            <TextReveal
                                as="p"
                                type="lines"
                                className="text-body-lg text-foreground-muted max-w-[52ch]"
                                delay={0.2}
                            >
                                Each engagement blends strategy, design systems, and engineering
                                so launches are ready for scale on day one. Here&apos;s a selection
                                of recent work we&apos;re proud of.
                            </TextReveal>
                        </div>

                        {/* Quick stats */}
                        <div className="col-span-12 lg:col-span-3 lg:col-start-10 flex flex-row lg:flex-col gap-8 lg:gap-6 lg:pt-2">
                            {[
                                { metric: "40+", label: "Projects delivered" },
                                { metric: "12", label: "Industries" },
                                { metric: "6", label: "Countries" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-tight text-foreground block font-mono">
                                        {s.metric}
                                    </span>
                                    <span className="text-label text-foreground-muted">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────────────────── Featured Projects ────────────────────── */}
            <section className="section-container space-y-24 lg:space-y-32">
                {featured.map((project, i) => (
                    <FeaturedCard key={project.slug} project={project} index={i} />
                ))}
            </section>

            {/* ────────────────────── More Projects ────────────────────── */}
            {others.length > 0 && (
                <section className="section-py">
                    <div className="section-container">
                        <div className="space-y-6 mb-14 lg:mb-20">
                            <LineReveal />
                            <TextReveal as="h2" type="words" className="text-heading">
                                More projects
                            </TextReveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-20">
                            {others.map((project, i) => (
                                <GridCard key={project.slug} project={project} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ────────────────────── CTA ────────────────────── */}
            <section className="relative section-py overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(ellipse 50% 60% at 50% 50%, oklch(0.72 0.15 295 / 0.05), transparent 70%)",
                    }}
                />
                <div className="absolute -left-[12%] bottom-[5%] w-[40%] h-[60%] pointer-events-none">
                    <OrionMark variant="belt" lineOpacity={0.04} globalOpacity={0.25} rotate={-15} mirror />
                </div>

                <div className="relative z-10 section-container text-center space-y-8">
                    <TextReveal as="h2" type="words" className="text-title">
                        Your project could be next
                    </TextReveal>
                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted max-w-[44ch] mx-auto"
                        delay={0.15}
                    >
                        We partner with teams that care about quality as much as we do.
                        Let&apos;s talk about what you&apos;re building.
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
