"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS } from "@/lib/animations/config";
import type { QuoteData } from "@/lib/project-types";

export function QuoteSection({ data }: { data: QuoteData }) {
    const blockRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!blockRef.current) return;

        gsap.from(blockRef.current, {
            opacity: 0,
            y: 24,
            duration: DURATIONS.slow,
            ease: EASES.brand,
            scrollTrigger: {
                trigger: blockRef.current,
                start: "top 88%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: blockRef });

    return (
        <div className="section-container">
            <div ref={blockRef} className="grid-container">
                <div className="col-span-12 lg:col-start-3 lg:col-span-8">
                    <div className="relative pl-8 lg:pl-12">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/40" />
                        <p className="text-editorial !text-[clamp(1.25rem,2.2vw,1.75rem)] !leading-[1.6] text-foreground/90">
                            &ldquo;{data.text}&rdquo;
                        </p>
                        {data.author && (
                            <div className="mt-8 flex items-center gap-3">
                                <div className="w-8 h-px bg-border" />
                                <span className="text-label text-foreground-muted">{data.author}</span>
                                {data.role && (
                                    <span className="text-label text-foreground-muted/50">{data.role}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
