"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useScrollReset } from "@/hooks/use-scroll-reset";
import { LenisContext } from "@/lib/lenis-context";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useScrollReset(lenis);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const instance = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    setLenis(instance);

    const rafCallback = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    instance.on("scroll", () => ScrollTrigger.update());

    ScrollTrigger.refresh();

    const handleMotionChange = () => {
      if (mediaQuery.matches) instance.stop();
      else instance.start();
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      gsap.ticker.remove(rafCallback);
      instance.destroy();
      ScrollTrigger.killAll();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext value={lenis}>
      {children}
    </LenisContext>
  );
}
