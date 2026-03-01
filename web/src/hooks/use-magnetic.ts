"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { EASES } from "@/lib/animations/config";

interface UseMagneticOptions {
  strength?: number;
  ease?: string;
  duration?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  options: UseMagneticOptions = {}
) {
  const ref = useRef<T>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const el = ref.current;
    const { strength = 0.4, ease = EASES.elastic, duration = 0.6 } = options;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration,
        ease,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration, ease });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: ref });

  return ref;
}
