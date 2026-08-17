"use client";

import { useEffect, useRef, type RefObject } from "react";

export type CanvasFrame = {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    time: number;
};

type CanvasLoopOptions = {
    fps?: number;
    threshold?: number;
    stillTime?: number;
    rootMargin?: string;
};

export function useCanvasLoop(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    draw: (frame: CanvasFrame) => void,
    { fps = 30, threshold = 0.1, stillTime = 0, rootMargin = "0px" }: CanvasLoopOptions = {}
) {
    const drawRef = useRef(draw);

    useEffect(() => {
        drawRef.current = draw;
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let raf = 0;
        let visible = true;
        let t0 = 0;
        let last = 0;

        const interval = 1000 / fps;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const paint = (time: number) => drawRef.current({ ctx, width, height, time });

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const frame = (ts: number) => {
            raf = requestAnimationFrame(frame);
            if (!visible || document.hidden) return;
            if (ts - last < interval) return;
            last = ts;
            if (!t0) t0 = ts;
            paint((ts - t0) / 1000);
        };

        const start = () => {
            cancelAnimationFrame(raf);
            if (motion.matches) {
                paint(stillTime);
                return;
            }
            t0 = 0;
            last = 0;
            raf = requestAnimationFrame(frame);
        };

        const ro = new ResizeObserver(() => {
            resize();
            if (motion.matches) paint(stillTime);
        });
        ro.observe(canvas);
        resize();

        const io = new IntersectionObserver(
            ([entry]) => { visible = entry.isIntersecting; },
            { threshold, rootMargin }
        );
        io.observe(canvas);

        start();
        motion.addEventListener("change", start);

        return () => {
            cancelAnimationFrame(raf);
            motion.removeEventListener("change", start);
            io.disconnect();
            ro.disconnect();
        };
    }, [canvasRef, fps, threshold, stillTime, rootMargin]);
}
