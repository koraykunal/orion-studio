"use client";

import { MaskImage } from "@/components/motion/MaskImage";
import type { FullImageData } from "@/lib/project-types";

export function FullImageSection({ data }: { data: FullImageData }) {
    return (
        <div className="section-container">
            <MaskImage
                src={data.image}
                alt={data.alt}
                aspect="21/9"
                inset={8}
                className="rounded-lg lg:rounded-xl"
            />
        </div>
    );
}
