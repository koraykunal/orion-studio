export const EASES = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
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
