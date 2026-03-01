"use client";

import { useRef } from "react";
import { gsap, DrawSVGPlugin, useGSAP } from "@/lib/animations/gsap";
import { DURATIONS, EASES } from "@/lib/animations/config";

interface LineRevealProps {
    className?: string;
    color?: string;
    duration?: number;
    start?: string;
    delay?: number;
}

export function LineReveal({
    className,
    color = "var(--border)",
    duration = DURATIONS.xslow,
    start = "top 90%",
    delay = 0,
}: LineRevealProps) {
    const ref = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        const line = ref.current.querySelector("line");
        if (!line) return;

        gsap.from(line, {
            drawSVG: "0%",
            duration,
            ease: EASES.expo,
            delay,
            scrollTrigger: {
                trigger: ref.current,
                start,
                toggleActions: "play none none none",
            },
        });
    }, { scope: ref });

    return (
        <svg
            ref={ref}
            className={className}
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "1px", display: "block", overflow: "visible" }}
        >
            <line
                x1="0" y1="1" x2="1000" y2="1"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
