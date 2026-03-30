"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { LineReveal } from "@/components/motion/LineReveal";
import { EASES, DURATIONS } from "@/lib/animations/config";
import type { BeforeAfterData } from "@/lib/project-types";

export function BeforeAfterSection({ data }: { data: BeforeAfterData }) {
    const wrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;

        const cols = wrapRef.current.querySelectorAll(".ba-col");
        if (!cols.length) return;

        gsap.from(cols, {
            opacity: 0,
            y: 40,
            duration: DURATIONS.slow,
            ease: EASES.brand,
            stagger: 0.2,
            scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: wrapRef });

    return (
        <div className="section-container">
            <div ref={wrapRef} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-start">
                <div className="ba-col space-y-4">
                    <span className="text-label text-foreground-muted">{data.before.label}</span>
                    <div className="relative overflow-hidden rounded-lg lg:rounded-xl" style={{ aspectRatio: "4/3" }}>
                        <Image
                            src={data.before.src}
                            alt={data.before.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 45vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-center h-full py-12">
                    <LineReveal className="w-px h-full rotate-90 origin-center" />
                </div>
                <div className="md:hidden">
                    <LineReveal />
                </div>

                <div className="ba-col space-y-4">
                    <span className="text-label text-foreground-muted">{data.after.label}</span>
                    <div className="relative overflow-hidden rounded-lg lg:rounded-xl" style={{ aspectRatio: "4/3" }}>
                        <Image
                            src={data.after.src}
                            alt={data.after.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 45vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
