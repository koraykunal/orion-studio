"use client";

import { useRef } from "react";
import { gsap, DrawSVGPlugin, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { EASES, STAGGER } from "@/lib/animations/config";

const steps = [
    {
        index: "01",
        title: "Alignment Sprint",
        detail:
            "Two-week intake focused on discovery, measurement frameworks, and scope locking. We surface every assumption before a line of code is written.",
    },
    {
        index: "02",
        title: "Build Loop",
        detail:
            "Weekly sprints covering design, engineering, QA, and stakeholder reviews. Momentum never pauses between disciplines.",
    },
    {
        index: "03",
        title: "Launch & Scale",
        detail:
            "Staging reviews, analytics setup, performance benchmarks, and handover for growth teams. Ready for scale on day one.",
    },
];

function StepItem({
    step,
    isLast,
}: {
    step: (typeof steps)[number];
    isLast: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!ref.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        if (numRef.current) {
            tl.from(numRef.current, {
                opacity: 0,
                scale: 0.8,
                y: 20,
                duration: 0.9,
                ease: EASES.expo,
            }, 0);
        }

        if (lineRef.current) {
            tl.from(lineRef.current, {
                drawSVG: "0%",
                duration: 1.4,
                ease: EASES.expo,
            }, 0.2);
        }
    }, { scope: ref });

    return (
        <div ref={ref} className={`py-10 lg:py-14 ${!isLast ? "" : ""}`}>
            <div className="grid-container gap-y-6">
                {/* Index number */}
                <div className="col-span-4 md:col-span-2 lg:col-span-2">
                    <span
                        ref={numRef}
                        className="text-metric text-foreground-subtle block"
                    >
                        {step.index}
                    </span>
                </div>

                {/* Content */}
                <div className="col-span-12 md:col-span-6 lg:col-start-3 lg:col-span-6 space-y-4">
                    {/* Divider line */}
                    <svg
                        viewBox="0 0 1000 2"
                        preserveAspectRatio="none"
                        style={{
                            width: "100%",
                            height: "1px",
                            display: "block",
                            overflow: "visible",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <line
                            ref={lineRef}
                            x1="0" y1="1" x2="1000" y2="1"
                            stroke="var(--border)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    <TextReveal as="h3" type="words" className="text-heading">
                        {step.title}
                    </TextReveal>

                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted max-w-[48ch]"
                        delay={0.1}
                    >
                        {step.detail}
                    </TextReveal>
                </div>
            </div>
        </div>
    );
}

export function PhilosophySection() {
    return (
        <section className="relative section-py bg-background overflow-hidden" id="process">
            <div className="absolute -left-[15%] top-[10%] w-[55%] h-[70%] pointer-events-none">
                <OrionMark variant="shoulders" lineOpacity={0.06} globalOpacity={0.4} rotate={-10} mirror />
            </div>

            <div className="relative z-10 section-container mb-12 lg:mb-16">
                <span className="text-index text-foreground-subtle block mb-6">
                    03 — Process
                </span>
                <TextReveal as="h2" type="lines" className="text-title max-w-2xl">
                    Simple cadence, extraordinary output
                </TextReveal>
            </div>

            {steps.map((step, i) => (
                <StepItem
                    key={step.index}
                    step={step}
                    isLast={i === steps.length - 1}
                />
            ))}
        </section>
    );
}
