"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS } from "@/lib/animations/config";
import type { VideoEmbedData } from "@/lib/project-types";
import { getSafeVideoEmbedUrl } from "@/lib/video-embed";

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

    const embedUrl = getSafeVideoEmbedUrl(data.url);
    if (!embedUrl) return null;

    return (
        <div className="section-container">
            <div ref={wrapRef} className="relative aspect-video overflow-hidden rounded-lg lg:rounded-xl">
                <iframe
                    src={embedUrl}
                    title="Project video"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
