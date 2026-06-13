"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
    const alwaysShowVideo = Boolean(video && videoMode === "always");

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
            {image ? (
                <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes={sizes}
                    className={className}
                />
            ) : (
                <div className="absolute inset-0 bg-surface-2" aria-hidden="true" />
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
