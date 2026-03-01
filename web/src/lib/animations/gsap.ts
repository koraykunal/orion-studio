import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore -- Windows casing conflict
import { Flip } from "gsap/Flip";
// @ts-ignore -- Windows casing conflict
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
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

gsap.defaults({
  ease: "power3.out",
  duration: 0.6,
});

ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
});

CustomEase.create("orion.out",    "M0,0 C0.05,0 0.133,1 1,1");
CustomEase.create("orion.inOut",  "M0,0 C0.37,0 0.63,1 1,1");
CustomEase.create("orion.spring", "M0,0 C0.175,0 0.32,1.275 1,1");

export { gsap, ScrollTrigger, Flip, Observer, SplitText, DrawSVGPlugin, CustomEase, useGSAP };
