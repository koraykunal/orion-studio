"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useScrollReset } from "@/hooks/use-scroll-reset";
import { LenisContext } from "@/lib/lenis-context";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useScrollReset(lenis);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return () => {
        window.removeEventListener("load", refresh);
      };
    }

    const instance = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenisRef.current = instance;

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

    queueMicrotask(() => setLenis(instance));

    return () => {
      window.removeEventListener("load", refresh);
      mediaQuery.removeEventListener("change", handleMotionChange);
      gsap.ticker.remove(rafCallback);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [pathname]);

  return (
    <LenisContext value={lenis}>
      {children}
    </LenisContext>
  );
}
