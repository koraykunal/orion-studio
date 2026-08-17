"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ScrollTrigger } from "@/lib/animations/gsap";
import { useCanvasLoop } from "@/hooks/use-canvas-loop";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { seeded } from "@/lib/seeded-random";

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
    cosYaw: number;
    sinYaw: number;
    cosPitch: number;
    sinPitch: number;
    cosRoll: number;
    sinRoll: number;
};

type Vec3 = { x: number; y: number; z: number };
type Projection = Vec3 & { sx: number; sy: number; scale: number; alpha: number };

const ORBITS: Orbit[] = [
    { rx: 0.54, ry: 0.17, rz: 0.36, yaw: -0.22, pitch: 0.34, roll: -0.3, phase: 0, alpha: 0.25, width: 1.05 },
    { rx: 0.44, ry: 0.27, rz: 0.42, yaw: 0.38, pitch: -0.18, roll: 0.42, phase: 0.19, alpha: 0.15, width: 0.78 },
    { rx: 0.66, ry: 0.12, rz: 0.31, yaw: 0.04, pitch: 0.08, roll: 0.04, phase: 0.38, alpha: 0.14, width: 0.68 },
    { rx: 0.33, ry: 0.34, rz: 0.46, yaw: 0.56, pitch: 0.2, roll: 0.92, phase: 0.62, alpha: 0.11, width: 0.58 },
].map((o) => ({
    ...o,
    cosYaw: Math.cos(o.yaw),
    sinYaw: Math.sin(o.yaw),
    cosPitch: Math.cos(o.pitch),
    sinPitch: Math.sin(o.pitch),
    cosRoll: Math.cos(o.roll),
    sinRoll: Math.sin(o.roll),
}));

const ORBIT_STEPS = 220;
const FOCUS_LAYERS = [
    { span: 1 / 7, width: 2.6, alpha: 0.05 },
    { span: 1 / 12, width: 1.7, alpha: 0.09 },
    { span: 1 / 22, width: 1.15, alpha: 0.15 },
] as const;

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

function dwell(progress: number, count: number, hold = 0.42) {
    const shifted = clamp01(progress) * count + 0.5;
    const index = Math.floor(shifted);
    const local = shifted - index;
    const eased = smoothstep((local - hold / 2) / (1 - hold));

    return clamp01((index + eased - 0.5) / count);
}

function itemStyles(index: number, progress: number) {
    const center = (index + 0.5) / ITEMS.length;
    const distance = Math.abs((progress - center) * ITEMS.length);
    const visibility = smoothstep(clamp01(1 - distance * 0.92));
    const driftY = (progress - center) * 34;
    const direction = progress < center ? 1 : -1;
    const titleTravel = direction * (1 - visibility) * 64;
    const descTravel = direction * (1 - visibility) * 32;

    return {
        article: {
            opacity: `${visibility}`,
            filter: `blur(${(1 - visibility) * 9}px)`,
            transform: `translate3d(0, ${driftY}px, ${visibility * 90}px) scale(${0.96 + visibility * 0.04})`,
        },
        title: {
            transform: `translate3d(${titleTravel}px, 0, ${visibility * 120}px) rotateY(${direction * (1 - visibility) * -18}deg)`,
        },
        desc: {
            transform: `translate3d(${descTravel}px, ${(1 - visibility) * 10}px, ${visibility * 54 - 32}px) rotateY(${direction * (1 - visibility) * -10}deg)`,
        },
    };
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

    [x, z] = [x * orbit.cosYaw + z * orbit.sinYaw, -x * orbit.sinYaw + z * orbit.cosYaw];
    [y, z] = [y * orbit.cosPitch - z * orbit.sinPitch, y * orbit.sinPitch + z * orbit.cosPitch];
    [x, y] = [x * orbit.cosRoll - y * orbit.sinRoll, x * orbit.sinRoll + y * orbit.cosRoll];

    return { x, y, z };
}

function orbitPoint(t: number, orbit: Orbit, base: number, time: number): Vec3 {
    const angle = t * Math.PI * 2 + orbit.phase * Math.PI * 2 + time * 0.035;
    const wobble = Math.sin(angle * 2 + orbit.phase * 8 + time * 0.08) * base * 0.008;
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
    };
}

const STAR_SPRITE_STEPS = 6;
const STAR_RADIUS_MAX = 1.17;

function buildStarSprites(dpr: number): HTMLCanvasElement[] {
    return Array.from({ length: STAR_SPRITE_STEPS }, (_, i) => {
        const radius = ((i + 1) / STAR_SPRITE_STEPS) * STAR_RADIUS_MAX;
        const extent = radius * 8;
        const size = Math.ceil(extent * 2 * dpr);
        const sprite = document.createElement("canvas");
        sprite.width = size;
        sprite.height = size;

        const sctx = sprite.getContext("2d");
        if (!sctx) return sprite;

        sctx.scale(dpr, dpr);
        const c = extent;

        const glow = sctx.createRadialGradient(c, c, 0, c, c, extent);
        glow.addColorStop(0, "rgba(224, 218, 255, 0.26)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        sctx.fillStyle = glow;
        sctx.beginPath();
        sctx.arc(c, c, extent, 0, Math.PI * 2);
        sctx.fill();

        const core = sctx.createRadialGradient(c, c, 0, c, c, radius * 1.8);
        core.addColorStop(0, "rgba(246, 244, 255, 0.94)");
        core.addColorStop(0.55, "rgba(214, 204, 255, 0.34)");
        core.addColorStop(1, "rgba(0,0,0,0)");
        sctx.fillStyle = core;
        sctx.beginPath();
        sctx.arc(c, c, radius * 1.8, 0, Math.PI * 2);
        sctx.fill();

        return sprite;
    });
}

function spriteIndex(radius: number) {
    return clamp(Math.round((radius / STAR_RADIUS_MAX) * STAR_SPRITE_STEPS) - 1, 0, STAR_SPRITE_STEPS - 1);
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
    const points: Projection[] = [];
    const layerSegments: Projection[][][] = FOCUS_LAYERS.map(() => []);
    const layerLastStep = FOCUS_LAYERS.map(() => -2);
    const layerFromZero = FOCUS_LAYERS.map(() => false);

    for (let i = 0; i < ORBIT_STEPS; i++) {
        const t = i / ORBIT_STEPS;
        const point = projectPoint(orbitPoint(t, orbit, base, time), camera, width, height, zoom, anchorX, anchorY);

        points.push(point);

        const raw = Math.abs(t - focusT);
        const distance = Math.min(raw, 1 - raw);

        for (let l = 0; l < FOCUS_LAYERS.length; l++) {
            if (distance >= FOCUS_LAYERS[l].span) continue;

            const segments = layerSegments[l];
            if (i !== layerLastStep[l] + 1) segments.push([]);
            segments[segments.length - 1].push(point);
            layerLastStep[l] = i;
            if (i === 0) layerFromZero[l] = true;
        }
    }

    for (let l = 0; l < FOCUS_LAYERS.length; l++) {
        const segments = layerSegments[l];
        if (segments.length > 1 && layerFromZero[l] && layerLastStep[l] === ORBIT_STEPS - 1) {
            segments[0] = segments.pop()!.concat(segments[0]);
        }
    }

    if (points.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(points[0].sx, points[0].sy);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].sx, points[i].sy);
    ctx.closePath();
    ctx.strokeStyle = `rgba(226, 220, 255, ${orbit.alpha * 0.72})`;
    ctx.lineWidth = orbit.width * 1.05;
    ctx.stroke();

    for (let l = 0; l < FOCUS_LAYERS.length; l++) {
        const layer = FOCUS_LAYERS[l];
        let drawn = false;

        ctx.beginPath();
        for (const segment of layerSegments[l]) {
            if (segment.length < 2) continue;
            ctx.moveTo(segment[0].sx, segment[0].sy);
            for (let i = 1; i < segment.length; i++) ctx.lineTo(segment[i].sx, segment[i].sy);
            drawn = true;
        }

        if (!drawn) continue;

        ctx.strokeStyle = `rgba(238, 234, 255, ${layer.alpha})`;
        ctx.lineWidth = orbit.width * layer.width;
        ctx.stroke();
    }

    ctx.restore();
}

export function BrandMapSection() {
    const t = useTranslations("home");
    const reduced = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const spritesRef = useRef<{ dpr: number; sprites: HTMLCanvasElement[] } | null>(null);
    const atmosphereRef = useRef<{ width: number; height: number; fill: CanvasGradient } | null>(null);
    const stars = useMemo(() => buildStars(170), []);

    useEffect(() => {
        const section = sectionRef.current;
        const copy = copyRef.current;
        const dots = dotsRef.current;
        if (reduced || !section || !copy || !dots) return;

        const articles = Array.from(copy.querySelectorAll<HTMLElement>("[data-brand-item]"));
        const dotEls = Array.from(dots.children) as HTMLElement[];

        const apply = (raw: number) => {
            const progress = dwell(raw, ITEMS.length);
            progressRef.current = progress;

            articles.forEach((article, index) => {
                const styles = itemStyles(index, progress);
                Object.assign(article.style, styles.article);

                const title = article.querySelector<HTMLElement>("h2");
                const desc = article.querySelector<HTMLElement>("p");
                if (title) title.style.transform = styles.title.transform;
                if (desc) desc.style.transform = styles.desc.transform;
            });

            const active = Math.min(ITEMS.length - 1, Math.floor(clamp01(raw) * ITEMS.length));
            dotEls.forEach((dot, index) => {
                dot.dataset.active = index === active ? "true" : "false";
            });
        };

        apply(0);

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
            onUpdate: (self) => apply(self.progress),
        });

        return () => trigger.kill();
    }, [reduced]);

    useCanvasLoop(canvasRef, ({ ctx, width, height, time }) => {
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

        const cachedAtmosphere = atmosphereRef.current;
        if (!cachedAtmosphere || cachedAtmosphere.width !== width || cachedAtmosphere.height !== height) {
            const fill = ctx.createRadialGradient(width * 0.54, height * 0.48, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.86);
            fill.addColorStop(0, "rgba(36, 29, 58, 0.74)");
            fill.addColorStop(0.42, "rgba(20, 17, 29, 0.34)");
            fill.addColorStop(1, "rgba(8, 8, 10, 0)");
            atmosphereRef.current = { width, height, fill };
        }
        ctx.fillStyle = atmosphereRef.current!.fill;
        ctx.fillRect(0, 0, width, height);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (!spritesRef.current || spritesRef.current.dpr !== dpr) {
            spritesRef.current = { dpr, sprites: buildStarSprites(dpr) };
        }
        const sprites = spritesRef.current.sprites;

        stars.forEach((star) => {
            const twinkle = Math.sin(time * star.speed + star.phase) * 0.1;
            const driftX = (star.x - 0.5) * scrollP * width * 0.08;
            const driftY = (star.y - 0.5) * scrollP * height * 0.12;
            const index = spriteIndex(star.r);
            const extent = ((index + 1) / STAR_SPRITE_STEPS) * STAR_RADIUS_MAX * 8;

            ctx.globalAlpha = clamp(star.alpha + twinkle, 0, 0.82);
            ctx.drawImage(
                sprites[index],
                star.x * width + driftX - extent,
                star.y * height + driftY - extent,
                extent * 2,
                extent * 2
            );
        });
        ctx.globalAlpha = 1;

        ORBITS.forEach((orbit) => drawOrbit(ctx, orbit, base, time, cameraLead, width, height, zoom, anchorX, anchorY, focusT));
        drawRadiantStar(ctx, movingStar.sx, movingStar.sy, 4.6 * movingStar.scale, 0.92);
    }, { fps: 60, rootMargin: "35% 0px" });

    if (reduced) {
        return (
            <section id="brand-map" className="section-py bg-background">
                <div className="section-container grid gap-8 sm:grid-cols-2 lg:gap-12">
                    {ITEMS.map((item) => (
                        <article key={item}>
                            <h2 className="max-w-[14ch] text-title text-foreground">{t(`diff${item}Title`)}</h2>
                            <p className="mt-5 max-w-[38ch] text-body-lg text-foreground-readable">
                                {t(`diff${item}Desc`)}
                            </p>
                        </article>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="brand-map" ref={sectionRef} className="relative h-[300svh] bg-background">
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

                <div ref={copyRef} className="pointer-events-none absolute inset-0 z-20" style={{ perspective: "1200px" }}>
                    {ITEMS.map((item) => {
                        const layout = COPY_LAYOUTS[item];
                        const styles = itemStyles(item, 0);

                        return (
                            <article
                                key={item}
                                data-brand-item
                                className={`absolute w-[84%] text-left md:w-[32rem] ${layout.className}`}
                                style={{
                                    ...styles.article,
                                    textAlign: layout.align,
                                    transformStyle: "preserve-3d",
                                    willChange: "opacity, filter, transform",
                                }}
                            >
                                <h2
                                    className="max-w-[12ch] text-title text-foreground"
                                    style={{
                                        textShadow: "0 0 48px rgba(185, 164, 255, 0.34), 0 18px 70px rgba(0,0,0,0.72)",
                                        transform: styles.title.transform,
                                        transformOrigin: "50% 50%",
                                    }}
                                >
                                    {t(`diff${item}Title`)}
                                </h2>
                                <p
                                    className="mt-5 max-w-[34ch] text-body-lg text-foreground-readable"
                                    style={{
                                        textShadow: "0 12px 44px rgba(0,0,0,0.84)",
                                        transform: styles.desc.transform,
                                        transformOrigin: "50% 50%",
                                    }}
                                >
                                    {t(`diff${item}Desc`)}
                                </p>
                            </article>
                        );
                    })}
                </div>

                <div
                    ref={dotsRef}
                    className="absolute bottom-8 left-1/2 z-20 grid w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 grid-cols-4 gap-2 md:bottom-10"
                >
                    {ITEMS.map((item) => (
                        <span
                            key={item}
                            data-active={item === 0}
                            className="h-px bg-border-bright transition-colors duration-500 data-[active=true]:bg-accent"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
