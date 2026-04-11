"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { DURATIONS, EASES, STAGGER } from "@/lib/animations/config";

type SplitMode = "chars" | "words" | "lines";

interface TextRevealProps {
    children: ReactNode;
    as?: ElementType;
    type?: SplitMode;
    stagger?: number;
    duration?: number;
    ease?: string;
    delay?: number;
    y?: number;
    rotateX?: number;
    start?: string;
    once?: boolean;
    scrub?: boolean | number;
    className?: string;
}

export function TextReveal({
    children,
    as: Tag = "div",
    type = "lines",
    stagger: staggerVal,
    duration = DURATIONS.slow,
    ease = EASES.expo,
    delay = 0,
    y = 48,
    rotateX = 0,
    start = "top 88%",
    once = true,
    scrub = false,
    className,
}: TextRevealProps) {
    const ref = useRef<HTMLElement>(null);

    const defaultStagger =
        type === "chars" ? STAGGER.chars : type === "words" ? STAGGER.words : STAGGER.base;

    useGSAP(() => {
        if (!ref.current) return;

        const split = SplitText.create(ref.current, {
            type,
            linesClass: "split-line",
            wordsClass: "split-word",
            charsClass: "split-char",
        });

        const targets =
            type === "chars" ? split.chars : type === "words" ? split.words : split.lines;

        if (!targets || targets.length === 0) return () => split.revert();

        if (type === "lines") {
            split.lines.forEach((line) => {
                const el = line as HTMLElement;
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "hidden";
                wrapper.style.display = "block";
                wrapper.style.paddingBottom = "0.3em";
                wrapper.style.marginBottom = "-0.3em";
                el.parentNode!.insertBefore(wrapper, el);
                wrapper.appendChild(el);
            });
        }

        gsap.from(targets, {
            opacity: 0,
            y,
            rotateX,
            duration,
            ease,
            stagger: staggerVal ?? defaultStagger,
            delay,
            scrollTrigger: scrub
                ? {
                      trigger: ref.current,
                      start,
                      end: "bottom 60%",
                      scrub: typeof scrub === "number" ? scrub : 1,
                  }
                : {
                      trigger: ref.current,
                      start,
                      toggleActions: once
                          ? "play none none none"
                          : "play none none reverse",
                  },
        });

        return () => split.revert();
    }, { scope: ref });

    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
}
