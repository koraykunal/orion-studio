# i18n Entegrasyonu Tasarım Spec'i

**Tarih:** 2026-04-10  
**Proje:** Orion Studio — Next.js App Router  
**Kapsam:** Türkçe / İngilizce lokalizasyon, sub-path routing, dinamik içerik

---

## Genel Bakış

`next-intl` kütüphanesi kullanılarak `/en` ve `/tr` sub-path routing entegre edilir. Tarayıcı diline göre otomatik yönlendirme yapılır, tercih cookie'ye kaydedilir. UI string'leri JSON mesaj dosyalarında tutulur. Proje ve blog yazıları için veritabanına Türkçe alanlar eklenir. Admin paneli locale routing dışında kalır.

---

## 1. Mimari & Routing

### Klasör Yapısı

```
src/app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── contact/page.tsx
│   └── work/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── admin/
└── layout.tsx
```

Mevcut `(site)` ve `(marketing)` route group'ları `[locale]` altına taşınır. Admin paneli bu yapının dışında kalır.

### Middleware

`middleware.ts` dosyası proje root'una eklenir. `next-intl` middleware tüm istekleri yakalar, `Accept-Language` header'ını okur ve `/` isteklerini uygun locale'e yönlendirir. Tercih `NEXT_LOCALE` cookie'sine kaydedilir. `/admin` path'i matcher'dan muaf tutulur.

### Locale Konfigürasyonu

```
locales: ['en', 'tr']
defaultLocale: 'en'
```

---

## 2. Çeviri Dosyaları & Tip Güvenliği

### Dosya Yapısı

```
src/messages/
├── en.json
└── tr.json
```

### Namespace Yapısı

```json
{
  "nav": { "work": "", "about": "", "blog": "", "contact": "" },
  "home": { "hero": { "headline": "", "cta": "" } },
  "about": { "title": "", "description": "" },
  "work": { "title": "", "featuredLabel": "" },
  "blog": { "title": "", "readMore": "" },
  "contact": { "title": "", "submit": "", "fields": {} }
}
```

### Kullanım Deseni

Server Component'lerde `getTranslations(namespace)`, Client Component'lerde `useTranslations(namespace)` kullanılır. `next-intl` mesaj anahtarlarını TypeScript tipine expose eder; var olmayan anahtar derleme hatası verir.

---

## 3. Veritabanı & Dinamik İçerik

### Schema Değişiklikleri

Mevcut `title`, `description`, `content`, `excerpt` alanları `_en` suffix'i alır. Türkçe karşılıkları `_tr` suffix'li optional alanlar olarak eklenir.

```prisma
model Project {
  title_en       String
  title_tr       String?
  description_en String
  description_tr String?
  excerpt_en     String?
  excerpt_tr     String?
}

model Post {
  title_en   String
  title_tr   String?
  content_en String  @db.Text
  content_tr String? @db.Text
  excerpt_en String?
  excerpt_tr String?
}
```

### Fallback Stratejisi

`_tr` alanı boşsa `_en` alanı kullanılır. `lib/` katmanında `getLocalizedField(obj, field, locale)` yardımcı fonksiyonu bu mantığı merkezi olarak yönetir.

### Migration

Mevcut alan adları `_en` suffix'i alacak şekilde yeniden adlandırılır. Veri kaybı yoktur; yalnızca rename migration uygulanır.

---

## 4. Admin Panel Güncellemeleri

Proje ve blog yazısı formları locale routing dışında kalmaya devam eder (`/admin`). Mevcut input alanları `_en` label'ı alır. Her form için `_tr` alanları eklenir. Tab yapısı: **English | Türkçe**. Türkçe alanlar opsiyonel; boş bırakıldığında İngilizce içerik public sitede gösterilir.

---

## 5. Language Switcher & SEO

### Switcher Bileşeni

Navigasyona `EN | TR` toggle eklenir. `next-intl`'in `usePathname()` hook'u locale prefix'ini soyar; switcher bu pathname'i kullanarak `/en{pathname}` ve `/tr{pathname}` linklerini üretir. Aktif locale belirgin, diğeri düşük opaklıkta gösterilir.

### HTML lang Attribute

`[locale]/layout.tsx` içinde `<html lang={locale}>` set edilir.

### hreflang Meta Tag'leri

Her sayfada `generateMetadata` içinde `next-intl`'in `generateAlternates()` utility'si ile hreflang tag'leri üretilir.

---

## 6. Kapsam Dışı

- Admin paneli lokalizasyonu
- 3. dil desteği (yapı hazır olacak, eklenmeyecek)
- RTL dil desteği
- İçerik çeviri otomasyonu (makine çevirisi entegrasyonu)
