"use client";

import { useEffect, useRef } from "react";

// Real-world astronomical coordinates (normalized to 0-1 range for a ~20 degree field of view)
// Right Ascension (RA) maps to X, Declination (Dec) maps to Y. 
// Note: In astronomy, RA increases to the east (left when looking south), so we invert it for typical celestial maps.
const STARS: Record<string, { cx: number; cy: number; r: number; b: number; delay: number; dur: number }> = {
    betelgeuse: { cx: 0.30, cy: 0.350, r: 5.5, b: 1.00, delay: 0.6, dur: 2.2 }, // Top Left, Orange Supergiant
    rigel: { cx: 0.74, cy: 0.75, r: 5.0, b: 0.95, delay: 0.9, dur: 2.6 },      // Bottom Right, Blue Supergiant
    bellatrix: { cx: 0.65, cy: 0.30, r: 3.2, b: 0.78, delay: 1.1, dur: 2.4 },  // Top Right
    saiph: { cx: 0.58, cy: 0.95, r: 2.8, b: 0.65, delay: 1.5, dur: 2.0 },      // Bottom Left
    alnitak: { cx: 0.65, cy: 0.60, r: 2.6, b: 0.68, delay: 1.85, dur: 1.6 },   // Belt Left
    alnilam: { cx: 0.52, cy: 0.63, r: 3.2, b: 0.82, delay: 1.4, dur: 1.8 },    // Belt Center
    mintaka: { cx: 0.44, cy: 0.61, r: 2.6, b: 0.68, delay: 1.7, dur: 1.6 },    // Belt Right
    meissa: { cx: 0.48, cy: 0.2, r: 2.0, b: 0.58, delay: 2.1, dur: 1.4 },     // Head
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

const CONTAINER_MAX = 88 * 16;
const PARALLAX = 0;
const SCALE_START = 6.0;
const LINE_START = 3.6;
const LINE_DUR = 3.0;
const TILT_RAD = -0.58;

function easeOutHeavy(t: number) { return 1 - Math.pow(1 - t, 6); }
function easeOutMedium(t: number) { return 1 - Math.pow(1 - t, 4); }
function easeOutLight(t: number) { return 1 - Math.pow(1 - t, 3); }

function getEase(r: number) {
    if (r > 4.5) return easeOutHeavy;
    if (r > 2.8) return easeOutMedium;
    return easeOutLight;
}

export function OrionConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const rafRef = useRef<number>(0);
    const t0Ref = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const bgStars = Array.from({ length: 380 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.0 + 0.2,
            op: Math.random() * 0.53 + 0.12,
            phase: Math.random() * Math.PI * 2,
            spd: Math.random() * 0.3 + 0.12,
        }));

        const twinkle = Object.fromEntries(
            Object.keys(STARS).map(id => [
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
            ctx.scale(dpr, dpr);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const onMouse = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current.x = (e.clientX - r.left) / r.width;
            mouseRef.current.y = (e.clientY - r.top) / r.height;
        };
        window.addEventListener("mousemove", onMouse, { passive: true });

        const pos = (id: string, scrollP: number = 0) => {
            const s = STARS[id];
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Reduced parallax impact from desktop to make it softer
            const parallaxScale = 0.4; // Always apply this scale, as isMobile is removed
            const px = (mx - 0.5) * PARALLAX * parallaxScale;
            const py = (my - 0.5) * PARALLAX * parallaxScale;

            const isMobile = W < 768;
            const offsetX = isMobile ? 0 : W * 0.15;

            // Dispersion depth effect: Push stars slightly outward from center
            const dispMultiplier = scrollP * 0.15; // 15% push outward
            const centerOffsetX = s.cx - 0.5;
            const centerOffsetY = s.cy - 0.5;
            const dx = centerOffsetX * dispMultiplier * W;
            const dy = centerOffsetY * dispMultiplier * H;

            return {
                x: s.cx * W + offsetX + px + dx,
                y: s.cy * H + py + dy,
            };
        };

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

        const drawStar = (x: number, y: number, r: number, b: number, alpha: number, id: string, scaleFactor: number) => {
            ctx.save();
            ctx.globalAlpha = alpha;

            const isBrightStar = id === "betelgeuse" || id === "rigel";

            if (isBrightStar) {
                const atmosAlpha = 0.07 * Math.max(scaleFactor, 0.12);
                const atmosR = r * (id === "betelgeuse" ? 60 : 50);
                const color = id === "betelgeuse" ? "#9070c0" : "#7080d0";
                drawAtmosphere(x, y, atmosR, color, atmosAlpha);
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
                const spike = (angle: number, length: number) => {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    const sg = ctx.createLinearGradient(0, 0, length, 0);
                    sg.addColorStop(0, `rgba(210, 200, 240, ${b * 0.5 * spikeAlpha})`);
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

        const isVisible = { current: true };
        const visObserver = new IntersectionObserver(
            (entries) => { isVisible.current = entries[0].isIntersecting; },
            { threshold: 0.01 }
        );
        visObserver.observe(canvas);

        const frame = (ts: number) => {
            if (!t0Ref.current) t0Ref.current = ts;
            const t = (ts - t0Ref.current) / 1000;

            if (!isVisible.current || document.hidden) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            const wrapper = canvasRef.current?.parentElement;
            const scrollP = wrapper ? parseFloat(wrapper.style.getPropertyValue('--orion-progress')) || 0 : 0;

            ctx.clearRect(0, 0, W, H);

            // Background stars — flat fill (no per-star gradients)
            ctx.fillStyle = "rgb(235, 230, 255)";
            bgStars.forEach(s => {
                const flicker = Math.sin(t * s.spd + s.phase) * 0.12;
                const baseOp = Math.max(0, s.op + flicker);
                ctx.globalAlpha = Math.min(1, baseOp + scrollP * 0.5);

                const centerOffsetX = s.x - 0.5;
                const centerOffsetY = s.y - 0.5;
                const dx = centerOffsetX * scrollP * 0.12 * W;
                const dy = centerOffsetY * scrollP * 0.12 * H;

                ctx.beginPath();
                ctx.arc(s.x * W + dx, s.y * H + dy, s.r * (1 + scrollP * 0.4), 0, Math.PI * 2);
                ctx.fill();
            });
            const isMobile = W < 768;
            ctx.globalAlpha = 1;
            const cx = W * 0.5 + (isMobile ? 0 : W * 0.15);
            const cy = H * 0.5;
            const tilt = isMobile ? 0 : TILT_RAD;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(tilt);
            ctx.translate(-cx, -cy);

            Object.entries(STARS).forEach(([id, s]) => {
                const elapsed = t - s.delay;
                if (elapsed <= 0) return;

                const rawP = Math.min(1, elapsed / s.dur);
                const ease = getEase(s.r);
                const p = ease(rawP);
                const scale = SCALE_START - (SCALE_START - 1) * p;
                const scaleFactor = (scale - 1) / (SCALE_START - 1);
                const tw = twinkle[id];
                const flicker = rawP >= 1 ? Math.sin(t * tw.spd + tw.phase) * 0.08 : 0;
                const { x, y } = pos(id, scrollP);

                // Boost brightness and size based on scroll dispersion
                const boostedScale = scale * (1 + scrollP * 0.25);
                const baseB = Math.min(1, s.b + flicker);
                const boostedB = Math.min(1, baseB + scrollP * 0.6); // Brighten significantly

                drawStar(x, y, s.r * boostedScale, boostedB, p, id, scaleFactor);
            });

            const lineOpacity = (isMobile ? 0.07 : 0.22) * (1 - scrollP * 0.8); // Fade out lines as it scatters
            const lineP = Math.min(1, Math.max(0, (t - LINE_START) / LINE_DUR));

            if (lineP > 0 && lineOpacity > 0.01) {
                LINES.forEach(([a, b]) => {
                    const pa = pos(a, scrollP);
                    const pb = pos(b, scrollP);
                    const d = Math.hypot(pb.x - pa.x, pb.y - pa.y);

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(pa.x, pa.y);
                    ctx.lineTo(pb.x, pb.y);
                    ctx.setLineDash([d]);
                    ctx.lineDashOffset = d * (1 - easeOutHeavy(lineP));
                    ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.restore();
                });
            }

            ctx.restore();

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);

        return () => {
            visObserver.disconnect();
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
            window.removeEventListener("mousemove", onMouse);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
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
