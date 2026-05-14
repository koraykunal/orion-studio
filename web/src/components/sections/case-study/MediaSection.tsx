"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES } from "@/lib/animations/config";
import type { MediaData } from "@/lib/project-types";

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v)$/i;

export function MediaSection({ data }: { data: MediaData }) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current,
            { clipPath: "inset(8% 8% 8% 8%)", scale: 1.04 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.4,
                ease: EASES.brandInOut,
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, { scope: ref });

    if (!data.src) return null;

    const isVideo = VIDEO_EXT_RE.test(data.src);
    const aspectRatio = data.aspectRatio?.trim() || (isVideo ? "16/9" : undefined);

    return (
        <div className="section-container">
            <div
                ref={ref}
                className="relative w-full overflow-hidden rounded-lg lg:rounded-xl bg-background"
                style={{
                    aspectRatio,
                    clipPath: "inset(8% 8% 8% 8%)",
                }}
            >
                {isVideo ? (
                    <video
                        src={data.src}
                        poster={data.poster || undefined}
                        autoPlay={data.autoplay}
                        loop={data.loop}
                        controls={data.controls}
                        muted
                        playsInline
                        preload="metadata"
                        aria-label={data.alt || undefined}
                        className="block w-full h-full object-cover"
                    />
                ) : aspectRatio ? (
                    <Image
                        src={data.src}
                        alt={data.alt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <Image
                        src={data.src}
                        alt={data.alt}
                        width={1600}
                        height={1200}
                        sizes="100vw"
                        className="block w-full h-auto"
                        unoptimized
                    />
                )}
            </div>
        </div>
    );
}
