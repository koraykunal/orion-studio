"use client";

import { useEffect, useRef } from "react";

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
    bgStarCount = 60,
}: OrionMarkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    const activeStars = VARIANT_STARS[variant];
    const activeLines = VARIANT_LINES[variant];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const bgStarsData = Array.from({ length: bgStarCount }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 0.8 + 0.2,
            op: Math.random() * 0.4 + 0.08,
            phase: Math.random() * Math.PI * 2,
            spd: Math.random() * 0.3 + 0.1,
        }));

        const twinkle = Object.fromEntries(
            activeStars.map(id => [
                id,
                { phase: Math.random() * Math.PI * 2, spd: Math.random() * 0.4 + 0.2 },
            ])
        );

        let W = 0, H = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const drawAtmosphere = (x: number, y: number, r: number, color: string, alpha: number) => {
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
            grad.addColorStop(0.35, `${color}${Math.round(alpha * 0.35 * 255).toString(16).padStart(2, "0")}`);
            grad.addColorStop(1, `${color}00`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawStar = (x: number, y: number, r: number, b: number, id: string) => {
            ctx.save();

            const isBright = id === "betelgeuse" || id === "rigel";

            if (isBright) {
                const atmosR = r * (id === "betelgeuse" ? 60 : 50);
                const color = id === "betelgeuse" ? "#9070c0" : "#7080d0";
                drawAtmosphere(x, y, atmosR, color, 0.07);
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
                const spike = (angle: number, length: number) => {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    const sg = ctx.createLinearGradient(0, 0, length, 0);
                    sg.addColorStop(0, `rgba(210, 200, 240, ${b * 0.35})`);
                    sg.addColorStop(1, "rgba(210, 200, 240, 0)");
                    ctx.fillStyle = sg;
                    ctx.beginPath();
                    ctx.moveTo(0, -0.6);
                    ctx.lineTo(length, 0);
                    ctx.lineTo(0, 0.6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                };
                const spikeLen = r * 9;
                spike(0, spikeLen);
                spike(Math.PI, spikeLen);
                spike(Math.PI / 2, spikeLen * 0.5);
                spike(-Math.PI / 2, spikeLen * 0.5);
            }

            ctx.restore();
        };

        const pos = (id: string) => {
            const s = STARS[id];
            let px = s.cx;
            let py = s.cy;
            if (mirror) px = 1 - px;
            return { x: px * W, y: py * H };
        };

        const isVisible = { current: false };
        const observer = new IntersectionObserver(
            (entries) => { isVisible.current = entries[0].isIntersecting; },
            { threshold: 0.01 }
        );
        observer.observe(canvas);

        let t0 = 0;

        const frame = (ts: number) => {
            if (!t0) t0 = ts;
            const t = (ts - t0) / 1000;

            if (!isVisible.current || document.hidden) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            ctx.clearRect(0, 0, W, H);

            ctx.save();
            if (rotate) {
                ctx.translate(W / 2, H / 2);
                ctx.rotate((rotate * Math.PI) / 180);
                ctx.translate(-W / 2, -H / 2);
            }

            ctx.globalAlpha = globalOpacity;

            ctx.fillStyle = "rgb(235, 230, 255)";
            bgStarsData.forEach(s => {
                const flicker = Math.sin(t * s.spd + s.phase) * 0.1;
                ctx.globalAlpha = Math.max(0, (s.op + flicker)) * globalOpacity;
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

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

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, [variant, lineOpacity, globalOpacity, rotate, mirror, bgStarCount, activeStars, activeLines]);

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
