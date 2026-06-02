"use client";

import {useEffect, useRef} from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {ScrollTrigger} from "@/lib/animations/gsap";
import {TextReveal} from "@/components/motion/TextReveal";
import {SERVICE_SLUGS} from "@/lib/services";

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

export function BrandMapSection() {
    const t = useTranslations("home");
    const tSvc = useTranslations("services");
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

        if (reduce) {
            drawField(0, FIELD_DEPTH * 0.25);
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

        const panelEls = SERVICE_SLUGS.map((_, i) => {
            const root = panelRefs.current[i];
            if (!root) return null;
            return {
                root,
                img: root.querySelector<HTMLElement>("[data-img]"),
                lines: Array.from(root.querySelectorAll<HTMLElement>("[data-line]")),
            };
        });

        const isVisible = {current: true};
        const vis = new IntersectionObserver((e) => {
            isVisible.current = e[0].isIntersecting;
        }, {threshold: 0});
        vis.observe(canvas);

        let raf = 0, t0 = 0, lastFrame = 0, lastDraw = 0;
        const CANVAS_FRAME = 1000 / CANVAS_FPS;
        const seg = (1 - INTRO_END) / SERVICE_SLUGS.length;

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

            for (let i = 0; i < SERVICE_SLUGS.length; i++) {
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
                if (el.img) {
                    el.img.style.transform = `scale(${(1 + (1 - reveal) * 0.09).toFixed(4)})`;
                    el.img.style.opacity = clamp01(reveal * 1.4).toFixed(3);
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
        <section ref={sectionRef} className="relative h-[720svh] bg-background motion-reduce:h-auto">
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

                {SERVICE_SLUGS.map((key, i) => {
                    return (
                        <div
                            key={key}
                            ref={(el) => {
                                panelRefs.current[i] = el;
                            }}
                            className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none opacity-0 will-change-transform motion-reduce:relative motion-reduce:inset-auto motion-reduce:opacity-100 motion-reduce:py-16"
                        >
                            <div className="grid w-full max-w-[60rem] items-center gap-8 md:grid-cols-2 lg:gap-14">
                                <div data-img
                                     className="relative aspect-[4/3] overflow-hidden rounded-lg lg:rounded-xl border border-border/60 bg-surface-1 will-change-transform">
                                    <div
                                        className="absolute inset-0"
                                        style={{ background: "radial-gradient(circle at 50% 38%, var(--glow-strong), transparent 70%)" }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Image
                                            src={`/images/services/${key}.svg`}
                                            alt=""
                                            width={180}
                                            height={180}
                                            className="w-1/3 h-1/3 object-contain opacity-90"
                                        />
                                    </div>
                                    <span className="absolute bottom-4 left-5 text-index text-foreground-subtle">0{i + 1}</span>
                                </div>

                                <div className="text-center md:text-left">
                                    <span className="block overflow-hidden pb-[0.22em] -mb-[0.22em]">
                                        <span data-line className="block text-index text-accent will-change-transform">0{i + 1}</span>
                                    </span>
                                    <span className="block overflow-hidden mt-3 pb-[0.22em] -mb-[0.22em]">
                                        <h3 data-line className="block text-heading leading-[1.2] will-change-transform">{tSvc(`${key}Name`)}</h3>
                                    </span>
                                    <span className="block overflow-hidden mt-4 max-w-[42ch] mx-auto md:mx-0 pb-[0.22em] -mb-[0.22em]">
                                        <p data-line
                                           className="block text-body-lg text-foreground-muted leading-[1.45] text-balance will-change-transform">{tSvc(`${key}Tagline`)}</p>
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
