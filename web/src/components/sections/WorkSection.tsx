"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";

type WorkItem = {
    client: string;
    focus: string;
    outcome: string;
    image: string;
};

const work: WorkItem[] = [
    {
        client: "Nova Mobility",
        focus: "Product Launch",
        outcome: "Multi-market site with CMS-backed case stories.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=600&fit=crop&q=80",
    },
    {
        client: "Atlar Finance",
        focus: "Brand & Investor Hub",
        outcome: "Modular landing kit with analytics-ready events.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&q=80",
    },
    {
        client: "Museo Light",
        focus: "Immersive Exhibition",
        outcome: "Rich media stack and ticketing integrations.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=600&fit=crop&q=80",
    },
];

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!imageWrapRef.current || !cardRef.current) return;

        gsap.fromTo(
            imageWrapRef.current,
            { clipPath: "inset(6% 6% 6% 6%)", scale: 1.06 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.4,
                ease: "orion.inOut",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className="shrink-0 w-[75vw] lg:w-[45vw] group transition-transform duration-500 ease-out hover:-translate-y-1"

        >
            <div
                ref={imageWrapRef}
                className="relative overflow-hidden rounded-lg lg:rounded-xl"
                style={{ aspectRatio: "3/2", clipPath: "inset(6% 6% 6% 6%)" }}
            >
                <Image
                    src={item.image}
                    alt={`${item.client} — ${item.focus}`}
                    fill
                    sizes="(max-width: 1024px) 75vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
            </div>

            <div className="mt-5 lg:mt-6 flex items-start justify-between gap-4">
                <div>
                    <span className="text-index text-foreground-subtle mb-2 block">0{index + 1}</span>
                    <h3 className="text-heading">{item.client}</h3>
                </div>
                <span className="text-label text-foreground-muted mt-6">{item.focus}</span>
            </div>

            <p className="text-body-lg text-foreground-muted mt-2 max-w-[36ch]">{item.outcome}</p>
        </div>
    );
}

export function WorkSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !trackRef.current) return;

        const track = trackRef.current;
        const totalScroll = track.scrollWidth - window.innerWidth;

        if (totalScroll <= 0) return;

        gsap.to(track, {
            x: -totalScroll,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${totalScroll}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="bg-background overflow-hidden" id="work">
            <div
                ref={trackRef}
                className="flex items-start gap-8 lg:gap-12 pl-6 md:pl-12 lg:pl-[max(3rem,calc((100vw-1400px)/2+3rem))] pt-24 lg:pt-32 pb-24 lg:pb-32"
            >
                {/* Header card */}
                <div className="shrink-0 w-[75vw] lg:w-[30vw] flex flex-col justify-center pr-8 lg:pr-0">
                    <span className="text-index text-foreground-subtle mb-6">02 — Selected Work</span>
                    <TextReveal as="h2" type="lines" className="text-title">
                        Projects that define our craft
                    </TextReveal>
                    <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted mt-6" delay={0.15}>
                        Each engagement blends design systems, motion, and growth instrumentation so launches are ready for scale on day one.
                    </TextReveal>
                </div>

                {work.map((item, i) => (
                    <WorkCard key={item.client} item={item} index={i} />
                ))}

                <div className="shrink-0 w-[10vw]" />
            </div>
        </section>
    );
}
