# Orion Studio - Brand Language

> The single source of truth for how Orion looks, moves, and speaks across every surface: website, ads, social, decks, email.
> `DESIGN-SYSTEM.md` is the technical token reference (the *what*). This file is the *how* and the *why*.

The rule of thumb: **deep night sky, one violet light, honest words.** If a layout, post, or ad still reads as "Orion" with the logo removed, the system is working.

---

## 1. Essence

| | |
|---|---|
| **What we are** | A digital studio: strategy, design, engineering, from concept to launch. |
| **Personality** | Precise, calm, confident. Quietly technical. No hype. |
| **Feeling** | Standing under a clear night sky. Vast, dark, ordered, one point of light you keep looking at. |
| **The metaphor** | Orion: a fixed constellation people have navigated by for millennia. We are the steady reference point for the people we work with. |

Three words to check any asset against: **dark, precise, honest.** If an asset is loud, decorative, or vague, it is off-brand.

---

## 2. The Symbol - Orion Constellation

The brand mark is the **Orion constellation**, rendered as connected stars on a dark field (see `src/components/effects/OrionMark.tsx`). It is the one ownable, non-negotiable visual asset.

**Anatomy** (do not rename or reposition the stars):
- Shoulders: **Betelgeuse** (brightest, top-left), **Bellatrix**
- Belt: **Mintaka, Alnilam, Alnitak** (the three aligned stars - the most recognisable signature)
- Feet: **Rigel** (second brightest), **Saiph**
- Head: **Meissa**

**Variants** (already coded):
- `full` - the whole figure. Hero moments, brand statements.
- `belt` - the three belt stars only. The tightest, most abstract lockup. Favicons, small spaces, loaders.
- `shoulders` - figure without the head. Mid-size decorative.
- `minimal` - four corner stars. Faint background texture.

**Usage rules:**
- The mark lives in the **background**, low opacity (`globalOpacity` 0.2-0.4 for sections, up to 0.7 for a deliberate hero feature). It is atmosphere, not a sticker.
- Betelgeuse and Rigel are the only stars that get diffraction spikes and atmospheric glow. Never add spikes to other stars.
- Star glow is always **violet-white** (`rgba(180,160,220,...)`), never warm, never multicolor.
- Rotate (`rotate` prop) and `mirror` to fit a composition, but keep the belt readable. Do not distort proportions.

**Do not:**
- Do not fill the constellation lines at high opacity so it becomes a hard "logo box".
- Do not recolor the stars to amber or any non-violet hue.
- Do not place it over busy photography where the stars disappear.
- Do not hand-draw a different star arrangement. The arrangement is the brand.

**The star-wipe transition** (`star.svg` mask in `globals.css` view transitions) is part of the identity. Page-to-page navigation irises through a star shape. Reuse this shape for social/video stingers when motion is available.

---

## 3. Color

Canonical color is **OKLCh** (`globals.css` / `tokens.css`). Values below include an approximate sRGB hex for tools that cannot take OKLCh (ad managers, some social editors). **OKLCh is the source of truth; convert exactly via oklch.com when precision matters.**

### Core palette

| Role | Token | OKLCh | ~HEX | Where |
|---|---|---|---|---|
| Night (page bg) | `--background` | `0.08 0.012 280` | `#05050a` | Everything sits on this |
| Surface 1 | `--surface-1` | `0.11 0.012 278` | `#0a0a10` | Cards, raised blocks |
| Surface 2 | `--surface-2` | `0.15 0.012 276` | `#0f1014` | Inputs, hover |
| Text primary | `--foreground` | `0.94 0.008 280` | `#eaebf1` | Headlines, body |
| Text muted | `--foreground-muted` | `0.55 0.012 275` | `#6f7179` | Secondary copy |
| Text subtle | `--foreground-subtle` | `0.34 0.010 278` | `#37383d` | Index numbers, hints |
| **Accent (violet)** | `--accent` | `0.72 0.15 295` | `#ac8ff8` | The one light |
| Accent bright | `--accent-bright` | `0.82 0.12 290` | `#c3b7ff` | Hover/active of accent |
| Accent warm (amber) | `--accent-warm` | `0.80 0.13 80` | `#e9b452` | Rare highlight only |
| Border | `--border` | `0.22 0.008 278` | `#1a1a1e` | Hairlines |
| Destructive | `--destructive` | `0.62 0.22 25` | `#ee343b` | Errors only |
| Success | `--success` | `0.72 0.15 155` | `#43c07a` | Confirmations only |

### The accent discipline (most important color rule)

- **Violet (`--accent`) is the brand light.** It is the only color that gets to glow, fill a CTA, or draw the eye. Use it sparingly so it stays special: a focus ring, one CTA, one hovered link, the constellation glow.
- **Amber (`--accent-warm`) is a guest, not a member.** It appears at most once per view, for a single warm highlight (a featured pill, a comparison "after"). Never as a second CTA color, never alongside violet competing for attention. If you are unsure, do not use amber.
- **One accent per surface.** A violet page does not get an amber button. A social post is either violet-lit or (rarely) amber-lit, never both shouting.
- Tints (`accent/10`, `glow`, `glow-strong`) carry the violet into shadows and gradients. Prefer these over solid violet blocks.

### Do not

- No pure black (`#000`) or pure white (`#fff`). Always the off-night and off-white tokens. Pure values flatten the depth.
- No gradient soup. Backgrounds are near-black with at most one soft violet radial glow.
- No new accent hues. The palette is violet + a rare amber. Adding teal, pink, etc. breaks recognition.
- No light-mode sections. The brand is dark, one theme, top to bottom.

---

## 4. Typography

Three typefaces, each with one job.

| Role | Typeface | Token | Job |
|---|---|---|---|
| Display | **Red Hat Display** | `--font-rh-display` / `font-display` | Hero, oversized statements. Tight tracking, uppercase for `text-hero`. |
| Body / UI | **Bricolage Grotesque** | `--font-bricolage` / `font-sans` | All running text, headings, labels. The default voice. |
| Meta / numeric | **Red Hat Mono** | `--font-rh-mono` / `font-mono` | Index numbers (`01`), years, metrics, technical tags. |

### Rules

- **Headlines control hierarchy with weight and tracking, not just size.** `tracking-tighter`, `leading-none` for display. Do not just inflate font size to shout.
- **Emphasis inside a headline uses italic of the same family** (Red Hat Display ships italics). Never swap in a different font for one word.
- **Mono is reserved for things that are literally data**: indices, years, metrics, spec values. Do not set body copy or marketing punch in mono.
- **Body copy max width 65ch.** Muted color for secondary paragraphs.
- The `text-editorial` style (italic, larger, muted) is the one place we get lyrical: taglines, pull quotes. Use once per section at most.
- Italic + descender letters (`y g j p q`) need `leading-[1.1]` minimum so descenders are not clipped.

### Type scale (named utilities, do not freelance sizes)

`text-display` > `text-hero` > `text-title` > `text-heading` > `text-body-lg` > `text-label` / `text-caption` / `text-index`. Reach for the named utility before writing an arbitrary `text-[...]`.

---

## 5. Texture - Grain

A fixed, full-viewport grain overlay (`body::after`, `noise.png`) sits above everything at ~5.5% opacity and jitters subtly (GPU `transform` only, disabled under `prefers-reduced-motion`). It is what makes the dark feel like film, not flat #000.

**For other channels:** export stills and video with a matching fine grain (low opacity, ~58px tile, monochrome). A perfectly clean gradient is off-brand; the night should have texture. Keep grain subtle enough to survive compression.

---

## 6. Motion Language

Motion is **slow, weighted, intentional.** Things arrive; they do not bounce in.

| Token | Curve | Use |
|---|---|---|
| `orion.out` / `brand` | `cubic-bezier(0.05,0,0.133,1)` | Default entrances |
| `orion.inOut` / `brand-in-out` | `cubic-bezier(0.37,0,0.63,1)` | Reveals, clip animations |
| `orion.spring` | `cubic-bezier(0.175,0.885,0.32,1.275)` | Rare playful accent |

**Signature moves** (reuse these, do not invent new ones per project):
- **Clip-inset reveal:** images open from `inset(6%)` to `inset(0)` with a slight scale-down. The house image entrance.
- **Line reveal / text reveal:** copy rises and fades on scroll, staggered by line or word.
- **Constellation drift:** stars twinkle slowly in the background, capped at 24fps, paused off-screen.
- **Star-wipe page transition:** the `star.svg` iris between routes.

**Rules:** animate only `transform` and `opacity`. Everything above a faint level honours `prefers-reduced-motion`. Motion must communicate (hierarchy, sequence, feedback), never decorate. No infinite loops except the slow constellation twinkle and a single marquee where it serves content.

---

## 7. Layout & Grid

- Container max `88rem` (1408px), fluid side padding `clamp(1.5rem,5vw,5rem)`.
- Generous vertical rhythm: `section-py` is `clamp(6rem,12vw,14rem)`. Orion breathes; it is not dense.
- Asymmetry over centered symmetry for most sections. Left-aligned headers, offset columns, the horizontal-scroll work track.
- One corner-radius family: soft (`rounded-lg`/`rounded-xl`) for surfaces, `rounded-full` for pills and interactive chips. Do not mix sharp and pill in one composition.
- **Eyebrows are rationed:** at most one small uppercase/mono label per ~3 sections. The index number (`01`) is the preferred minimal label. Do not put an uppercase eyebrow above every heading.

---

## 8. Voice & Tone

Orion writes like a senior person who respects your time: **plain, concrete, honest, never salesy.**

Reference (live contact copy):
> "Tell us what you're building. The messy, early version is fine. We'll come back within 48 hours with a real plan and an honest estimate."

### Do

- Short, declarative sentences. Concrete nouns and verbs.
- Admit limits and realities ("the messy, early version is fine", "an honest estimate").
- Say what a thing does, not how revolutionary it is.
- One clear call to action per page, reused verbatim ("Start a project").

### Do not

- No filler verbs: *elevate, unleash, seamless, next-gen, revolutionize, supercharge.*
- No invented brand names or fake-precise stats. Real numbers or none.
- No cute meta-labels ("From the field", "Currently on the bench"). Plain labels or none.
- **No em-dash (`-`) anywhere, ever.** This is a hard rule across web, ads, social, email, alt text. Use a period, comma, colon, parentheses, or a middle dot (`·`) for title separators (max one per line). En-dash for ranges is also out: write `$10K - $25K`, `1 - 3 months`.
- One CTA intent per page. Do not mix "Get in touch" + "Let's talk" + "Start a project".

---

## 9. Cross-Channel Application (Ads & Social)

The system has to survive outside the website. The recognisability test: **night background + violet light + the belt of Orion + honest type.**

**Always:**
- Start from `#05050a` night (or the deepest surface), never white.
- Place the Orion mark (usually `belt` or `minimal`) low-opacity in the field, off-center.
- One violet focal point (a word, a CTA, a glow). Amber only if violet is absent.
- Red Hat Display for the statement, Red Hat Mono for any number/date/handle.
- Apply fine grain to the export.
- Keep a safe margin; the belt and the headline never touch the edge.

**Never:**
- A bright/white background "for contrast".
- Stock-style multicolor gradients.
- The constellation turned into a hard logo lockup with a box around it.
- Two competing accent colors.
- Em-dashes in captions or ad copy.

**Formats:** keep one type scale across a campaign (a 1:1 post and a 9:16 story share the same headline weight feel). The constellation can rotate per format but the belt stays legible.

---

## 10. 30-Second Pre-Flight (any Orion asset)

- [ ] On a dark night background, not white, not pure black?
- [ ] Exactly one accent in play (violet by default; amber only as a rare guest)?
- [ ] Orion mark present, atmospheric, belt readable, stars violet?
- [ ] Red Hat Display for statement, Bricolage for body, Mono only for data?
- [ ] Grain texture applied?
- [ ] Zero em-dashes and en-dashes in any visible text?
- [ ] One CTA, one intent, plain honest wording, no filler verbs?
- [ ] Motion (if any) slow and weighted, reduced-motion safe?
- [ ] Recognisable as Orion with the wordmark removed?

If any box is unchecked, it is not ready.
