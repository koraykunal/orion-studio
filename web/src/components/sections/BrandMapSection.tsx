"use client";

import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import {ScrollTrigger} from "@/lib/animations/gsap";
import {TextReveal} from "@/components/motion/TextReveal";

const DIFFERENTIATORS = [
    {
        key: "character",
        framePath: "/marketing/differentiators/character/frames",
    },
    {
        key: "system",
        framePath: "/marketing/differentiators/system/frames",
    },
    {
        key: "clarity",
        framePath: "/marketing/differentiators/clarity/frames",
    },
    {
        key: "continuity",
        framePath: "/marketing/differentiators/continuity/frames",
    },
] as const;

const SEQUENCE_FRAME_COUNT = 75;
const PRELOAD_BEHIND = 3;
const PRELOAD_AHEAD = 9;
const CACHE_RADIUS = 24;
const FOCAL = 320;
const NEAR = 40;
const SPREAD = 1300;
const BG_COUNT = 60;
const FIELD_DEPTH = 3600;
const FLOW_SPEED = 240;
const SCROLL_FLOW = 5200;
const INTRO_END = 0.1;
const CANVAS_FPS = 30;
const PROGRESS_DAMPING = 9;

function clamp01(v: number) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
}

function clampN(v: number) {
    return v < -1 ? -1 : v > 1 ? 1 : v;
}

function smooth(a: number, b: number, t: number) {
    const x = clamp01((t - a) / (b - a));
    return x * x * (3 - 2 * x);
}

function frameSrc(path: string, frame: number) {
    return `${path}/frame_${String(frame).padStart(4, "0")}.jpg`;
}

type SequenceState = {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    framePath: string;
    cache: Map<number, HTMLImageElement>;
    lastFrame: number;
    lastDrawn: number;
};

function syncSequenceCanvas(sequence: SequenceState) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(sequence.canvas.offsetWidth * dpr));
    const height = Math.max(1, Math.round(sequence.canvas.offsetHeight * dpr));
    if (sequence.canvas.width !== width || sequence.canvas.height !== height) {
        sequence.canvas.width = width;
        sequence.canvas.height = height;
        sequence.context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function drawCover(sequence: SequenceState, image: HTMLImageElement) {
    syncSequenceCanvas(sequence);
    const {context, canvas} = sequence;
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sw = image.naturalWidth;
    let sh = image.naturalHeight;

    if (imageRatio > canvasRatio) {
        sw = image.naturalHeight * canvasRatio;
        sx = (image.naturalWidth - sw) / 2;
    } else {
        sh = image.naturalWidth / canvasRatio;
        sy = (image.naturalHeight - sh) / 2;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
}

function loadFrame(sequence: SequenceState, frame: number) {
    const safeFrame = Math.min(SEQUENCE_FRAME_COUNT, Math.max(1, frame));
    const cached = sequence.cache.get(safeFrame);
    if (cached) return cached;

    const image = new Image();
    image.decoding = "async";
    image.src = frameSrc(sequence.framePath, safeFrame);
    image.onload = () => {
        if (sequence.lastFrame === safeFrame) {
            drawCover(sequence, image);
            sequence.lastDrawn = safeFrame;
        }
    };
    sequence.cache.set(safeFrame, image);
    return image;
}

function drawSequence(sequence: SequenceState, frame: number) {
    const target = Math.min(SEQUENCE_FRAME_COUNT, Math.max(1, frame));
    sequence.lastFrame = target;

    for (let i = target - PRELOAD_BEHIND; i <= target + PRELOAD_AHEAD; i++) {
        if (i >= 1 && i <= SEQUENCE_FRAME_COUNT) loadFrame(sequence, i);
    }

    for (const key of sequence.cache.keys()) {
        if (Math.abs(key - target) > CACHE_RADIUS) sequence.cache.delete(key);
    }

    const image = sequence.cache.get(target);
    if (image?.complete && image.naturalWidth > 0 && sequence.lastDrawn !== target) {
        drawCover(sequence, image);
        sequence.lastDrawn = target;
    }
}

export function BrandMapSection() {
    const t = useTranslations("home");
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progress = useRef(0);
    const easedProgress = useRef(0);
    const flowZ = useRef(0);
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const introRef = useRef<HTMLDivElement>(null);
    const bloomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;
        const ctx = canvas.getContext("2d")!;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let W = 0, H = 0;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio ?? 1, 1);
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const newStar = (z: number) => ({
            z,
            ax: (Math.random() - 0.5) * 2 * SPREAD,
            ay: (Math.random() - 0.5) * 2 * SPREAD,
            r: Math.random() * 1.3 + 0.5,
            op: Math.random() * 0.5 + 0.3,
            phase: Math.random() * Math.PI * 2,
            spd: Math.random() * 0.4 + 0.15,
            driftPhase: Math.random() * Math.PI * 2,
            driftSpd: Math.random() * 0.5 + 0.2,
            bright: Math.random() < 0.05,
        });
        const bgCount = window.innerWidth < 768 ? 36 : BG_COUNT;
        const bg = Array.from({length: bgCount}, () => newStar(NEAR + Math.random() * FIELD_DEPTH));

        const SPR = 128;
        const glowSprite = document.createElement("canvas");
        glowSprite.width = SPR;
        glowSprite.height = SPR;
        {
            const s = glowSprite.getContext("2d")!;
            const c = SPR / 2;
            const glow = s.createRadialGradient(c, c, 0, c, c, c);
            glow.addColorStop(0, "rgba(184, 164, 224, 0.5)");
            glow.addColorStop(0.3, "rgba(160, 140, 212, 0.16)");
            glow.addColorStop(1, "rgba(0,0,0,0)");
            s.fillStyle = glow;
            s.fillRect(0, 0, SPR, SPR);
            s.fillStyle = "rgba(214, 204, 244, 0.5)";
            const spike = (ang: number, l: number) => {
                s.save();
                s.translate(c, c);
                s.rotate(ang);
                s.beginPath();
                s.moveTo(0, -0.7);
                s.lineTo(l, 0);
                s.lineTo(0, 0.7);
                s.closePath();
                s.fill();
                s.restore();
            };
            spike(0, c * 0.9);
            spike(Math.PI, c * 0.9);
            spike(Math.PI / 2, c * 0.5);
            spike(-Math.PI / 2, c * 0.5);
            const core = s.createRadialGradient(c, c, 0, c, c, SPR * 0.1);
            core.addColorStop(0, "rgba(238, 233, 255, 1)");
            core.addColorStop(0.4, "rgba(210, 200, 246, 0.45)");
            core.addColorStop(1, "rgba(160, 140, 210, 0)");
            s.fillStyle = core;
            s.beginPath();
            s.arc(c, c, SPR * 0.1, 0, Math.PI * 2);
            s.fill();
        }

        const drawField = (time: number, camZ: number) => {
            const cx = W / 2, cy = H / 2;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgb(232, 227, 252)";
            for (const s of bg) {
                let dz = s.z - camZ;
                if (dz < NEAR) {
                    Object.assign(s, newStar(camZ + FIELD_DEPTH));
                    dz = s.z - camZ;
                }
                const f = FOCAL / dz;
                const drift = Math.sin(time * s.driftSpd + s.driftPhase) * 16;
                const sx = cx + s.ax * f + drift, sy = cy + s.ay * f;
                if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
                const depth = clamp01(1 - dz / FIELD_DEPTH);
                if (s.bright) {
                    const tw = 0.85 + Math.sin(time * s.spd + s.phase) * 0.15;
                    const size = Math.max(34, Math.min(H * 0.8, s.r * f * 48));
                    ctx.globalAlpha = clamp01(0.42 + depth * 0.58) * tw;
                    ctx.drawImage(glowSprite, sx - size / 2, sy - size / 2, size, size);
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = "rgb(232, 227, 252)";
                } else {
                    const flick = Math.sin(time * s.spd + s.phase) * 0.12;
                    ctx.globalAlpha = clamp01((s.op + flick) * (0.45 + depth * 0.75));
                    ctx.beginPath();
                    ctx.arc(sx, sy, Math.max(0.5, s.r * f * 1.5), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        };

        const ro = new ResizeObserver(() => {
            resize();
            if (reduce) drawField(0, FIELD_DEPTH * 0.25);
        });
        ro.observe(canvas);
        resize();

        const panelEls = DIFFERENTIATORS.map((_, i) => {
            const root = panelRefs.current[i];
            if (!root) return null;
            const sequenceCanvas = root.querySelector<HTMLCanvasElement>("[data-sequence]");
            return {
                root,
                visual: root.querySelector<HTMLElement>("[data-visual]"),
                sequence: sequenceCanvas
                    ? {
                        canvas: sequenceCanvas,
                        context: sequenceCanvas.getContext("2d")!,
                        framePath: DIFFERENTIATORS[i].framePath,
                        cache: new Map<number, HTMLImageElement>(),
                        lastFrame: 1,
                        lastDrawn: 0,
                    } satisfies SequenceState
                    : null,
                lines: Array.from(root.querySelectorAll<HTMLElement>("[data-line]")),
            };
        });

        if (reduce) {
            drawField(0, FIELD_DEPTH * 0.25);
            for (const panel of panelEls) {
                if (panel?.sequence) drawSequence(panel.sequence, 1);
            }
            return () => {
                ro.disconnect();
            };
        }

        const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                progress.current = self.progress;
            },
        });

        const isVisible = {current: true};
        const vis = new IntersectionObserver((e) => {
            isVisible.current = e[0].isIntersecting;
        }, {threshold: 0});
        vis.observe(canvas);

        let raf = 0, t0 = 0, lastFrame = 0, lastDraw = 0;
        const CANVAS_FRAME = 1000 / CANVAS_FPS;
        const seg = (1 - INTRO_END) / DIFFERENTIATORS.length;

        const frame = (ts: number) => {
            raf = requestAnimationFrame(frame);
            if (!t0) t0 = ts;
            if (!isVisible.current || document.hidden) {
                lastFrame = ts;
                return;
            }
            if (!lastFrame) lastFrame = ts;
            const dt = Math.min(0.05, (ts - lastFrame) / 1000);
            lastFrame = ts;

            const time = (ts - t0) / 1000;
            easedProgress.current += (progress.current - easedProgress.current) * (1 - Math.exp(-dt * PROGRESS_DAMPING));
            const p = easedProgress.current;
            flowZ.current += dt * FLOW_SPEED;
            const camZ = flowZ.current + p * SCROLL_FLOW;

            if (ts - lastDraw >= CANVAS_FRAME) {
                drawField(time, camZ);
                lastDraw = ts;
            }

            for (let i = 0; i < DIFFERENTIATORS.length; i++) {
                const el = panelEls[i];
                if (!el) continue;
                const center = INTRO_END + (i + 0.5) * seg;
                const d = (p - center) / (seg * 0.62);
                const rawFocus = clamp01(1 - d * d);
                const foc = rawFocus * rawFocus * (3 - 2 * rawFocus);
                el.root.style.opacity = foc.toFixed(3);
                el.root.style.visibility = foc > 0.006 ? "visible" : "hidden";
                if (foc <= 0.002) continue;
                el.root.style.transform = `translate3d(0, ${(-clampN(d) * H * 0.12).toFixed(1)}px, 0)`;
                const reveal = smooth(-1, -0.12, d);
                if (el.visual) {
                    el.visual.style.transform = `scale(${(1 + (1 - reveal) * 0.06).toFixed(4)})`;
                    el.visual.style.opacity = clamp01(reveal * 1.35).toFixed(3);
                }
                if (el.sequence) {
                    const localProgress = clamp01((d + 0.8) / 1.6);
                    const targetFrame = Math.round(localProgress * (SEQUENCE_FRAME_COUNT - 1)) + 1;
                    drawSequence(el.sequence, targetFrame);
                }
                for (let k = 0; k < el.lines.length; k++) {
                    const lr = smooth(-1 + k * 0.12, -0.08 + k * 0.12, d);
                    el.lines[k].style.transform = `translateY(${((1 - lr) * 120).toFixed(1)}%)`;
                    el.lines[k].style.opacity = lr.toFixed(3);
                }
            }

            if (introRef.current) {
                const o = 1 - smooth(0, INTRO_END + 0.02, p);
                introRef.current.style.opacity = String(o);
                introRef.current.style.transform = `translateY(${-(1 - o) * 44}px)`;
            }
            if (bloomRef.current) {
                bloomRef.current.style.opacity = String(clamp01(smooth(0.9, 0.99, p) * 0.85 - smooth(0.995, 1, p) * 0.3));
            }
        };
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            vis.disconnect();
            st.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative h-[460svh] bg-background motion-reduce:h-auto">
            <div
                className="sticky top-0 h-svh w-full overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-24">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full motion-reduce:hidden"
                        style={{pointerEvents: "none"}} aria-hidden/>

                <div
                    className="absolute inset-0 pointer-events-none motion-reduce:hidden"
                    style={{background: "radial-gradient(ellipse 76% 68% at 50% 50%, transparent 0%, var(--background) 100%)"}}
                />
                <div className="absolute inset-x-0 top-0 z-[5] h-32 bg-gradient-to-b from-background to-transparent pointer-events-none motion-reduce:hidden" />
                <div className="absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-background to-transparent pointer-events-none motion-reduce:hidden" />

                <div
                    ref={introRef}
                    className="absolute inset-x-0 top-[34svh] text-center px-6 z-10 motion-reduce:static motion-reduce:top-auto motion-reduce:mb-20"
                >
                    <TextReveal as="h2" type="lines" className="text-title max-w-[18ch] mx-auto" start="top 80%">
                        {t("constTitle")}
                    </TextReveal>
                    <TextReveal
                        as="p"
                        type="lines"
                        className="text-body-lg text-foreground-muted mt-5 max-w-[46ch] mx-auto"
                        start="top 80%"
                        delay={0.12}
                    >
                        {t("constDesc")}
                    </TextReveal>
                </div>

                {DIFFERENTIATORS.map((item, i) => {
                    return (
                        <div
                            key={item.key}
                            ref={(el) => {
                                panelRefs.current[i] = el;
                            }}
                            className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none opacity-0 will-change-transform motion-reduce:relative motion-reduce:inset-auto motion-reduce:opacity-100 motion-reduce:py-16"
                        >
                            <div className="grid w-full max-w-[78rem] items-center gap-12 md:grid-cols-[1.08fr_0.92fr] lg:gap-24">
                                <div data-visual
                                     className="relative h-[48svh] min-h-[22rem] overflow-hidden will-change-transform md:-ml-[7vw] md:h-[72svh] md:min-h-[34rem]"
                                     style={{
                                         WebkitMaskImage: "radial-gradient(ellipse 70% 78% at 52% 48%, #000 48%, rgba(0,0,0,0.72) 68%, transparent 100%)",
                                         maskImage: "radial-gradient(ellipse 70% 78% at 52% 48%, #000 48%, rgba(0,0,0,0.72) 68%, transparent 100%)",
                                     }}>
                                    <div
                                        className="absolute inset-0 z-10 pointer-events-none"
                                        style={{ background: "radial-gradient(circle at 52% 45%, transparent 28%, rgba(5,5,10,0.08) 58%, rgba(5,5,10,0.72) 100%)" }}
                                    />
                                    <div
                                        className="absolute inset-x-0 bottom-0 z-10 h-1/3 pointer-events-none"
                                        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
                                    />
                                    <canvas
                                        data-sequence
                                        className="absolute inset-0 h-full w-full opacity-95 saturate-[0.92]"
                                        aria-hidden
                                    />
                                </div>

                                <div className="relative z-20 text-center md:text-left">
                                    <span className="block overflow-hidden pt-[0.08em] pb-[0.7em]">
                                        <h3 data-line className="block text-title leading-[1.14] max-w-[12ch] mx-auto md:mx-0 will-change-transform">{t(`diff${i}Title`)}</h3>
                                    </span>
                                    <span className="block overflow-hidden mt-3 max-w-[38ch] mx-auto md:mx-0 pt-[0.04em] pb-[0.5em]">
                                        <p data-line
                                           className="block text-body-lg text-foreground-muted leading-[1.5] text-balance will-change-transform">{t(`diff${i}Desc`)}</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div
                    ref={bloomRef}
                    className="absolute inset-0 pointer-events-none z-20 opacity-0 motion-reduce:hidden"
                    style={{background: "radial-gradient(circle 80% at 50% 55%, rgba(188,162,238,0.6) 0%, rgba(152,124,212,0.22) 40%, transparent 75%)"}}
                />
            </div>
        </section>
    );
}
