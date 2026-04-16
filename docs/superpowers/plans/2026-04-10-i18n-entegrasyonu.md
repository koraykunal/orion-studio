# i18n Entegrasyonu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** next-intl kullanarak `/en` ve `/tr` sub-path routing ile Türkçe/İngilizce lokalizasyon entegre etmek.

**Architecture:** `[locale]` dinamik segment tüm marketing route'larını sarar. Root `app/layout.tsx` kaldırılır; `[locale]/layout.tsx` ve `admin/layout.tsx` kendi `<html>/<body>` tag'larını içerir. Navbar'da `EN | TR` switcher eklenir. Prisma şemasına `_tr` alanları eklenir ve mevcut alanlar `_en` suffix'i alır.

**Tech Stack:** next-intl 4.x, Next.js 16 App Router, TypeScript, Prisma/PostgreSQL

---

## Dosya Haritası

**Yeni dosyalar:**
- `web/i18n/routing.ts`
- `web/i18n/request.ts`
- `web/middleware.ts`
- `web/src/messages/en.json`
- `web/src/messages/tr.json`
- `web/src/app/[locale]/layout.tsx`
- `web/src/app/[locale]/(site)/layout.tsx`
- `web/src/app/[locale]/(site)/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/about/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/blog/layout.tsx`
- `web/src/app/[locale]/(site)/(marketing)/blog/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/blog/[slug]/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/contact/layout.tsx`
- `web/src/app/[locale]/(site)/(marketing)/contact/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/work/layout.tsx`
- `web/src/app/[locale]/(site)/(marketing)/work/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/work/WorkPageClient.tsx`
- `web/src/app/[locale]/(site)/(marketing)/work/[slug]/page.tsx`
- `web/src/app/[locale]/(site)/(marketing)/work/[slug]/CaseStudyClient.tsx`
- `web/prisma/migrations/YYYYMMDD_i18n_fields/migration.sql`

**Değiştirilen dosyalar:**
- `web/next.config.ts`
- `web/src/app/layout.tsx` (silinir)
- `web/src/app/admin/layout.tsx` (`<html>/<body>` eklenir)
- `web/src/components/layout/Navbar.tsx`
- `web/src/components/layout/Footer.tsx`
- `web/src/components/sections/HeroSection.tsx`
- `web/src/components/sections/ServicesSection.tsx`
- `web/src/components/sections/ContactSection.tsx`
- `web/prisma/schema.prisma`
- `web/src/lib/projects.ts`
- `web/src/lib/blog.ts`
- `web/src/lib/project-types.ts`
- Admin panel form dosyaları

---

## Task 1: next-intl kur

**Files:**
- Modify: `web/package.json`

- [ ] **Step 1: Paketi kur**

```bash
cd web && npm install next-intl
```

- [ ] **Step 2: Kurulumu doğrula**

```bash
npm ls next-intl
```

Expected: `next-intl@4.x.x`

---

## Task 2: i18n config ve middleware oluştur

**Files:**
- Create: `web/i18n/routing.ts`
- Create: `web/i18n/request.ts`
- Create: `web/middleware.ts`

- [ ] **Step 1: `web/i18n/routing.ts` oluştur**

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
});
```

- [ ] **Step 2: `web/i18n/request.ts` oluştur**

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'tr')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: `web/middleware.ts` oluştur**

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
```

---

## Task 3: next.config.ts güncelle

**Files:**
- Modify: `web/next.config.ts`

- [ ] **Step 1: withNextIntl wrapper ekle**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const securityHeaders = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
    },
    experimental: {
        viewTransition: true,
    },
    async redirects() {
        return [
            { source: "/personal", destination: "/en/work", permanent: true },
            { source: "/ecom", destination: "/en/work", permanent: true },
            { source: "/corporation", destination: "/en/work", permanent: true },
            { source: "/single-page", destination: "/en/work", permanent: true },
            { source: "/request", destination: "/en/contact", permanent: true },
            { source: "/work/forma", destination: "/en/work", permanent: true },
            { source: "/work/harlow-finch", destination: "/en/work", permanent: true },
            { source: "/work/noctis", destination: "/en/work", permanent: true },
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
```

---

## Task 4: Çeviri dosyaları oluştur

**Files:**
- Create: `web/src/messages/en.json`
- Create: `web/src/messages/tr.json`

- [ ] **Step 1: `web/src/messages/en.json` oluştur**

```json
{
  "nav": {
    "studio": "Studio",
    "work": "Work",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact",
    "startProject": "Start a project",
    "openMenu": "Open menu",
    "closeMenu": "Close menu"
  },
  "footer": {
    "tagline": "Design-led studio crafting brands, products, and digital experiences that scale.",
    "navigate": "Navigate",
    "social": "Social",
    "getInTouch": "Get in touch",
    "bookCall": "Book a call",
    "crafted": "Crafted with precision",
    "navStudio": "Studio",
    "navWork": "Work",
    "navBlog": "Blog",
    "navAbout": "About",
    "navProcess": "Process",
    "navContact": "Contact"
  },
  "home": {
    "heroTagline": "Digital dreams designed for you",
    "heroStartProject": "Start a project",
    "heroViewWork": "View work",
    "heroTicker0": "Brand Strategy",
    "heroTicker1": "Web Design",
    "heroTicker2": "Digital Products",
    "heroTicker3": "Motion Design",
    "heroTicker4": "Creative Direction",
    "heroTicker5": "Development",
    "servicesLabel": "01 — Services",
    "servicesTitle": "What we do best",
    "servicesDescription": "From positioning to polish, every capability stays in lockstep with engineering so there are no handoffs breaking momentum.",
    "service0Title": "We Design Interfaces That Convert",
    "service0Description": "Web platforms and mobile applications engineered for clarity, speed, and real business outcomes.",
    "service1Title": "We Build Complex Systems",
    "service1Description": "From ERP platforms to custom backends — scalable architecture that grows with your business.",
    "service2Title": "We Craft Visual Identities",
    "service2Description": "Brand systems, motion design, and design tokens that stay cohesive across every touchpoint.",
    "service3Title": "We Ship End-to-End",
    "service3Description": "Strategy through production. No handoffs, no lost context — one team from concept to launch."
  },
  "about": {
    "heroLabel": "About Orion",
    "heroTitle": "A studio built for brands that refuse to blend in",
    "heroDescription": "We are a multidisciplinary design and engineering studio. We partner with ambitious companies to create digital experiences that are visually striking, technically sound, and built for growth.",
    "valuesLabel": "Our values",
    "valuesTitle": "What drives us",
    "valuesDescription": "Principles that shape how we work, what we build, and who we partner with.",
    "value0Title": "Craft over convention",
    "value0Body": "Every detail serves a purpose. We obsess over typography, motion, and interaction until the experience feels inevitable — not designed.",
    "value1Title": "Integrated delivery",
    "value1Body": "Strategy, design, and engineering operate on the same sprint. No handoffs, no lost context, no momentum breaks.",
    "value2Title": "Launch-ready thinking",
    "value2Body": "We build with production in mind from day one. Analytics, performance, accessibility — baked in, not bolted on.",
    "value3Title": "Transparent cadence",
    "value3Body": "Weekly updates, shared Figma files, documented decisions. You always know where the project stands.",
    "teamLabel": "The team",
    "teamTitle": "The people behind the work",
    "teamDescription": "Senior-only, cross-functional, and fully committed. Every person on the team ships — no account managers, no middlemen.",
    "member0Name": "Koray Kunal",
    "member0Role": "Co-Founder",
    "member1Name": "Mecit Keskin",
    "member1Role": "Brand Strategist",
    "capsLabel": "Capabilities",
    "capsTitle": "End-to-end, by design",
    "capsDescription": "From brand strategy to production-grade code, we cover the full spectrum so your project stays cohesive from concept to launch.",
    "cap0": "Web Design & Engineering",
    "cap1": "Mobile Applications",
    "cap2": "Product Design",
    "cap3": "Brand Identity",
    "cap4": "Design Systems",
    "ctaTitle": "Ready to build something remarkable?",
    "ctaDescription": "We take on a limited number of projects each quarter to ensure every engagement gets our full attention.",
    "ctaButton": "Start a project"
  },
  "work": {
    "pageLabel": "Selected Work",
    "featuredLabel": "Featured",
    "allLabel": "All Projects",
    "noProjects": "No projects found.",
    "yearLabel": "Year",
    "servicesLabel": "Services",
    "outcomeLabel": "Outcome",
    "backLabel": "Back to work",
    "nextProject": "Next project"
  },
  "blog": {
    "pageLabel": "Insights",
    "pageTitle": "From the studio",
    "pageDescription": "Thoughts on design, engineering, and the craft of building digital products.",
    "comingSoon": "Coming soon.",
    "readMore": "Read article"
  },
  "contact": {
    "pageLabel": "Let's work together",
    "pageTitle": "Tell us about your project",
    "servicesLabel": "Services needed",
    "service0": "Experience Strategy",
    "service1": "Web Engineering",
    "service2": "Visual Production",
    "service3": "Product Integration",
    "budgetLabel": "Budget range",
    "budget0": "< $10K",
    "budget1": "$10K – $25K",
    "budget2": "$25K – $50K",
    "budget3": "$50K – $100K",
    "budget4": "$100K+",
    "timelineLabel": "Timeline",
    "timeline0": "< 1 month",
    "timeline1": "1 – 3 months",
    "timeline2": "3 – 6 months",
    "timeline3": "6+ months",
    "timeline4": "Flexible",
    "fieldName": "Name",
    "fieldNamePlaceholder": "Your name",
    "fieldCompany": "Company",
    "fieldCompanyPlaceholder": "Company name (optional)",
    "fieldEmail": "Email",
    "fieldEmailPlaceholder": "your@email.com",
    "fieldBrief": "Project brief",
    "fieldBriefPlaceholder": "Tell us about your project...",
    "fieldReferral": "How did you find us?",
    "fieldReferralPlaceholder": "Google, Instagram, referral...",
    "submit": "Send message",
    "sending": "Sending...",
    "successTitle": "Message sent!",
    "successBody": "We'll be in touch soon.",
    "errorTitle": "Something went wrong.",
    "errorBody": "Please try again or email us directly."
  },
  "meta": {
    "homeTitle": "Orion Studio — Digital Agency",
    "homeDescription": "We design and engineer digital products for ambitious brands. Strategy, design, and engineering — from concept to launch.",
    "aboutTitle": "About",
    "aboutDescription": "A studio built for brands that refuse to blend in.",
    "workTitle": "Work",
    "workDescription": "Selected projects from Orion Studio.",
    "blogTitle": "Blog",
    "blogDescription": "Thoughts on design, engineering, and digital craft.",
    "contactTitle": "Contact",
    "contactDescription": "Start a project with Orion Studio."
  }
}
```

- [ ] **Step 2: `web/src/messages/tr.json` oluştur**

```json
{
  "nav": {
    "studio": "Studio",
    "work": "Projeler",
    "blog": "Blog",
    "about": "Hakkımızda",
    "contact": "İletişim",
    "startProject": "Proje Başlat",
    "openMenu": "Menüyü aç",
    "closeMenu": "Menüyü kapat"
  },
  "footer": {
    "tagline": "Marka, ürün ve dijital deneyimleri büyüterek tasarlayan yaratıcı stüdyo.",
    "navigate": "Sayfalar",
    "social": "Sosyal",
    "getInTouch": "İletişim",
    "bookCall": "Görüşme planla",
    "crafted": "Özenle inşa edildi",
    "navStudio": "Studio",
    "navWork": "Projeler",
    "navBlog": "Blog",
    "navAbout": "Hakkımızda",
    "navProcess": "Süreç",
    "navContact": "İletişim"
  },
  "home": {
    "heroTagline": "Hayallerin dijital tasarımı",
    "heroStartProject": "Proje Başlat",
    "heroViewWork": "Projeleri Gör",
    "heroTicker0": "Marka Stratejisi",
    "heroTicker1": "Web Tasarımı",
    "heroTicker2": "Dijital Ürünler",
    "heroTicker3": "Motion Tasarımı",
    "heroTicker4": "Yaratıcı Yönetim",
    "heroTicker5": "Geliştirme",
    "servicesLabel": "01 — Hizmetler",
    "servicesTitle": "En iyi yaptığımız şey",
    "servicesDescription": "Konumlandırmadan bitişe kadar, her kapasite mühendislikle adım adım ilerler; el değiştirmeler ivmeyi kesmez.",
    "service0Title": "Dönüşüm Sağlayan Arayüzler Tasarlıyoruz",
    "service0Description": "Netlik, hız ve gerçek iş sonuçları için tasarlanmış web platformları ve mobil uygulamalar.",
    "service1Title": "Karmaşık Sistemler İnşa Ediyoruz",
    "service1Description": "ERP platformlarından özel backend'lere — işinizle büyüyen ölçeklenebilir mimari.",
    "service2Title": "Görsel Kimlikler Üretiyoruz",
    "service2Description": "Her temas noktasında tutarlı kalan marka sistemleri, motion tasarımı ve tasarım token'ları.",
    "service3Title": "Uçtan Uca Teslim Ediyoruz",
    "service3Description": "Stratejiden üretime. El değiştirme yok, bağlam kaybı yok — fikirden lansmana kadar tek ekip."
  },
  "about": {
    "heroLabel": "Orion Hakkında",
    "heroTitle": "Sıraya girmek istemeyen markalar için kurulmuş bir stüdyo",
    "heroDescription": "Çok disiplinli bir tasarım ve mühendislik stüdyosuyuz. İddialı şirketlerle ortaklık kurarak görsel olarak çarpıcı, teknik olarak sağlam ve büyümeye hazır dijital deneyimler yaratıyoruz.",
    "valuesLabel": "Değerlerimiz",
    "valuesTitle": "Bizi yönlendiren şey",
    "valuesDescription": "Nasıl çalıştığımızı, ne ürettiğimizi ve kiminle çalıştığımızı şekillendiren ilkeler.",
    "value0Title": "Konvansiyonun ötesinde zanaatkarlık",
    "value0Body": "Her detay bir amaca hizmet eder. Deneyim kaçınılmaz hissettirene kadar tipografi, motion ve etkileşim üzerinde takıntılı biçimde çalışırız.",
    "value1Title": "Entegre teslimat",
    "value1Body": "Strateji, tasarım ve mühendislik aynı sprint'te çalışır. El değiştirme yok, bağlam kaybı yok, ivme kırılması yok.",
    "value2Title": "Lansmana hazır düşünce",
    "value2Body": "İlk günden itibaren üretimi akılda tutarak inşa ederiz. Analitik, performans, erişilebilirlik — sonradan eklenmez, baştan dahil edilir.",
    "value3Title": "Şeffaf kadans",
    "value3Body": "Haftalık güncellemeler, paylaşılan Figma dosyaları, belgelenmiş kararlar. Projenin nerede olduğunu her zaman bilirsiniz.",
    "teamLabel": "Ekip",
    "teamTitle": "İşin arkasındaki insanlar",
    "teamDescription": "Yalnızca kıdemli, çapraz fonksiyonlu ve tamamen adanmış. Ekipteki her kişi üretir — hesap yöneticisi yok, aracı yok.",
    "member0Name": "Koray Kunal",
    "member0Role": "Kurucu Ortak",
    "member1Name": "Mecit Keskin",
    "member1Role": "Marka Stratejisti",
    "capsLabel": "Yetenekler",
    "capsTitle": "Tasarımla uçtan uca",
    "capsDescription": "Marka stratejisinden üretim kalitesindeki koda, projenizin fikirden lansmana tutarlı kalması için tam spektrumu kapsıyoruz.",
    "cap0": "Web Tasarımı & Mühendisliği",
    "cap1": "Mobil Uygulamalar",
    "cap2": "Ürün Tasarımı",
    "cap3": "Marka Kimliği",
    "cap4": "Tasarım Sistemleri",
    "ctaTitle": "Olağanüstü bir şey inşa etmeye hazır mısınız?",
    "ctaDescription": "Her projeye tam dikkatimizi verebilmek için çeyrek başına sınırlı sayıda proje alıyoruz.",
    "ctaButton": "Proje Başlat"
  },
  "work": {
    "pageLabel": "Seçili Projeler",
    "featuredLabel": "Öne Çıkan",
    "allLabel": "Tüm Projeler",
    "noProjects": "Proje bulunamadı.",
    "yearLabel": "Yıl",
    "servicesLabel": "Hizmetler",
    "outcomeLabel": "Sonuç",
    "backLabel": "Projelere Dön",
    "nextProject": "Sonraki proje"
  },
  "blog": {
    "pageLabel": "İçgörüler",
    "pageTitle": "Stüdyodan",
    "pageDescription": "Tasarım, mühendislik ve dijital ürün üretme sanatı üzerine düşünceler.",
    "comingSoon": "Yakında.",
    "readMore": "Makaleyi oku"
  },
  "contact": {
    "pageLabel": "Birlikte çalışalım",
    "pageTitle": "Projeniz hakkında bize anlatın",
    "servicesLabel": "İhtiyaç duyulan hizmetler",
    "service0": "Deneyim Stratejisi",
    "service1": "Web Mühendisliği",
    "service2": "Görsel Prodüksiyon",
    "service3": "Ürün Entegrasyonu",
    "budgetLabel": "Bütçe aralığı",
    "budget0": "< $10K",
    "budget1": "$10K – $25K",
    "budget2": "$25K – $50K",
    "budget3": "$50K – $100K",
    "budget4": "$100K+",
    "timelineLabel": "Zaman çizelgesi",
    "timeline0": "< 1 ay",
    "timeline1": "1 – 3 ay",
    "timeline2": "3 – 6 ay",
    "timeline3": "6+ ay",
    "timeline4": "Esnek",
    "fieldName": "Ad",
    "fieldNamePlaceholder": "Adınız",
    "fieldCompany": "Şirket",
    "fieldCompanyPlaceholder": "Şirket adı (isteğe bağlı)",
    "fieldEmail": "E-posta",
    "fieldEmailPlaceholder": "siz@email.com",
    "fieldBrief": "Proje özeti",
    "fieldBriefPlaceholder": "Projeniz hakkında bize anlatın...",
    "fieldReferral": "Bizi nasıl buldunuz?",
    "fieldReferralPlaceholder": "Google, Instagram, referans...",
    "submit": "Mesaj gönder",
    "sending": "Gönderiliyor...",
    "successTitle": "Mesaj gönderildi!",
    "successBody": "En kısa sürede size dönüş yapacağız.",
    "errorTitle": "Bir şeyler ters gitti.",
    "errorBody": "Lütfen tekrar deneyin veya doğrudan e-posta gönderin."
  },
  "meta": {
    "homeTitle": "Orion Studio — Dijital Ajans",
    "homeDescription": "İddialı markalar için dijital ürünler tasarlıyor ve geliştiriyoruz.",
    "aboutTitle": "Hakkımızda",
    "aboutDescription": "Sıraya girmek istemeyen markalar için kurulmuş bir stüdyo.",
    "workTitle": "Projeler",
    "workDescription": "Orion Studio'dan seçili projeler.",
    "blogTitle": "Blog",
    "blogDescription": "Tasarım, mühendislik ve dijital zanaat üzerine düşünceler.",
    "contactTitle": "İletişim",
    "contactDescription": "Orion Studio ile proje başlatın."
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd web && git add i18n/ middleware.ts next.config.ts src/messages/
git commit -m "feat: add next-intl config and translation files"
```

---

## Task 5: Root layout yeniden yapılandır

**Files:**
- Delete: `web/src/app/layout.tsx`
- Create: `web/src/app/[locale]/layout.tsx`
- Modify: `web/src/app/admin/layout.tsx`

- [ ] **Step 1: `web/src/app/layout.tsx` sil**

```bash
rm web/src/app/layout.tsx
```

- [ ] **Step 2: `web/src/app/[locale]/layout.tsx` oluştur**

Font import'ları mevcut `layout.tsx`'ten alınır. `notFound` locale doğrulaması için eklenir.

```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Sora, Unica_One, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ViewTransitions } from "next-view-transitions";
import { routing } from "../../../i18n/routing";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap", weight: ["600", "700"] });
const unica = Unica_One({ variable: "--font-unica", display: "swap", weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", weight: ["400", "500", "600"], style: ["normal", "italic"] });
const myglaos = localFont({ src: "../../fonts/Myglaos.woff", variable: "--font-display-custom", display: "swap", weight: "400" });
const bechilo = localFont({ src: "../../fonts/bechilo.woff", variable: "--font-bechilo", display: "swap", weight: "400" });
const centralwell = localFont({ src: "../../fonts/Centralwell.ttf", variable: "--font-centralwell", display: "swap", weight: "400" });
const arcaneWhispers = localFont({ src: "../../fonts/ArcaneWhispers.ttf", variable: "--font-arcane", display: "swap", weight: "400" });

const BASE_URL = "https://orion-studio.net";

const fontVariables = [
    inter.variable, spaceGrotesk.variable, sora.variable, unica.variable,
    playfair.variable, myglaos.variable, bechilo.variable, centralwell.variable, arcaneWhispers.variable,
].join(" ");

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        metadataBase: new URL(BASE_URL),
        title: { default: t("homeTitle"), template: `%s | Orion Studio` },
        description: t("homeDescription"),
        keywords: ["digital agency", "web design", "brand identity", "UI/UX design", "frontend engineering", "design studio"],
        authors: [{ name: "Orion Studio", url: BASE_URL }],
        creator: "Orion Studio",
        icons: {
            icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/logo.svg", type: "image/svg+xml" }],
            apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",
        openGraph: {
            title: t("homeTitle"),
            description: t("homeDescription"),
            url: BASE_URL,
            siteName: "Orion Studio",
            locale: locale === "tr" ? "tr_TR" : "en_US",
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Orion Studio — Digital Agency" }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("homeTitle"),
            description: t("homeDescription"),
            images: ["/og-image.png"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}`,
            languages: { en: `${BASE_URL}/en`, tr: `${BASE_URL}/tr` },
        },
        other: { "theme-color": "#0a0a12", "msapplication-TileColor": "#0a0a12" },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "en" | "tr")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <ViewTransitions>
            <html lang={locale} className="dark">
                <head />
                <body className={fontVariables}>
                    <NextIntlClientProvider messages={messages}>
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "Organization",
                                    name: "Orion Studio",
                                    url: BASE_URL,
                                    logo: `${BASE_URL}/logo.svg`,
                                    description: "We design and engineer digital products for ambitious brands.",
                                    sameAs: [
                                        "https://www.instagram.com/orionstud.io/",
                                        "https://www.linkedin.com/company/104592237",
                                    ],
                                    contactPoint: {
                                        "@type": "ContactPoint",
                                        email: "koraykunal85@outlook.com",
                                        contactType: "customer service",
                                    },
                                }),
                            }}
                        />
                        {children}
                    </NextIntlClientProvider>
                </body>
            </html>
        </ViewTransitions>
    );
}
```

- [ ] **Step 3: `web/src/app/admin/layout.tsx` güncelle — `<html>` ve `<body>` ekle**

Font import'ları `[locale]/layout.tsx` ile aynı olacak. Inter ve SpaceGrotesk admin için yeterli.

```tsx
import { Inter, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./components/Sidebar";
import { auth } from "@/lib/auth";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata = {
    title: "Admin — Orion Studio",
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
                <SessionProvider session={session}>
                    {isLoggedIn ? (
                        <div className="flex min-h-screen bg-background">
                            <Sidebar />
                            <main className="flex-1 overflow-y-auto">
                                <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
                                    {children}
                                </div>
                            </main>
                        </div>
                    ) : (
                        children
                    )}
                </SessionProvider>
            </body>
        </html>
    );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/ src/app/admin/layout.tsx
git commit -m "feat: restructure root layout for locale routing"
```

---

## Task 6: Marketing route'larını [locale] altına taşı

**Files:**
- Create: `web/src/app/[locale]/(site)/layout.tsx`
- Create: `web/src/app/[locale]/(site)/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/about/layout.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/about/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/blog/layout.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/blog/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/blog/[slug]/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/contact/layout.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/contact/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/work/layout.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/work/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/work/WorkPageClient.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/work/[slug]/layout.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/work/[slug]/page.tsx`
- Create: `web/src/app/[locale]/(site)/(marketing)/work/[slug]/CaseStudyClient.tsx`
- Delete: `web/src/app/(site)/` (tüm içeriğiyle)

- [ ] **Step 1: Mevcut dosyaları kopyala**

```bash
cd web
cp -r src/app/\(site\)/ src/app/\[locale\]/\(site\)/
```

- [ ] **Step 2: Eski (site) klasörünü sil**

```bash
rm -rf src/app/\(site\)/
```

- [ ] **Step 3: `[locale]/(site)/(marketing)/work/page.tsx` güncelle — locale'i params'tan al**

```tsx
export const dynamic = "force-dynamic";

import { getAllProjects } from "@/lib/projects";
import { WorkPageClient } from "./WorkPageClient";

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const projects = await getAllProjects(locale);
    const featured = projects.filter((p) => p.featured);
    const others = projects.filter((p) => !p.featured);

    return <WorkPageClient featured={featured} others={others} />;
}
```

- [ ] **Step 4: `[locale]/(site)/(marketing)/blog/page.tsx` güncelle — locale'i params'tan al**

```tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const posts = await getAllPosts(locale);
    const t = await getTranslations("blog");

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -right-[10%] top-[5%] w-[45%] h-[75%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.05} globalOpacity={0.3} rotate={10} />
                </div>
                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />
                    <div className="space-y-8 max-w-3xl">
                        <span className="text-index text-foreground-muted">{t("pageLabel")}</span>
                        <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                            {t("pageTitle")}
                        </TextReveal>
                        <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[52ch]" delay={0.2}>
                            {t("pageDescription")}
                        </TextReveal>
                    </div>
                </div>
            </section>
            <section className="section-container pb-32">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-body-lg text-foreground-muted">{t("comingSoon")}</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block py-8 border-b border-border-subtle hover:border-border transition-colors duration-300">
                                <div className="flex items-start justify-between gap-8">
                                    <div className="flex-1 space-y-3">
                                        <h2 className="text-heading group-hover:text-accent transition-colors duration-300">{post.title}</h2>
                                        <p className="text-body text-foreground-muted max-w-[60ch]">{post.description}</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-caption text-foreground-subtle">{post.date}</span>
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="text-caption px-2 py-0.5 rounded-full border border-border text-foreground-muted">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-label text-foreground-subtle group-hover:text-accent transition-colors duration-300 shrink-0 mt-1">{t("readMore")}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
```

- [ ] **Step 5: `[locale]/(site)/(marketing)/work/[slug]/page.tsx` güncelle**

```tsx
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { CaseStudyClient } from "./CaseStudyClient";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function CaseStudyPage({ params }: Props) {
    const { slug, locale } = await params;
    const project = await getProjectBySlug(slug, locale);

    if (!project) notFound();

    const allProjects = await getAllProjects(locale);
    const nextProject = allProjects.find((p) => p.sections && p.sections.length > 0 && p.slug !== slug) ?? null;

    return <CaseStudyClient project={project} nextProject={nextProject} />;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/
git commit -m "feat: move marketing routes under [locale] segment"
```

---

## Task 7: Navbar güncelle

**Files:**
- Modify: `web/src/components/layout/Navbar.tsx`

- [ ] **Step 1: Navbar'ı locale-aware ve çeviri destekli hale getir**

`useLocale` ve `usePathname` next-intl'den, `useTranslations` çeviri için, `Link` ise `next-view-transitions`'tan kalır (view transitions korunmak için).

```tsx
'use client'

import { useRef, useState, useCallback } from "react";
import { usePathname } from "next-intl/client";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animations/gsap";

const CYCLE_INTERVAL = 4;
const FLIP_DURATION = 0.6;

export function Navbar() {
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("nav");
    const tHome = useTranslations("home");
    const [menuOpen, setMenuOpen] = useState(false);

    const routes = [
        { labelKey: "studio", link: `/${locale}/#capabilities` },
        { labelKey: "work",   link: `/${locale}/work` },
        { labelKey: "blog",   link: `/${locale}/blog` },
        { labelKey: "about",  link: `/${locale}/about` },
        { labelKey: "contact",link: `/${locale}/contact` },
    ];

    const handleClick = (e: React.MouseEvent, href: string) => {
        if (`/${locale}${pathname}` === href || pathname === href) e.preventDefault();
        setMenuOpen(false);
    };

    const toggleMenu = useCallback(() => {
        setMenuOpen((prev) => !prev);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const dreamRef = useRef<HTMLSpanElement>(null);
    const orionRef = useRef<HTMLSpanElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !dreamRef.current || !orionRef.current || !logoRef.current) return;

        const items = [dreamRef.current, orionRef.current, logoRef.current];
        let current = 0;

        items.forEach(el => el.style.transform = "");
        gsap.set(items[0], { yPercent: 0 });
        gsap.set(items[1], { yPercent: 100 });
        gsap.set(items[2], { yPercent: 100 });

        const flip = () => {
            const outEl = items[current];
            const next = (current + 1) % items.length;
            const inEl = items[next];

            gsap.timeline({ onComplete: () => { current = next; } })
                .to(outEl, { yPercent: -100, duration: FLIP_DURATION, ease: "orion.inOut" })
                .fromTo(inEl, { yPercent: 100 }, { yPercent: 0, duration: FLIP_DURATION, ease: "orion.inOut" }, 0);
        };

        gsap.delayedCall(CYCLE_INTERVAL, function repeat() {
            flip();
            gsap.delayedCall(CYCLE_INTERVAL, repeat);
        });
    }, { scope: containerRef });

    const textStyle = {
        fontFamily: "var(--font-unica)",
        fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
        letterSpacing: "0.12em",
        lineHeight: "1.2",
        textTransform: "uppercase" as const,
    };

    const otherLocale = locale === "en" ? "tr" : "en";

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50">
                <div className="section-container flex items-center justify-between h-20">
                    <Link href={`/${locale}`} onClick={(e) => handleClick(e, `/${locale}`)} className="block" aria-label="Orion Studio">
                        <div ref={containerRef} className="relative overflow-hidden" style={{ ...textStyle, height: "1.2em" }}>
                            <span ref={dreamRef} className="block whitespace-nowrap" style={{ letterSpacing: "0.08em" }}>
                                {tHome("heroTagline")}
                            </span>
                            <span ref={orionRef} className="absolute top-0 left-0 block">Orion Studio</span>
                            <div ref={logoRef} className="absolute top-0 left-0 flex items-center h-full">
                                <Image src="/logo.svg" alt="Orion Studio" width={60} height={60} className="w-[1.2em] h-[1.2em]" />
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-8">
                        <ul className="hidden md:flex items-center gap-8">
                            {routes.map((route) => (
                                <li key={route.labelKey}>
                                    <Link
                                        href={route.link}
                                        onClick={(e) => handleClick(e, route.link)}
                                        className="nav-link text-label text-foreground-muted hover:text-foreground transition-colors"
                                        style={{ transitionDuration: "350ms" }}
                                    >
                                        {t(route.labelKey as "studio" | "work" | "blog" | "about" | "contact")}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="hidden md:flex items-center gap-3 text-label">
                            <Link
                                href={`/en${pathname}`}
                                className={locale === "en" ? "font-semibold text-foreground" : "text-foreground-muted hover:text-foreground transition-colors"}
                                style={{ transitionDuration: "350ms" }}
                            >
                                EN
                            </Link>
                            <span className="text-foreground-subtle opacity-40">|</span>
                            <Link
                                href={`/tr${pathname}`}
                                className={locale === "tr" ? "font-semibold text-foreground" : "text-foreground-muted hover:text-foreground transition-colors"}
                                style={{ transitionDuration: "350ms" }}
                            >
                                TR
                            </Link>
                        </div>

                        <Link
                            href={`/${locale}/contact`}
                            onClick={(e) => handleClick(e, `/${locale}/contact`)}
                            className="hidden md:block text-label border-b border-border pb-0.5 hover:border-foreground transition-colors"
                            style={{ transitionDuration: "350ms" }}
                        >
                            {t("startProject")}
                        </Link>

                        <button
                            onClick={toggleMenu}
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                            aria-expanded={menuOpen}
                        >
                            <span className="block w-5 h-px bg-foreground transition-all duration-300" style={{ transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none" }} />
                            <span className="block w-5 h-px bg-foreground transition-all duration-300" style={{ opacity: menuOpen ? 0 : 1 }} />
                            <span className="block w-5 h-px bg-foreground transition-all duration-300" style={{ transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none" }} />
                        </button>
                    </div>
                </div>
            </nav>

            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden">
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {routes.map((route) => (
                            <Link
                                key={route.labelKey}
                                href={route.link}
                                onClick={(e) => handleClick(e, route.link)}
                                className="text-title text-foreground hover:text-accent transition-colors duration-300"
                            >
                                {t(route.labelKey as "studio" | "work" | "blog" | "about" | "contact")}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4 text-label">
                            <Link href={`/en${pathname}`} className={locale === "en" ? "font-semibold" : "text-foreground-muted"}>EN</Link>
                            <span className="text-foreground-subtle opacity-40">|</span>
                            <Link href={`/tr${pathname}`} className={locale === "tr" ? "font-semibold" : "text-foreground-muted"}>TR</Link>
                        </div>
                        <Link
                            href={`/${locale}/contact`}
                            onClick={(e) => handleClick(e, `/${locale}/contact`)}
                            className="mt-4 px-8 py-3 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500"
                        >
                            {t("startProject")}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
```

**Not:** Navbar, `usePathname` için `next-intl/client` kullanır. Bu import'un doğru çözümlendiğini build ile doğrula. Sorun çıkarsa `next-intl`'den import et.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add locale-aware navigation and language switcher"
```

---

## Task 8: Footer güncelle

**Files:**
- Modify: `web/src/components/layout/Footer.tsx`

- [ ] **Step 1: Footer'a translations ekle**

`"use client"` direktifi korunur. `useLocale` ve `useTranslations` eklenir. `navLinks` ve `socials` array'leri translations'dan türetilir. Sosyal medya URL'leri değişmez.

Mevcut Footer dosyasında:
1. `import { useLocale, useTranslations } from "next-intl";` ekle
2. `useTranslations("footer")` çağrısı ekle
3. `useLocale()` çağrısı ekle
4. `navLinks` array'ini translations kullanacak şekilde güncelle
5. Link href'lerini `/${locale}/work` formatına güncelle
6. "Navigate", "Social", "Get in touch", "Book a call", "Crafted with precision" string'lerini `t(...)` ile değiştir

Aşağıdaki değişiklikler `Footer.tsx`'e uygulanır:

```tsx
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
    const locale = useLocale();
    const t = useTranslations("footer");

    const navLinks = [
        { labelKey: "navStudio",  href: `/${locale}/#capabilities` },
        { labelKey: "navWork",    href: `/${locale}/work` },
        { labelKey: "navBlog",    href: `/${locale}/blog` },
        { labelKey: "navAbout",   href: `/${locale}/about` },
        { labelKey: "navProcess", href: `/${locale}/#process` },
        { labelKey: "navContact", href: `/${locale}/contact` },
    ];
```

Ve template içinde `"Navigate"` → `{t("navigate")}`, `"Social"` → `{t("social")}`, `"Get in touch"` → `{t("getInTouch")}`, `"Book a call"` → `{t("bookCall")}`, `"Crafted with precision"` → `{t("crafted")}`, tagline string'i → `{t("tagline")}` yapılır.

NavLinks map içinde `{link.label}` yerine `{t(link.labelKey as any)}` kullanılır.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: localize Footer component"
```

---

## Task 9: HeroSection ve ServicesSection güncelle

**Files:**
- Modify: `web/src/components/sections/HeroSection.tsx`
- Modify: `web/src/components/sections/ServicesSection.tsx`

- [ ] **Step 1: HeroSection güncelle**

`useTranslations("home")` ekle. `TICKER_ITEMS` array'ini translations'dan türet. Link href'leri locale-aware yap.

```tsx
import { useTranslations, useLocale } from "next-intl";

export function HeroSection() {
    const t = useTranslations("home");
    const locale = useLocale();

    const TICKER_ITEMS = [
        t("heroTicker0"), t("heroTicker1"), t("heroTicker2"),
        t("heroTicker3"), t("heroTicker4"), t("heroTicker5"),
    ];

    // ...mevcut GSAP kodu değişmez...

    return (
        // ...
        <Link href={`/${locale}/contact`} ...>
            {t("heroStartProject")}
        </Link>
        <Link href={`/${locale}/#work`} ...>
            {t("heroViewWork")}
        </Link>
        // ...
    );
}
```

Logo tagline metni `dreamRef` span'ında: `{t("heroTagline")}`

- [ ] **Step 2: ServicesSection güncelle**

`useTranslations("home")` ekle. `services` array'ini translations'dan türet.

```tsx
import { useTranslations } from "next-intl";

export function ServicesSection() {
    const t = useTranslations("home");

    const services = [
        { title: t("service0Title"), description: t("service0Description") },
        { title: t("service1Title"), description: t("service1Description") },
        { title: t("service2Title"), description: t("service2Description") },
        { title: t("service3Title"), description: t("service3Description") },
    ];

    return (
        <section className="section-py bg-background" id="capabilities">
            <div className="grid-container gap-y-12">
                <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-6">
                    <span className="text-index text-foreground-subtle">{t("servicesLabel")}</span>
                    <TextReveal as="h2" type="lines" className="text-title">{t("servicesTitle")}</TextReveal>
                    <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted" delay={0.2}>
                        {t("servicesDescription")}
                    </TextReveal>
                </div>
                <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                    {services.map((service, i) => (
                        <ServiceItem key={service.title} title={service.title} description={service.description} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.tsx src/components/sections/ServicesSection.tsx
git commit -m "feat: localize HeroSection and ServicesSection"
```

---

## Task 10: About sayfasını güncelle

**Files:**
- Modify: `web/src/app/[locale]/(site)/(marketing)/about/page.tsx`

- [ ] **Step 1: About sayfasına translations ekle**

`"use client"` direktifi kalır. `useTranslations("about")` ve `useLocale()` ekle. Tüm hardcoded string'leri ve array'leri translations'dan türet.

```tsx
import { useTranslations, useLocale } from "next-intl";

export default function AboutPage() {
    const t = useTranslations("about");
    const locale = useLocale();

    const values = [
        { index: "01", title: t("value0Title"), body: t("value0Body") },
        { index: "02", title: t("value1Title"), body: t("value1Body") },
        { index: "03", title: t("value2Title"), body: t("value2Body") },
        { index: "04", title: t("value3Title"), body: t("value3Body") },
    ];

    const team = [
        { name: t("member0Name"), role: t("member0Role"), image: "/team/koray.png" },
        { name: t("member1Name"), role: t("member1Role"), image: "/team/mecit.jpeg" },
    ];

    const capabilities = [
        t("cap0"), t("cap1"), t("cap2"), t("cap3"), t("cap4"),
    ];
```

Sayfa içindeki tüm hardcoded string'leri ilgili `t(...)` çağrılarıyla değiştir:
- `"About Orion"` → `{t("heroLabel")}`
- `"A studio built for brands that refuse to blend in"` → `{t("heroTitle")}`
- `"We are a multidisciplinary..."` → `{t("heroDescription")}`
- `"Our values"` → `{t("valuesLabel")}`
- `"What drives us"` → `{t("valuesTitle")}`
- `"Principles that shape..."` → `{t("valuesDescription")}`
- `"The team"` → `{t("teamLabel")}`
- `"The people behind the work"` → `{t("teamTitle")}`
- `"Senior-only..."` → `{t("teamDescription")}`
- `"Capabilities"` → `{t("capsLabel")}`
- `"End-to-end, by design"` → `{t("capsTitle")}`
- `"From brand strategy..."` → `{t("capsDescription")}`
- `"Ready to build something remarkable?"` → `{t("ctaTitle")}`
- `"We take on a limited..."` → `{t("ctaDescription")}`
- `"Start a project"` (CTA) → `{t("ctaButton")}`
- CTA link href: `href={`/${locale}/contact`}`

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/\(site\)/\(marketing\)/about/
git commit -m "feat: localize About page"
```

---

## Task 11: Contact sayfasını güncelle

**Files:**
- Modify: `web/src/app/[locale]/(site)/(marketing)/contact/page.tsx`

- [ ] **Step 1: Contact sayfasına translations ekle**

`useTranslations("contact")` ve `useLocale()` ekle. `services`, `budgets`, `timelines` array'lerini translations'dan türet.

```tsx
import { useTranslations, useLocale } from "next-intl";

export default function ContactPage() {
    const t = useTranslations("contact");
    const locale = useLocale();

    const services = [t("service0"), t("service1"), t("service2"), t("service3")];
    const budgets = [t("budget0"), t("budget1"), t("budget2"), t("budget3"), t("budget4")];
    const timelines = [t("timeline0"), t("timeline1"), t("timeline2"), t("timeline3"), t("timeline4")];
```

Form field label'larını ve placeholder'larını `t(...)` ile değiştir:
- Field label'ları: `t("fieldName")`, `t("fieldCompany")`, `t("fieldEmail")`, `t("fieldBrief")`, `t("fieldReferral")`
- Placeholder'lar: `t("fieldNamePlaceholder")` vb.
- Submit button: `{formStatus === "sending" ? t("sending") : t("submit")}`
- Section label: `{t("servicesLabel")}`, `{t("budgetLabel")}`, `{t("timelineLabel")}`
- Success/error mesajları: `t("successTitle")`, `t("successBody")`, `t("errorTitle")`, `t("errorBody")`
- Sayfa başlığı: `{t("pageLabel")}`, `{t("pageTitle")}`

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/\(site\)/\(marketing\)/contact/
git commit -m "feat: localize Contact page"
```

---

## Task 12: Work sayfasını ve WorkPageClient güncelle

**Files:**
- Modify: `web/src/app/[locale]/(site)/(marketing)/work/WorkPageClient.tsx`

- [ ] **Step 1: WorkPageClient güncelle**

`useTranslations("work")` ve `useLocale()` ekle. `getCategoryLabel` fonksiyonu locale'e göre güncellenir (Task 16'da).

```tsx
import { useTranslations, useLocale } from "next-intl";

export function WorkPageClient({ featured, others }: { featured: Project[]; others: Project[] }) {
    const t = useTranslations("work");
    const locale = useLocale();
```

Hardcoded string'leri değiştir:
- Featured section heading → `{t("featuredLabel")}`
- All projects heading → `{t("allLabel")}`
- `getCategoryLabel(project.category)` → `getCategoryLabel(project.category, locale)` (Task 14'te güncellendi)
- Project link href'leri → `/${locale}/work/${project.slug}`

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/\(site\)/\(marketing\)/work/
git commit -m "feat: localize Work page"
```

---

## Task 13: Prisma şeması güncelle

**Files:**
- Modify: `web/prisma/schema.prisma`

- [ ] **Step 1: Post modelini güncelle**

```prisma
model Post {
  id            String     @id @default(cuid())
  title_en      String
  title_tr      String?
  slug          String     @unique
  description_en String    @default("")
  description_tr String?
  content_en    Json?
  content_tr    Json?
  contentHtml_en String    @default("")
  contentHtml_tr String?
  tags          String[]
  coverImage    String?
  status        PostStatus @default(draft)
  publishedAt   DateTime?
  author        User       @relation(fields: [authorId], references: [id])
  authorId      String
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
```

- [ ] **Step 2: Project modelini güncelle**

```prisma
model Project {
  id          String          @id @default(cuid())
  slug        String          @unique
  client      String
  tagline_en  String          @default("")
  tagline_tr  String?
  year        String          @default("")
  services    String[]
  outcome_en  String          @default("")
  outcome_tr  String?
  image       String          @default("")
  category    ProjectCategory @default(client)
  sections    Json            @default("[]")
  featured    Boolean         @default(false)
  order       Int             @default(0)
  status      PostStatus      @default(draft)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}
```

- [ ] **Step 3: Migration oluştur**

```bash
cd web && npx prisma migrate dev --name i18n_fields
```

Migration SQL'i onaylamadan önce incele. Rename işlemleri için Prisma otomatik `DROP` + `ADD` yapabilir. Veri kaybını önlemek için migration SQL dosyasını elle düzenle:

Migration dosyasını bul (`prisma/migrations/*/migration.sql`) ve içeriğini şununla değiştir:

```sql
ALTER TABLE "Post" RENAME COLUMN "title" TO "title_en";
ALTER TABLE "Post" ADD COLUMN "title_tr" TEXT;
ALTER TABLE "Post" RENAME COLUMN "description" TO "description_en";
ALTER TABLE "Post" ADD COLUMN "description_tr" TEXT;
ALTER TABLE "Post" RENAME COLUMN "content" TO "content_en";
ALTER TABLE "Post" ADD COLUMN "content_tr" JSONB;
ALTER TABLE "Post" RENAME COLUMN "contentHtml" TO "contentHtml_en";
ALTER TABLE "Post" ADD COLUMN "contentHtml_tr" TEXT;
ALTER TABLE "Project" RENAME COLUMN "tagline" TO "tagline_en";
ALTER TABLE "Project" ADD COLUMN "tagline_tr" TEXT;
ALTER TABLE "Project" RENAME COLUMN "outcome" TO "outcome_en";
ALTER TABLE "Project" ADD COLUMN "outcome_tr" TEXT;
```

- [ ] **Step 4: Migration'ı çalıştır**

```bash
npx prisma migrate deploy
```

- [ ] **Step 5: Prisma client'ı yenile**

```bash
npx prisma generate
```

- [ ] **Step 6: Commit**

```bash
git add prisma/
git commit -m "feat: add i18n fields to Post and Project models"
```

---

## Task 14: lib/projects.ts ve lib/blog.ts güncelle

**Files:**
- Modify: `web/src/lib/projects.ts`
- Modify: `web/src/lib/blog.ts`
- Modify: `web/src/lib/project-types.ts`

- [ ] **Step 1: `project-types.ts` güncelle — `getCategoryLabel` locale destekli yap**

`Project` tipindeki `tagline` ve `outcome` alanları aynı isimde kalır (locale çözümlemesi lib katmanında yapılır). `getCategoryLabel` fonksiyonu locale parametresi alacak şekilde güncellenir:

```ts
export function getCategoryLabel(category: ProjectCategory, locale: string = "en"): string {
    const labels: Record<ProjectCategory, Record<string, string>> = {
        client: { en: "Client Work", tr: "Müşteri Projesi" },
        concept: { en: "Design Exploration", tr: "Tasarım Keşfi" },
        studio: { en: "Studio Showcase", tr: "Stüdyo Çalışması" },
    };
    return labels[category][locale] ?? labels[category]["en"];
}
```

WorkPageClient ve CaseStudyClient'ta `getCategoryLabel(project.category, locale)` olarak çağır.

- [ ] **Step 2: `lib/projects.ts` güncelle — locale parametresi ekle**

```ts
import { prisma } from "@/lib/prisma";
import type { Project, ProjectCategory, Section } from "@/lib/project-types";

export type { Project, ProjectCategory, Section };
export { getCategoryLabel } from "@/lib/project-types";

function getLocalizedStr(en: string, tr: string | null | undefined, locale: string): string {
    return (locale === "tr" && tr) ? tr : en;
}

function mapProject(
    p: {
        slug: string; client: string; tagline_en: string; tagline_tr: string | null;
        year: string; services: string[]; outcome_en: string; outcome_tr: string | null;
        image: string; category: string; featured: boolean; sections: unknown;
    },
    locale: string
): Project {
    return {
        slug: p.slug,
        client: p.client,
        tagline: getLocalizedStr(p.tagline_en, p.tagline_tr, locale),
        year: p.year,
        services: p.services,
        outcome: getLocalizedStr(p.outcome_en, p.outcome_tr, locale),
        image: p.image,
        category: p.category as ProjectCategory,
        featured: p.featured,
        sections: (p.sections as Section[]) || [],
    };
}

export async function getAllProjects(locale: string = "en"): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { status: "published" },
        orderBy: { order: "asc" },
    });
    return projects.map((p) => mapProject(p, locale));
}

export async function getFeaturedProjects(locale: string = "en"): Promise<Project[]> {
    const projects = await prisma.project.findMany({
        where: { status: "published", featured: true },
        orderBy: { order: "asc" },
    });
    return projects.map((p) => mapProject(p, locale));
}

export async function getProjectBySlug(slug: string, locale: string = "en"): Promise<Project | undefined> {
    const p = await prisma.project.findFirst({
        where: { slug, status: "published" },
    });
    if (!p) return undefined;
    return mapProject(p, locale);
}
```

- [ ] **Step 3: `lib/blog.ts` güncelle — locale parametresi ekle**

```ts
import { prisma } from "@/lib/prisma";

export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    contentHtml: string;
    coverImage: string | null;
};

function getLocalizedStr(en: string, tr: string | null | undefined, locale: string): string {
    return (locale === "tr" && tr) ? tr : en;
}

export async function getAllPosts(locale: string = "en"): Promise<BlogPost[]> {
    const posts = await prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        select: {
            slug: true,
            title_en: true,
            title_tr: true,
            description_en: true,
            description_tr: true,
            publishedAt: true,
            tags: true,
            contentHtml_en: true,
            contentHtml_tr: true,
            coverImage: true,
        },
    });

    return posts.map((post) => ({
        slug: post.slug,
        title: getLocalizedStr(post.title_en, post.title_tr, locale),
        description: getLocalizedStr(post.description_en, post.description_tr, locale),
        date: post.publishedAt?.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        tags: post.tags,
        contentHtml: getLocalizedStr(post.contentHtml_en, post.contentHtml_tr, locale),
        coverImage: post.coverImage,
    }));
}

export async function getPostBySlug(slug: string, locale: string = "en"): Promise<BlogPost | undefined> {
    const post = await prisma.post.findFirst({
        where: { slug, status: "published" },
        select: {
            slug: true,
            title_en: true,
            title_tr: true,
            description_en: true,
            description_tr: true,
            publishedAt: true,
            tags: true,
            contentHtml_en: true,
            contentHtml_tr: true,
            coverImage: true,
        },
    });

    if (!post) return undefined;

    return {
        slug: post.slug,
        title: getLocalizedStr(post.title_en, post.title_tr, locale),
        description: getLocalizedStr(post.description_en, post.description_tr, locale),
        date: post.publishedAt?.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        tags: post.tags,
        contentHtml: getLocalizedStr(post.contentHtml_en, post.contentHtml_tr, locale),
        coverImage: post.coverImage,
    };
}
```

- [ ] **Step 4: blog/[slug]/page.tsx güncelle**

```tsx
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug, locale);
    if (!post) notFound();
    // ...
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/projects.ts src/lib/blog.ts
git commit -m "feat: add locale support to projects and blog lib functions"
```

---

## Task 15: Admin panel — EN/TR tab yapısı ekle

**Files:**
- Modify: `web/src/app/admin/projects/new/page.tsx`
- Modify: `web/src/app/admin/projects/[id]/page.tsx`
- Modify: `web/src/app/admin/posts/new/page.tsx`
- Modify: `web/src/app/admin/posts/[id]/page.tsx`

- [ ] **Step 1: Admin proje formuna TR alanları ekle**

`web/src/app/admin/projects/new/page.tsx` ve `[id]/page.tsx` dosyalarında form field'larını güncelle. `title` → `title_en` ve yeni `title_tr` alanı yan yana veya tab içinde.

Her form field çifti için pattern:

```tsx
<div className="space-y-2">
    <label className="text-sm font-medium">Tagline (EN)</label>
    <input name="tagline_en" defaultValue={project?.tagline_en} className="..." />
</div>
<div className="space-y-2">
    <label className="text-sm font-medium">Tagline (TR)</label>
    <input name="tagline_tr" defaultValue={project?.tagline_tr ?? ""} placeholder="Turkish version (optional)" className="..." />
</div>
```

Form action'larında `tagline_en`, `tagline_tr`, `outcome_en`, `outcome_tr` field'larını handle et.

- [ ] **Step 2: Admin blog formuna TR alanları ekle**

Post formlarında `title_en`, `title_tr`, `description_en`, `description_tr` alanları ekle. `contentHtml_en` ve `contentHtml_tr` için iki ayrı TiptapEditor bileşeni kullanılır.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add TR fields to admin project and post forms"
```

---

## Task 16: Sayfa metadata ve hreflang güncelle

**Files:**
- Modify: `web/src/app/[locale]/(site)/(marketing)/about/layout.tsx`
- Modify: `web/src/app/[locale]/(site)/(marketing)/work/layout.tsx`
- Modify: `web/src/app/[locale]/(site)/(marketing)/blog/layout.tsx`
- Modify: `web/src/app/[locale]/(site)/(marketing)/contact/layout.tsx`

- [ ] **Step 1: About layout metadata**

```tsx
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://orion-studio.net";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        title: t("aboutTitle"),
        description: t("aboutDescription"),
        alternates: {
            canonical: `${BASE_URL}/${locale}/about`,
            languages: { en: `${BASE_URL}/en/about`, tr: `${BASE_URL}/tr/about` },
        },
    };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
```

Aynı pattern `work`, `blog`, `contact` layout'larına uygulanır — namespace anahtarları `workTitle/workDescription`, `blogTitle/blogDescription`, `contactTitle/contactDescription` olarak değişir.

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/\(site\)/\(marketing\)/
git commit -m "feat: add hreflang and locale metadata to marketing pages"
```

---

## Task 17: Build doğrula

- [ ] **Step 1: TypeScript kontrolü**

```bash
cd web && npx tsc --noEmit
```

Hata yoksa devam et.

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Dev modda manuel test**

```bash
npm run dev
```

Tarayıcıda test et:
- `http://localhost:3000` → `/en` redirect olmalı (veya tarayıcı diline göre `/tr`)
- `http://localhost:3000/tr/about` → Türkçe içerik göstermeli
- `http://localhost:3000/en/work` → İngilizce içerik göstermeli
- Navbar'da `EN | TR` switcher görünmeli
- `/admin` → locale routing'e girmemeli
- Dil değiştirince aynı sayfada kalmalı (örn. `/en/about` → `/tr/about`)
