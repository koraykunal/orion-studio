"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";

type RevealOptions = {
    selector?: string;
    y?: number;
    stagger?: number;
    start?: string;
    duration?: number;
    delay?: number;
};

export function useReveal<T extends HTMLElement = HTMLDivElement>({
    selector = ".reveal",
    y = 28,
    stagger = STAGGER.base,
    start = "top 85%",
    duration = DURATIONS.slow,
    delay = 0,
}: RevealOptions = {}) {
    const scope = useRef<T>(null);

    useGSAP(
        () => {
            if (!scope.current) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            const targets = scope.current.querySelectorAll(selector);
            if (!targets.length) return;

            gsap.set(targets, { opacity: 0, y, filter: "blur(4px)" });
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration,
                stagger,
                delay,
                ease: EASES.brand,
                scrollTrigger: {
                    trigger: scope.current,
                    start,
                    toggleActions: "play none none none",
                },
            });
        },
        { scope }
    );

    return scope;
}
