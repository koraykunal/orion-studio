export default function DesignSystemPage() {
    const colors = [
        { name: "background", token: "--background", value: "oklch(0.08 0.012 280)" },
        { name: "surface-1", token: "--surface-1", value: "oklch(0.11 0.012 278)" },
        { name: "surface-2", token: "--surface-2", value: "oklch(0.15 0.012 276)" },
        { name: "surface-3", token: "--surface-3", value: "oklch(0.19 0.010 274)" },
        { name: "foreground", token: "--foreground", value: "oklch(0.94 0.008 280)" },
        { name: "foreground-muted", token: "--foreground-muted", value: "oklch(0.55 0.012 275)" },
        { name: "foreground-subtle", token: "--foreground-subtle", value: "oklch(0.34 0.010 278)" },
        { name: "accent", token: "--accent", value: "oklch(0.72 0.15 295)" },
        { name: "accent-warm", token: "--accent-warm", value: "oklch(0.65 0.18 310)" },
        { name: "accent-bright", token: "--accent-bright", value: "oklch(0.82 0.12 290)" },
        { name: "border", token: "--border", value: "oklch(0.22 0.008 278)" },
        { name: "border-subtle", token: "--border-subtle", value: "oklch(0.15 0.006 278)" },
        { name: "border-bright", token: "--border-bright", value: "oklch(0.30 0.010 280)" },
        { name: "destructive", token: "--destructive", value: "oklch(0.62 0.22 25)" },
    ];

    const glows = [
        { name: "glow", token: "--glow", value: "oklch(0.72 0.15 295 / 0.10)" },
        { name: "glow-strong", token: "--glow-strong", value: "oklch(0.72 0.15 295 / 0.22)" },
    ];

    const radii = [
        { name: "sm", value: "0.25rem" },
        { name: "md", value: "0.375rem" },
        { name: "default", value: "0.5rem" },
        { name: "lg", value: "0.625rem" },
        { name: "xl", value: "1rem" },
        { name: "2xl", value: "1.5rem" },
        { name: "full", value: "9999px" },
    ];

    const eases = [
        { name: "brand", css: "cubic-bezier(0.05, 0, 0.133, 1)", gsap: "orion.out" },
        { name: "brand-in", css: "cubic-bezier(0.55, 0, 1, 0.45)", gsap: "—" },
        { name: "brand-in-out", css: "cubic-bezier(0.37, 0, 0.63, 1)", gsap: "orion.inOut" },
        { name: "spring", css: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", gsap: "orion.spring" },
        { name: "expo", css: "—", gsap: "expo.out" },
    ];

    const durations = [
        { name: "fast", css: "150ms", gsap: "0.3s" },
        { name: "base", css: "350ms", gsap: "0.6s" },
        { name: "slow", css: "600ms", gsap: "0.9s" },
        { name: "xslow", css: "900ms", gsap: "1.4s" },
    ];

    const spacings = [
        { name: "section-py", value: "clamp(6rem, 12vw, 14rem)" },
        { name: "section-gap", value: "clamp(3rem, 6vw, 8rem)" },
        { name: "container-max", value: "88rem (1408px)" },
        { name: "container-px", value: "clamp(1.5rem, 5vw, 5rem)" },
    ];

    return (
        <main className="bg-background text-foreground min-h-screen py-20">
            <div className="max-w-[1200px] mx-auto px-8 space-y-24">

                {/* ── Header ── */}
                <header className="space-y-4 border-b border-border pb-12">
                    <p className="text-index">Design System</p>
                    <h1 className="text-title">Orion Studio</h1>
                    <p className="text-body-lg text-foreground-muted max-w-[60ch]">
                        A comprehensive design system built on OKLCh color space, fluid typography, and custom GSAP motion primitives.
                    </p>
                </header>

                {/* ── 1. Colors ── */}
                <section className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-index">01</p>
                        <h2 className="text-heading">Color Palette</h2>
                        <p className="text-body-lg text-foreground-muted">OKLCh color space — perceptually uniform, Hue 275-295</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {colors.map((c) => (
                            <div key={c.name} className="space-y-2">
                                <div
                                    className="w-full aspect-square rounded-lg border border-border"
                                    style={{ backgroundColor: `var(${c.token})` }}
                                />
                                <p className="text-label">{c.name}</p>
                                <p className="text-xs font-mono text-foreground-subtle">{c.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Glows */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Glows</p>
                        <div className="flex gap-6">
                            {glows.map((g) => (
                                <div key={g.name} className="space-y-2">
                                    <div
                                        className="w-32 h-32 rounded-full"
                                        style={{ background: `radial-gradient(circle, var(${g.token}), transparent 70%)`, border: "1px solid var(--border-subtle)" }}
                                    />
                                    <p className="text-label">{g.name}</p>
                                    <p className="text-xs font-mono text-foreground-subtle">{g.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 2. Typography ── */}
                <section className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-index">02</p>
                        <h2 className="text-heading">Typography</h2>
                        <p className="text-body-lg text-foreground-muted">5 font families, 10+ utility classes</p>
                    </div>

                    {/* Font Families */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 border-b border-border">
                        <div className="space-y-2">
                            <p className="text-label text-accent">Display — Myglaos</p>
                            <p style={{ fontFamily: "var(--font-display-custom)", fontSize: "2.5rem", lineHeight: 1, letterSpacing: "-0.03em" }}>Orion Studio</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-label text-accent">Title — Unica One</p>
                            <p style={{ fontFamily: "var(--font-unica)", fontSize: "2.5rem", lineHeight: 1 }}>ORION STUDIO</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-label text-accent">Interface — Space Grotesk</p>
                            <p style={{ fontFamily: "var(--font-space)", fontSize: "1.5rem", lineHeight: 1.3 }}>Space Grotesk 400</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-label text-accent">Editorial — Bechilo</p>
                            <p style={{ fontFamily: "var(--font-bechilo)", fontSize: "2rem", lineHeight: 1.2, fontStyle: "italic" }}>Bechilo Italic</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-label text-accent">Data — JetBrains Mono</p>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", lineHeight: 1.4 }}>0123456789 — 98.7%</p>
                        </div>
                    </div>

                    {/* Type Scale */}
                    <div className="space-y-6">
                        <p className="text-label text-foreground-muted">Type Scale</p>

                        <div className="space-y-8">
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-display</span>
                                <span className="text-display leading-none" style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}>Aa</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-hero</span>
                                <span className="text-hero">Hero Headline</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-title</span>
                                <span className="text-title">Title Text</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-heading</span>
                                <span className="text-heading">Heading Text</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-body-lg</span>
                                <span className="text-body-lg">Body large — the primary reading size for longer passages of text.</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-label</span>
                                <span className="text-label">Label Text</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-caption</span>
                                <span className="text-caption">Caption Text</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-index</span>
                                <span className="text-index">Index / Mono Text</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-metric</span>
                                <span className="text-metric" style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}>98.7%</span>
                            </div>
                            <div className="flex items-end gap-6 border-b border-border-subtle pb-4">
                                <span className="text-index shrink-0 w-28">.text-editorial</span>
                                <span className="text-editorial">Editorial italic style for quotes and callouts</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 3. Spacing ── */}
                <section className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-index">03</p>
                        <h2 className="text-heading">Spacing & Layout</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {spacings.map((s) => (
                            <div key={s.name} className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-1">
                                <span className="text-label">{s.name}</span>
                                <span className="font-mono text-sm text-foreground-muted">{s.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">12-Column Grid</p>
                        <div className="grid grid-cols-12 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-16 rounded bg-surface-2 border border-border-subtle flex items-center justify-center">
                                    <span className="text-index">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 4. Radii ── */}
                <section className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-index">04</p>
                        <h2 className="text-heading">Border Radius</h2>
                    </div>

                    <div className="flex flex-wrap gap-6 items-end">
                        {radii.map((r) => (
                            <div key={r.name} className="space-y-2 text-center">
                                <div
                                    className="w-20 h-20 bg-accent/20 border-2 border-accent"
                                    style={{ borderRadius: r.value }}
                                />
                                <p className="text-label">{r.name}</p>
                                <p className="text-xs font-mono text-foreground-subtle">{r.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 5. Surfaces & Components ── */}
                <section className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-index">05</p>
                        <h2 className="text-heading">Surfaces & Components</h2>
                    </div>

                    {/* Surface Stack */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Surface Elevation</p>
                        <div className="flex gap-4">
                            {["background", "surface-1", "surface-2", "surface-3"].map((s, i) => (
                                <div
                                    key={s}
                                    className="flex-1 h-32 rounded-lg border border-border flex items-center justify-center"
                                    style={{ backgroundColor: `var(--${s})` }}
                                >
                                    <span className="text-label">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card Variants */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Cards</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="surface-card rounded-lg p-6 space-y-3">
                                <h3 className="text-heading text-lg">Surface Card</h3>
                                <p className="text-sm text-foreground-muted">Default card with subtle border</p>
                            </div>
                            <div className="surface-card-hover rounded-lg p-6 space-y-3 cursor-pointer">
                                <h3 className="text-heading text-lg">Hover Card</h3>
                                <p className="text-sm text-foreground-muted">Interactive card — hover me</p>
                            </div>
                            <div className="rounded-lg p-6 space-y-3 border border-accent/30 bg-surface-1 glow-accent">
                                <h3 className="text-heading text-lg">Glow Card</h3>
                                <p className="text-sm text-foreground-muted">Accent glow effect</p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Buttons</p>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className="px-8 py-3 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500">
                                Default Button
                            </button>
                            <button className="px-8 py-3 rounded-full bg-accent text-accent-foreground text-label hover:bg-accent-bright transition-all duration-500">
                                Primary Button
                            </button>
                            <button className="px-8 py-3 rounded-full border border-border text-label text-foreground-muted hover:text-foreground hover:border-border-bright transition-all duration-500">
                                Ghost Button
                            </button>
                        </div>
                    </div>

                    {/* Dividers */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Dividers</p>
                        <div className="space-y-4 p-6 bg-surface-1 rounded-lg">
                            <p className="text-xs font-mono text-foreground-subtle">.divider</p>
                            <div className="divider" />
                            <p className="text-xs font-mono text-foreground-subtle">.divider-subtle</p>
                            <div className="divider-subtle" />
                        </div>
                    </div>

                    {/* Capability Pills */}
                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Pills / Tags</p>
                        <div className="flex flex-wrap gap-3">
                            {["Brand Strategy", "Visual Identity", "Web Design", "Motion Systems", "Frontend Engineering", "Design Systems"].map((cap) => (
                                <span
                                    key={cap}
                                    className="px-5 py-3 rounded-full border border-border bg-surface-1 text-label text-foreground-muted hover:border-border-bright hover:text-foreground transition-all duration-300"
                                >
                                    {cap}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 6. Motion ── */}
                <section className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-index">06</p>
                        <h2 className="text-heading">Motion & Easing</h2>
                        <p className="text-body-lg text-foreground-muted">GSAP-powered motion with custom easing curves</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Easing Curves</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {eases.map((e) => (
                                <div key={e.name} className="p-4 rounded-lg border border-border bg-surface-1 space-y-2">
                                    <p className="text-label">{e.name}</p>
                                    <p className="text-xs font-mono text-foreground-subtle">CSS: {e.css}</p>
                                    <p className="text-xs font-mono text-accent">GSAP: {e.gsap}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Duration Scale</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {durations.map((d) => (
                                <div key={d.name} className="p-4 rounded-lg border border-border bg-surface-1 space-y-1">
                                    <p className="text-label">{d.name}</p>
                                    <p className="text-xs font-mono text-foreground-subtle">CSS: {d.css}</p>
                                    <p className="text-xs font-mono text-accent">GSAP: {d.gsap}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-label text-foreground-muted">Stagger Presets (GSAP)</p>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { name: "tight", value: "0.04s" },
                                { name: "base", value: "0.08s" },
                                { name: "loose", value: "0.15s" },
                                { name: "chars", value: "0.02s" },
                                { name: "words", value: "0.06s" },
                            ].map((s) => (
                                <div key={s.name} className="px-4 py-3 rounded-lg border border-border bg-surface-1">
                                    <p className="text-label">{s.name}</p>
                                    <p className="text-xs font-mono text-accent">{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t border-border pt-8 pb-4">
                    <p className="text-caption">Orion Studio Design System v1.0</p>
                </footer>
            </div>
        </main>
    );
}
