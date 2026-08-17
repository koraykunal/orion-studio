"use client";

import { useMemo, useRef } from "react";
import { useCanvasLoop } from "@/hooks/use-canvas-loop";
import { seeded } from "@/lib/seeded-random";

const STARS: Record<string, { cx: number; cy: number; r: number; b: number; delay: number; dur: number }> = {
    betelgeuse: { cx: 0.30, cy: 0.350, r: 5.5, b: 1.00, delay: 0.6, dur: 2.2 },
    rigel: { cx: 0.74, cy: 0.75, r: 5.0, b: 0.95, delay: 0.9, dur: 2.6 },
    bellatrix: { cx: 0.65, cy: 0.30, r: 3.2, b: 0.78, delay: 1.1, dur: 2.4 },
    saiph: { cx: 0.58, cy: 0.95, r: 2.8, b: 0.65, delay: 1.5, dur: 2.0 },
    alnitak: { cx: 0.65, cy: 0.60, r: 2.6, b: 0.68, delay: 1.85, dur: 1.6 },
    alnilam: { cx: 0.52, cy: 0.63, r: 3.2, b: 0.82, delay: 1.4, dur: 1.8 },
    mintaka: { cx: 0.44, cy: 0.61, r: 2.6, b: 0.68, delay: 1.7, dur: 1.6 },
    meissa: { cx: 0.48, cy: 0.2, r: 2.0, b: 0.58, delay: 2.1, dur: 1.4 },
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

const SCALE_START = 6.0;
const LINE_START = 3.6;
const LINE_DUR = 3.0;
const TILT_RAD = -0.58;
const BG_STAR_COUNT = 150;
const SETTLED_TIME = 8;

function easeOutHeavy(t: number) { return 1 - Math.pow(1 - t, 6); }
function easeOutMedium(t: number) { return 1 - Math.pow(1 - t, 4); }
function easeOutLight(t: number) { return 1 - Math.pow(1 - t, 3); }

function getEase(r: number) {
    if (r > 4.5) return easeOutHeavy;
    if (r > 2.8) return easeOutMedium;
    return easeOutLight;
}

function drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    b: number,
    alpha: number,
    id: string,
    scaleFactor: number
) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const isBrightStar = id === "betelgeuse" || id === "rigel";

    if (isBrightStar) {
        const atmosAlpha = 0.07 * Math.max(scaleFactor, 0.12);
        const atmosR = r * (id === "betelgeuse" ? 60 : 50);
        ctx.globalAlpha = alpha * atmosAlpha;
        ctx.fillStyle = id === "betelgeuse" ? "rgba(144, 112, 192, 0.15)" : "rgba(112, 128, 208, 0.15)";
        ctx.beginPath();
        ctx.arc(x, y, atmosR, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
    }

    const settled = isBrightStar ? 0.28 : 0.18;
    const glowPeak = isBrightStar ? 0.30 : 0.18;
    const glowAlpha = settled + (glowPeak - settled) * scaleFactor;
    const outerGlowR = r * (isBrightStar ? 22 : 12);
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

    if (isBrightStar) {
        const spikeAlpha = 0.45 + scaleFactor * 0.45;
        const spikeLen = r * 9;
        ctx.globalAlpha = alpha * b * 0.5 * spikeAlpha;
        ctx.fillStyle = "rgba(210, 200, 240, 1)";

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
}

export function OrionConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const bgStars = useMemo(
        () =>
            Array.from({ length: BG_STAR_COUNT }, (_, i) => ({
                x: seeded(i + 11),
                y: seeded(i + 53),
                r: seeded(i + 97) * 1.0 + 0.2,
                op: seeded(i + 137) * 0.53 + 0.12,
                phase: seeded(i + 191) * Math.PI * 2,
                spd: seeded(i + 233) * 0.3 + 0.12,
            })),
        []
    );

    const twinkle = useMemo(
        () =>
            Object.fromEntries(
                Object.keys(STARS).map((id, i) => [
                    id,
                    { phase: seeded(i + 307) * Math.PI * 2, spd: seeded(i + 349) * 0.4 + 0.2 },
                ])
            ),
        []
    );

    useCanvasLoop(
        canvasRef,
        ({ ctx, width, height, time }) => {
            const isMobile = width < 768;
            const offsetX = isMobile ? 0 : width * 0.15;

            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "rgb(235, 230, 255)";
            for (const s of bgStars) {
                const flicker = Math.sin(time * s.spd + s.phase) * 0.12;
                ctx.globalAlpha = Math.max(0, s.op + flicker);
                ctx.beginPath();
                ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            const cx = width * 0.5 + offsetX;
            const cy = height * 0.5;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(isMobile ? 0 : TILT_RAD);
            ctx.translate(-cx, -cy);

            Object.entries(STARS).forEach(([id, s]) => {
                const elapsedStar = time - s.delay;
                if (elapsedStar <= 0) return;

                const rawP = Math.min(1, elapsedStar / s.dur);
                const p = getEase(s.r)(rawP);
                const scale = SCALE_START - (SCALE_START - 1) * p;
                const scaleFactor = (scale - 1) / (SCALE_START - 1);
                const tw = twinkle[id];
                const flicker = rawP >= 1 ? Math.sin(time * tw.spd + tw.phase) * 0.08 : 0;

                drawStar(
                    ctx,
                    s.cx * width + offsetX,
                    s.cy * height,
                    s.r * scale,
                    Math.min(1, s.b + flicker),
                    p,
                    id,
                    scaleFactor
                );
            });

            const lineOpacity = isMobile ? 0.07 : 0.22;
            const lineP = Math.min(1, Math.max(0, (time - LINE_START) / LINE_DUR));

            if (lineP > 0) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
                ctx.lineWidth = 1;
                LINES.forEach(([a, b]) => {
                    const pa = { x: STARS[a].cx * width + offsetX, y: STARS[a].cy * height };
                    const pb = { x: STARS[b].cx * width + offsetX, y: STARS[b].cy * height };
                    const d = Math.hypot(pb.x - pa.x, pb.y - pa.y);

                    ctx.beginPath();
                    ctx.moveTo(pa.x, pa.y);
                    ctx.lineTo(pb.x, pb.y);
                    ctx.setLineDash([d]);
                    ctx.lineDashOffset = d * (1 - easeOutHeavy(lineP));
                    ctx.stroke();
                });
                ctx.setLineDash([]);
            }

            ctx.restore();
        },
        { stillTime: SETTLED_TIME }
    );

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
