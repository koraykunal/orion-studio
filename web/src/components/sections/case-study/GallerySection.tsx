"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES, STAGGER } from "@/lib/animations/config";
import type { GalleryData } from "@/lib/project-types";

const columnClasses: Record<1 | 2 | 3, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

export function GallerySection({ data }: { data: GalleryData }) {
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!gridRef.current) return;

        const items = gridRef.current.querySelectorAll(".gallery-item");
        if (!items.length) return;

        gsap.fromTo(
            items,
            { clipPath: "inset(8% 8% 8% 8%)", scale: 1.06 },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 1.4,
                ease: EASES.brandInOut,
                stagger: STAGGER.loose,
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, { scope: gridRef });

    return (
        <div className="section-container">
            <div ref={gridRef} className={`grid ${columnClasses[data.columns]} gap-4 lg:gap-6`}>
                {data.images.map((img, i) => (
                    <div
                        key={i}
                        className="gallery-item relative overflow-hidden rounded-lg lg:rounded-xl"
                        style={{ aspectRatio: "4/3", clipPath: "inset(8% 8% 8% 8%)" }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes={
                                data.columns === 1
                                    ? "100vw"
                                    : data.columns === 2
                                      ? "(max-width: 768px) 100vw, 50vw"
                                      : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            }
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
