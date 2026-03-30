"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import type { MetricsData } from "@/lib/project-types";

export function MetricsSection({ data }: { data: MetricsData }) {
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!gridRef.current) return;

        const items = gridRef.current.querySelectorAll(".metric-item");
        if (!items.length) return;

        gsap.from(items, {
            opacity: 0,
            y: 30,
            scale: 0.95,
            duration: DURATIONS.slow,
            ease: EASES.expo,
            stagger: STAGGER.loose,
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: gridRef });

    const cols = data.items.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

    return (
        <div className="section-container">
            <div className="p-8 lg:p-12 rounded-xl border border-border bg-surface-1/30">
                <div ref={gridRef} className={`grid grid-cols-2 md:grid-cols-3 ${cols} gap-8 lg:gap-12`}>
                    {data.items.map((metric, i) => (
                        <div key={i} className="metric-item text-center lg:text-left space-y-2">
                            <span className="block text-[clamp(2rem,4vw,3.5rem)] font-light tracking-tight text-foreground font-mono leading-none">
                                {metric.value}
                            </span>
                            <span className="block text-label text-foreground-muted mt-3">
                                {metric.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
