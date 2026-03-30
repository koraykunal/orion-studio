"use client";

import { MaskImage } from "@/components/motion/MaskImage";
import { TextReveal } from "@/components/motion/TextReveal";
import { OrionMark } from "@/components/effects/OrionMark";

export function ReelSection() {
    return (
        <section className="relative section-py bg-background overflow-hidden">
            <div className="absolute -right-[10%] -top-[5%] w-[50%] h-[80%] pointer-events-none">
                <OrionMark variant="belt" lineOpacity={0.07} globalOpacity={0.5} />
            </div>

            <div className="relative z-10 section-container">
                <MaskImage
                    src="/desktop.png"
                    alt="Orion Studio — crafting digital experiences"
                    aspect="21/9"
                    inset={10}
                    className="rounded-lg lg:rounded-xl"
                />

                <div className="mt-12 lg:mt-16 max-w-3xl mx-auto text-center">
                    <TextReveal as="p" type="words" className="text-editorial" stagger={0.04}>
                        Crafting digital experiences that move people — from first impression to lasting impact.
                    </TextReveal>
                </div>
            </div>
        </section>
    );
}
