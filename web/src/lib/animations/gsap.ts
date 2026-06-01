import { gsap } from "gsap";
import {
  ScrollTrigger,
  Flip,
  Observer,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  CustomEase,
} from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(
  ScrollTrigger,
  Flip,
  Observer,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  CustomEase,
  useGSAP
);

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

gsap.defaults({
  ease: "power3.out",
  duration: prefersReducedMotion ? 0 : 0.6,
});

ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
});

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(1000);
}

CustomEase.create("orion.out",    "M0,0 C0.05,0 0.133,1 1,1");
CustomEase.create("orion.inOut",  "M0,0 C0.37,0 0.63,1 1,1");
CustomEase.create("orion.spring", "M0,0 C0.175,0 0.32,1.275 1,1");

export { gsap, ScrollTrigger, Flip, Observer, SplitText, DrawSVGPlugin, CustomEase, useGSAP };
