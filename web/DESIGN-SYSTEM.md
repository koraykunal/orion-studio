# Orion Studio — Design System

> Dark, violet-accented (with amber/gold warm accent) digital agency aesthetic with grainy texture overlay, cinematic animations, and OKLCh color space.

---

## 1. Overview

**Theme:** Dark mode only, deep navy backgrounds with lavender/violet accents and an amber/gold warm accent.
**Aesthetic:** Grainy texture, constellation motifs, cinematic scroll-driven animations.
**Tech stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4.1 (OKLCh), GSAP 3.14, Lenis smooth scroll, Canvas-based effects.

---

## 2. Colors

All colours are defined once, in `app/globals.css`. There is no second
source: this table is generated from that file.

```bash
npm run tokens
```

The script prints the table below and exits non-zero if `globals.css` is
missing a token, so the documentation cannot drift from the code without the
check failing.

| Token | Role |
|---|---|
| `--background` | Page base |
| `--surface-1` / `--surface-2` / `--surface-3` | Raised surfaces, ascending |
| `--foreground` | Primary text |
| `--foreground-readable` | Long-form body text |
| `--foreground-muted` | Secondary text, labels |
| `--foreground-subtle` | Tertiary text, indices |
| `--foreground-atmospheric` | Decorative text, disabled |
| `--accent` | Primary violet, interactive |
| `--accent-warm` | Amber, used sparingly per BRAND.md |
| `--accent-bright` | Hover and emphasis |
| `--accent-foreground` | Text on `--accent` |
| `--border` / `--border-subtle` / `--border-bright` | Hairlines, ascending |
| `--border-interactive` | Control boundaries |
| `--device-body` / `--device-edge` / `--device-bezel` | Simulated device chrome |
| `--device-screen-top` / `--device-screen-bottom` | Simulated screens |
| `--device-lens` | Cameras and sensors |
| `--glow-subtle` / `--glow` / `--glow-strong` | Violet radial glows |
| `--glow-warm-subtle` / `--glow-warm` | Amber radial glows |
| `--card` / `--primary` / `--muted` / `--secondary` / `--destructive` / `--success` / `--input` / `--ring` | shadcn aliases, defined in terms of the tokens above |

The device tokens are a deliberately separate palette: they are bezels, screens
and camera lenses in the case-study showcase, not brand surfaces. They were
previously 26 inline hex values in one component with no name.

### Contrast

`--foreground-muted` and `--foreground-subtle` sit at or above WCAG AA for
body text on `--background`. `--accent-foreground` on `--accent` is the
tightest pairing in the system; anything using it needs at least 16px, which is
why `OrionButton` uses it only on the large primary variant.

## 3. Typography

### Fonts

| Variable             | Font                | Role                       |
|----------------------|---------------------|----------------------------|
| `--font-rh-display`  | Red Hat Display     | Display, headings, logo    |
| `--font-bricolage`   | Bricolage Grotesque | Interface / body (default) |
| `--font-rh-mono`     | Red Hat Mono        | Numbers, metrics, index    |

Semantic CSS variables (in `globals.css`):
- `--font-sans` → Bricolage Grotesque (body default)
- `--font-display` → Red Hat Display (`.text-hero`, `.text-display`)
- `--font-mono` → Red Hat Mono (`.text-metric`, `.text-index`)

### Utility Classes

| Class            | Size                          | Line Height | Weight | Notes                    |
|------------------|-------------------------------|-------------|--------|--------------------------|
| `.text-display`  | `clamp(6.5rem, 13vw, 15rem)` | 0.88        | 400    | Red Hat Display          |
| `.text-hero`     | `clamp(2.5rem, 6.5vw, 8rem)` | 0.88        | 400    | Red Hat Display, uppercase |
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

| Name | Definition |
|---|---|
| `orion.out` | `expo.out` |
| `orion.inOut` | `expo.inOut` |
| `orion.spring` | `power3.out` with a small overshoot |

### GSAP Config Presets (`lib/animations/config.ts`)

| Export | Value |
|---|---|
| `EASES.expo` | `expo.out` |
| `EASES.sine` | `sine.inOut` |
| `DURATIONS.fast` | 0.4s |
| `DURATIONS.base` | 0.6s |
| `DURATIONS.slow` | 0.9s |
| `DURATIONS.xslow` | 1.2s |
| `STAGGER.tight` | 0.04s |
| `STAGGER.base` | 0.08s |
| `STAGGER.loose` | 0.16s |

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

Applied via `body::after` — fixed position PNG noise at 4% opacity, z-index 9990. Uses `/brand/noise.png` (128x128 tile).

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

Three independent root layouts, each rendering its own `<html>`/`<body>`.

```
src/app/
├── [locale]/                     public site, locale-prefixed
│   ├── layout.tsx                 document shell, JSON-LD, easter egg
│   └── (site)/
│       ├── layout.tsx             skip link, Navbar, Footer
│       ├── page.tsx               home
│       └── (marketing)/
│           ├── about/  blog/  contact/  services/  work/
├── admin/                         CMS, not localised
│   ├── layout.tsx                 document shell only, no auth check
│   ├── login/                     the only route reachable anonymously
│   └── (dashboard)/               auth() + redirect, then the shell
│       ├── page.tsx  posts/  projects/  messages/
├── design-system/                 style reference, noindex
├── api/
│   ├── admin/{projects,posts,messages,upload}
│   ├── auth/[...nextauth]  contact/  health/  indexnow-key/
├── error.tsx  global-error.tsx  not-found.tsx  robots.ts  sitemap.ts
└── proxy.ts                       Next 16's renamed middleware
```

`(marketing)` contributes no URL segment and has no layout; it is an
organisational grouping. `(dashboard)` does the same job but also owns the
authorisation check, which is why `/admin/login` can render for an anonymous
visitor while every other admin route cannot.

### Landing Page Section Order

```
HeroSection → TrustStrip → WorkSection → BrandMapSection → ReelSection
→ ServicesSection → WhyOrionSection → PhilosophySection → FaqSection
→ ContactSection
```

Ten sections, four numbered eyebrows. The numbering is deliberately not
contiguous: `BrandMapSection`, `ReelSection`, `WhyOrionSection` and
`FaqSection` are unnumbered.

### View Transitions

Page transitions use CSS `::view-transition` with a star-shaped mask (`/brand/star.svg`):
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

- **`/design-system` is publicly reachable.** It is `noindex`, but there is
  no auth gate. Add one, or accept that the token reference is public.
- **The dev project fallback is opt-in.** Set `DEV_PROJECT_FALLBACK=1`. It used
  to fire automatically on any empty result or thrown error in development,
  which made a broken query indistinguishable from an empty table.
- **iOS safe-area.** `viewport-fit: cover` is deliberately not set, so the
  fixed footer sits under the home indicator on notched devices. This was a
  deliberate trade for footer legibility; if it is reverted, the choice belongs
  here rather than only in a commit message.
- **The brand slogan in the navbar** ("DIGITAL DREAMS DESIGNED FOR YOU") is not
  in the brand voice. BRAND.md calls for precise and never salesy. It should be
  replaced before launch.
- **`OrionButton` has no `size` prop.** Every variant is `px-8 py-4`. A
  compact CTA currently has to be a hand-rolled button.
