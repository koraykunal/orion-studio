# Orion Studio — Design System

> Dark, violet-accented digital agency aesthetic with grainy texture overlay, cinematic animations, and OKLCh color space.

---

## 1. Overview

**Theme:** Dark mode only, deep navy backgrounds with lavender/violet accents.
**Aesthetic:** Grainy texture, constellation motifs, cinematic scroll-driven animations.
**Tech stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4.1 (OKLCh), GSAP 3.14, Lenis smooth scroll, Canvas-based effects.

---

## 2. Colors

All colors use **OKLCh** color space for perceptual uniformity.

### Backgrounds

| Token              | Value                     | Usage               |
|--------------------|---------------------------|----------------------|
| `--background`     | `oklch(0.08 0.012 280)`  | Page background      |
| `--surface-1`      | `oklch(0.11 0.012 278)`  | Cards, elevated      |
| `--surface-2`      | `oklch(0.15 0.012 276)`  | Inputs, hover states |
| `--surface-3`      | `oklch(0.19 0.010 274)`  | Active states        |

### Foreground

| Token                  | Value                     | Usage            |
|------------------------|---------------------------|------------------|
| `--foreground`         | `oklch(0.94 0.008 280)`  | Primary text     |
| `--foreground-muted`   | `oklch(0.55 0.012 275)`  | Secondary text   |
| `--foreground-subtle`  | `oklch(0.34 0.010 278)`  | Labels, hints    |

### Accent

| Token               | Value                     | Usage              |
|----------------------|---------------------------|--------------------|
| `--accent`           | `oklch(0.72 0.15 295)`   | Primary accent     |
| `--accent-warm`      | `oklch(0.65 0.18 310)`   | Warm variant       |
| `--accent-bright`    | `oklch(0.82 0.12 290)`   | Bright variant     |
| `--accent-foreground`| `oklch(0.08 0.012 280)`  | Text on accent bg  |

### Borders

| Token              | Value                     | Usage            |
|--------------------|---------------------------|------------------|
| `--border`         | `oklch(0.22 0.008 278)`  | Default border   |
| `--border-subtle`  | `oklch(0.15 0.006 278)`  | Subtle dividers  |
| `--border-bright`  | `oklch(0.30 0.010 280)`  | Emphasized       |

### Glows

| Token           | Value                              | Usage           |
|-----------------|-------------------------------------|-----------------|
| `--glow`        | `oklch(0.72 0.15 295 / 0.10)`     | Subtle glow     |
| `--glow-strong` | `oklch(0.72 0.15 295 / 0.22)`     | Hover glow      |

---

## 3. Typography

### Fonts

| Variable                 | Font             | Role           |
|--------------------------|------------------|----------------|
| `--font-display-custom`  | Myglaos          | Display/hero   |
| `--font-unica`           | Unica One        | ORION title    |
| `--font-bechilo`         | Bechilo          | Editorial      |
| `--font-centralwell`     | Centralwell      | Decorative     |
| `--font-arcane`          | Arcane Whispers  | Decorative     |
| `--font-space`           | Space Grotesk    | Interface/sans |
| `--font-inter`           | Inter            | Fallback sans  |
| `--font-mono`            | JetBrains Mono   | Data/code      |

### Utility Classes

| Class            | Size                          | Line Height | Weight | Notes                    |
|------------------|-------------------------------|-------------|--------|--------------------------|
| `.text-display`  | `clamp(6.5rem, 13vw, 15rem)` | 0.88        | 400    | Unica One, color: beige  |
| `.text-hero`     | `clamp(2.5rem, 6.5vw, 8rem)` | 0.88        | 400    | Myglaos, uppercase       |
| `.text-title`    | `clamp(2rem, 4vw, 4.5rem)`   | 1.0         | 500    |                          |
| `.text-heading`  | `clamp(1.5rem, 2.5vw, 2.5rem)` | 1.1       | 500    |                          |
| `.text-body-lg`  | `clamp(1.0625rem, 1.25vw, 1.25rem)` | 1.65 | —      |                          |
| `.text-label`    | `0.6875rem`                   | —           | 500    | Uppercase, 0.2em spacing |
| `.text-caption`  | `0.75rem`                     | —           | —      | Uppercase, muted color   |
| `.text-index`    | `0.6875rem` (mono)            | —           | —      | Subtle color             |
| `.text-metric`   | `clamp(3rem, 8vw, 7rem)`     | 1           | 300    | Mono, tabular-nums       |
| `.text-editorial`| `clamp(1.25rem, 2vw, 1.75rem)` | 1.5       | —      | Italic, muted            |

---

## 4. Spacing & Layout

### Container

| Token              | Value                        | Usage                       |
|--------------------|------------------------------|-----------------------------|
| `--container-max`  | `88rem` (1408px)             | Max content width           |
| `--container-px`   | `clamp(1.5rem, 5vw, 5rem)`  | Horizontal padding          |
| `--section-py`     | `clamp(6rem, 12vw, 14rem)`  | Vertical section padding    |
| `--section-gap`    | `clamp(3rem, 6vw, 8rem)`    | Gap between sections        |

### Layout Utilities

| Class               | Behavior                                              |
|----------------------|-------------------------------------------------------|
| `.section-container` | `max-width` + auto margins + horizontal padding      |
| `.container-px`      | Horizontal padding only                               |
| `.section-py`        | Vertical section padding                              |
| `.grid-container`    | 4 → 8 → 12 col responsive grid with gap              |

### Grid Breakpoints

| Breakpoint | Columns | Gap    |
|------------|---------|--------|
| Default    | 4       | 1rem   |
| `md`       | 8       | 1rem   |
| `lg`       | 12      | 1.5rem |

---

## 5. Border Radius

| Token           | Value     |
|-----------------|-----------|
| `--radius`      | `0.5rem`  |
| `--radius-sm`   | `0.25rem` |
| `--radius-md`   | `0.375rem`|
| `--radius-lg`   | `0.625rem`|
| `--radius-xl`   | `1rem`    |
| `--radius-2xl`  | `1.5rem`  |
| `--radius-full` | `9999px`  |

---

## 6. Animation

### CSS Easings (`styles/tokens.css`)

| Variable              | Value                                     |
|-----------------------|-------------------------------------------|
| `--ease-brand`        | `cubic-bezier(0.05, 0, 0.133, 1)`        |
| `--ease-brand-in`     | `cubic-bezier(0.55, 0, 1, 0.45)`         |
| `--ease-brand-in-out` | `cubic-bezier(0.37, 0, 0.63, 1)`         |
| `--ease-spring`       | `cubic-bezier(0.175, 0.885, 0.32, 1.275)`|
| `--ease-out`          | `cubic-bezier(0.0, 0.0, 0.2, 1)`         |

### CSS Transitions

| Variable             | Value                         |
|----------------------|-------------------------------|
| `--transition-fast`  | `150ms var(--ease-brand)`     |
| `--transition-base`  | `350ms var(--ease-brand)`     |
| `--transition-slow`  | `600ms var(--ease-brand)`     |
| `--transition-xslow` | `900ms var(--ease-brand)`     |

### GSAP Custom Eases (`lib/animations/gsap.ts`)

| Name            | Curve                                     |
|-----------------|-------------------------------------------|
| `orion.out`     | `M0,0 C0.05,0 0.133,1 1,1`               |
| `orion.inOut`   | `M0,0 C0.37,0 0.63,1 1,1`                |
| `orion.spring`  | `M0,0 C0.175,0 0.32,1.275 1,1`           |

### GSAP Config Presets (`lib/animations/config.ts`)

**Eases:**
| Key           | Value                |
|---------------|----------------------|
| `out`         | `power3.out`         |
| `inOut`       | `power2.inOut`       |
| `expo`        | `expo.out`           |
| `back`        | `back.out(1.7)`      |
| `elastic`     | `elastic.out(1, 0.3)`|
| `brand`       | `orion.out`          |
| `brandInOut`  | `orion.inOut`        |
| `brandSpring` | `orion.spring`       |

**Durations:**
| Key     | Value |
|---------|-------|
| `fast`  | 0.3s  |
| `base`  | 0.6s  |
| `slow`  | 0.9s  |
| `xslow` | 1.4s  |

**Stagger:**
| Key     | Value |
|---------|-------|
| `tight` | 0.04  |
| `base`  | 0.08  |
| `loose` | 0.15  |
| `chars` | 0.02  |
| `words` | 0.06  |

**ScrollTrigger Defaults:**
```ts
{ start: "top 85%", end: "bottom 15%", toggleActions: "play none none reverse" }
```

### GSAP Global Defaults

```ts
gsap.defaults({ ease: "power3.out", duration: 0.6 });
ScrollTrigger.defaults({ toggleActions: "play none none reverse" });
```

---

## 7. Surfaces & Effects

### Cards

| Class                | Description                                      |
|----------------------|--------------------------------------------------|
| `.surface-card`      | `surface-1` bg + subtle border                   |
| `.surface-card-hover`| Same + transition on hover → `surface-2` + border|

### Glows

| Class          | Description                                  |
|----------------|----------------------------------------------|
| `.glow-accent` | Violet box-shadow glow                       |
| `.service-glow`| Radial gradient glow following `--mouse-x/y` |

### Dividers

| Class            | Description              |
|------------------|--------------------------|
| `.divider`       | 1px `--border` line      |
| `.divider-subtle`| 1px `--border-subtle`    |

### Grain Overlay

Applied via `body::after` — fixed position PNG noise at 4% opacity, z-index 9990. Uses `/noise.png` (128x128 tile).

### Clip Path Utilities

| Class          | Value                      |
|----------------|----------------------------|
| `.clip-reveal` | `clip-path: inset(0 100% 0 0)` |
| `.clip-visible`| `clip-path: inset(0 0% 0 0)`   |

---

## 8. Components

### Motion Primitives (`components/motion/`)

#### TextReveal
Staggered text entrance via GSAP SplitText.
```tsx
<TextReveal type="lines" stagger={0.08} y={40}>
  <h2 className="text-title">Headline</h2>
</TextReveal>
```
Props: `children`, `as`, `type` (chars/words/lines), `stagger`, `duration`, `ease`, `delay`, `y`, `rotateX`, `start`, `once`, `scrub`, `className`

#### LineReveal
SVG horizontal line draw animation (DrawSVGPlugin).
```tsx
<LineReveal color="var(--border)" duration={1.2} />
```
Props: `className`, `color`, `duration`, `start`, `delay`

#### MaskImage
Image reveal with clip-path inset + scale animation.
```tsx
<MaskImage src="/image.jpg" alt="..." aspect="16/9" />
```
Props: `src`, `alt`, `aspect`, `priority`, `className`, `inset`, `scrub`

#### Marquee
Infinite CSS-animated ticker strip.
```tsx
<Marquee items={["Item 1", "Item 2"]} speed={25} separator="dot" />
```
Props: `items` (string[]), `speed`, `separator` (dot/star/dash), `className`

### Effects (`components/effects/`)

#### OrionConstellation
Canvas-based Orion constellation with parallax, twinkling background stars, diffraction spikes on bright stars, and constellation line draw animation. Used in HeroSection background.

#### OrionMark
Canvas constellation variant system for decorative placement.
```tsx
<OrionMark variant="full" lineOpacity={0.05} globalOpacity={0.3} rotate={20} />
```
Variants: `full`, `belt`, `shoulders`, `minimal`
Props: `variant`, `className`, `lineOpacity`, `globalOpacity`, `rotate`, `mirror`, `bgStarCount`

### Layout (`components/layout/`)

#### Navbar
Fixed navigation bar. Logo transitions from tagline to "Orion Studio" on scroll (homepage only). Uses GSAP-powered animation.

#### Footer
Site-wide footer with navigation links, social links, contact info, giant "ORION STUDIO" brand text, and OrionMark decoration. Animated on scroll entry.

### System (`components/system/`)

#### SmoothScroll
Lenis smooth scroll wrapper. Integrates with GSAP ticker and ScrollTrigger. Provides Lenis instance via LenisContext.

---

## 9. Page Structure

### Layout Hierarchy

```
RootLayout (layout.tsx)
├── SmoothScroll (Lenis + GSAP ticker)
│   ├── Navbar (fixed)
│   ├── {children}        ← page content
│   └── Footer
```

### Route Structure

```
app/
├── page.tsx                    ← Landing page (all sections)
└── (marketing)/
    ├── about/page.tsx
    ├── contact/page.tsx
    └── work/page.tsx
```

### Landing Page Section Order

1. **HeroSection** — ORION character reveal + pinned scroll exit
2. **ComparisonSection** — Before/after comparison
3. **ReelSection** — Clip-path image reveal
4. **ServicesSection** — DrawSVG service lines
5. **WorkSection** — Horizontal scroll gallery
6. **PhilosophySection** — Process steps
7. **ContactSection** — Magnetic CTA

### View Transitions

Page transitions use CSS `::view-transition` with a star-shaped mask (`/star.svg`):
- Old page closes with star mask shrinking
- New page opens with star mask expanding (0.55s delay)

---

## 10. Conventions

### Named Exports
All components use **named exports** (no `export default`).
```ts
// Good
export function MyComponent() { ... }

// Bad
export default function MyComponent() { ... }
```

### "use client" Directive
Any component that uses hooks, event handlers, or browser APIs must include `"use client"` at the top.

### GSAP Patterns
- Import from centralized barrel: `import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap"`
- Use `useGSAP()` hook (not raw `useEffect`) for timeline cleanup
- Use preset constants from `@/lib/animations/config` (`EASES`, `DURATIONS`, `STAGGER`)
- Use `{ scope: ref }` option on `useGSAP` for automatic selector scoping

### Tailwind Token Usage
- Use Tailwind utility classes mapped to CSS custom properties (e.g., `bg-background`, `text-foreground-muted`, `border-border-subtle`)
- Use typography utility classes (`.text-display`, `.text-body-lg`, etc.) instead of raw font-size
- Use layout utilities (`.section-container`, `.grid-container`, `.section-py`) for consistent spacing

### File Organization
- `components/sections/` — Landing page sections only
- `components/layout/` — Site-wide persistent UI (Navbar, Footer)
- `components/motion/` — Reusable animation primitives
- `components/effects/` — Visual effects (constellation, marks)
- `components/system/` — Infrastructure (SmoothScroll)
- `hooks/` — Custom React hooks
- `lib/animations/` — GSAP setup and config
- `lib/` — Utilities, context providers

### Known Issues
- GSAP Flip and Observer imports require `@ts-ignore` on Windows due to filename casing conflicts
- `lib/lenis-context.ts` exports `useLenis` for future use — currently unused but retained intentionally
