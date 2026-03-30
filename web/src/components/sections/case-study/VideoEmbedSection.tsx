"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS } from "@/lib/animations/config";
import type { VideoEmbedData } from "@/lib/project-types";

function toEmbedUrl(url: string): string {
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return url;
}

export function VideoEmbedSection({ data }: { data: VideoEmbedData }) {
    const wrapRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapRef.current) return;

        gsap.from(wrapRef.current, {
            opacity: 0,
            y: 30,
            duration: DURATIONS.slow,
            ease: EASES.brand,
            scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });
    }, { scope: wrapRef });

    return (
        <div className="section-container">
            <div ref={wrapRef} className="relative aspect-video overflow-hidden rounded-lg lg:rounded-xl">
                <iframe
                    src={toEmbedUrl(data.url)}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
