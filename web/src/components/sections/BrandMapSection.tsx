"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollTrigger } from "@/lib/animations/gsap";

const ITEMS = [0, 1, 2, 3] as const;
const ZOOMS = [1.08, 1.34, 1.18, 1.46] as const;
const COPY_LAYOUTS = [
    { align: "left", className: "left-[8%] top-[56%] md:left-[9%] md:top-[22%]" },
    { align: "left", className: "left-[8%] top-[56%] md:left-[56%] md:top-[21%]" },
    { align: "left", className: "left-[8%] top-[56%] md:left-[10%] md:top-[57%]" },
    { align: "left", className: "left-[8%] top-[56%] md:left-[52%] md:top-[56%]" },
] as const;

type Star = {
    x: number;
    y: number;
    r: number;
    alpha: number;
    phase: number;
    speed: number;
};

type Orbit = {
    rx: number;
    ry: number;
    rz: number;
    yaw: number;
    pitch: number;
    roll: number;
    phase: number;
    alpha: number;
    width: number;
};

type Vec3 = { x: number; y: number; z: number };
type Projection = Vec3 & { sx: number; sy: number; scale: number; alpha: number; visible: boolean };

const ORBITS: Orbit[] = [
    { rx: 0.54, ry: 0.17, rz: 0.36, yaw: -0.22, pitch: 0.34, roll: -0.3, phase: 0, alpha: 0.25, width: 1.05 },
    { rx: 0.44, ry: 0.27, rz: 0.42, yaw: 0.38, pitch: -0.18, roll: 0.42, phase: 0.19, alpha: 0.15, width: 0.78 },
    { rx: 0.66, ry: 0.12, rz: 0.31, yaw: 0.04, pitch: 0.08, roll: 0.04, phase: 0.38, alpha: 0.14, width: 0.68 },
    { rx: 0.33, ry: 0.34, rz: 0.46, yaw: 0.56, pitch: 0.2, roll: 0.92, phase: 0.62, alpha: 0.11, width: 0.58 },
];

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

function clamp01(value: number) {
    return clamp(value, 0, 1);
}

function smoothstep(value: number) {
    const x = clamp01(value);
    return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function seeded(index: number) {
    const x = Math.sin(index * 735.17) * 10000;
    return x - Math.floor(x);
}

function buildStars(count: number): Star[] {
    return Array.from({ length: count }, (_, i) => ({
        x: seeded(i + 17),
        y: seeded(i + 41),
        r: 0.22 + seeded(i + 73) * 0.95,
        alpha: 0.1 + seeded(i + 101) * 0.48,
        phase: seeded(i + 149) * Math.PI * 2,
        speed: 0.1 + seeded(i + 181) * 0.34,
    }));
}

function rotate3d(point: Vec3, orbit: Orbit): Vec3 {
    let { x, y, z } = point;

    const cy = Math.cos(orbit.yaw);
    const sy = Math.sin(orbit.yaw);
    [x, z] = [x * cy + z * sy, -x * sy + z * cy];

    const cp = Math.cos(orbit.pitch);
    const sp = Math.sin(orbit.pitch);
    [y, z] = [y * cp - z * sp, y * sp + z * cp];

    const cr = Math.cos(orbit.roll);
    const sr = Math.sin(orbit.roll);
    [x, y] = [x * cr - y * sr, x * sr + y * cr];

    return { x, y, z };
}

function orbitPoint(t: number, orbit: Orbit, base: number, time: number): Vec3 {
    const angle = t * Math.PI * 2 + orbit.phase * Math.PI * 2 + time * 0.035;
    const wobble = Math.sin(angle * 2.2 + orbit.phase * 8 + time * 0.08) * base * 0.008;
    const local = {
        x: Math.cos(angle) * (base * orbit.rx + wobble),
        y: Math.sin(angle) * (base * orbit.ry + wobble),
        z: Math.sin(angle) * base * orbit.rz,
    };

    return rotate3d(local, orbit);
}

function projectPoint(
    point: Vec3,
    camera: Vec3,
    width: number,
    height: number,
    zoom: number,
    anchorX: number,
    anchorY: number
): Projection {
    const base = Math.min(width, height * 1.2);
    const dx = point.x - camera.x;
    const dy = point.y - camera.y;
    const dz = point.z - camera.z;
    const focal = base * 1.12;
    const perspective = focal / (focal - dz * 0.62);
    const scale = clamp(perspective * zoom, 0.28, 2.4);
    const depth = clamp01((dz / base + 0.72) / 1.44);

    return {
        ...point,
        sx: anchorX + dx * scale,
        sy: anchorY + dy * scale,
        scale,
        alpha: 0.18 + depth * 0.82,
        visible: scale > 0.2,
    };
}

function drawBackgroundStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 8);
    glow.addColorStop(0, "rgba(224, 218, 255, 0.26)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 8, 0, Math.PI * 2);
    ctx.fill();

    const core = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.8);
    core.addColorStop(0, "rgba(246, 244, 255, 0.94)");
    core.addColorStop(0.55, "rgba(214, 204, 255, 0.34)");
    core.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawRadiantStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 34);
    halo.addColorStop(0, "rgba(238, 234, 255, 0.72)");
    halo.addColorStop(0.28, "rgba(176, 150, 224, 0.26)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, radius * 34, 0, Math.PI * 2);
    ctx.fill();

    const core = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
    core.addColorStop(0, "rgba(250, 248, 255, 1)");
    core.addColorStop(0.42, "rgba(218, 208, 255, 0.5)");
    core.addColorStop(1, "rgba(168, 148, 220, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.42;
    ctx.fillStyle = "rgba(238, 234, 255, 1)";
    const spike = (angle: number, length: number, width: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-length * 0.08, -width);
        ctx.lineTo(length, 0);
        ctx.lineTo(-length * 0.08, width);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };
    spike(0, radius * 12, 0.62);
    spike(Math.PI, radius * 12, 0.62);
    spike(Math.PI / 2, radius * 6, 0.48);
    spike(-Math.PI / 2, radius * 6, 0.48);

    ctx.restore();
}

function drawOrbit(
    ctx: CanvasRenderingContext2D,
    orbit: Orbit,
    base: number,
    time: number,
    camera: Vec3,
    width: number,
    height: number,
    zoom: number,
    anchorX: number,
    anchorY: number,
    focusT: number
) {
    const steps = 260;
    const points: Projection[] = [];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const point = projectPoint(orbitPoint(t, orbit, base, time), camera, width, height, zoom, anchorX, anchorY);
        if (point.visible) points.push(point);
    }

    if (points.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.sx, point.sy);
        else ctx.lineTo(point.sx, point.sy);
    });
    ctx.strokeStyle = `rgba(226, 220, 255, ${orbit.alpha * 0.72})`;
    ctx.lineWidth = orbit.width * 1.05;
    ctx.stroke();

    for (let i = 1; i < points.length; i++) {
        const t = i / Math.max(1, points.length - 1);
        const focusDistance = Math.min(Math.abs(t - focusT), 1 - Math.abs(t - focusT));
        const focus = Math.max(0, 1 - focusDistance * 7);
        if (focus <= 0.02) continue;

        ctx.strokeStyle = `rgba(238, 234, 255, ${focus * 0.24})`;
        ctx.lineWidth = orbit.width * (1.25 + focus * 1.2);
        ctx.beginPath();
        ctx.moveTo(points[i - 1].sx, points[i - 1].sy);
        ctx.lineTo(points[i].sx, points[i].sy);
        ctx.stroke();
    }

    ctx.restore();
}

export function BrandMapSection() {
    const t = useTranslations("home");
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const progressRef = useRef(0);
    const activeIndexRef = useRef(0);
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const stars = useMemo(() => buildStars(170), []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.9,
            onUpdate: (self) => {
                const nextProgress = self.progress;
                const nextIndex = Math.min(ITEMS.length - 1, Math.floor(clamp01(nextProgress) * ITEMS.length));

                progressRef.current = nextProgress;
                setProgress(nextProgress);

                if (nextIndex !== activeIndexRef.current) {
                    activeIndexRef.current = nextIndex;
                    setActiveIndex(nextIndex);
                }
            },
        });

        return () => trigger.kill();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let start = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const frame = (timestamp: number) => {
            if (!start) start = timestamp;
            const time = (timestamp - start) / 1000;
            const scrollP = clamp01(progressRef.current);
            const eased = smoothstep(scrollP);
            const focusT = 0.08 + eased * 0.82;
            const base = Math.min(width, height * (width < 768 ? 1.36 : 1.2));
            const zoomPosition = scrollP * (ZOOMS.length - 1);
            const zoomIndex = Math.min(ZOOMS.length - 2, Math.floor(zoomPosition));
            const zoomLocal = smoothstep(zoomPosition - zoomIndex);
            const zoom = lerp(ZOOMS[zoomIndex], ZOOMS[zoomIndex + 1], zoomLocal);
            const starPoint = orbitPoint(focusT, ORBITS[0], base, time);
            const cameraLead = orbitPoint(clamp01(focusT - 0.035), ORBITS[0], base, time);
            const anchorX = width * (width < 768 ? 0.5 : 0.54 + Math.sin(eased * Math.PI * 2) * 0.035);
            const anchorY = height * (width < 768 ? 0.47 : 0.48 + Math.cos(eased * Math.PI * 1.4) * 0.035);
            const movingStar = projectPoint(starPoint, cameraLead, width, height, zoom, anchorX, anchorY);

            ctx.clearRect(0, 0, width, height);

            const atmosphere = ctx.createRadialGradient(width * 0.54, height * 0.48, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.86);
            atmosphere.addColorStop(0, "rgba(36, 29, 58, 0.74)");
            atmosphere.addColorStop(0.42, "rgba(20, 17, 29, 0.34)");
            atmosphere.addColorStop(1, "rgba(8, 8, 10, 0)");
            ctx.fillStyle = atmosphere;
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                const twinkle = Math.sin(time * star.speed + star.phase) * 0.1;
                const driftX = (star.x - 0.5) * scrollP * width * 0.08;
                const driftY = (star.y - 0.5) * scrollP * height * 0.12;
                drawBackgroundStar(ctx, star.x * width + driftX, star.y * height + driftY, star.r, clamp(star.alpha + twinkle, 0, 0.82));
            });

            ORBITS.forEach((orbit) => drawOrbit(ctx, orbit, base, time, cameraLead, width, height, zoom, anchorX, anchorY, focusT));
            drawRadiantStar(ctx, movingStar.sx, movingStar.sy, 4.6 * movingStar.scale, 0.92);

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, [stars]);

    return (
        <section id="brand-map" ref={sectionRef} className="relative h-[430svh] bg-background">
            <div className="sticky top-0 h-svh overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, var(--background) 0%, transparent 16%, transparent 76%, var(--background) 100%), radial-gradient(ellipse 60% 46% at 50% 52%, transparent 42%, rgb(8 8 10 / 0.82) 100%)",
                    }}
                    aria-hidden
                />

                <div className="pointer-events-none absolute inset-0 z-20" style={{ perspective: "1200px" }}>
                    {ITEMS.map((item) => {
                        const center = (item + 0.5) / ITEMS.length;
                        const distance = Math.abs((progress - center) * ITEMS.length);
                        const visibility = smoothstep(clamp01(1 - distance * 0.92));
                        const layout = COPY_LAYOUTS[item];
                        const driftY = (progress - center) * 34;
                        const direction = progress < center ? 1 : -1;
                        const titleTravel = direction * (1 - visibility) * 64;
                        const descTravel = direction * (1 - visibility) * 32;

                        return (
                            <article
                                key={item}
                                className={`absolute w-[84%] text-left md:w-[32rem] ${layout.className}`}
                                style={{
                                    textAlign: layout.align,
                                    opacity: visibility,
                                    filter: `blur(${(1 - visibility) * 9}px)`,
                                    transform: `translate3d(0, ${driftY}px, ${visibility * 90}px) scale(${0.96 + visibility * 0.04})`,
                                    transformStyle: "preserve-3d",
                                    willChange: "opacity, filter, transform",
                                }}
                            >
                                <h2
                                    className="max-w-[12ch] text-title text-foreground"
                                    style={{
                                        textShadow: "0 0 48px rgba(185, 164, 255, 0.34), 0 18px 70px rgba(0,0,0,0.72)",
                                        transform: `translate3d(${titleTravel}px, 0, ${visibility * 120}px) rotateY(${direction * (1 - visibility) * -18}deg)`,
                                        transformOrigin: "50% 50%",
                                    }}
                                >
                                    {t(`diff${item}Title`)}
                                </h2>
                                <p
                                    className="mt-5 max-w-[34ch] text-body-lg text-foreground-readable"
                                    style={{
                                        textShadow: "0 12px 44px rgba(0,0,0,0.84)",
                                        transform: `translate3d(${descTravel}px, ${(1 - visibility) * 10}px, ${visibility * 54 - 32}px) rotateY(${direction * (1 - visibility) * -10}deg)`,
                                        transformOrigin: "50% 50%",
                                    }}
                                >
                                    {t(`diff${item}Desc`)}
                                </p>
                            </article>
                        );
                    })}
                </div>

                <div className="absolute bottom-8 left-1/2 z-20 grid w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 grid-cols-4 gap-2 md:bottom-10">
                    {ITEMS.map((item) => (
                        <span
                            key={item}
                            className={`h-px transition-colors duration-500 ${item === activeIndex ? "bg-accent" : "bg-border-bright"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
