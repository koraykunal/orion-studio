"use client";

import { useMemo, useRef } from "react";
import { useCanvasLoop } from "@/hooks/use-canvas-loop";
import { seeded } from "@/lib/seeded-random";

const STARS: Record<string, { cx: number; cy: number; r: number; b: number }> = {
    betelgeuse: { cx: 0.30, cy: 0.35, r: 5.5, b: 1.00 },
    rigel:      { cx: 0.74, cy: 0.75, r: 5.0, b: 0.95 },
    bellatrix:  { cx: 0.65, cy: 0.30, r: 3.2, b: 0.78 },
    saiph:      { cx: 0.58, cy: 0.95, r: 2.8, b: 0.65 },
    alnitak:    { cx: 0.65, cy: 0.60, r: 2.6, b: 0.68 },
    alnilam:    { cx: 0.52, cy: 0.63, r: 3.2, b: 0.82 },
    mintaka:    { cx: 0.44, cy: 0.61, r: 2.6, b: 0.68 },
    meissa:     { cx: 0.48, cy: 0.20, r: 2.0, b: 0.58 },
};

const LINES: [string, string][] = [
    ["meissa", "betelgeuse"],
    ["meissa", "bellatrix"],
    ["betelgeuse", "mintaka"],
    ["bellatrix", "mintaka"],
    ["mintaka", "alnilam"],
    ["alnilam", "alnitak"],
    ["alnitak", "rigel"],
    ["mintaka", "saiph"],
];

type Variant = "full" | "belt" | "shoulders" | "minimal";

const VARIANT_STARS: Record<Variant, string[]> = {
    full: Object.keys(STARS),
    belt: ["mintaka", "alnilam", "alnitak"],
    shoulders: ["betelgeuse", "bellatrix", "mintaka", "alnilam", "alnitak", "rigel", "saiph"],
    minimal: ["betelgeuse", "bellatrix", "rigel", "saiph"],
};

const VARIANT_LINES: Record<Variant, [string, string][]> = {
    full: LINES,
    belt: [["mintaka", "alnilam"], ["alnilam", "alnitak"]],
    shoulders: [
        ["betelgeuse", "mintaka"], ["bellatrix", "mintaka"],
        ["mintaka", "alnilam"], ["alnilam", "alnitak"],
        ["alnitak", "rigel"], ["mintaka", "saiph"],
    ],
    minimal: [
        ["betelgeuse", "bellatrix"], ["betelgeuse", "saiph"],
        ["bellatrix", "rigel"], ["saiph", "rigel"],
    ],
};

interface OrionMarkProps {
    variant?: Variant;
    className?: string;
    lineOpacity?: number;
    globalOpacity?: number;
    rotate?: number;
    mirror?: boolean;
    bgStarCount?: number;
}

export function OrionMark({
    variant = "full",
    className,
    lineOpacity = 0.15,
    globalOpacity = 0.7,
    rotate = 0,
    mirror = false,
    bgStarCount = 30,
}: OrionMarkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const activeStars = VARIANT_STARS[variant];
    const activeLines = VARIANT_LINES[variant];

    const bgStarsData = useMemo(
        () =>
            Array.from({ length: bgStarCount }, (_, i) => ({
                x: seeded(i + 19),
                y: seeded(i + 61),
                r: seeded(i + 103) * 0.8 + 0.2,
                op: seeded(i + 149) * 0.4 + 0.08,
                phase: seeded(i + 197) * Math.PI * 2,
                spd: seeded(i + 241) * 0.3 + 0.1,
            })),
        [bgStarCount]
    );

    const twinkle = useMemo(
        () =>
            Object.fromEntries(
                activeStars.map((id, i) => [
                    id,
                    { phase: seeded(i + 313) * Math.PI * 2, spd: seeded(i + 353) * 0.4 + 0.2 },
                ])
            ),
        [activeStars]
    );

    useCanvasLoop(canvasRef, ({ ctx, width: W, height: H, time: t }) => {
        const drawStar = (x: number, y: number, r: number, b: number, id: string) => {
            ctx.save();

            const isBright = id === "betelgeuse" || id === "rigel";

            if (isBright) {
                const atmosR = r * (id === "betelgeuse" ? 60 : 50);
                ctx.globalAlpha = globalOpacity * 0.07;
                ctx.fillStyle = id === "betelgeuse" ? "rgba(144, 112, 192, 0.15)" : "rgba(112, 128, 208, 0.15)";
                ctx.beginPath();
                ctx.arc(x, y, atmosR, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = globalOpacity;
            }

            const glowAlpha = isBright ? 0.28 : 0.18;
            const outerGlowR = r * (isBright ? 22 : 12);
            const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, outerGlowR);
            outerGlow.addColorStop(0, `rgba(180, 160, 220, ${b * glowAlpha})`);
            outerGlow.addColorStop(0.3, `rgba(160, 140, 210, ${b * glowAlpha * 0.35})`);
            outerGlow.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(x, y, outerGlowR, 0, Math.PI * 2);
            ctx.fill();

            const core = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8);
            core.addColorStop(0, `rgba(230, 225, 255, ${b})`);
            core.addColorStop(0.4, `rgba(200, 190, 240, ${b * 0.25})`);
            core.addColorStop(1, "rgba(160, 140, 210, 0)");
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
            ctx.fill();

            if (isBright) {
                ctx.globalAlpha = globalOpacity * b * 0.35;
                ctx.fillStyle = "rgba(210, 200, 240, 1)";
                const spikeLen = r * 9;

                const drawSpike = (angle: number, length: number) => {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, -0.6);
                    ctx.lineTo(length, 0);
                    ctx.lineTo(0, 0.6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                };
                drawSpike(0, spikeLen);
                drawSpike(Math.PI, spikeLen);
                drawSpike(Math.PI / 2, spikeLen * 0.5);
                drawSpike(-Math.PI / 2, spikeLen * 0.5);
            }

            ctx.restore();
        };

        const pos = (id: string) => {
            const s = STARS[id];
            let px = s.cx;
            const py = s.cy;
            if (mirror) px = 1 - px;
            return { x: px * W, y: py * H };
        };

        ctx.clearRect(0, 0, W, H);

        ctx.save();
        if (rotate) {
            ctx.translate(W / 2, H / 2);
            ctx.rotate((rotate * Math.PI) / 180);
            ctx.translate(-W / 2, -H / 2);
        }

        ctx.fillStyle = "rgb(235, 230, 255)";
        for (const s of bgStarsData) {
            const flicker = Math.sin(t * s.spd + s.phase) * 0.1;
            ctx.globalAlpha = Math.max(0, s.op + flicker) * globalOpacity;
            ctx.beginPath();
            ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = globalOpacity;

        activeLines.forEach(([a, b]) => {
            const pa = pos(a);
            const pb = pos(b);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        activeStars.forEach((id) => {
            const s = STARS[id];
            const tw = twinkle[id];
            const flicker = Math.sin(t * tw.spd + tw.phase) * 0.08;
            const { x, y } = pos(id);
            drawStar(x, y, s.r, Math.min(1, s.b + flicker), id);
        });

        ctx.restore();
    }, { fps: 24, threshold: 0.15 });

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
            aria-hidden="true"
        />
    );
}
