export const EASES = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  back: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  circ: "circ.out",
  sine: "sine.inOut",
  brand: "orion.out",
  brandInOut: "orion.inOut",
  brandSpring: "orion.spring",
} as const;

export const DURATIONS = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  xslow: 1.4,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.15,
  chars: 0.02,
  words: 0.06,
} as const;

export const SCROLL_TRIGGER_DEFAULTS = {
  start: "top 85%",
  end: "bottom 15%",
  toggleActions: "play none none reverse" as const,
} as const;
