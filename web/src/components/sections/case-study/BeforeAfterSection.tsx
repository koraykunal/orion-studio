"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { LineReveal } from "@/components/motion/LineReveal";
import { EASES, DURATIONS } from "@/lib/animations/config";
import type { BeforeAfterData } from "@/lib/project-types";

export function BeforeAfterSection({ data }: { data: BeforeAfterData }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const aspect = data.aspectRatio ?? "auto";
    const useFixedAspect = aspect !== "auto";

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

    const renderImage = (src: string, alt: string) => {
        if (useFixedAspect) {
            return (
                <div
                    className="relative overflow-hidden rounded-lg lg:rounded-xl"
                    style={{ aspectRatio: aspect }}
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                    />
                </div>
            );
        }
        return (
            <div className="relative overflow-hidden rounded-lg lg:rounded-xl">
                <Image
                    src={src}
                    alt={alt}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="block w-full h-auto"
                />
            </div>
        );
    };

    return (
        <div className="section-container">
            <div
                ref={wrapRef}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-3 lg:gap-4 items-start"
            >
                <div className="ba-col space-y-3">
                    <span className="text-label text-foreground-muted">{data.before.label}</span>
                    {renderImage(data.before.src, data.before.alt)}
                </div>

                <div className="hidden md:flex items-stretch justify-center self-stretch py-10">
                    <LineReveal className="w-px h-full rotate-90 origin-center" />
                </div>
                <div className="md:hidden">
                    <LineReveal />
                </div>

                <div className="ba-col space-y-3">
                    <span className="text-label text-foreground-muted">{data.after.label}</span>
                    {renderImage(data.after.src, data.after.alt)}
                </div>
            </div>
        </div>
    );
}
