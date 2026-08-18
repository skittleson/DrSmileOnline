# Dr. Smile Dental Group — Website Redesign

## Summary

Full redesign of the Dr. Smile Dental Group static site (Astro 5) with a warm/family
visual design, bilingual EN/ES support for all 19 main pages, and WCAG 2.1 AA
accessibility. 104 blog posts remain English-only. Deployed to GitHub Pages at
`/DrSmileOnline/` with custom domain `doctorsmileonline.com`.

## Design System

### Color Palette

| Role | Hex | Use |
|------|-----|-----|
| Primary (soft teal) | `#2A9D8F` | Headings, primary buttons, nav |
| Deep (navy-teal) | `#1D5C54` | Footer, dark sections, emphasis |
| Accent (warm amber) | `#E9A03B` | CTA buttons, highlights, stars (fills only, not body text on white) |
| Surface (cream) | `#FDF8F0` | Section backgrounds, cards |
| Text | `#2C3E50` | Body copy (8.3:1 on white) |
| Text light | `#5D6D7E` | Secondary text (5.5:1 on white) |
| White | `#FFFFFF` | Base background |

All body-text pairings pass WCAG 2.1 AA (≥4.5:1). Accent `#E9A03B` fails as text on
white (2.8:1) — use only for button fills, large decorative elements, and icons.

### Typography

- **Body:** Inter (variable 400/500/600/700), loaded from Google Fonts, `display: swap`
- **Display/headings:** Nunito (600/700/800), rounded warm family feel
- **Scale:** H1 `clamp(2rem, 4vw, 3rem)`, H2 `1.75rem`, H3 `1.25rem`, body `1.0625rem` (17px)
- **Line-height:** 1.6 body, 1.3 headings
- All sizes in `rem` (WCAG 1.4.4)

### Spacing & Layout

- 8px base unit: 8, 16, 24, 32, 48, 64, 80, 96px
- Max width: 1200px, container padding 20px
- Border radius: 12px (cards), 8px (buttons), 50% (avatars)

### Motion

- All transitions ≤ 200ms, ease-out
- `@media (prefers-reduced-motion: reduce)` — disable all animations/transitions
- No parallax, no auto-playing carousels

## Components

### New Components

1. **UtilityBar** — persistent top bar: phone (left), language toggle EN|ES (center),
   "Schedule a Visit" button (right). All pages, all viewports.

2. **Header** — logo left, nav center, sticky on scroll. Mobile: hamburger →
   full-screen overlay, accordion submenus. "Call" and "Schedule" always visible.

3. **TrustBand** — star rating + review count + "Accepting Most Insurance" +
   location count. Below hero on home, below fold on other pages.

4. **LocationCards** — 4 cards (Newport Beach, San Pedro, Torrance, Lomita) with
   address, phone, hours, "Get Directions" link.

5. **StickyMobileCTA** — bottom bar on mobile: "Call" + "Schedule". Appears after
   scrolling past hero. `aria-hidden` when not in view.

6. **TestimonialCarousel** — 3-4 patient quotes, manual next/prev (no autoplay),
   `aria-live="polite"`, pause on hover/focus.

### Homepage Section Order

1. Utility bar
2. Hero — full-bleed photo, H1 (outcome), sub-line, single CTA + "Call" secondary
3. Trust band
4. Services grid — 4 cards with icons
5. Why Dr. Smile — 3 benefit blocks
6. Meet the team — headshots + names + specialties
7. Testimonials — carousel
8. Locations — 4 cards
9. Final CTA band
10. Footer — hours, addresses, phone, privacy, accessibility statement, social

### Other Pages

Restyle with new design system. Add TrustBand + LocationCards where relevant
(services, contact, financing). Blog: EN-only, restyled.

### Contact Page

Proper form (name, phone, email, location select, message) + phone/address/hours
sidebar. Replaces "COMING SOON" placeholder.

## i18n Architecture

### URL Structure

- English: `/` (root) — `/services/`, `/about/`, `/contact/`
- Spanish: `/es/` — `/es/servicios/`, `/es/nosotros/`, `/es/contacto/`
- Blog: EN-only at `/blog/`, `/blog/[slug]/`

### Astro i18n Config

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  routing: {
    prefixDefaultLocale: false,
    redirectToDefaultLocale: false
  }
}
```

### Translation Files

- `src/i18n/en.json` — UI strings (nav, buttons, labels, section headings)
- `src/i18n/es.json` — Spanish equivalents
- Page-specific copy inline in each `.astro` file (duplicated EN/ES versions)

### Page Routing

- `src/pages/index.astro` → EN home
- `src/pages/es/index.astro` → ES home
- `src/pages/services.astro` → EN services
- `src/pages/es/servicios.astro` → ES services

### Language Toggle

- In UtilityBar: `EN | ES` buttons
- Links to equivalent page in other language (not just home)
- `aria-label="Cambiar a español"` / `"Switch to English"`
- Current language shown with checkmark or bold

### hreflang

```html
<link rel="alternate" hreflang="en" href="https://skittleson.github.io/DrSmileOnline/services/" />
<link rel="alternate" hreflang="es" href="https://skittleson.github.io/DrSmileOnline/es/servicios/" />
<link rel="alternate" hreflang="x-default" href="https://skittleson.github.io/DrSmileOnline/services/" />
```

### html lang

`en` on EN pages, `es` on ES pages. Inline mixed-language: `<span lang="es">...</span>`.

### Spanish Page Slugs

| English | Spanish |
|---------|---------|
| `/` | `/es/` |
| `/about/` | `/es/nosotros/` |
| `/services/` | `/es/servicios/` |
| `/oral-surgery/` | `/es/cirugia-bucal/` |
| `/cosmetic-care/` | `/es/cuidado-cosmetico/` |
| `/invisalign-orthodontcs/` | `/es/invisalign-ortodoncia/` |
| `/all-on-four-prosthetics/` | `/es/all-on-four/` |
| `/dental-implant-guide/` | `/es/guia-implantes/` |
| `/dental-veneers-guide/` | `/es/guia-carillas/` |
| `/dental-invisalign-treatment/` | `/es/tratamiento-invisalign/` |
| `/location/` | `/es/ubicacion/` |
| `/financing/` | `/es/financiamiento/` |
| `/contact/` | `/es/contacto/` |
| `/faqs/` | `/es/preguntas-frecuentes/` |
| `/important-announcements/` | `/es/anuncios-importantes/` |
| `/privacy-policy/` | `/es/politica-de-privacidad/` |
| `/terms-and-conditions/` | `/es/terminos-y-condiciones/` |

## Accessibility (WCAG 2.1 AA)

### Structural

- Skip-to-content link (first focusable element, visible on focus)
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- One `<h1>` per page, logical heading hierarchy
- All interactive elements keyboard-operable (Tab, Enter, Space, Escape)
- Visible focus indicator: 3px solid `#2A9D8F` outline, 2px offset
- Focus trap in mobile menu overlay, returns focus to hamburger on close

### Perceivable

- All meaningful images: descriptive `alt` text
- Decorative images: `alt=""`
- Color never the only indicator
- Text contrast ≥ 4.5:1 (verified all pairings)
- Body text ≥ 17px, line-height ≥ 1.6
- Reflow at 320px width, no 2D scrolling
- Non-text contrast ≥ 3:1 (borders, icons, focus rings)

### Operable

- All functionality keyboard-accessible
- Carousel: manual next/prev only, no autoplay, `aria-live="polite"`, pause on hover/focus
- Tap targets ≥ 44×44px
- `prefers-reduced-motion: reduce` — disable all animations
- Focus not obscured by sticky header or mobile CTA bar
- No drag-only interactions

### Understandable

- `<html lang>` set on every page
- Inline mixed-language text marked with `lang` attribute
- Form labels: `<label for>` on every input
- Form errors: text + `aria-describedby`, not color-only
- Consistent nav and component identification
- Reading level: ~8th grade, jargon defined on first use

### Robust

- Custom components expose proper ARIA (`role`, `aria-expanded`, `aria-controls`, `aria-live`)
- Status messages via `role="status"` / `aria-live="polite"`
- No `display: none` on focusable elements

### Testing

- Lighthouse a11y ≥ 95
- axe DevTools: zero critical/serious violations
- Keyboard-only pass on all pages
- 200% zoom pass
- Screen reader pass on key flows

## SEO & Performance

### SEO

- Unique `<title>` + `<meta description>` per page (EN and ES)
- `hreflang` tags on every EN/ES pair
- `canonical` URL per page
- Structured data: `Dentist` LocalBusiness JSON-LD
- `BreadcrumbList` on subpages
- Sitemap includes EN and ES URLs
- Spanish pages use natural Spanish keywords

### Performance (Lighthouse ≥ 95)

- Images: WebP, `loading="lazy"` (except hero), explicit `width`/`height`
- Hero: `fetchpriority="high"`, preloaded
- Fonts: Inter + Nunito, `display: swap`, preloaded
- Zero render-blocking JS (~1KB inline total)
- No GA4 (re-added when real ID available)
- Single critical CSS file
- Total page weight target: < 300KB (excluding hero)

### GitHub Pages

- Base path: `/DrSmileOnline/`
- `CNAME`: `doctorsmileonline.com`
- `robots.txt`: allow all, point to sitemap
- Custom 404 page with links to home + contact

## Boundaries

### In Scope

- Redesign all 19 main pages with warm/family design system
- Add EN/ES i18n for all 19 main pages
- Full WCAG 2.1 AA accessibility
- New components (UtilityBar, TrustBand, LocationCards, StickyMobileCTA, TestimonialCarousel)
- Contact form (frontend only, no backend)
- Custom 404 page
- Sitemap, robots.txt, structured data

### Out of Scope

- Blog posts in Spanish (104 posts remain EN-only)
- Backend form handling (contact form is frontend-only)
- Online booking/scheduling integration
- Patient portal
- Insurance verification
- Before/after gallery (no photos available yet)
- Video content
- GA4 analytics (placeholder removed, re-add when real ID available)
- Custom domain DNS configuration (CNAME file is in repo, DNS is user's task)
