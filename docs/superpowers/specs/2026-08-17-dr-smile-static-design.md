# Dr. Smile Dental Group — Static Site Design

**Date:** 2026-08-17
**Status:** Approved
**Source site:** https://doctorsmileonline.com/ (WordPress)

## Goals

- Rebuild the Dr. Smile Dental Group site as a fully static Astro site
- Achieve a high Lighthouse score (target 95–100) on all four categories
- Replace the WordPress contact form with a Google Form (URL TBD — placeholder for now)
- Own the code, update content by editing Markdown files
- Deploy to GitHub Pages (subdirectory for testing, custom domain later)

## Stack

- **Astro** — static site generator, zero-JS by default
- **No UI framework** — hand-written CSS, no React/Vue/Svelte
- **No web fonts** — system font stack
- **GA4** — loaded via `<script async>` in `<head>`
- **Astro content collections** — for blog posts (Markdown)
- **astro:assets** — image optimization (WebP, lazy-load, dimensions)

## Architecture

```
dr-smile-static/
├── public/
│   ├── images/              # All site images (downloaded from WP, optimized)
│   ├── favicon.ico
│   ├── robots.txt
│   └── CNAME                # "doctorsmileonline.com" (for custom domain mode)
├── src/
│   ├── layouts/
│   │   └── Base.astro       # HTML shell, nav, footer, GA4
│   ├── components/
│   │   ├── Header.astro     # Nav with dropdowns
│   │   ├── Footer.astro     # Footer with links, social, gallery
│   │   ├── ServiceCard.astro
│   │   ├── Testimonial.astro
│   │   └── CtaBanner.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── faqs.astro
│   │   ├── services.astro
│   │   ├── oral-surgery.astro
│   │   ├── cosmetic-care.astro
│   │   ├── invisalign-orthodontcs.astro
│   │   ├── all-on-four-prosthetics.astro
│   │   ├── dental-implant-guide.astro
│   │   ├── dental-veneers-guide.astro
│   │   ├── dental-invisalign-treatment.astro
│   │   ├── location.astro
│   │   ├── financing.astro
│   │   ├── contact.astro    # Google Form embed (placeholder URL for now)
│   │   ├── privacy-policy.astro
│   │   ├── terms-and-conditions.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   └── content/
│       └── blog/            # Markdown posts
│           └── config.ts    # Content collection schema
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions → GitHub Pages
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Pages (17)

| Page | Route | Notes |
|------|-------|-------|
| Home | `/` | Hero, "What Sets Us Apart", services grid, testimonials, CTA |
| About | `/about/` | Team, patient-first messaging |
| FAQs | `/faqs/` | Q&A list |
| Services | `/services/` | Overview + links to 4 service detail pages |
| Oral Surgery, TMJ & Implants | `/oral-surgery/` | Service detail |
| Cosmetics, Veneers & Whitening | `/cosmetic-care/` | Service detail |
| Invisalign & Orthodontics | `/invisalign-orthodontcs/` | Service detail |
| All-on-Four & Prosthetics | `/all-on-four-prosthetics/` | Service detail |
| Dental Implant Guide | `/dental-implant-guide/` | Guide |
| Dental Veneers Guide | `/dental-veneers-guide/` | Guide |
| Invisalign Treatment | `/dental-invisalign-treatment/` | Guide |
| Location | `/location/` | 4 locations, hours, tel: links |
| Financing | `/financing/` | Financing options |
| Contact | `/contact/` | Google Form (placeholder URL) |
| Blog | `/blog/` | Index of posts |
| Blog posts | `/blog/[slug]` | From content collection |
| Privacy Policy | `/privacy-policy/` | Copied from WP |
| Terms & Conditions | `/terms-and-conditions/` | Copied from WP |

## Navigation

```
Home | About ▾ (FAQs) | Dental Guide ▾ (3 guides) | Location | Services | Financing | Blog ▾ (Announcements) | Contact | [CALL NOW]
```

## Lighthouse Strategy

### Performance (target: 100)
- Zero JS except GA4 (loaded `async`)
- All images: WebP via `astro:assets`, `loading="lazy"` (except LCP hero), explicit `width`/`height`
- Single small CSS file (~10–15 KB)
- No render-blocking resources
- System font stack (no web font downloads)

### Accessibility (target: 100)
- Semantic HTML: `header`, `nav`, `main`, `footer`, `article`, `section`
- All images have `alt` text
- Color contrast ≥ 4.5:1
- Skip-to-content link
- Proper heading hierarchy (one `h1` per page)
- Descriptive nav link names

### Best Practices (target: 100)
- HTTPS only
- No console errors
- `tel:` links for phone, `mailto:` for email

### SEO (target: 100)
- Unique `<title>` + meta description per page
- Open Graph tags
- Canonical URLs
- `robots.txt` + `sitemap.xml` (Astro sitemap integration)
- Structured data: `Dentist` LocalBusiness schema with 4 locations

## Content Migration

- Scrape text content from the live WordPress site for each page
- Download all images from `wp-content/uploads/`
- Port blog posts to Markdown (Astro content collection)
- Copy legal pages (privacy, terms) verbatim

## Hosting & Deployment

**Platform:** GitHub Pages

**Testing mode:**
- Repo: `skittleson/dr-smile-static`
- URL: `skittleson.github.io/dr-smile-static/`
- Astro `base: '/dr-smile-static/'`

**Production mode (later):**
- Custom domain: `doctorsmileonline.com`
- CNAME record in repo settings
- `public/CNAME` file
- Astro `base: '/'`

**Deployment flow:**
```
1. Edit a .md or .astro file
2. git commit && git push
3. GitHub Actions: npm ci && npm run build
4. Deploy dist/ to GitHub Pages
5. Live
```

**GitHub Actions workflow (`.github/workflows/deploy.yml`):**
- Trigger: push to `main`
- Steps: checkout → setup Node → `npm ci` → `npm run build` → deploy `dist/` to Pages

## Open Items

- [ ] Google Form URL for contact page (placeholder until provided)
- [ ] GA4 measurement ID (placeholder until provided)
- [ ] Verify all 4 location addresses/phones from live site
- [ ] Confirm blog post list from live site
