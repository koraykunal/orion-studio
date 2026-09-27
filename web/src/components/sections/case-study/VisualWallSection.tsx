"use client";

import Image from "next/image";
import type { VisualWallData } from "@/lib/project-types";

const IMAGE_FILE_RE = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const VIDEO_FILE_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function VisualWallMedia({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
    if (VIDEO_FILE_RE.test(src)) {
        return (
            <video
                src={src}
                className="block h-auto w-full rounded-md"
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label={alt || undefined}
            />
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            loading={priority ? "eager" : "lazy"}
            className="block h-auto w-full rounded-md"
        />
    );
}

/**
 * Masonry wall of supporting visuals.
 *
 * Extracted out of CaseStudyClient so it is a normal section with a normal
 * editor form and a normal place in the render order. Items whose source is
 * neither a recognised image nor a recognised video are dropped rather than
 * rendered as a broken tile, which is what the previous inline filter did, but
 * the section itself is no longer hoisted to a fixed position on the page.
 */
export function VisualWallSection({ data }: { data: VisualWallData }) {
    const items = data.items.filter((item) => item.src && (IMAGE_FILE_RE.test(item.src) || VIDEO_FILE_RE.test(item.src)));
    if (items.length === 0) return null;

    return (
        <section className="section-container" aria-label="Supporting visuals">
            <div className="mx-auto max-w-352">
                <div className="columns-1 gap-4 md:columns-2 lg:columns-3 lg:gap-5">
                    {items.map((item, index) => (
                        <div key={`${item.src}-${index}`} className="mb-3 break-inside-avoid rounded-md bg-surface-1 lg:mb-5">
                            <VisualWallMedia src={item.src} alt={item.alt} priority={index < 2} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
