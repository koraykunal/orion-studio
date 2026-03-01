"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";

interface MaskImageProps {
    src: string;
    alt: string;
    aspect?: string;
    priority?: boolean;
    className?: string;
    inset?: number;
    scrub?: boolean | number;
}

export function MaskImage({
    src,
    alt,
    aspect = "16/9",
    priority = false,
    className,
    inset = 12,
    scrub = true,
}: MaskImageProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapRef.current || !imgRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 80%",
                end: "bottom 40%",
                scrub: typeof scrub === "number" ? scrub : scrub ? 1.2 : false,
                ...(!scrub && { toggleActions: "play none none none" as const }),
            },
        });

        tl.fromTo(
            wrapRef.current,
            { clipPath: `inset(${inset}% ${inset}% ${inset}% ${inset}%)` },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "orion.inOut" },
            0
        );

        tl.fromTo(
            imgRef.current,
            { scale: 1.15 },
            { scale: 1, duration: 1.8, ease: "orion.out" },
            0
        );
    }, { scope: wrapRef });

    return (
        <div
            ref={wrapRef}
            className={`overflow-hidden ${className ?? ""}`}
            style={{ aspectRatio: aspect, clipPath: `inset(${inset}% ${inset}% ${inset}% ${inset}%)` }}
        >
            <div ref={imgRef} className="relative w-full h-full">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="100vw"
                    priority={priority}
                    className="object-cover"
                />
            </div>
        </div>
    );
}
