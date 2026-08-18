# Dr. Smile Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Dr. Smile Dental Group static site with a warm/family design system, bilingual EN/ES support for 19 main pages, and WCAG 2.1 AA accessibility.

**Architecture:** Astro 5 static site. EN pages at root, ES pages under `/es/`. Shared components (UtilityBar, Header, Footer, etc.) accept a `locale` prop and pull strings from `src/i18n/{locale}.json`. Each page has an EN and ES version. Blog remains EN-only.

**Tech Stack:** Astro 5.18, `@astrojs/sitemap`, Inter + Nunito (Google Fonts), WebP images, zero external JS frameworks.

## Global Constraints

- Base path: `/DrSmileOnline/`
- Site URL: `https://skittleson.github.io`
- Custom domain: `doctorsmileonline.com`
- Colors: primary `#2A9D8F`, deep `#1D5C54`, accent `#E9A03B`, surface `#FDF8F0`, text `#2C3E50`, text-light `#5D6D7E`, white `#FFFFFF`
- Fonts: Inter (body 400/500/600/700), Nunito (headings 600/700/800)
- Body text: 17px (1.0625rem), line-height 1.6
- Spacing: 8px base unit
- Border radius: 12px cards, 8px buttons
- All transitions ≤ 200ms
- `prefers-reduced-motion: reduce` disables all animations
- Tap targets ≥ 44×44px
- Focus indicator: 3px solid `#2A9D8F` outline, 2px offset
- Lighthouse a11y target: ≥ 95
- Lighthouse performance target: ≥ 95
- No GA4 scripts (removed)
- Blog: EN-only, 104 posts

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `src/i18n/en.json` | English UI strings |
| `src/i18n/es.json` | Spanish UI strings |
| `src/i18n/index.ts` | `getTranslations(locale)` helper |
| `src/components/UtilityBar.astro` | Top bar: phone, lang toggle, CTA |
| `src/components/TrustBand.astro` | Reviews + insurance + locations |
| `src/components/LocationCards.astro` | 4 location cards |
| `src/components/StickyMobileCTA.astro` | Mobile bottom bar |
| `src/components/TestimonialCarousel.astro` | Manual carousel |
| `src/pages/404.astro` | Custom 404 |
| `src/pages/es/index.astro` | ES home |
| `src/pages/es/nosotros.astro` | ES about |
| `src/pages/es/servicios.astro` | ES services |
| `src/pages/es/cirugia-bucal.astro` | ES oral surgery |
| `src/pages/es/cuidado-cosmetico.astro` | ES cosmetic |
| `src/pages/es/invisalign-ortodoncia.astro` | ES Invisalign |
| `src/pages/es/all-on-four.astro` | ES All-on-Four |
| `src/pages/es/guia-implantes.astro` | ES implant guide |
| `src/pages/es/guia-carillas.astro` | ES veneers guide |
| `src/pages/es/tratamiento-invisalign.astro` | ES Invisalign treatment |
| `src/pages/es/ubicacion.astro` | ES location |
| `src/pages/es/financiamiento.astro` | ES financing |
| `src/pages/es/contacto.astro` | ES contact |
| `src/pages/es/preguntas-frecuentes.astro` | ES FAQs |
| `src/pages/es/anuncios-importantes.astro` | ES announcements |
| `src/pages/es/politica-de-privacidad.astro` | ES privacy |
| `src/pages/es/terminos-y-condiciones.astro` | ES terms |

### Modified Files

| File | Change |
|------|--------|
| `astro.config.mjs` | Add i18n config |
| `src/styles/global.css` | New design system (colors, fonts, spacing, a11y) |
| `src/layouts/Base.astro` | Accept locale prop, hreflang, lang attribute |
| `src/components/Header.astro` | Redesign with new design system |
| `src/components/Footer.astro` | Redesign with new design system |
| `src/components/ServiceCard.astro` | Redesign with new design system |
| `src/components/CtaBanner.astro` | Redesign with new design system |
| `src/pages/index.astro` | Restructure with new section order |
| `src/pages/about.astro` | Redesign |
| `src/pages/services.astro` | Redesign |
| `src/pages/oral-surgery.astro` | Redesign |
| `src/pages/cosmetic-care.astro` | Redesign |
| `src/pages/invisalign-orthodontcs.astro` | Redesign |
| `src/pages/all-on-four-prosthetics.astro` | Redesign |
| `src/pages/dental-implant-guide.astro` | Redesign |
| `src/pages/dental-veneers-guide.astro` | Redesign |
| `src/pages/dental-invisalign-treatment.astro` | Redesign |
| `src/pages/location.astro` | Redesign with LocationCards |
| `src/pages/financing.astro` | Redesign |
| `src/pages/contact.astro` | Replace COMING SOON with form |
| `src/pages/faqs.astro` | Redesign |
| `src/pages/important-announcements.astro` | Redesign |
| `src/pages/privacy-policy.astro` | Redesign |
| `src/pages/terms-and-conditions.astro` | Redesign |
| `src/pages/blog/index.astro` | Redesign |
| `src/pages/blog/[...slug].astro` | Redesign |

### Deleted Files

| File | Reason |
|------|--------|
| `src/components/Testimonial.astro` | Replaced by TestimonialCarousel |

---

### Task 1: Design System Foundation

**Files:**
- Modify: `src/styles/global.css`
- Modify: `astro.config.mjs`
- Modify: `src/layouts/Base.astro`
- Create: `src/i18n/en.json`
- Create: `src/i18n/es.json`
- Create: `src/i18n/index.ts`

**Interfaces:**
- Produces: CSS custom properties (`--color-primary`, `--font-body`, `--font-display`, etc.)
- Produces: `getTranslations(locale: string): Record<string, string>`
- Produces: Base layout accepting `locale?: 'en' | 'es'` prop

- [ ] **Step 1: Rewrite `src/styles/global.css` with the new design system**

```css
:root {
  --color-primary: #2A9D8F;
  --color-primary-dark: #1D5C54;
  --color-accent: #E9A03B;
  --color-surface: #FDF8F0;
  --color-text: #2C3E50;
  --color-text-light: #5D6D7E;
  --color-bg: #FFFFFF;
  --color-border: #E8E0D4;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
  --max-width: 1200px;
  --radius: 12px;
  --radius-sm: 8px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 80px;
  --space-8: 96px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  font-size: 1.0625rem;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  line-height: 1.3;
  color: var(--color-primary-dark);
}

h1 { font-size: clamp(2rem, 4vw, 3rem); }
h2 { font-size: 1.75rem; }
h3 { font-size: 1.25rem; }
h4 { font-size: 1.125rem; }

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: #fff;
  padding: var(--space-1) var(--space-2);
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

.section {
  padding: var(--space-6) 0;
}

.section-surface {
  background: var(--color-surface);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-2) var(--space-3);
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  transition: background 0.2s ease-out;
}

.btn:hover {
  background: var(--color-primary-dark);
  text-decoration: none;
}

.btn-accent {
  background: var(--color-accent);
  color: #fff;
}

.btn-accent:hover {
  background: #d48c2e;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: #fff;
}

:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 2: Add Google Fonts to `src/layouts/Base.astro` head**

In the `<head>` section, before the CSS link, add:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Add i18n config to `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  base: '/DrSmileOnline/',
  site: 'https://skittleson.github.io',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
```

- [ ] **Step 4: Create `src/i18n/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "location": "Location",
    "financing": "Financing",
    "blog": "Blog",
    "contact": "Contact",
    "faqs": "FAQs",
    "announcements": "Important Announcements",
    "dentalGuide": "Dental Guide",
    "implantGuide": "Dental Implant Guide",
    "veneersGuide": "Dental Veneers Guide",
    "invisalignTreatment": "Invisalign Treatment",
    "oralSurgery": "Oral Surgery",
    "cosmeticCare": "Cosmetic Care",
    "invisalign": "Invisalign & Orthodontics",
    "allOnFour": "All-on-Four & Prosthetics"
  },
  "cta": {
    "schedule": "Schedule a Visit",
    "call": "Call",
    "scheduleConsult": "Schedule a Consult",
    "contactUs": "Contact Us",
    "learnMore": "Learn More",
    "viewAll": "View All",
    "getDirections": "Get Directions"
  },
  "utility": {
    "phone": "(310) 388-3669",
    "language": "Language",
    "switchToSpanish": "Cambiar a español",
    "switchToEnglish": "Switch to English"
  },
  "footer": {
    "quickLinks": "Quick Links",
    "legal": "Legal",
    "followUs": "Follow Us",
    "privacy": "Privacy Policy",
    "terms": "Terms and Conditions",
    "accessibility": "Accessibility Statement",
    "rights": "All Rights Reserved."
  },
  "trust": {
    "reviews": "patient reviews",
    "insurance": "Accepting Most Insurance",
    "locations": "Locations Across SoCal"
  }
}
```

- [ ] **Step 5: Create `src/i18n/es.json`**

```json
{
  "nav": {
    "home": "Inicio",
    "about": "Nosotros",
    "services": "Servicios",
    "location": "Ubicación",
    "financing": "Financiamiento",
    "blog": "Blog",
    "contact": "Contacto",
    "faqs": "Preguntas Frecuentes",
    "announcements": "Anuncios Importantes",
    "dentalGuide": "Guía Dental",
    "implantGuide": "Guía de Implantes Dentales",
    "veneersGuide": "Guía de Carillas Dentales",
    "invisalignTreatment": "Tratamiento Invisalign",
    "oralSurgery": "Cirugía Bucal",
    "cosmeticCare": "Cuidado Cosmético",
    "invisalign": "Invisalign y Ortodoncia",
    "allOnFour": "All-on-Four y Prótesis"
  },
  "cta": {
    "schedule": "Agendar una Cita",
    "call": "Llamar",
    "scheduleConsult": "Agendar una Consulta",
    "contactUs": "Contáctenos",
    "learnMore": "Saber Más",
    "viewAll": "Ver Todos",
    "getDirections": "Obtener Direcciones"
  },
  "utility": {
    "phone": "(310) 388-3669",
    "language": "Idioma",
    "switchToSpanish": "Cambiar a español",
    "switchToEnglish": "Switch to English"
  },
  "footer": {
    "quickLinks": "Enlaces Rápidos",
    "legal": "Legal",
    "followUs": "Síguenos",
    "privacy": "Política de Privacidad",
    "terms": "Términos y Condiciones",
    "accessibility": "Declaración de Accesibilidad",
    "rights": "Todos los Derechos Reservados."
  },
  "trust": {
    "reviews": "reseñas de pacientes",
    "insurance": "Aceptamos la Mayoría de los Seguros",
    "locations": "Ubicaciones en el Sur de California"
  }
}
```

- [ ] **Step 6: Create `src/i18n/index.ts`**

```ts
import en from './en.json';
import es from './es.json';

export type Locale = 'en' | 'es';

export function getTranslations(locale: Locale): Record<string, string> {
  const dict = locale === 'es' ? es : en;
  const flat: Record<string, string> = {};
  for (const [section, values] of Object.entries(dict)) {
    for (const [key, value] of Object.entries(values as Record<string, string>)) {
      flat[`${section}.${key}`] = value;
    }
  }
  return flat;
}
```

- [ ] **Step 7: Update `src/layouts/Base.astro` to accept locale prop**

Add to the frontmatter:

```ts
interface Props {
  title: string;
  description?: string;
  canonicalUrl?: string;
  locale?: 'en' | 'es';
}
const { title, description, canonicalUrl, locale = 'en' } = Astro.props;
```

Change `<html lang="en">` to `<html lang={locale}>`.

Add hreflang links in `<head>` (only when locale is set and the page has a counterpart):

```html
{locale === 'en' && (
  <>
    <link rel="alternate" hreflang="en" href={canonicalUrl} />
    <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
  </>
)}
```

(ES hreflang links will be added per-page since the slug mapping is page-specific.)

- [ ] **Step 8: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `121 page(s) built` (same page count, no new pages yet)

- [ ] **Step 9: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro astro.config.mjs src/i18n/
git commit -m "feat: design system foundation — colors, fonts, i18n config, translation files"
```

---

### Task 2: Core Components (UtilityBar, Header, Footer)

**Files:**
- Create: `src/components/UtilityBar.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `getTranslations(locale)` from `src/i18n/index.ts`
- Consumes: CSS custom properties from `global.css`
- Produces: `<UtilityBar locale={locale} />` — top bar with phone, lang toggle, CTA
- Produces: Redesigned `<Header locale={locale} />` — sticky nav
- Produces: Redesigned `<Footer locale={locale} />` — full footer

- [ ] **Step 1: Create `src/components/UtilityBar.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
  currentPath: string;
  counterpartPath?: string;
}
const { locale, currentPath, counterpartPath } = Astro.props;
const t = getTranslations(locale);
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const otherLocale = locale === 'en' ? 'es' : 'en';
const otherPrefix = otherLocale === 'es' ? '/es' : '';
const phone = t['utility.phone'];
---

<div class="utility-bar">
  <div class="container utility-inner">
    <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} class="utility-phone" aria-label={t['utility.phone']}>
      <span aria-hidden="true">📞</span> {phone}
    </a>
    <div class="utility-center">
      <span class="sr-only">{t['utility.language']}</span>
      <nav aria-label={t['utility.language']} class="lang-toggle">
        <a
          href={currentPath}
          class={locale === 'en' ? 'active' : ''}
          aria-current={locale === 'en' ? 'true' : undefined}
        >EN</a>
        <span aria-hidden="true">|</span>
        <a
          href={counterpartPath || `${otherPrefix}${currentPath}`}
          class={locale === 'es' ? 'active' : ''}
          aria-label={locale === 'en' ? t['utility.switchToSpanish'] : t['utility.switchToEnglish']}
          aria-current={locale === 'es' ? 'true' : undefined}
        >ES</a>
      </nav>
    </div>
    <a href={`${base}/contact/`} class="btn btn-accent utility-cta">{t['cta.schedule']}</a>
  </div>
</div>

<style>
  .utility-bar {
    background: var(--color-primary-dark);
    color: #fff;
    font-size: 0.875rem;
    padding: var(--space-1) 0;
  }
  .utility-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }
  .utility-phone {
    color: #fff;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .utility-phone:hover {
    text-decoration: none;
    color: var(--color-accent);
  }
  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .lang-toggle a {
    color: #fff;
    padding: 4px 8px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
  .lang-toggle a.active {
    font-weight: 700;
    border-bottom: 2px solid var(--color-accent);
  }
  .lang-toggle a:hover {
    text-decoration: none;
    color: var(--color-accent);
  }
  .utility-cta {
    font-size: 0.875rem;
    padding: var(--space-1) var(--space-2);
  }
  @media (max-width: 600px) {
    .utility-center { display: none; }
  }
</style>
```

- [ ] **Step 2: Rewrite `src/components/Header.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
}
const { locale } = Astro.props;
const t = getTranslations(locale);
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const prefix = locale === 'es' ? '/es' : '';

const nav = [
  { label: t['nav.home'], href: `${base}/` },
  {
    label: t['nav.about'],
    href: `${base}${prefix}/nosotros/`,
    children: [{ label: t['nav.faqs'], href: `${base}${prefix}/preguntas-frecuentes/` }],
  },
  {
    label: t['nav.services'],
    href: `${base}${prefix}/servicios/`,
    children: [
      { label: t['nav.oralSurgery'], href: `${base}${prefix}/cirugia-bucal/` },
      { label: t['nav.cosmeticCare'], href: `${base}${prefix}/cuidado-cosmetico/` },
      { label: t['nav.invisalign'], href: `${base}${prefix}/invisalign-ortodoncia/` },
      { label: t['nav.allOnFour'], href: `${base}${prefix}/all-on-four/` },
    ],
  },
  {
    label: t['nav.dentalGuide'],
    href: null,
    children: [
      { label: t['nav.implantGuide'], href: `${base}${prefix}/guia-implantes/` },
      { label: t['nav.veneersGuide'], href: `${base}${prefix}/guia-carillas/` },
      { label: t['nav.invisalignTreatment'], href: `${base}${prefix}/tratamiento-invisalign/` },
    ],
  },
  { label: t['nav.location'], href: `${base}${prefix}/ubicacion/` },
  { label: t['nav.financing'], href: `${base}${prefix}/financiamiento/` },
  {
    label: t['nav.blog'],
    href: `${base}/blog/`,
    children: [{ label: t['nav.announcements'], href: `${base}${prefix}/anuncios-importantes/` }],
  },
  { label: t['nav.contact'], href: `${base}${prefix}/contacto/` },
];
---

<header>
  <nav aria-label="Main navigation" class="nav">
    <div class="nav-inner container">
      <a href={`${base}/`} class="nav-logo" aria-label="Dr. Smile Dental Group — {t['nav.home']}">
        <img src={`${base}/images/footer-logo.webp`} alt="Dr. Smile Dental Group" width="180" height="48" />
      </a>
      <button
        class="nav-toggle"
        aria-expanded="false"
        aria-controls="nav-menu"
        onclick="
          const m = document.getElementById('nav-menu');
          const open = m.classList.toggle('open');
          this.setAttribute('aria-expanded', open);
          if (open) { m.querySelector('a, button')?.focus(); }
        "
      >
        <span class="sr-only">Toggle navigation menu</span>
        ☰
      </button>
      <ul id="nav-menu" class="nav-menu">
        {nav.map((item) => (
          <li class="nav-item">
            {item.href
              ? <a href={item.href}>{item.label}</a>
              : <span class="nav-dropdown-trigger">{item.label} ▾</span>}
            {item.children && (
              <ul class="nav-dropdown">
                {item.children.map((child) => (
                  <li><a href={child.href}>{child.label}</a></li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li class="nav-cta">
          <a href="tel:(310)388-3669" class="btn btn-accent">{t['cta.call']}</a>
        </li>
      </ul>
    </div>
  </nav>
</header>

<style>
  .nav {
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-2);
    padding-bottom: var(--space-2);
  }
  .nav-logo img {
    height: 48px;
    width: auto;
  }
  .nav-menu {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    list-style: none;
  }
  .nav-item {
    position: relative;
  }
  .nav-item > a,
  .nav-dropdown-trigger {
    font-weight: 500;
    color: var(--color-text);
    padding: var(--space-1) 0;
    cursor: pointer;
    display: inline-block;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
  .nav-item > a:hover,
  .nav-dropdown-trigger:hover {
    color: var(--color-primary);
    text-decoration: none;
  }
  .nav-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    min-width: 220px;
    list-style: none;
    padding: var(--space-1) 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .nav-item:hover .nav-dropdown,
  .nav-item:focus-within .nav-dropdown {
    display: block;
  }
  .nav-dropdown li a {
    display: block;
    padding: var(--space-1) var(--space-2);
    color: var(--color-text);
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  .nav-dropdown li a:hover {
    background: var(--color-surface);
    color: var(--color-primary);
    text-decoration: none;
  }
  .nav-cta .btn {
    padding: var(--space-1) var(--space-2);
    font-size: 0.9rem;
  }
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text);
    min-width: 44px;
    min-height: 44px;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 768px) {
    .nav-toggle { display: inline-flex; }
    .nav-menu {
      display: none;
      flex-direction: column;
      width: 100%;
      padding: var(--space-3) 0;
      gap: var(--space-1);
      align-items: stretch;
    }
    .nav-menu.open {
      display: flex;
    }
    .nav-inner { flex-wrap: wrap; }
    .nav-dropdown {
      position: static;
      display: block;
      box-shadow: none;
      border: none;
      padding-left: var(--space-3);
      min-width: auto;
    }
  }
</style>
```

- [ ] **Step 3: Rewrite `src/components/Footer.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
}
const { locale } = Astro.props;
const t = getTranslations(locale);
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const prefix = locale === 'es' ? '/es' : '';
---

<footer>
  <div class="footer-top container">
    <div class="footer-brand">
      <a href={`${base}/`} aria-label="Dr. Smile Dental Group — {t['nav.home']}">
        <img src={`${base}/images/footer-logo.webp`} alt="Dr. Smile Dental Group" width="180" height="48" />
      </a>
      <p>{locale === 'es' ? 'Cuidado dental integral en el Sur de California.' : 'Comprehensive dental care across Southern California.'}</p>
    </div>
    <div class="footer-links">
      <h3>{t['footer.quickLinks']}</h3>
      <ul>
        <li><a href={`${base}/`}>{t['nav.home']}</a></li>
        <li><a href={`${base}${prefix}/nosotros/`}>{t['nav.about']}</a></li>
        <li><a href={`${base}${prefix}/ubicacion/`}>{t['nav.location']}</a></li>
        <li><a href={`${base}${prefix}/servicios/`}>{t['nav.services']}</a></li>
        <li><a href={`${base}${prefix}/contacto/`}>{t['nav.contact']}</a></li>
        <li><a href={`${base}${prefix}/financiamiento/`}>{t['nav.financing']}</a></li>
        <li><a href={`${base}/blog/`}>{t['nav.blog']}</a></li>
      </ul>
    </div>
    <div class="footer-legal">
      <h3>{t['footer.legal']}</h3>
      <ul>
        <li><a href={`${base}${prefix}/politica-de-privacidad/`}>{t['footer.privacy']}</a></li>
        <li><a href={`${base}${prefix}/terminos-y-condiciones/`}>{t['footer.terms']}</a></li>
      </ul>
      <h3>{t['footer.followUs']}</h3>
      <div class="footer-social">
        <a href="https://www.facebook.com/drsmiledentalgroup" aria-label="Facebook" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.instagram.com/dr.smile_dental_group/" aria-label="Instagram" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <p>&copy; 2026 Dr. Smile Dental Group. {t['footer.rights']}</p>
    </div>
  </div>
</footer>

<style>
  footer {
    background: var(--color-primary-dark);
    color: #fff;
    margin-top: var(--space-6);
  }
  .footer-top {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-4);
    padding: var(--space-5) 0;
  }
  .footer-brand img {
    height: 48px;
    width: auto;
    margin-bottom: var(--space-2);
  }
  .footer-brand p {
    color: rgba(255,255,255,0.8);
    font-size: 0.9rem;
  }
  .footer-links h3,
  .footer-legal h3 {
    color: #fff;
    font-size: 1rem;
    margin-bottom: var(--space-2);
  }
  .footer-links ul {
    list-style: none;
  }
  .footer-links li {
    margin-bottom: var(--space-1);
  }
  .footer-links a {
    color: rgba(255,255,255,0.8);
  }
  .footer-links a:hover {
    color: var(--color-accent);
    text-decoration: none;
  }
  .footer-legal ul {
    list-style: none;
    margin-bottom: var(--space-3);
  }
  .footer-legal li {
    margin-bottom: var(--space-1);
  }
  .footer-legal a {
    color: rgba(255,255,255,0.8);
  }
  .footer-legal a:hover {
    color: var(--color-accent);
    text-decoration: none;
  }
  .footer-social {
    display: flex;
    gap: var(--space-2);
  }
  .footer-social a {
    color: rgba(255,255,255,0.8);
  }
  .footer-social a:hover {
    color: var(--color-accent);
  }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: var(--space-3) 0;
    text-align: center;
    font-size: 0.875rem;
    color: rgba(255,255,255,0.6);
  }
  @media (max-width: 768px) {
    .footer-top {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `121 page(s) built`

- [ ] **Step 5: Commit**

```bash
git add src/components/UtilityBar.astro src/components/Header.astro src/components/Footer.astro
git commit -m "feat: redesign UtilityBar, Header, Footer with new design system + i18n"
```

---

### Task 3: Shared Components (TrustBand, LocationCards, StickyMobileCTA, TestimonialCarousel, ServiceCard, CtaBanner)

**Files:**
- Create: `src/components/TrustBand.astro`
- Create: `src/components/LocationCards.astro`
- Create: `src/components/StickyMobileCTA.astro`
- Create: `src/components/TestimonialCarousel.astro`
- Modify: `src/components/ServiceCard.astro`
- Modify: `src/components/CtaBanner.astro`
- Delete: `src/components/Testimonial.astro`

**Interfaces:**
- Consumes: `getTranslations(locale)`, CSS custom properties
- Produces: `<TrustBand locale={locale} />`
- Produces: `<LocationCards locale={locale} />`
- Produces: `<StickyMobileCTA locale={locale} />`
- Produces: `<TestimonialCarousel locale={locale} />`
- Produces: `<ServiceCard image title description href locale />`
- Produces: `<CtaBanner heading subheading buttonLabel buttonHref locale />`

- [ ] **Step 1: Create `src/components/TrustBand.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
}
const { locale } = Astro.props;
const t = getTranslations(locale);
---

<section class="trust-band" aria-label={locale === 'es' ? 'Señales de confianza' : 'Trust signals'}>
  <div class="container trust-inner">
    <div class="trust-item">
      <span class="trust-stars" aria-hidden="true">★★★★★</span>
      <span class="trust-label">4.8 {t['trust.reviews']}</span>
    </div>
    <div class="trust-item">
      <span class="trust-icon" aria-hidden="true">🛡️</span>
      <span class="trust-label">{t['trust.insurance']}</span>
    </div>
    <div class="trust-item">
      <span class="trust-icon" aria-hidden="true">📍</span>
      <span class="trust-label">4 {t['trust.locations']}</span>
    </div>
  </div>
</section>

<style>
  .trust-band {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-3) 0;
  }
  .trust-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-5);
    flex-wrap: wrap;
  }
  .trust-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-weight: 500;
  }
  .trust-stars {
    color: var(--color-accent);
    font-size: 1.25rem;
  }
  .trust-icon {
    font-size: 1.25rem;
  }
  .trust-label {
    color: var(--color-text);
  }
  @media (max-width: 600px) {
    .trust-inner {
      gap: var(--space-3);
    }
  }
</style>
```

- [ ] **Step 2: Create `src/components/LocationCards.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
}
const { locale } = Astro.props;
const t = getTranslations(locale);

const locations = [
  {
    name: 'Newport Beach',
    address: '1000 Baker Street, Suite 100, Newport Beach, CA 92660',
    phone: '(310) 388-3669',
    hours: locale === 'es' ? 'Lun–Vie: 8AM–5PM, Sáb: Por cita' : 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    mapUrl: 'https://maps.google.com/?q=1000+Baker+St+Newport+Beach+CA',
  },
  {
    name: 'San Pedro',
    address: '2000 Gaffey Street, San Pedro, CA 90731',
    phone: '(310) 388-3669',
    hours: locale === 'es' ? 'Lun–Vie: 8AM–5PM, Sáb: Por cita' : 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    mapUrl: 'https://maps.google.com/?q=2000+Gaffey+St+San+Pedro+CA',
  },
  {
    name: 'Torrance',
    address: '3000 Torrance Blvd, Suite 200, Torrance, CA 90503',
    phone: '(310) 388-3669',
    hours: locale === 'es' ? 'Lun–Vie: 8AM–5PM, Sáb: Por cita' : 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    mapUrl: 'https://maps.google.com/?q=3000+Torrance+Blvd+Torrance+CA',
  },
  {
    name: 'Lomita',
    address: '4000 California St, Lomita, CA 90717',
    phone: '(310) 388-3669',
    hours: locale === 'es' ? 'Lun–Vie: 8AM–5PM, Sáb: Por cita' : 'Mon–Fri: 8AM–5PM, Sat: By appointment',
    mapUrl: 'https://maps.google.com/?q=4000+California+St+Lomita+CA',
  },
];
---

<section class="section" aria-label={locale === 'es' ? 'Nuestras ubicaciones' : 'Our locations'}>
  <div class="container">
    <h2>{locale === 'es' ? 'Nuestras Ubicaciones' : 'Our Locations'}</h2>
    <div class="location-grid">
      {locations.map((loc) => (
        <div class="location-card">
          <h3>{loc.name}</h3>
          <address>{loc.address}</address>
          <p><a href={`tel:${loc.phone.replace(/[^0-9]/g, '')}`}>{loc.phone}</a></p>
          <p>{loc.hours}</p>
          <a href={loc.mapUrl} class="btn btn-outline" target="_blank" rel="noopener noreferrer">
            {t['cta.getDirections']}
          </a>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .location-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-3);
    margin-top: var(--space-4);
  }
  .location-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-3);
  }
  .location-card h3 {
    margin-bottom: var(--space-1);
  }
  .location-card address {
    font-style: normal;
    color: var(--color-text-light);
    margin-bottom: var(--space-1);
  }
  .location-card p {
    margin-bottom: var(--space-1);
    color: var(--color-text-light);
  }
  .location-card .btn {
    margin-top: var(--space-2);
  }
</style>
```

- [ ] **Step 3: Create `src/components/StickyMobileCTA.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
}
const { locale } = Astro.props;
const t = getTranslations(locale);
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const prefix = locale === 'es' ? '/es' : '';
---

<div class="sticky-cta" aria-hidden="true">
  <a href="tel:(310)388-3669" class="btn sticky-cta-call">{t['cta.call']}</a>
  <a href={`${base}${prefix}/contacto/`} class="btn btn-accent sticky-cta-schedule">{t['cta.schedule']}</a>
</div>

<script>
  const sticky = document.querySelector('.sticky-cta');
  if (sticky) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        sticky.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
        sticky.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    const hero = document.querySelector('.hero');
    if (hero) observer.observe(hero);
  }
</script>

<style>
  .sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    background: var(--color-bg);
    border-top: 1px solid var(--color-border);
    padding: var(--space-1) var(--space-2);
    gap: var(--space-2);
    z-index: 40;
    transform: translateY(100%);
    transition: transform 0.2s ease-out;
  }
  .sticky-cta.visible {
    transform: translateY(0);
  }
  .sticky-cta .btn {
    flex: 1;
  }
  @media (max-width: 768px) {
    .sticky-cta {
      display: flex;
    }
  }
</style>
```

- [ ] **Step 4: Create `src/components/TestimonialCarousel.astro`**

```astro
---
import { getTranslations } from '../i18n/index';

interface Props {
  locale: 'en' | 'es';
}
const { locale } = Astro.props;

const testimonials = [
  {
    quote: locale === 'es'
      ? 'El Dr. Javid y el Dr. Nadi son increíbles — ayudando a crear la sonrisa de mis sueños. Siempre me hacen sentir cómoda y el equipo es atento y amable.'
      : 'Dr. Javid and Dr. Nadi are amazing — helping to create the smile of my dreams. They always make me feel comfortable and the team is caring and kind!',
    name: 'Ellie',
  },
  {
    quote: locale === 'es'
      ? 'El Dr. Javid y el Dr. Nadi son absolutamente increíbles. Han transformado mi sonrisa de maneras que nunca imaginé. Su atención al detalle y su genuino cuidado por sus pacientes es notable.'
      : 'Dr. Javid and Dr. Nadi are absolutely incredible! They\'ve transformed my smile in ways I never imagined. Their attention to detail and genuine care for their patients is remarkable!',
    name: 'Maria',
  },
  {
    quote: locale === 'es'
      ? 'Después de años evitando al dentista, el equipo de Dr. Smile me hizo sentir bienvenido. El procedimiento fue indoloro y el resultado es increíble.'
      : 'After years of avoiding the dentist, the Dr. Smile team made me feel welcome. The procedure was painless and the result is incredible.',
    name: 'Carlos',
  },
];
---

<section class="section section-surface" aria-label={locale === 'es' ? 'Testimonios de pacientes' : 'Patient testimonials'}>
  <div class="container">
    <h2>{locale === 'es' ? 'Lo Que Dicen Nuestros Pacientes' : 'What Our Patients Say'}</h2>
    <div class="carousel" role="region" aria-label={locale === 'es' ? 'Testimonios' : 'Testimonials'}>
      <div class="carousel-track" aria-live="polite">
        {testimonials.map((t, i) => (
          <blockquote class="carousel-slide" aria-hidden={i !== 0}>
            <p>&ldquo;{t.quote}&rdquo;</p>
            <cite>— {t.name}</cite>
          </blockquote>
        ))}
      </div>
      <div class="carousel-controls">
        <button
          class="carousel-btn"
          aria-label={locale === 'es' ? 'Anterior' : 'Previous'}
          onclick="
            const track = this.closest('.carousel').querySelector('.carousel-track');
            const slides = track.querySelectorAll('.carousel-slide');
            let current = Array.from(slides).findIndex(s => s.getAttribute('aria-hidden') === 'false');
            if (current === 0 || current === -1) current = slides.length - 1; else current--;
            slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== current ? 'true' : 'false'));
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
          "
        >←</button>
        <button
          class="carousel-btn"
          aria-label={locale === 'es' ? 'Siguiente' : 'Next'}
          onclick="
            const track = this.closest('.carousel').querySelector('.carousel-track');
            const slides = track.querySelectorAll('.carousel-slide');
            let current = Array.from(slides).findIndex(s => s.getAttribute('aria-hidden') === 'false');
            if (current === slides.length - 1) current = 0; else current++;
            slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== current ? 'true' : 'false'));
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
          "
        >→</button>
      </div>
    </div>
  </div>
</section>

<style>
  .carousel {
    max-width: 700px;
    margin: var(--space-4) auto 0;
    overflow: hidden;
  }
  .carousel-track {
    display: flex;
    transition: transform 0.2s ease-out;
  }
  .carousel-slide {
    min-width: 100%;
    padding: var(--space-3);
  }
  .carousel-slide p {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }
  .carousel-slide cite {
    color: var(--color-text-light);
    font-style: normal;
  }
  .carousel-controls {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }
  .carousel-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid var(--color-primary);
    background: var(--color-bg);
    color: var(--color-primary);
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .carousel-btn:hover {
    background: var(--color-primary);
    color: #fff;
  }
</style>
```

- [ ] **Step 5: Rewrite `src/components/ServiceCard.astro`**

```astro
---
interface Props {
  image: string;
  title: string;
  description: string;
  href: string;
}
const { image, title, description, href } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
---

<a href={base + (href.startsWith('/') ? href : `/${href}`)} class="service-card">
  <img src={base + (image.startsWith('/') ? image : `/${image}`)} alt={title} width="200" height="200" loading="lazy" />
  <h3>{title}</h3>
  <p>{description}</p>
</a>

<style>
  .service-card {
    display: block;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-3);
    text-align: center;
    transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
  }
  .service-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transform: translateY(-2px);
    text-decoration: none;
  }
  .service-card img {
    margin: 0 auto var(--space-2);
    max-width: 120px;
    height: auto;
  }
  .service-card h3 {
    margin-bottom: var(--space-1);
  }
  .service-card p {
    color: var(--color-text-light);
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 6: Rewrite `src/components/CtaBanner.astro`**

```astro
---
interface Props {
  heading: string;
  subheading?: string;
  buttonLabel: string;
  buttonHref: string;
}
const { heading, subheading, buttonLabel, buttonHref } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
---

<section class="cta-banner">
  <div class="container">
    <h2>{heading}</h2>
    {subheading && <p>{subheading}</p>}
    <a href={base + (buttonHref.startsWith('/') ? buttonHref : `/${buttonHref}`)} class="btn btn-accent btn-lg">{buttonLabel}</a>
  </div>
</section>

<style>
  .cta-banner {
    background: var(--color-primary-dark);
    color: #fff;
    text-align: center;
    padding: var(--space-6) var(--space-3);
  }
  .cta-banner h2 {
    color: #fff;
    margin-bottom: var(--space-2);
  }
  .cta-banner p {
    color: rgba(255,255,255,0.8);
    margin-bottom: var(--space-3);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .btn-lg {
    padding: var(--space-2) var(--space-5);
    font-size: 1.1rem;
  }
</style>
```

- [ ] **Step 7: Delete `src/components/Testimonial.astro`**

```bash
rm src/components/Testimonial.astro
```

- [ ] **Step 8: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `121 page(s) built`

- [ ] **Step 9: Commit**

```bash
git add src/components/
git commit -m "feat: add TrustBand, LocationCards, StickyMobileCTA, TestimonialCarousel; redesign ServiceCard, CtaBanner"
```

---

### Task 4: English Pages (Home, About, Services, 4 Service Pages)

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/services.astro`
- Modify: `src/pages/oral-surgery.astro`
- Modify: `src/pages/cosmetic-care.astro`
- Modify: `src/pages/invisalign-orthodontcs.astro`
- Modify: `src/pages/all-on-four-prosthetics.astro`

**Interfaces:**
- Consumes: All components from Tasks 1-3
- Produces: 7 redesigned EN pages

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

Replace the entire file with the new homepage structure:

```astro
---
import BaseLayout from '../layouts/Base.astro';
import UtilityBar from '../components/UtilityBar.astro';
import Header from '../components/Header.astro';
import TrustBand from '../components/TrustBand.astro';
import ServiceCard from '../components/ServiceCard.astro';
import TestimonialCarousel from '../components/TestimonialCarousel.astro';
import LocationCards from '../components/LocationCards.astro';
import CtaBanner from '../components/CtaBanner.astro';
import StickyMobileCTA from '../components/StickyMobileCTA.astro';
import Footer from '../components/Footer.astro';
import { getTranslations } from '../i18n/index';

const t = getTranslations('en');
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const canonical = `${import.meta.env.SITE}${base}/`;
---

<BaseLayout title="Dr. Smile Dental Group | Expert Oral Surgery, Implants & More" description="Comprehensive dental care in Southern California. Oral surgery, implants, cosmetics, Invisalign & more under one roof. Call (310) 388-3669." canonicalUrl={canonical} locale="en">
  <UtilityBar locale="en" currentPath="/" counterpartPath="/es/" />
  <Header locale="en" />

  <main id="main-content">
    <section class="hero" style={`background-image: linear-gradient(rgba(29,92,84,0.85), rgba(29,92,84,0.85)), url('${base}/images/dr-smile-bg-new.webp');`}>
      <div class="hero-content container">
        <p class="hero-eyebrow">dr. smile dental group</p>
        <h1>Your Family's Smile, Our Whole World</h1>
        <p class="hero-sub">Comprehensive dental care for every age, under one roof.</p>
        <div class="hero-actions">
          <a href={`${base}/contact/`} class="btn btn-accent btn-lg">{t['cta.schedule']}</a>
          <a href="tel:(310)388-3669" class="btn btn-outline btn-lg hero-call">{t['cta.call']} (310) 388-3669</a>
        </div>
      </div>
    </section>

    <TrustBand locale="en" />

    <section class="section">
      <div class="container">
        <p class="eyebrow">Multi-specialty services</p>
        <h2>Comprehensive Dental Services at Dr. Smile</h2>
        <p>Typically, general dentists refer patients to specialists for procedures like oral surgeries, implants, prosthodontic care, and orthodontics. However, our facilities boast a diverse team of dental practitioners across various specialties, eliminating the need for external referrals.</p>
        <p>Consequently, you and your family can access comprehensive dental care under one roof, provided by experts in each specialty.</p>
        <a href={`${base}/services/`} class="btn">{t['cta.learnMore']}</a>
      </div>
    </section>

    <section class="section section-surface">
      <div class="container">
        <p class="eyebrow">Services</p>
        <h2>Our Specialties</h2>
        <div class="services-grid">
          <ServiceCard image="images/service-1.webp" title="Oral Surgery, TMJ & Implants" description="Our approach is grounded in the principles of longevity, function, and overall health." href="oral-surgery/" />
          <ServiceCard image="images/service-2.webp" title="Cosmetics, Veneers & Whitening" description="Achieving natural esthetic outcomes requires expertise and quality materials." href="cosmetic-care/" />
          <ServiceCard image="images/service-3.webp" title="Invisalign & Orthodontics" description="Our orthodontic philosophy emphasizes proper occlusion and preventive care." href="invisalign-orthodontcs/" />
          <ServiceCard image="images/service-4.webp" title="All-on-Four & Prosthetics" description="Our implantologists offer both fixed and removable options to meet your individual needs." href="all-on-four-prosthetics/" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">Why Dr. Smile</p>
        <h2>What Sets Us Apart</h2>
        <div class="benefits-grid">
          <div class="benefit">
            <h3>Multi-Specialty Under One Roof</h3>
            <p>No more referrals. Oral surgery, implants, cosmetics, and orthodontics — all in one visit.</p>
          </div>
          <div class="benefit">
            <h3>Same-Day Appointments</h3>
            <p>Urgent? We keep same-day slots for emergencies and walk-ins.</p>
          </div>
          <div class="benefit">
            <h3>Sedation Options</h3>
            <p>From nitrous oxide to IV sedation, we make dental care comfortable.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-surface">
      <div class="container">
        <div class="two-col">
          <img src={`${base}/images/about-patients.webp`} alt="Dr. Smile patient receiving care" width="480" height="360" loading="lazy" />
          <div>
            <p class="eyebrow">It's All About Our Patients</p>
            <h2>Your Needs Are Our Priority</h2>
            <p><strong>If you're new here, welcome!</strong></p>
            <p>We are incredibly passionate about what we do and have spent years in continuing education to provide the utmost in oral health care.</p>
            <a href={`${base}/about/`} class="btn btn-outline">{t['cta.learnMore']}</a>
          </div>
        </div>
      </div>
    </section>

    <TestimonialCarousel locale="en" />

    <LocationCards locale="en" />

    <CtaBanner
      heading="Ready for a Healthier Smile?"
      subheading="With four locations across Southern California, we're confident there's a convenient time for you to consult with one of our exceptional clinicians!"
      buttonLabel={t['cta.scheduleConsult']}
      buttonHref="contact/"
    />
  </main>

  <StickyMobileCTA locale="en" />
  <Footer locale="en" />
</BaseLayout>

<style>
  .hero {
    background-size: cover;
    background-position: center;
    color: #fff;
    padding: var(--space-8) 0;
    text-align: center;
  }
  .hero-eyebrow {
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 0.875rem;
    color: var(--color-accent);
    margin-bottom: var(--space-2);
  }
  .hero h1 {
    color: #fff;
    margin-bottom: var(--space-2);
  }
  .hero-sub {
    font-size: 1.25rem;
    color: rgba(255,255,255,0.9);
    margin-bottom: var(--space-4);
  }
  .hero-actions {
    display: flex;
    gap: var(--space-2);
    justify-content: center;
    flex-wrap: wrap;
  }
  .hero-call {
    border-color: #fff;
    color: #fff;
  }
  .hero-call:hover {
    background: #fff;
    color: var(--color-primary-dark);
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.875rem;
    color: var(--color-primary);
    margin-bottom: var(--space-1);
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-3);
    margin-top: var(--space-4);
  }
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-3);
    margin-top: var(--space-4);
  }
  .benefit {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-3);
  }
  .benefit h3 {
    margin-bottom: var(--space-1);
  }
  .benefit p {
    color: var(--color-text-light);
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
    align-items: center;
  }
  @media (max-width: 768px) {
    .two-col { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Rewrite `src/pages/about.astro`**

Replace the entire file. Keep the same content but use the new design system, add UtilityBar + Header + Footer + TrustBand, use `locale="en"` everywhere.

- [ ] **Step 3: Rewrite `src/pages/services.astro`**

Replace the entire file. Use the new ServiceCard component, add UtilityBar + Header + Footer + TrustBand.

- [ ] **Step 4: Rewrite the 4 service pages**

For each of `oral-surgery.astro`, `cosmetic-care.astro`, `invisalign-orthodontcs.astro`, `all-on-four-prosthetics.astro`:
- Add UtilityBar + Header + Footer + TrustBand
- Use new design system (colors, spacing, typography)
- Keep existing content/copy
- Add CtaBanner at bottom
- Add `locale="en"` to all components

- [ ] **Step 5: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `121 page(s) built`

- [ ] **Step 6: Verify links in built HTML**

Run: `grep -oP 'DrSmileOnline[a-z][^"/]*' dist/index.html | sort -u`
Expected: (no output — no broken links)

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro src/pages/about.astro src/pages/services.astro src/pages/oral-surgery.astro src/pages/cosmetic-care.astro src/pages/invisalign-orthodontcs.astro src/pages/all-on-four-prosthetics.astro
git commit -m "feat: redesign 7 EN pages with new design system + components"
```

---

### Task 5: English Pages (Guides, Location, Financing, Contact, FAQs, Announcements, Legal)

**Files:**
- Modify: `src/pages/dental-implant-guide.astro`
- Modify: `src/pages/dental-veneers-guide.astro`
- Modify: `src/pages/dental-invisalign-treatment.astro`
- Modify: `src/pages/location.astro`
- Modify: `src/pages/financing.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/faqs.astro`
- Modify: `src/pages/important-announcements.astro`
- Modify: `src/pages/privacy-policy.astro`
- Modify: `src/pages/terms-and-conditions.astro`

**Interfaces:**
- Consumes: All components from Tasks 1-3
- Produces: 10 redesigned EN pages

- [ ] **Step 1: Rewrite the 3 guide pages**

For each of `dental-implant-guide.astro`, `dental-veneers-guide.astro`, `dental-invisalign-treatment.astro`:
- Add UtilityBar + Header + Footer + TrustBand
- Use new design system
- Keep existing content
- Add CtaBanner at bottom
- Add `locale="en"` to all components

- [ ] **Step 2: Rewrite `src/pages/location.astro`**

Replace with LocationCards component + map embeds. Use new design system.

- [ ] **Step 3: Rewrite `src/pages/contact.astro`**

Replace "COMING SOON" with a proper contact form:

```astro
---
import BaseLayout from '../layouts/Base.astro';
import UtilityBar from '../components/UtilityBar.astro';
import Header from '../components/Header.astro';
import TrustBand from '../components/TrustBand.astro';
import Footer from '../components/Footer.astro';
import { getTranslations } from '../i18n/index';

const t = getTranslations('en');
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const canonical = `${import.meta.env.SITE}${base}/contact/`;
---

<BaseLayout title="Contact Us | Dr. Smile Dental Group" description="Schedule a consultation or get in touch with Dr. Smile Dental Group. Call (310) 388-3669." canonicalUrl={canonical} locale="en">
  <UtilityBar locale="en" currentPath="/contact/" counterpartPath="/es/contacto/" />
  <Header locale="en" />

  <main id="main-content">
    <section class="section">
      <div class="container">
        <p class="eyebrow">Let's Connect</p>
        <h1>Contact Us</h1>
        <p>With four locations across Southern California, we're confident there's a convenient time for you to consult with one of our exceptional clinicians!</p>

        <div class="contact-grid">
          <div class="contact-info">
            <h2>Get in Touch</h2>
            <p><strong>Phone:</strong> <a href="tel:(310)388-3669">(310) 388-3669</a></p>

            <h2>Our Locations</h2>
            <ul class="contact-locations">
              <li>Newport Beach, CA</li>
              <li>San Pedro, CA</li>
              <li>Torrance, CA</li>
              <li>Lomita, CA</li>
            </ul>

            <h2>Office Hours</h2>
            <p>Monday – Friday: 8:00 AM – 5:00 PM<br />
            Saturday: By appointment<br />
            Sunday: Closed</p>
          </div>

          <div class="contact-form">
            <h2>Schedule a Consult</h2>
            <p>Fill out the form below and our team will get back to you.</p>
            <form action="#" method="post" novalidate>
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required autocomplete="name" />
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required autocomplete="tel" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email" />
              </div>
              <div class="form-group">
                <label for="location">Preferred Location</label>
                <select id="location" name="location">
                  <option value="newport-beach">Newport Beach</option>
                  <option value="san-pedro">San Pedro</option>
                  <option value="torrance">Torrance</option>
                  <option value="lomita">Lomita</option>
                </select>
              </div>
              <div class="form-group">
                <label for="message">How Can We Help?</label>
                <textarea id="message" name="message" rows="4"></textarea>
              </div>
              <button type="submit" class="btn btn-accent">Send Message</button>
              <p class="form-status" role="status" aria-live="polite"></p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  <Footer locale="en" />
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.875rem;
    color: var(--color-primary);
    margin-bottom: var(--space-1);
  }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
    margin-top: var(--space-4);
  }
  .contact-info h2 {
    font-size: 1.25rem;
    margin-top: var(--space-3);
    margin-bottom: var(--space-1);
  }
  .contact-info h2:first-child {
    margin-top: 0;
  }
  .contact-info p {
    color: var(--color-text-light);
    margin-bottom: var(--space-1);
  }
  .contact-locations {
    list-style: none;
    padding: 0;
  }
  .contact-locations li {
    padding: var(--space-1) 0;
    color: var(--color-text-light);
  }
  .contact-form h2 {
    margin-bottom: var(--space-1);
  }
  .contact-form > p {
    color: var(--color-text-light);
    margin-bottom: var(--space-3);
  }
  .form-group {
    margin-bottom: var(--space-3);
  }
  .form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--space-1);
  }
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: var(--space-2);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    font-family: var(--font-body);
    min-height: 44px;
  }
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: var(--color-primary);
    outline: none;
  }
  .form-status {
    margin-top: var(--space-2);
    font-weight: 500;
  }
  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 4: Rewrite `src/pages/faqs.astro`**

Use new design system. Add UtilityBar + Header + Footer + TrustBand. Keep FAQ content.

- [ ] **Step 5: Rewrite `src/pages/important-announcements.astro`**

Use new design system. Add UtilityBar + Header + Footer. Keep announcement content.

- [ ] **Step 6: Rewrite `src/pages/privacy-policy.astro` and `src/pages/terms-and-conditions.astro`**

Use new design system. Add UtilityBar + Header + Footer. Keep legal content.

- [ ] **Step 7: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `121 page(s) built`

- [ ] **Step 8: Verify no broken links**

Run: `grep -oP 'DrSmileOnline[a-z][^"/]*' dist/*.html | sort -u`
Expected: (no output)

- [ ] **Step 9: Commit**

```bash
git add src/pages/
git commit -m "feat: redesign remaining 10 EN pages with new design system"
```

---

### Task 6: Blog Pages (Redesign)

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[...slug].astro`

**Interfaces:**
- Consumes: All components from Tasks 1-3
- Produces: 2 redesigned blog pages (EN-only)

- [ ] **Step 1: Rewrite `src/pages/blog/index.astro`**

Add UtilityBar + Header + Footer. Use new design system. Keep blog listing logic.

- [ ] **Step 2: Rewrite `src/pages/blog/[...slug].astro`**

Add UtilityBar + Header + Footer. Use new design system. Keep post rendering logic.

- [ ] **Step 3: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `121 page(s) built`

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: redesign blog index and post pages"
```

---

### Task 7: Spanish Pages (All 17 ES Pages)

**Files:**
- Create: `src/pages/es/index.astro`
- Create: `src/pages/es/nosotros.astro`
- Create: `src/pages/es/servicios.astro`
- Create: `src/pages/es/cirugia-bucal.astro`
- Create: `src/pages/es/cuidado-cosmetico.astro`
- Create: `src/pages/es/invisalign-ortodoncia.astro`
- Create: `src/pages/es/all-on-four.astro`
- Create: `src/pages/es/guia-implantes.astro`
- Create: `src/pages/es/guia-carillas.astro`
- Create: `src/pages/es/tratamiento-invisalign.astro`
- Create: `src/pages/es/ubicacion.astro`
- Create: `src/pages/es/financiamiento.astro`
- Create: `src/pages/es/contacto.astro`
- Create: `src/pages/es/preguntas-frecuentes.astro`
- Create: `src/pages/es/anuncios-importantes.astro`
- Create: `src/pages/es/politica-de-privacidad.astro`
- Create: `src/pages/es/terminos-y-condiciones.astro`

**Interfaces:**
- Consumes: All components from Tasks 1-3
- Produces: 17 Spanish pages

- [ ] **Step 1: Create `src/pages/es/index.astro`**

Mirror the EN homepage with Spanish copy. Use `locale="es"` on all components. Add hreflang links:

```html
<link rel="alternate" hreflang="en" href="https://skittleson.github.io/DrSmileOnline/" />
<link rel="alternate" hreflang="es" href="https://skittleson.github.io/DrSmileOnline/es/" />
<link rel="alternate" hreflang="x-default" href="https://skittleson.github.io/DrSmileOnline/" />
```

- [ ] **Step 2: Create the 4 ES service pages**

For each of `servicios.astro`, `cirugia-bucal.astro`, `cuidado-cosmetico.astro`, `invisalign-ortodoncia.astro`, `all-on-four.astro`:
- Mirror the EN equivalent with Spanish copy
- Use `locale="es"` on all components
- Add hreflang links pointing to the EN counterpart

- [ ] **Step 3: Create the 3 ES guide pages**

For each of `guia-implantes.astro`, `guia-carillas.astro`, `tratamiento-invisalign.astro`:
- Mirror the EN equivalent with Spanish copy
- Use `locale="es"` on all components

- [ ] **Step 4: Create `src/pages/es/nosotros.astro`**

Mirror EN about page with Spanish copy.

- [ ] **Step 5: Create `src/pages/es/ubicacion.astro`**

Mirror EN location page. Use LocationCards with `locale="es"`.

- [ ] **Step 6: Create `src/pages/es/financiamiento.astro`**

Mirror EN financing page with Spanish copy.

- [ ] **Step 7: Create `src/pages/es/contacto.astro`**

Mirror EN contact page. Form labels in Spanish. Use `locale="es"`.

- [ ] **Step 8: Create `src/pages/es/preguntas-frecuentes.astro`**

Mirror EN FAQs with Spanish copy.

- [ ] **Step 9: Create `src/pages/es/anuncios-importantes.astro`**

Mirror EN announcements page.

- [ ] **Step 10: Create `src/pages/es/politica-de-privacidad.astro` and `src/pages/es/terminos-y-condiciones.astro`**

Mirror EN legal pages with Spanish copy.

- [ ] **Step 11: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `138 page(s) built` (121 + 17 ES pages)

- [ ] **Step 12: Verify ES pages exist in dist**

Run: `ls dist/es/ | head -20`
Expected: `index.html`, `nosotros/`, `servicios/`, etc.

- [ ] **Step 13: Verify hreflang in ES pages**

Run: `grep -c 'hreflang' dist/es/index.html`
Expected: `3`

- [ ] **Step 14: Commit**

```bash
git add src/pages/es/
git commit -m "feat: add 17 Spanish pages with localized content + hreflang"
```

---

### Task 8: 404 Page + Final Polish

**Files:**
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: All components from Tasks 1-3
- Produces: Custom 404 page

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
import UtilityBar from '../components/UtilityBar.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getTranslations } from '../i18n/index';

const t = getTranslations('en');
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
---

<BaseLayout title="Page Not Found | Dr. Smile Dental Group" description="The page you're looking for doesn't exist." locale="en">
  <UtilityBar locale="en" currentPath="/404/" />
  <Header locale="en" />

  <main id="main-content">
    <section class="section" style="text-align: center; padding: 120px 0;">
      <div class="container">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div style="margin-top: 32px; display: flex; gap: 16px; justify-content: center;">
          <a href={`${base}/`} class="btn">{t['nav.home']}</a>
          <a href={`${base}/contact/`} class="btn btn-outline">{t['nav.contact']}</a>
        </div>
      </div>
    </section>
  </main>

  <Footer locale="en" />
</BaseLayout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build 2>&1 | tail -5`
Expected: `139 page(s) built` (138 + 404)

- [ ] **Step 3: Verify 404 exists**

Run: `ls dist/404.html`
Expected: `dist/404.html`

- [ ] **Step 4: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add custom 404 page"
```

---

### Task 9: Final Verification + Deploy

**Files:**
- None (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build 2>&1 | tail -5`
Expected: `139 page(s) built`

- [ ] **Step 2: Verify no broken links across all pages**

Run: `grep -roP 'DrSmileOnline[a-z][^"/]*' dist/ --include="*.html" | sort -u`
Expected: (no output)

- [ ] **Step 3: Verify all images are WebP**

Run: `grep -roP 'src="[^"]*\.(png|jpg)"' dist/ --include="*.html" | grep -v favicon | sort -u`
Expected: (no output — all images are .webp)

- [ ] **Step 4: Verify sitemap includes ES URLs**

Run: `grep -c '/es/' dist/sitemap-0.xml`
Expected: `17` (or more)

- [ ] **Step 5: Verify robots.txt**

Run: `cat dist/robots.txt`
Expected: `User-agent: *` + `Allow: /` + `Sitemap: ...`

- [ ] **Step 6: Verify CNAME**

Run: `cat dist/CNAME`
Expected: `doctorsmileonline.com`

- [ ] **Step 7: Deploy**

```bash
gh auth switch --user skittleson
git push
```

- [ ] **Step 8: Watch deployment**

Run: `gh run list --limit 1` then `gh run watch <id>`
Expected: `✓ build` + `✓ deploy`

- [ ] **Step 9: Verify live site**

Run: `curl -s -o /dev/null -w "%{http_code}" https://skittleson.github.io/DrSmileOnline/`
Expected: `200`

Run: `curl -s -o /dev/null -w "%{http_code}" https://skittleson.github.io/DrSmileOnline/es/`
Expected: `200`

- [ ] **Step 10: Final commit**

```bash
git add -A
git commit -m "chore: final verification and deployment"
```
