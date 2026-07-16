"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isExternalImageSrc } from "@/lib/image-source";

type PortfolioPreviewMediaProps = {
    image: string;
    video?: string;
    alt: string;
    sizes: string;
    className?: string;
    videoMode?: "hover" | "always";
};

export function PortfolioPreviewMedia({
    image,
    video,
    alt,
    sizes,
    className = "object-cover",
    videoMode = "hover",
}: PortfolioPreviewMediaProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [imageFailed, setImageFailed] = useState(false);
    const alwaysShowVideo = Boolean(video && videoMode === "always");
    const unoptimized = isExternalImageSrc(image);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl || !alwaysShowVideo) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reducedMotion) return;

        void videoEl.play().catch(() => undefined);
    }, [alwaysShowVideo]);

    const playPreview = () => {
        if (videoMode !== "hover") return;

        const videoEl = videoRef.current;
        if (!videoEl) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reducedMotion) return;

        void videoEl.play().catch(() => undefined);
    };

    const stopPreview = () => {
        if (videoMode !== "hover") return;

        const videoEl = videoRef.current;
        if (!videoEl) return;

        videoEl.pause();
        videoEl.currentTime = 0;
    };

    return (
        <div
            className="absolute inset-0"
            onMouseEnter={playPreview}
            onMouseLeave={stopPreview}
            onFocus={playPreview}
            onBlur={stopPreview}
        >
            {image && !imageFailed ? (
                <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes={sizes}
                    unoptimized={unoptimized}
                    className={className}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="absolute inset-0 grid place-items-center bg-surface-1" aria-hidden="true">
                    <div className="relative h-28 w-28 rounded-full border border-border-bright/40">
                        <span className="absolute left-[20%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent/70 shadow-[0_0_16px_var(--glow)]" />
                        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/80 shadow-[0_0_18px_var(--glow)]" />
                        <span className="absolute right-[20%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent/70 shadow-[0_0_16px_var(--glow)]" />
                    </div>
                </div>
            )}

            {video && (
                <video
                    ref={videoRef}
                    src={video}
                    poster={image || undefined}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                        alwaysShowVideo
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    } ${className}`}
                    muted
                    loop
                    playsInline
                    autoPlay={alwaysShowVideo}
                    preload="metadata"
                    aria-label={alt}
                />
            )}
        </div>
    );
}
