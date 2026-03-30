"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import type { TechStackData } from "@/lib/project-types";

export function TechStackSection({ data }: { data: TechStackData }) {
    const wrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;

        const pills = wrapRef.current.querySelectorAll(".tech-pill");
        if (!pills.length) return;

        gsap.from(pills, {
            opacity: 0,
            scale: 0.85,
            y: 10,
            duration: DURATIONS.base,
            ease: EASES.brand,
            stagger: 0.04,
            scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: wrapRef });

    return (
        <div className="section-container">
            <div className="grid-container gap-y-6">
                <div className="col-span-12 lg:col-span-3 lg:self-center">
                    <TextReveal as="span" type="words" className="text-label text-foreground-muted">
                        Built with
                    </TextReveal>
                </div>
                <div className="col-span-12 lg:col-start-4 lg:col-span-9">
                    <div ref={wrapRef} className="flex flex-wrap gap-2.5">
                        {data.items.map((item) => (
                            <span
                                key={item}
                                className="tech-pill px-4 py-2 rounded-full border border-border bg-surface-1 text-label text-foreground-muted hover:border-border-bright hover:text-foreground transition-all duration-300"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
