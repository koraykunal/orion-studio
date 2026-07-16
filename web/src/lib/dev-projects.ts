import type { Project } from "@/lib/project-types";

const tr = (locale: string, trText: string, enText: string) => (locale === "tr" ? trText : enText);

export function getDevProjects(locale: string): Project[] {
    return [
        {
            slug: "orion-brand-lab",
            client: "Orion Brand Lab",
            tagline: tr(
                locale,
                "Yeni bir stüdyo dilini moodboard, arayüz sistemi ve yayınlanabilir kod arasında kuran deneysel kimlik çalışması.",
                "An experimental identity study connecting moodboards, interface systems, and production-ready code.",
            ),
            year: "2026",
            services: ["Creative direction", "Identity", "UI kit", "Web engineering"],
            outcome: tr(
                locale,
                "Kimlik, motion ve web sistemi tek bir üretim dilinde toplandı.",
                "Identity, motion, and web system were unified into one production language.",
            ),
            image: "/brand/og-image.png",
            previewVideo: "",
            category: "studio",
            serviceCategory: "identity",
            featured: true,
            sections: [
                {
                    id: "orion-text",
                    type: "textBlock",
                    data: {
                        title: tr(locale, "Görsel sistem", "Visual system"),
                        content: null,
                        contentHtml: tr(
                            locale,
                            "<p>Moodboard, grid, tipografi ve hareket kararları tek bir tasarım sistemine indirildi. Amaç dekoratif bir vitrin değil, her yeni sayfada aynı karakteri koruyan bir marka altyapısıydı.</p>",
                            "<p>Moodboard, grid, typography, and motion decisions were reduced into one design system. The goal was not a decorative showcase, but brand infrastructure that keeps its character across every new page.</p>",
                        ),
                        layout: "side",
                    },
                },
                {
                    id: "orion-gallery",
                    type: "gallery",
                    data: {
                        columns: 3,
                        images: [
                            { src: "/brand/og-image.png", alt: "Desktop interface composition" },
                            { src: "/brand/og-image.png", alt: "Orion visual direction frame" },
                            { src: "/marketing/services/identity.svg", alt: "Identity system study" },
                            { src: "/marketing/services/web.svg", alt: "Web interface study" },
                        ],
                    },
                },
                {
                    id: "orion-tech",
                    type: "techStack",
                    data: { items: ["Next.js", "React", "Tailwind CSS", "GSAP", "Prisma", "Security headers"] },
                },
            ],
        },
        {
            slug: "atelier-flow",
            client: "Atelier Flow",
            tagline: tr(
                locale,
                "Bir kreatif ekibin brief, onay ve üretim akışını tek panelde toparlayan ürün konsepti.",
                "A product concept that brings brief, approval, and production flow into one creative operations panel.",
            ),
            year: "2026",
            services: ["Product design", "User flow", "Dashboard UI", "System design"],
            outcome: tr(
                locale,
                "Dağınık operasyon, rol bazlı ve ölçülebilir bir akışa çevrildi.",
                "A scattered operation became a role-based, measurable flow.",
            ),
            image: "/brand/og-image.png",
            previewVideo: "",
            category: "concept",
            serviceCategory: "apps",
            featured: true,
            sections: [
                {
                    id: "atelier-metrics",
                    type: "metrics",
                    data: {
                        items: [
                            { value: "5", label: "Core user flows" },
                            { value: "24", label: "Reusable UI states" },
                            { value: "3", label: "Permission layers" },
                        ],
                    },
                },
                {
                    id: "atelier-devices",
                    type: "deviceShowcase",
                    data: {
                        devices: [
                            { type: "desktop", image: "/brand/og-image.png", alt: "Desktop project dashboard" },
                            { type: "laptop", image: "/brand/og-image.png", alt: "Laptop approval workflow" },
                            { type: "phone", image: "/marketing/services/apps.svg", alt: "Mobile status view" },
                        ],
                    },
                },
                {
                    id: "atelier-security",
                    type: "textBlock",
                    data: {
                        title: tr(locale, "Engineering layer", "Engineering layer"),
                        content: null,
                        contentHtml: tr(
                            locale,
                            "<p>Yetki modeli, içerik güvenliği, audit trail ve performans bütçesi tasarım kararlarıyla aynı anda düşünüldü. Sistem yaklaşımı, arayüzün sadece iyi görünmesini değil güvenle çalışmasını hedefledi.</p>",
                            "<p>Permission model, content safety, audit trail, and performance budget were considered alongside design decisions. The system approach aimed for an interface that works reliably, not only looks polished.</p>",
                        ),
                        layout: "stackedLeft",
                    },
                },
            ],
        },
        {
            slug: "northline-web-system",
            client: "Northline",
            tagline: tr(
                locale,
                "Kurumsal web, servis sayfaları ve büyüme içerikleri için daha yalın bir yayın sistemi.",
                "A quieter publishing system for corporate web, service pages, and growth content.",
            ),
            year: "2025",
            services: ["Website", "SEO", "Design system", "Care plan"],
            outcome: tr(
                locale,
                "Sayfa üretimi hızlandı; görsel tutarlılık korunabilir hale geldi.",
                "Page production became faster while visual consistency stayed intact.",
            ),
            image: "/marketing/services/web.svg",
            previewVideo: "",
            category: "client",
            serviceCategory: "web",
            featured: false,
            sections: [
                {
                    id: "northline-quote",
                    type: "quote",
                    data: {
                        text: tr(
                            locale,
                            "Bize sadece yeni bir site değil, içeride sürdürebileceğimiz bir sistem gerekti.",
                            "We did not only need a new site. We needed a system our team could keep using.",
                        ),
                        author: "Northline team",
                        role: "Marketing",
                    },
                },
            ],
        },
        {
            slug: "motion-retail-kit",
            client: "Motion Retail Kit",
            tagline: tr(
                locale,
                "Sosyal içerik, landing page ve reklam kreatiflerini tek görsel dünyada birleştiren üretim kiti.",
                "A production kit that unifies social content, landing pages, and ad creatives in one visual world.",
            ),
            year: "2025",
            services: ["Content system", "Ads", "Motion", "Production"],
            outcome: tr(
                locale,
                "Kampanya üretimi daha hızlı, daha tanınabilir ve daha kontrollü hale geldi.",
                "Campaign production became faster, more recognizable, and more controlled.",
            ),
            image: "/marketing/services/production.svg",
            previewVideo: "",
            category: "concept",
            serviceCategory: "production",
            featured: false,
            sections: [],
        },
    ];
}

export function getDevProjectBySlug(slug: string, locale: string): Project | undefined {
    return getDevProjects(locale).find((project) => project.slug === slug);
}
