# Dr. Smile Static Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild doctorsmileonline.com as a fully static Astro site with a high Lighthouse score (95–100), replacing the WordPress contact form with a Google Form.

**Architecture:** Pure static Astro site. Zero client-side JS except GA4. Hand-written CSS, system font stack, optimized WebP images via `astro:assets`. Blog posts live in an Astro content collection (Markdown). Deployed to GitHub Pages.

**Tech Stack:** Astro 5, `@astrojs/sitemap`, `astro:assets`, GitHub Actions, hand-written CSS.

## Global Constraints

- **No web fonts** — system font stack only
- **No JS frameworks** — no React, Vue, Svelte, or any hydration
- **Zero client-side JS** except the GA4 `<script async>` snippet
- **All images** must have explicit `width`/`height` and `loading="lazy"` (except LCP hero)
- **One `h1` per page**, proper heading hierarchy
- **Semantic HTML**: `header`, `nav`, `main`, `footer`, `article`, `section`
- **Color contrast** ≥ 4.5:1
- **Unique `<title>` + meta description** per page
- **Canonical URLs** on every page
- **Testing base path:** `/dr-smile-static/` (GitHub Pages subdirectory)
- **Production base path:** `/` (custom domain, later)
- **GA4 measurement ID:** placeholder `G-XXXXXXXXXX` until provided
- **Google Form URL:** placeholder `https://forms.gle/PLACEHOLDER` until provided

---

### Task 1: Project Scaffolding

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `public/robots.txt`
- Create: `public/CNAME`
- Create: `public/favicon.ico`

**Interfaces:**
- Produces: Working Astro project that builds with `npm run build` into `dist/`

- [ ] **Step 1: Initialize Astro project**

```bash
cd /home/spencerkittleson/repos/drsmileonlinecom
npm create astro@latest -- --template minimal --no-install --no-git
rm -rf .astro src/pages src/layouts src/components
npm install
npm install @astrojs/sitemap
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  base: '/dr-smile-static/',
  site: 'https://skittleson.github.io',
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/styles/global.css`**

```css
:root {
  --color-primary: #1a5276;
  --color-primary-dark: #154360;
  --color-accent: #2e86c1;
  --color-text: #2c3e50;
  --color-text-light: #5d6d7e;
  --color-bg: #ffffff;
  --color-bg-alt: #f8f9fa;
  --color-border: #dde4e8;
  --font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --max-width: 1200px;
  --radius: 8px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-stack);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  font-size: 16px;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3;
  color: var(--color-primary);
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: #fff;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 60px 0;
}

.section-alt {
  background: var(--color-bg-alt);
}

.btn {
  display: inline-block;
  padding: 12px 28px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: var(--color-primary-dark);
  text-decoration: none;
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
```

- [ ] **Step 5: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://skittleson.github.io/dr-smile-static/sitemap-index.xml
```

- [ ] **Step 6: Create `public/CNAME`**

```
doctorsmileonline.com
```

- [ ] **Step 7: Download favicon**

```bash
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2025/01/favicon.png" -o public/favicon.png
```

- [ ] **Step 8: Verify build works**

```bash
npm run build
ls dist/
```

Expected: `dist/` contains `index.html`, `robots.txt`, `favicon.png`, `sitemap-index.xml`

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Astro project with global styles and config"
```

---

### Task 2: Base Layout, Header, and Footer

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` (from Task 1)
- Produces: `<BaseLayout>` component that all pages import. Expects props: `title`, `description`, `canonicalUrl`

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
const nav = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about/',
    children: [{ label: 'FAQs', href: '/faqs/' }],
  },
  {
    label: 'Dental Guide',
    href: null,
    children: [
      { label: 'Dental Implant Guide', href: '/dental-implant-guide/' },
      { label: 'Dental Veneers Guide', href: '/dental-veneers-guide/' },
      { label: 'Invisalign Treatment', href: '/dental-invisalign-treatment/' },
    ],
  },
  { label: 'Location', href: '/location/' },
  { label: 'Services', href: '/services/' },
  { label: 'Financing', href: '/financing/' },
  {
    label: 'Blog',
    href: '/blog/',
    children: [{ label: 'Important Announcements', href: '/important-announcements/' }],
  },
  { label: 'Contact', href: '/contact/' },
];
const base = Astro.base;
---

<header>
  <nav aria-label="Main navigation" class="nav">
    <div class="nav-inner container">
      <a href={base} class="nav-logo" aria-label="Dr. Smile Dental Group — Home">
        <img src={`${base}images/footer-logo.png`} alt="Dr. Smile Dental Group" width="180" height="48" />
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu">
        <span class="sr-only">Toggle navigation menu</span>
        ☰
      </button>
      <ul id="nav-menu" class="nav-menu">
        {nav.map((item) => (
          <li class="nav-item">
            {item.href
              ? <a href={base + item.href}>{item.label}</a>
              : <span class="nav-dropdown-trigger">{item.label} ▾</span>}
            {item.children && (
              <ul class="nav-dropdown">
                {item.children.map((child) => (
                  <li><a href={base + child.href}>{child.label}</a></li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li class="nav-cta">
          <a href="tel:(310)388-3669" class="btn">CALL NOW</a>
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
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .nav-logo img {
    height: 48px;
    width: auto;
  }
  .nav-menu {
    display: flex;
    align-items: center;
    gap: 24px;
    list-style: none;
  }
  .nav-item {
    position: relative;
  }
  .nav-item > a,
  .nav-dropdown-trigger {
    font-weight: 500;
    color: var(--color-text);
    padding: 8px 0;
    cursor: pointer;
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
    min-width: 200px;
    list-style: none;
    padding: 8px 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .nav-item:hover .nav-dropdown,
  .nav-item:focus-within .nav-dropdown {
    display: block;
  }
  .nav-dropdown li a {
    display: block;
    padding: 8px 16px;
    color: var(--color-text);
  }
  .nav-dropdown li a:hover {
    background: var(--color-bg-alt);
    color: var(--color-primary);
    text-decoration: none;
  }
  .nav-cta .btn {
    padding: 8px 20px;
    font-size: 0.9rem;
  }
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text);
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
  @media (max-width: 768px) {
    .nav-toggle { display: block; }
    .nav-menu {
      display: none;
      flex-direction: column;
      width: 100%;
      padding: 16px 0;
      gap: 8px;
    }
    .nav-inner { flex-wrap: wrap; }
    .nav-dropdown {
      position: static;
      display: block;
      box-shadow: none;
      border: none;
      padding-left: 16px;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
const base = Astro.base;
const year = new Date().getFullYear();
const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Location', href: '/location/' },
  { label: 'Services', href: '/services/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Financing', href: '/financing/' },
  { label: 'Blog', href: '/blog/' },
];
const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms and Conditions', href: '/terms-and-conditions/' },
];
---

<footer>
  <div class="footer-top container">
    <div class="footer-brand">
      <a href={base} aria-label="Dr. Smile Dental Group — Home">
        <img src={`${base}images/footer-logo.png`} alt="Dr. Smile Dental Group" width="180" height="48" />
      </a>
      <p>Comprehensive dental care across Southern California.</p>
    </div>
    <div class="footer-links">
      <h3>Quick Links</h3>
      <ul>
        {footerLinks.map((link) => (
          <li><a href={base + link.href}>{link.label}</a></li>
        ))}
      </ul>
    </div>
    <div class="footer-legal">
      <h3>Legal</h3>
      <ul>
        {legalLinks.map((link) => (
          <li><a href={base + link.href}>{link.label}</a></li>
        ))}
      </ul>
      <h3>Follow Us</h3>
      <div class="footer-social">
        <a href="https://www.facebook.com/drsmiledentalgroup" aria-label="Facebook" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.instagram.com/dr.smile_dental_group/" aria-label="Instagram" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <p>&copy; {year} Dr. Smile Dental Group. All Rights Reserved.</p>
    </div>
  </div>
</footer>

<style>
  footer {
    background: var(--color-primary-dark);
    color: #fff;
  }
  .footer-top {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 40px;
    padding: 48px 20px;
  }
  .footer-brand img {
    height: 48px;
    width: auto;
    margin-bottom: 16px;
  }
  .footer-brand p {
    color: rgba(255,255,255,0.7);
  }
  .footer-links h3,
  .footer-legal h3 {
    font-size: 1rem;
    margin-bottom: 12px;
    color: #fff;
  }
  .footer-links ul,
  .footer-legal ul {
    list-style: none;
  }
  .footer-links li,
  .footer-legal li {
    margin-bottom: 8px;
  }
  .footer-links a,
  .footer-legal a {
    color: rgba(255,255,255,0.7);
  }
  .footer-links a:hover,
  .footer-legal a:hover {
    color: #fff;
  }
  .footer-social {
    display: flex;
    gap: 16px;
    margin-top: 16px;
  }
  .footer-social a {
    color: rgba(255,255,255,0.7);
  }
  .footer-social a:hover {
    color: #fff;
  }
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding: 16px 0;
    text-align: center;
  }
  .footer-bottom p {
    color: rgba(255,255,255,0.5);
    font-size: 0.875rem;
  }
  @media (max-width: 768px) {
    .footer-top {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }
</style>
```

- [ ] **Step 3: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
}

const { title, description, canonicalUrl } = Astro.props;
const base = Astro.base;
const canonical = canonicalUrl || new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/png" href={`${base}favicon.png`} />
    <link rel="icon" type="image/x-icon" href={`${base}favicon.ico`} />

    <title>{title}</title>

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content="Dr. Smile Dental Group" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <!-- GA4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>

    <!-- Structured Data -->
    <script type="application/ld+json">
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        'name': 'Dr. Smile Dental Group',
        'description': 'Comprehensive dental care including oral surgery, implants, cosmetics, and orthodontics across Southern California.',
        'telephone': '(310) 388-3669',
        'url': 'https://doctorsmileonline.com',
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': 'CA'
        },
        'areaServed': 'Southern California',
        'sameAs': [
          'https://www.facebook.com/drsmiledentalgroup',
          'https://www.instagram.com/dr.smile_dental_group/'
        ]
      })
    </script>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Create a minimal `src/pages/index.astro` to test the layout**

```astro
---
import BaseLayout from '../layouts/Base.astro';
---

<BaseLayout
  title="Dr. Smile Dental Group | Expert Oral Surgery, Implants & More"
  description="Comprehensive dental care in Southern California. Oral surgery, implants, cosmetics, Invisalign & more under one roof."
>
  <section class="section">
    <div class="container">
      <h1>Dr. Smile Dental Group</h1>
      <p>Nothing You Wear is as Beautiful as a Healthy Smile!</p>
      <p>This is a placeholder page to verify the layout works.</p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
cat dist/index.html | head -50
```

Expected: HTML with `<title>`, meta description, canonical link, GA4 script, structured data, nav, footer.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add base layout, header with nav, and footer"
```

---

### Task 3: Download and Optimize Images

**Files:**
- Create: `public/images/` (directory with all downloaded images)

**Interfaces:**
- Consumes: `public/` directory (from Task 1)
- Produces: All images in `public/images/` ready for use in pages

- [ ] **Step 1: Create images directory and download all images**

```bash
mkdir -p public/images
cd public/images

# Hero and main images
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/12/dr-smile-bg-new-scaled.jpg" -o dr-smile-bg-new.jpg
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/footer-logo.png" -o footer-logo.png
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/nabiaa.jpeg" -o nabiaa.jpg
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/C3uaYcIg-2.png" -o testimonial-1.png
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/k-in-nb.jpeg" -o about-patients.jpg
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/contact-img.png" -o contact-img.png

# Service icons
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/service-1.png" -o service-1.png
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/service-2.png" -o service-2.png
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2025/02/service-3.png" -o service-3.png
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2025/02/dr_smile2.png" -o service-4.png

# Footer gallery
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/dr_smile20.png" -o gallery-1.png
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/footer-2.jpg" -o gallery-2.jpg
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2024/11/dr_smile6.jpg" -o gallery-3.jpg

# Favicon (also in public/)
curl -sL "https://doctorsmileonline.com/wp-content/uploads/2025/01/favicon.png" -o ../favicon.png

ls -la
```

- [ ] **Step 2: Verify all images downloaded successfully**

```bash
file public/images/*
# All should show "JPEG image data" or "PNG image data"
# No "ASCII text" (which would indicate a 404 page)
```

- [ ] **Step 3: Commit**

```bash
git add public/images/ public/favicon.png
git commit -m "feat: download and organize all site images"
```

---

### Task 4: Home Page

**Files:**
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/Testimonial.astro`
- Create: `src/components/CtaBanner.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2), images from `public/images/` (Task 3)
- Produces: Complete home page with hero, services grid, testimonials, CTA

- [ ] **Step 1: Create `src/components/ServiceCard.astro`**

```astro
---
interface Props {
  image: string;
  title: string;
  description: string;
  href: string;
}
const { image, title, description, href } = Astro.props;
const base = Astro.base;
---

<a href={base + href} class="service-card">
  <img src={base + image} alt={title} width="200" height="200" loading="lazy" />
  <h3>{title}</h3>
  <p>{description}</p>
</a>

<style>
  .service-card {
    display: block;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 24px;
    text-align: center;
    transition: box-shadow 0.2s;
  }
  .service-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    text-decoration: none;
  }
  .service-card img {
    margin: 0 auto 16px;
    max-width: 120px;
    height: auto;
  }
  .service-card h3 {
    margin-bottom: 8px;
    font-size: 1.1rem;
  }
  .service-card p {
    color: var(--color-text-light);
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 2: Create `src/components/Testimonial.astro`**

```astro
---
interface Props {
  quote: string;
  author: string;
}
const { quote, author } = Astro.props;
---

<figure class="testimonial">
  <blockquote>
    <p>&ldquo;{quote}&rdquo;</p>
  </blockquote>
  <figcaption>&mdash; {author}</figcaption>
</figure>

<style>
  .testimonial {
    background: var(--color-bg-alt);
    border-left: 4px solid var(--color-accent);
    padding: 24px;
    border-radius: var(--radius);
  }
  .testimonial blockquote p {
    font-style: italic;
    color: var(--color-text);
    margin-bottom: 12px;
  }
  .testimonial figcaption {
    font-weight: 600;
    color: var(--color-primary);
  }
</style>
```

- [ ] **Step 3: Create `src/components/CtaBanner.astro`**

```astro
---
interface Props {
  heading: string;
  subheading?: string;
  buttonLabel: string;
  buttonHref: string;
}
const { heading, subheading, buttonLabel, buttonHref } = Astro.props;
const base = Astro.base;
---

<section class="cta-banner">
  <div class="container">
    <h2>{heading}</h2>
    {subheading && <p>{subheading}</p>}
    <a href={base + buttonHref} class="btn btn-lg">{buttonLabel}</a>
  </div>
</section>

<style>
  .cta-banner {
    background: var(--color-primary);
    color: #fff;
    text-align: center;
    padding: 60px 20px;
  }
  .cta-banner h2 {
    color: #fff;
    margin-bottom: 12px;
  }
  .cta-banner p {
    color: rgba(255,255,255,0.8);
    margin-bottom: 24px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .btn-lg {
    padding: 16px 40px;
    font-size: 1.1rem;
    background: #fff;
    color: var(--color-primary);
  }
  .btn-lg:hover {
    background: rgba(255,255,255,0.9);
  }
</style>
```

- [ ] **Step 4: Replace `src/pages/index.astro` with the full home page**

```astro
---
import BaseLayout from '../layouts/Base.astro';
import ServiceCard from '../components/ServiceCard.astro';
import Testimonial from '../components/Testimonial.astro';
import CtaBanner from '../components/CtaBanner.astro';

const base = Astro.base;
---

<BaseLayout
  title="Dr. Smile Dental Group | Expert Oral Surgery, Implants & More"
  description="Comprehensive dental care in Southern California. Oral surgery, implants, cosmetics, Invisalign & more under one roof. Call (310) 388-3669."
>
  {/* Hero */}
  <section class="hero">
    <div class="hero-content container">
      <p class="hero-eyebrow">dr. smile dental group</p>
      <h1>Nothing You Wear is as Beautiful as a Healthy Smile!</h1>
      <p class="hero-sub">Unleash your smile's full potential!</p>
      <a href="tel:(310)388-3669" class="btn btn-lg">CALL (310) 388-3669</a>
    </div>
  </section>

  {/* What Sets Us Apart */}
  <section class="section">
    <div class="container">
      <h2>What Sets Us Apart</h2>
      <p>Throughout Southern California, our state-of-the-art facilities and advanced technology allow us to provide the latest in dental treatments and techniques, ensuring our patients receive the highest quality of care.</p>
      <p>No matter your age or dental concerns, we are dedicated to creating a personalized treatment plan tailored to your specific needs and goals.</p>
      <p><strong>We believe that everyone deserves a beautiful, healthy smile that they can be proud of.</strong></p>
    </div>
  </section>

  {/* Multi-Specialty */}
  <section class="section section-alt">
    <div class="container">
      <div class="two-col">
        <div>
          <p class="eyebrow">Multi-specialty services</p>
          <h2>Comprehensive Dental Services at Dr. Smile</h2>
          <p>Typically, general dentists refer patients to specialists for procedures like oral surgeries, implants, prosthodontic care, and orthodontics. However, our facilities boast a diverse team of dental practitioners across various specialties, eliminating the need for external referrals.</p>
          <p>Consequently, you and your family can access comprehensive dental care under one roof, provided by experts in each specialty. This streamlines your treatment process and enhances the personalized attention you receive.</p>
          <a href={base + 'services/'} class="btn">Specialties at Dr. Smile</a>
        </div>
        <img src={`${base}images/nabiaa.jpg`} alt="Dr. Smile dental team providing comprehensive care" width="480" height="360" loading="lazy" />
      </div>
    </div>
  </section>

  {/* Testimonials */}
  <section class="section">
    <div class="container">
      <p class="eyebrow">Testimonials</p>
      <h2>What Our Patients Say</h2>
      <div class="testimonial-grid">
        <Testimonial
          quote="Dr. Javid and Dr. Nadi are amazing — helping to create the smile of my dreams. They always make me feel comfortable and the team is caring and kind!"
          author="Ellie"
        />
        <Testimonial
          quote="Dr. Javid and Dr. Nadi are absolutely incredible! They've transformed my smile in ways I never imagined. Their attention to detail and genuine care for their patients is remarkable!"
          author="Maria"
        />
      </div>
    </div>
  </section>

  {/* About Patients */}
  <section class="section section-alt">
    <div class="container">
      <div class="two-col">
        <img src={`${base}images/about-patients.jpg`} alt="Dr. Smile patient receiving care" width="480" height="360" loading="lazy" />
        <div>
          <p class="eyebrow">It's All about Our Patients!</p>
          <h2>Your Needs Are Our Priority</h2>
          <p><strong>If you're new here, welcome!</strong></p>
          <p>We are incredibly passionate about what we do and have spent years in continuing education to provide the utmost in oral health care.</p>
          <a href={base + 'about/'} class="btn btn-outline">More About Us</a>
        </div>
      </div>
    </div>
  </section>

  {/* Services Grid */}
  <section class="section">
    <div class="container">
      <p class="eyebrow">Services</p>
      <h2>Our Specialties</h2>
      <div class="services-grid">
        <ServiceCard
          image="images/service-1.png"
          title="Oral Surgery, TMJ & Implants"
          description="Our approach is grounded in the principles of longevity, function, and overall health."
          href="oral-surgery/"
        />
        <ServiceCard
          image="images/service-2.png"
          title="Cosmetics, Veneers & Whitening"
          description="Achieving natural esthetic outcomes requires expertise and quality materials."
          href="cosmetic-care/"
        />
        <ServiceCard
          image="images/service-3.png"
          title="Invisalign & Orthodontics"
          description="Our orthodontic philosophy emphasizes proper occlusion and preventive care."
          href="invisalign-orthodontcs/"
        />
        <ServiceCard
          image="images/service-4.png"
          title="All-on-Four & Prosthetics"
          description="Our implantologists offer both fixed and removable options to meet your individual needs."
          href="all-on-four-prosthetics/"
        />
      </div>
    </div>
  </section>

  {/* CTA */}
  <CtaBanner
    heading="A Healthy Confident Smile is Waiting"
    subheading="With four locations across Southern California, we're confident there's a convenient time for you to consult with one of our exceptional clinicians!"
    buttonLabel="Schedule a Consult"
    buttonHref="contact/"
  />
</BaseLayout>

<style>
  .hero {
    background: linear-gradient(rgba(26,82,118,0.85), rgba(26,82,118,0.85)),
      url('images/dr-smile-bg-new.jpg') center/cover no-repeat;
    color: #fff;
    text-align: center;
    padding: 100px 20px;
  }
  .hero-eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 12px;
  }
  .hero h1 {
    color: #fff;
    font-size: 3rem;
    max-width: 800px;
    margin: 0 auto 16px;
  }
  .hero-sub {
    font-size: 1.25rem;
    color: rgba(255,255,255,0.8);
    margin-bottom: 32px;
  }
  .hero .btn-lg {
    padding: 16px 48px;
    font-size: 1.1rem;
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section h2 {
    margin-bottom: 16px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .two-col img {
    width: 100%;
    height: auto;
    border-radius: var(--radius);
  }
  .testimonial-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 24px;
  }
  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; }
    .two-col { grid-template-columns: 1fr; }
    .testimonial-grid { grid-template-columns: 1fr; }
    .services-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .services-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
# Check that the home page has all sections
grep -c "service-card\|testimonial\|cta-banner" dist/index.html
```

Expected: Multiple matches (services grid, testimonials, CTA)

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: build home page with hero, services, testimonials, and CTA"
```

---

### Task 5: About, FAQs, and Location Pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/faqs.astro`
- Create: `src/pages/location.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2)
- Produces: Three complete pages

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="About Dr. Smile Dental Group | Meet Our Doctors"
  description="Meet Dr. Mariam Nadi and Dr. Kayvon Javid. 16+ years of patient-centered dental care across Southern California."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">About</p>
      <h1>Meet Our Doctors</h1>

      <div class="doctor-card">
        <h2>Dr. Mariam Nadi</h2>
        <p>Dr. Mariam Nadi has proudly practiced in Southern California for 16 years. Together with her husband, Dr. Kayvon Javid, they have built a thriving patient-centered Dr. Smile brand, serving multiple communities.</p>
        <p>The offices have been designed to be warm and welcoming, creating spaces where patients feel comfortable and cared for. Dr. Nadi's approach combines advanced technology with a gentle, personal touch.</p>
      </div>

      <div class="doctor-card">
        <h2>Dr. Kayvon Javid</h2>
        <p>Dr. Kayvon Javid brings extensive experience in oral surgery, implants, and prosthodontics to the Dr. Smile team. His focus on longevity, function, and overall health ensures that every treatment plan is built to last.</p>
        <p>Together, Dr. Nadi and Dr. Javid provide comprehensive dental care under one roof, eliminating the need for external referrals and streamlining the treatment process for patients and their families.</p>
      </div>

      <div class="about-values">
        <h2>Our Philosophy</h2>
        <p>We believe that everyone deserves a beautiful, healthy smile that they can be proud of. Our state-of-the-art facilities and advanced technology allow us to provide the latest in dental treatments and techniques.</p>
        <p>No matter your age or dental concerns, we are dedicated to creating a personalized treatment plan tailored to your specific needs and goals.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .doctor-card {
    margin: 32px 0;
    padding: 24px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
  }
  .doctor-card h2 {
    margin-bottom: 12px;
  }
  .doctor-card p {
    margin-bottom: 12px;
    color: var(--color-text-light);
  }
  .about-values {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
  }
  .about-values p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .about-values .btn {
    margin-top: 16px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/faqs.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;

const faqs = [
  {
    q: 'What are the benefits of visiting the best dental clinic in San Pedro?',
    a: 'Visiting a reputable dental clinic in San Pedro ensures you receive high-quality, personalized care from experienced professionals. Our clinic offers state-of-the-art technology, a comfortable environment, and a team dedicated to your oral health.',
  },
  {
    q: 'Do you offer same-day appointments?',
    a: 'Yes, we offer same-day appointments for dental emergencies and urgent care. Call us at (310) 388-3669 and we will do our best to accommodate you the same day.',
  },
  {
    q: 'What insurance plans do you accept?',
    a: 'We accept most major insurance plans. Contact our office for specific details about your plan and how we can help maximize your benefits.',
  },
  {
    q: 'Do you offer financing options?',
    a: 'Yes, we offer flexible financing options to make quality dental care accessible and affordable. Visit our Financing page for more details.',
  },
  {
    q: 'What should I expect during my first visit?',
    a: 'During your first visit, we will conduct a comprehensive examination, take X-rays if needed, and discuss your dental history and concerns. We will then create a personalized treatment plan tailored to your needs.',
  },
  {
    q: 'Do you treat children?',
    a: 'Yes, we welcome patients of all ages. Our team is experienced in providing gentle, comprehensive care for children and adults alike.',
  },
];
---

<BaseLayout
  title="FAQs | Dr. Smile Dental Group"
  description="Frequently asked questions about our dental services, insurance, financing, and what to expect at your first visit."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">FAQs</p>
      <h1>Frequently Asked Questions</h1>
      <div class="faq-list">
        {faqs.map((faq) => (
          <details class="faq-item">
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
      <div class="faq-cta">
        <p>Still have questions?</p>
        <a href={base + 'contact/'} class="btn">Contact Us</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .faq-list {
    margin-top: 32px;
  }
  .faq-item {
    border-bottom: 1px solid var(--color-border);
    padding: 16px 0;
  }
  .faq-item summary {
    font-weight: 600;
    cursor: pointer;
    color: var(--color-primary);
    padding: 8px 0;
  }
  .faq-item summary:hover {
    color: var(--color-accent);
  }
  .faq-item p {
    margin-top: 12px;
    color: var(--color-text-light);
    padding-bottom: 8px;
  }
  .faq-cta {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
  }
  .faq-cta p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
</style>
```

- [ ] **Step 3: Create `src/pages/location.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;

const locations = [
  {
    name: 'Newport Beach',
    address: 'Newport Beach, CA',
    phone: '(310) 388-3669',
  },
  {
    name: 'San Pedro',
    address: 'San Pedro, CA',
    phone: '(310) 388-3669',
  },
  {
    name: 'Torrance',
    address: 'Torrance, CA',
    phone: '(310) 388-3669',
  },
  {
    name: 'Lomita',
    address: 'Lomita, CA',
    phone: '(310) 388-3669',
  },
];
---

<BaseLayout
  title="Locations | Dr. Smile Dental Group"
  description="Four convenient locations across Southern California: Newport Beach, San Pedro, Torrance, and Lomita."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Location</p>
      <h1>Our Locations</h1>
      <p>With four locations across Southern California, we're confident there's a convenient location near you.</p>

      <div class="locations-grid">
        {locations.map((loc) => (
          <div class="location-card">
            <h2>{loc.name}</h2>
            <p>{loc.address}</p>
            <a href={`tel:${loc.phone}`} class="btn btn-outline">Call {loc.phone}</a>
          </div>
        ))}
      </div>

      <div class="location-cta">
        <h2>Ready to Visit?</h2>
        <p>Schedule a consultation at the location most convenient for you.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .locations-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  .location-card {
    padding: 24px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
  }
  .location-card h2 {
    margin-bottom: 8px;
    font-size: 1.25rem;
  }
  .location-card p {
    color: var(--color-text-light);
    margin-bottom: 16px;
  }
  .location-cta {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }
  .location-cta p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  @media (max-width: 768px) {
    .locations-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
# Verify all three pages exist
ls dist/about/index.html dist/faqs/index.html dist/location/index.html
```

Expected: All three files exist

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add about, FAQs, and location pages"
```

---

### Task 6: Services Overview + 4 Service Detail Pages

**Files:**
- Create: `src/pages/services.astro`
- Create: `src/pages/oral-surgery.astro`
- Create: `src/pages/cosmetic-care.astro`
- Create: `src/pages/invisalign-orthodontcs.astro`
- Create: `src/pages/all-on-four-prosthetics.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2)
- Produces: Five complete pages

- [ ] **Step 1: Create `src/pages/services.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
import ServiceCard from '../components/ServiceCard.astro';
const base = Astro.base;
---

<BaseLayout
  title="Services | Dr. Smile Dental Group"
  description="Comprehensive dental services: oral surgery, TMJ & implants, cosmetics, veneers & whitening, Invisalign & orthodontics, All-on-Four & prosthetics."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Our Services</p>
      <h1>Expert Dental Services for a Healthier, Brighter Smile</h1>
      <p>At Dr. Smile, preserving your smile is not just our priority — it's our passion. Envision walking into any of our four state-of-the-art facilities, where every aspect of your oral health is expertly managed under one roof.</p>
      <p>Whether you're here for routine cleanings, cosmetic enhancements, or complex surgical procedures, our multi-specialty team is ready to provide the care you deserve.</p>

      <div class="services-grid">
        <ServiceCard
          image="images/service-1.png"
          title="Oral Surgery, TMJ & Implants"
          description="Our approach is grounded in the principles of longevity, function, and overall health."
          href="oral-surgery/"
        />
        <ServiceCard
          image="images/service-2.png"
          title="Cosmetics, Veneers & Whitening"
          description="Achieving natural esthetic outcomes requires expertise and quality materials."
          href="cosmetic-care/"
        />
        <ServiceCard
          image="images/service-3.png"
          title="Invisalign & Orthodontics"
          description="Our orthodontic philosophy emphasizes proper occlusion and preventive care."
          href="invisalign-orthodontcs/"
        />
        <ServiceCard
          image="images/service-4.png"
          title="All-on-Four & Prosthetics"
          description="Our implantologists offer both fixed and removable options to meet your individual needs."
          href="all-on-four-prosthetics/"
        />
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  @media (max-width: 768px) {
    .services-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Create `src/pages/oral-surgery.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Oral Surgery, TMJ & Implants | Dr. Smile Dental Group"
  description="Experienced oral surgeons and periodontists specializing in complex procedures, TMJ treatment, and dental implants."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Specialties at Dr. Smile</p>
      <h1>Oral Surgery and Implants</h1>

      <p>Sometimes, the loss of a bone or tooth may require oral surgery, which can range from straightforward procedures to more complex interventions. Our experienced team of oral surgeons and periodontists specializes in these surgical procedures, ensuring the best possible outcomes for our patients.</p>

      <h2>TMJ Treatment</h2>
      <p>T temporomandibular joint (TMJ) disorders can cause significant pain and discomfort. Our team provides comprehensive TMJ treatment, from diagnosis to long-term management, helping you find lasting relief.</p>

      <h2>Dental Implants</h2>
      <p>Dental implants are a transformative solution for missing teeth, providing a reliable and long-lasting alternative that looks and feels like natural teeth. Our implantologists offer both single and multiple implant solutions tailored to your needs.</p>

      <h2>Wisdom Tooth Removal</h2>
      <p>Wisdom teeth can cause crowding, pain, and other dental problems. Our oral surgeons perform wisdom tooth extractions with care and precision, ensuring a smooth recovery.</p>

      <div class="service-cta">
        <h2>Ready to Consult?</h2>
        <p>Our experienced team is ready to help you achieve optimal oral health.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .service-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .service-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 3: Create `src/pages/cosmetic-care.astro`**

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Cosmetic Dentistry, Veneers & Whitening | Dr. Smile Dental Group"
  description="Achieve natural esthetic outcomes with expert veneers, teeth whitening, and cosmetic dentistry in Southern California."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Your Smile Will Thank You</p>
      <h1>Cosmetic Dentistry and Veneers</h1>

      <p>You deserve the smile you've always dreamed of. At Dr. Smile, our mission is to deliver exactly that. Feeling and speaking confidently with your smile can be difficult when dealing with issues of color, shape, or alignment. If years of self-consciousness have held you back, it's time to change that.</p>

      <h2>Dental Veneers</h2>
      <p>Dental veneers are a cornerstone of modern cosmetic dentistry, offering a minimally invasive yet highly effective solution for transforming the appearance of teeth. Whether addressing discoloration, chips, gaps, or minor misalignments, veneers provide a natural-looking, long-lasting result.</p>

      <h2>Teeth Whitening</h2>
      <p>Professional teeth whitening is one of the quickest ways to brighten your smile. Our in-office whitening treatments are safe, effective, and designed to give you a noticeably whiter smile in a single visit.</p>

      <h2>Smile Makeovers</h2>
      <p>For patients seeking a comprehensive smile transformation, our cosmetic dentists work with you to design a personalized smile makeover that addresses multiple concerns at once — from color and shape to alignment and proportion.</p>

      <div class="service-cta">
        <h2>Ready to Transform Your Smile?</h2>
        <p>Consult with our cosmetic dentistry team today.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .service-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .service-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 4: Create `src/pages/invisalign-orthodontcs.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Invisalign & Orthodontics | Dr. Smile Dental Group"
  description="Discreet Invisalign treatment and orthodontic care emphasizing proper occlusion and preventive care."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Invisalign in Torrance</p>
      <h1>Invisalign & Orthodontics</h1>

      <p>Do you know suffering from a set of crooked teeth is more of a health concern than that of aesthetics? Yes, more of a fact, as per the sources of Scientific American, about 90% of every 9 out of 10 people suffer from the issue of crooked teeth. Well, cut to 2025, while the options for treatment have evolved, Invisalign remains one of the most popular and effective solutions.</p>

      <h2>What is Invisalign?</h2>
      <p>Invisalign represents a breakthrough in orthodontic treatment, offering a discreet and comfortable alternative to traditional metal braces. This treatment uses a series of custom-made, clear aligners that gradually straighten your teeth over time.</p>

      <h2>Benefits of Invisalign</h2>
      <p><strong>Nearly Invisible:</strong> The clear aligners are barely noticeable, so you can straighten your teeth without the self-consciousness that comes with metal braces.</p>
      <p><strong>Removable:</strong> You can take the aligners out to eat, drink, and brush your teeth, making oral hygiene easier to maintain.</p>
      <p><strong>Comfortable:</strong> There are no brackets or wires to irritate your gums and cheeks.</p>
      <p><strong>Predictable Results:</strong> Our team uses advanced 3D imaging to map out your treatment plan and show you the expected results before you begin.</p>

      <h2>Orthodontic Philosophy</h2>
      <p>Our orthodontic philosophy emphasizes proper occlusion and preventive care. We believe that healthy, well-aligned teeth are the foundation of a lifetime of oral health.</p>

      <div class="service-cta">
        <h2>Ready to Straighten Your Smile?</h2>
        <p>Schedule a consultation to see if Invisalign is right for you.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .service-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .service-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 5: Create `src/pages/all-on-four-prosthetics.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="All-on-Four & Prosthetics | Dr. Smile Dental Group"
  description="Fixed and removable implant solutions for full-arch tooth restoration. All-on-Four and prosthetic care in Newport Beach."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Smile Restoration</p>
      <h1>All-on-Four Implants & Prosthetics</h1>

      <p>Who likes a fake smile? None. But the constant loss of teeth, degraded dentition on the upper and lower jaw, and edentulism leave you with no option. Well, now gone are those days when you had to conceal your smile. DR Smile, with their new-fangled and cutting-edge implant solutions, offers a path back to a confident, natural-looking smile.</p>

      <h2>What is All-on-Four?</h2>
      <p>All-on-Four is a revolutionary implant solution that uses just four implants to support a full arch of teeth. This procedure is ideal for patients who have lost most or all of their teeth and are looking for a permanent, fixed solution.</p>

      <h2>Benefits of All-on-Four</h2>
      <p><strong>Same-Day Teeth:</strong> In many cases, you can leave the office with a full set of temporary teeth on the same day as your implant surgery.</p>
      <p><strong>Fixed Solution:</strong> Unlike traditional dentures, All-on-Four implants are fixed in place, so they don't slip or shift.</p>
      <p><strong>Natural Look and Feel:</strong> The prosthetic teeth are designed to look and function like natural teeth.</p>
      <p><strong>Preserves Bone:</strong> Implants stimulate the jawbone, preventing the bone loss that occurs with traditional dentures.</p>

      <h2>Removable Options</h2>
      <p>For patients who prefer a removable solution, our implantologists also offer implant-supported dentures that snap securely into place, providing the stability and comfort of a fixed solution with the flexibility of a removable one.</p>

      <div class="service-cta">
        <h2>Ready to Restore Your Smile?</h2>
        <p>Consult with our implant team to explore your options.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .service-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .service-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
ls dist/services/index.html dist/oral-surgery/index.html dist/cosmetic-care/index.html dist/invisalign-orthodontcs/index.html dist/all-on-four-prosthetics/index.html
```

Expected: All five files exist

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add services overview and 4 service detail pages"
```

---

### Task 7: Dental Guide Pages (3)

**Files:**
- Create: `src/pages/dental-implant-guide.astro`
- Create: `src/pages/dental-veneers-guide.astro`
- Create: `src/pages/dental-invisalign-treatment.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2)
- Produces: Three guide pages

- [ ] **Step 1: Create `src/pages/dental-implant-guide.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Dental Implant Guide | Dr. Smile Dental Group"
  description="A complete guide to dental implants: what they are, the procedure, recovery, and how they compare to other tooth replacement options."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Dental Implant Guide</p>
      <h1>Probing the Intricacies of Permanent Tooth Replacement</h1>

      <p>Dental implants represent a transformative solution in modern dentistry, providing patients with a reliable and long-lasting alternative to missing or damaged teeth. The perfect blend of both restorative and cosmetic dentistry, this dental efficacy solution has changed the way we think about tooth replacement.</p>

      <h2>What Are Dental Implants?</h2>
      <p>Dental implants are small posts, typically made of titanium, that are surgically placed into the jawbone. They serve as artificial tooth roots, providing a stable foundation for replacement teeth (crowns, bridges, or dentures).</p>

      <h2>The Implant Procedure</h2>
      <p><strong>Step 1: Consultation and Planning.</strong> Your dentist will examine your oral health, take X-rays or 3D scans, and create a personalized treatment plan.</p>
      <p><strong>Step 2: Implant Placement.</strong> The titanium post is surgically inserted into the jawbone. This procedure is typically performed under local anesthesia.</p>
      <p><strong>Step 3: Osseointegration.</strong> Over the next 3–6 months, the implant fuses with the jawbone, creating a strong, stable foundation.</p>
      <p><strong>Step 4: Abutment and Crown.</strong> Once the implant has integrated, an abutment is attached, and a custom crown is placed on top.</p>

      <h2>Benefits of Dental Implants</h2>
      <p><strong>Natural Appearance:</strong> Implants look and feel like natural teeth.</p>
      <p><strong>Permanent Solution:</strong> With proper care, implants can last a lifetime.</p>
      <p><strong>Preserves Jawbone:</strong> Unlike dentures, implants stimulate the bone and prevent resorption.</p>
      <p><strong>Improves Speech:</strong> Implants don't slip like dentures, so you can speak confidently.</p>
      <p><strong>Protects Adjacent Teeth:</strong> Unlike bridges, implants don't require grinding down neighboring teeth.</p>

      <h2>Recovery and Aftercare</h2>
      <p>Most patients experience mild swelling and discomfort for a few days after the procedure. Over-the-counter pain relievers are usually sufficient. Follow your dentist's aftercare instructions to ensure proper healing.</p>

      <div class="guide-cta">
        <h2>Considering Implants?</h2>
        <p>Our implant team would love to answer your questions.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .guide-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .guide-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/dental-veneers-guide.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Dental Veneers Guide | Dr. Smile Dental Group"
  description="A complete guide to dental veneers: what they are, the procedure, costs, and how to care for them."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Dental Veneers</p>
      <h1>The Art and Science of a Perfect Smile</h1>

      <p>Dental veneers are a cornerstone of modern cosmetic dentistry, offering a minimally invasive yet highly effective solution for transforming the appearance of teeth. Whether addressing discoloration, chips, gaps, or minor misalignments, veneers provide a natural-looking, long-lasting result.</p>

      <h2>What Are Dental Veneers?</h2>
      <p>Veneers are thin shells of porcelain or composite resin that are bonded to the front surface of your teeth. They are custom-made to match the color, shape, and size of your natural teeth, creating a seamless, natural-looking result.</p>

      <h2>Types of Veneers</h2>
      <p><strong>Porcelain Veneers:</strong> Durable, stain-resistant, and highly natural-looking. They require slightly more tooth preparation than composite veneers.</p>
      <p><strong>Composite Veneers:</strong> Made from tooth-colored resin material. They are less expensive and can often be placed in a single visit, but they are not as durable as porcelain.</p>

      <h2>The Veneer Procedure</h2>
      <p><strong>Step 1: Consultation.</strong> Your dentist will discuss your goals, examine your teeth, and create a treatment plan.</p>
      <p><strong>Step 2: Preparation.</strong> A small amount of enamel is removed from the front surface of the teeth to make room for the veneers.</p>
      <p><strong>Step 3: Impressions.</strong> Impressions of your teeth are taken and sent to a dental laboratory to fabricate the custom veneers.</p>
      <p><strong>Step 4: Placement.</strong> The veneers are bonded to your teeth using a special dental cement. The bond is cured with a special light.</p>

      <h2>Caring for Your Veneers</h2>
      <p><strong>Brush and floss</strong> twice daily, just as you would with natural teeth.</p>
      <p><strong>Avoid hard foods</strong> like ice, nuts, and hard candy, which can chip or crack veneers.</p>
      <p><strong>Limit staining foods and drinks</strong> like coffee, tea, red wine, and tobacco.</p>
      <p><strong>Wear a nightguard</strong> if you grind your teeth at night.</p>
      <p><strong>Visit your dentist</strong> regularly for check-ups and cleanings.</p>

      <div class="guide-cta">
        <h2>Ready for a Veneer Consultation?</h2>
        <p>Our cosmetic team would love to show you what's possible.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .guide-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .guide-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 3: Create `src/pages/dental-invisalign-treatment.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Invisalign Treatment Guide | Dr. Smile Dental Group"
  description="A complete guide to Invisalign: how it works, treatment duration, costs, and how it compares to traditional braces."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Invisalign Treatment</p>
      <h1>Modern Dental Efficacy for a Straighter Smile</h1>

      <p>Invisalign represents a breakthrough in orthodontic treatment, offering a discreet and comfortable alternative to traditional metal braces. This treatment uses a series of custom-made, clear aligners that gradually straighten your teeth over time.</p>

      <h2>How Does Invisalign Work?</h2>
      <p>Invisalign treatment begins with a 3D scan of your teeth. Our team uses this scan to create a personalized treatment plan that shows you the expected results at each stage of your treatment. You'll receive a series of clear aligners, each worn for about 1–2 weeks before moving to the next in the series.</p>

      <h2>Treatment Duration</h2>
      <p>Most Invisalign treatments last between 6 and 18 months, depending on the complexity of your case. Your orthodontist will give you a more precise estimate during your consultation.</p>

      <h2>Invisalign vs. Traditional Braces</h2>
      <p><strong>Visibility:</strong> Invisalign aligners are nearly invisible, while metal braces are clearly visible.</p>
      <p><strong>Comfort:</strong> Invisalign has no brackets or wires, so there's less irritation to the gums and cheeks.</p>
      <p><strong>Diet:</strong> You can remove Invisalign aligners to eat, so there are no dietary restrictions. With braces, you must avoid hard, sticky, or crunchy foods.</p>
      <p><strong>Oral Hygiene:</strong> You can brush and floss normally with Invisalign. With braces, cleaning around brackets and wires is more challenging.</p>

      <h2>Who is Invisalign Right For?</h2>
      <p>Invisalign is suitable for most orthodontic issues, including crowding, gaps, overbites, underbites, and crossbites. However, some complex cases may be better suited to traditional braces. Your orthodontist will evaluate your case and recommend the best option.</p>

      <div class="guide-cta">
        <h2>Ready to Start Your Invisalign Journey?</h2>
        <p>Schedule a consultation to see if Invisalign is right for you.</p>
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .guide-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .guide-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
ls dist/dental-implant-guide/index.html dist/dental-veneers-guide/index.html dist/dental-invisalign-treatment/index.html
```

Expected: All three files exist

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add 3 dental guide pages"
```

---

### Task 8: Financing and Contact Pages

**Files:**
- Create: `src/pages/financing.astro`
- Create: `src/pages/contact.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2)
- Produces: Two complete pages. Contact page has a Google Form placeholder.

- [ ] **Step 1: Create `src/pages/financing.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
---

<BaseLayout
  title="Dental Financing & Insurance | Dr. Smile Dental Group"
  description="Affordable dental care with flexible financing options and insurance acceptance. Quality care for all."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Financing</p>
      <h1>Explore Dental Financing & Insurance Benefits</h1>

      <p><strong>Affordable Care</strong></p>
      <p>At Dr. Smile Dental Group, we believe that everyone deserves quality dental care, so we strive to make dental care accessible and affordable for all of our patients. Our fees are competitive within our industry and reflect the quality of care and technology we provide.</p>

      <h2>Insurance</h2>
      <p>We accept most major dental insurance plans. Our team will work with your insurance provider to maximize your benefits and minimize your out-of-pocket costs. Contact our office to verify your specific plan coverage.</p>

      <h2>Financing Options</h2>
      <p>For patients without insurance or those needing treatment beyond their insurance coverage, we offer flexible financing options through third-party lenders. These plans allow you to spread the cost of your treatment over monthly payments that fit your budget.</p>

      <h2>Membership Plans</h2>
      <p>We also offer membership plans for patients who don't have dental insurance. These plans provide discounted rates on preventive and basic dental services, making ongoing care more affordable.</p>

      <div class="financing-cta">
        <h2>Questions About Financing?</h2>
        <p>Our team is happy to help you find the right option.</p>
        <a href={base + 'contact/'} class="btn">Contact Us</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .financing-cta {
    margin-top: 48px;
    padding: 32px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
    text-align: center;
  }
  .financing-cta p {
    margin-bottom: 16px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/contact.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
const base = Astro.base;
const googleFormUrl = 'https://forms.gle/PLACEHOLDER';
---

<BaseLayout
  title="Contact Us | Dr. Smile Dental Group"
  description="Schedule a consultation or get in touch with Dr. Smile Dental Group. Call (310) 388-3669."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Let's Connect!</p>
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
          <iframe
            src={googleFormUrl}
            width="100%"
            height="600"
            style="border: none;"
            loading="lazy"
            title="Dr. Smile Dental Group Contact Form"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin-top: 32px;
  }
  .contact-info h2 {
    font-size: 1.25rem;
    margin-top: 24px;
    margin-bottom: 8px;
  }
  .contact-info h2:first-child {
    margin-top: 0;
  }
  .contact-info p {
    color: var(--color-text-light);
    margin-bottom: 8px;
  }
  .contact-locations {
    list-style: none;
    padding: 0;
  }
  .contact-locations li {
    padding: 4px 0;
    color: var(--color-text-light);
  }
  .contact-form h2 {
    margin-bottom: 8px;
  }
  .contact-form p {
    color: var(--color-text-light);
    margin-bottom: 16px;
  }
  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
ls dist/financing/index.html dist/contact/index.html
```

Expected: Both files exist

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add financing and contact pages with Google Form placeholder"
```

---

### Task 9: Legal Pages (Privacy Policy, Terms)

**Files:**
- Create: `src/pages/privacy-policy.astro`
- Create: `src/pages/terms-and-conditions.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2)
- Produces: Two legal pages

- [ ] **Step 1: Create `src/pages/privacy-policy.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
---

<BaseLayout
  title="Privacy Policy | Dr. Smile Dental Group"
  description="How Dr. Smile Dental Group collects, uses, and protects your personal information."
>
  <section class="section">
    <div class="container">
      <h1>Privacy Policy</h1>
      <p>Last updated: 2024</p>

      <p>At Dr. Smile Dental Group, accessible from https://doctorsmileonline.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document describes the types of information that is collected and used by doctorsmileonline.com.</p>

      <h2>Log Files</h2>
      <p>Dr. Smile Dental Group follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are linked to no personal information such as e-mail addresses and accounts and are used to analyze trends, administer the site, track movement around the site, and gather demographic information.</p>

      <h2>Cookies and Web Beacons</h2>
      <p>Like many websites, Dr. Smile Dental Group uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that access or visit. The cookies are also used to understand traffic and to track the behavior of visitors to this website. You can choose to disable cookies through your individual browser options. To learn more about cookies, visit the Cookies article on Wikipedia.</p>

      <h2>Google DoubleClick DART Cookie</h2>
      <p>Google is one of third-party vendors on our site that uses cookies. Their use of the DART cookie enables them to serve ads to our visitors based on their visit to doctorsmileonline.com and other sites on the Internet. Users may decline the use of the DART cookie by visiting the Google ad and content network privacy policy.</p>

      <h2>Third Party Privacy Policies</h2>
      <p>Dr. Smile Dental Group's Privacy Policy does not apply to other advertisers or websites. Thus, we advise our users to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and about how to opt-out of certain options. You can visit this link to opt-out of individual third-party ad servers.</p>

      <h2>Children's Information</h2>
      <p>Another part of our priority is protecting the safety of children online. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

      <h2>Online Privacy Policy</h2>
      <p>You can review our rules and policies on the use of personal information on the website. Dr. Smile Dental Group collects the following types of information: IP address, e-mail address, physical address, date of birth, and medical information. Personal information is used for the following purposes: to provide information to users; to send periodic e-mails; to respond to your inquiries; to process your orders; to fulfill your order; to process payments; to provide customer support; and to request relevant suggestions and information.</p>

      <h2>Consent</h2>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

      <h2>Acceptance of This Policy</h2>
      <p>If you have any questions about this Privacy Policy, please contact us.</p>
    </div>
  </section>
</BaseLayout>

<style>
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/terms-and-conditions.astro`</h1>

```astro
---
import BaseLayout from '../layouts/Base.astro';
---

<BaseLayout
  title="Terms and Conditions | Dr. Smile Dental Group"
  description="Terms and conditions for using the Dr. Smile Dental Group website."
>
  <section class="section">
    <div class="container">
      <h1>Terms and Conditions</h1>
      <p>Last updated: 2024</p>

      <p>By accessing this website, we are deemed to accept these terms and conditions. Do not continue to use doctorsmileonline.com if you do not agree to all of the terms and conditions stated on this page.</p>

      <h2>License</h2>
      <p>The content on this website is licensed under the Creative Commons Attribution 4.0 International License. You are free to share and adapt the material for any purpose, even commercially, as long as you give appropriate credit, provide a link to the license, and indicate if changes were made.</p>

      <h2>Intellectual Property</h2>
      <p>All intellectual property rights are reserved by Dr. Smile Dental Group. Any unauthorized use of this website or its content may result in legal action.</p>

      <h2>Disclaimer</h2>
      <p>The information on this website is for general informational purposes only. All information provided is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the website.</p>

      <h2>Limitations</h2>
      <p>In no event shall Dr. Smile Dental Group be liable for any damages arising out of or in connection with the use of this website. Your use of this website and any reliance on any information you obtain on this website is at your own risk. We will not be liable for any losses or damages, including without limitation, indirect or consequential losses or damages, or any loss of profit, income, data, goodwill, or other intangible losses.</p>

      <h2>Accuracy of Information</h2>
      <p>The information on this website is provided in good faith, but we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the website. Under no circumstance shall we be liable for any loss or damage of any kind incurred as a result of using the site.</p>

      <h2>Links to Other Websites</h2>
      <p>This website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to read the terms and conditions and privacy policy of every site you visit.</p>

      <h2>Consent</h2>
      <p>By using our website, you hereby consent to our Terms and Conditions and agree to its terms.</p>
    </div>
  </section>
</BaseLayout>

<style>
  .section p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .section h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
</style>
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
ls dist/privacy-policy/index.html dist/terms-and-conditions/index.html
```

Expected: Both files exist

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add privacy policy and terms & conditions pages"
```

---

### Task 10: Blog (Content Collection + 100 Posts)

**Files:**
- Create: `src/content/blog/config.ts`
- Create: `src/content/blog/` (100 Markdown files)
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/important-announcements.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2)
- Produces: Blog index, individual post pages, announcements page

- [ ] **Step 1: Create `src/content/blog/config.ts`</h1>

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.string().optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Scrape all 100 blog posts from the live site and generate Markdown files**

Write a Python script to scrape each post's title, date, and body content, then save as Markdown files in `src/content/blog/`.

```python
#!/usr/bin/env python3
import re
import os
import urllib.request
import html
from datetime import datetime

BASE = "https://doctorsmileonline.com"
OUT_DIR = "src/content/blog"
os.makedirs(OUT_DIR, exist_ok=True)

# Get list of all blog post slugs from the blog index
with open("/tmp/opencode/blog.html") as f:
    blog_html = f.read()

known = {
    'about','faqs','services','location','financing','contact','blog',
    'privacy-policy','terms-and-conditions','important-announcements',
    'dental-implant-guide','dental-veneers-guide','dental-invisalign-treatment',
    'oral-surgery','cosmetic-care','invisalign-orthodontcs',
    'all-on-four-prosthetics','pain-tramadol','testimonial','cta-form','category'
}

links = re.findall(r'href="https://doctorsmileonline\.com/([a-z0-9-]+)/"', blog_html)
slugs = sorted(set(s for s in links if s not in known and 'category' not in s))

print(f"Found {len(slugs)} blog posts")

for slug in slugs:
    url = f"{BASE}/{slug}/"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            page_html = resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"  SKIP {slug}: {e}")
        continue

    # Extract title
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', page_html, re.DOTALL)
    title = html.unescape(re.sub(r'<[^>]+>', '', title_match.group(1)).strip()) if title_match else slug.replace('-', ' ').title()

    # Extract date
    date_match = re.search(r'datetime="([^"]+)"', page_html)
    if not date_match:
        date_match = re.search(r'<time[^>]*>([^<]+)</time>', page_html)
    pub_date = date_match.group(1).strip() if date_match else "2024-01-01"
    # Normalize to YYYY-MM-DD
    try:
        dt = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
        pub_date = dt.strftime('%Y-%m-%d')
    except:
        pub_date = "2024-01-01"

    # Extract main content
    content_match = re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>', page_html, re.DOTALL)
    if not content_match:
        content_match = re.search(r'<article[^>]*>(.*?)</article>', page_html, re.DOTALL)
    if not content_match:
        # Fallback: get the main content area
        content_match = re.search(r'<main[^>]*>(.*?)</main>', page_html, re.DOTALL)

    raw_content = content_match.group(1) if content_match else ""

    # Convert HTML to simple Markdown
    # Remove nav, scripts, styles
    raw_content = re.sub(r'<(script|style|nav|header|footer)[^>]*>.*?</\1>', '', raw_content, flags=re.DOTALL)
    # Convert headers
    raw_content = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n## \1\n', raw_content, flags=re.DOTALL)
    raw_content = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n### \1\n', raw_content, flags=re.DOTALL)
    # Convert bold/italic
    raw_content = re.sub(r'<strong>(.*?)</strong>', r'**\1**', raw_content, flags=re.DOTALL)
    raw_content = re.sub(r'<em>(.*?)</em>', r'*\1*', raw_content, flags=re.DOTALL)
    # Convert links
    raw_content = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', raw_content, flags=re.DOTALL)
    # Convert images (keep them)
    raw_content = re.sub(r'<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*/?>', r'![\2](\1)', raw_content, flags=re.DOTALL)
    # Convert paragraphs
    raw_content = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', raw_content, flags=re.DOTALL)
    # Convert lists
    raw_content = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1', raw_content, flags=re.DOTALL)
    # Remove remaining tags
    raw_content = re.sub(r'<[^>]+>', '', raw_content)
    # Clean up
    raw_content = html.unescape(raw_content)
    raw_content = re.sub(r'\n{3,}', '\n\n', raw_content).strip()

    # Write Markdown file
    md = f"""---
title: "{title.replace('"', '\\"')}"
description: ""
pubDate: {pub_date}
---

{raw_content}
"""
    filepath = os.path.join(OUT_DIR, f"{slug}.md")
    with open(filepath, 'w') as f:
        f.write(md)
    print(f"  OK {slug}")

print("Done")
```

Run it:
```bash
python3 /tmp/opencode/scrape_blog.py
```

Expected: 100 Markdown files in `src/content/blog/`

- [ ] **Step 3: Create `src/pages/blog/index.astro`</h1>

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/Base.astro';

const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const base = Astro.base;
---

<BaseLayout
  title="Blog | Dr. Smile Dental Group"
  description="Dental health tips, treatment guides, and news from Dr. Smile Dental Group."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Blog</p>
      <h1>Dental Health & News</h1>
      <p>Tips, guides, and updates from the Dr. Smile team.</p>

      <div class="blog-grid">
        {posts.map((post) => (
          <article class="blog-card">
            <h2>
              <a href={base + `blog/${post.slug}/`}>{post.data.title}</a>
            </h2>
            <time datetime={post.data.pubDate.toISOString()}>
              {post.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </article>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  .blog-card {
    padding: 24px;
    background: var(--color-bg-alt);
    border-radius: var(--radius);
  }
  .blog-card h2 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  .blog-card h2 a {
    color: var(--color-primary);
  }
  .blog-card h2 a:hover {
    color: var(--color-accent);
  }
  .blog-card time {
    color: var(--color-text-light);
    font-size: 0.875rem;
  }
  @media (max-width: 768px) {
    .blog-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 4: Create `src/pages/blog/[...slug].astro`</h1>

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const base = Astro.base;
---

<BaseLayout
  title={`${post.data.title} | Dr. Smile Dental Group`}
  description={post.data.description || post.data.title}
>
  <article class="section">
    <div class="container blog-post">
      <p class="eyebrow">Blog</p>
      <h1>{post.data.title}</h1>
      <time datetime={post.data.pubDate.toISOString()}>
        {post.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <div class="post-content">
        <Content />
      </div>
      <div class="post-cta">
        <a href={base + 'contact/'} class="btn">Schedule a Consult</a>
      </div>
    </div>
  </article>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .blog-post h1 {
    margin-bottom: 8px;
  }
  .blog-post time {
    color: var(--color-text-light);
    display: block;
    margin-bottom: 32px;
  }
  .post-content {
    line-height: 1.8;
  }
  .post-content p {
    margin-bottom: 16px;
    color: var(--color-text-light);
  }
  .post-content h2 {
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .post-content h3 {
    margin-top: 24px;
    margin-bottom: 8px;
  }
  .post-content ul, .post-content ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }
  .post-content li {
    margin-bottom: 8px;
    color: var(--color-text-light);
  }
  .post-content a {
    color: var(--color-accent);
  }
  .post-content img {
    margin: 24px 0;
    border-radius: var(--radius);
  }
  .post-cta {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }
</style>
```

- [ ] **Step 5: Create `src/pages/important-announcements.astro`</h1>

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/Base.astro';

const posts = (await getCollection('blog'))
  .filter((post) => post.data.category === 'announcements')
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const base = Astro.base;
---

<BaseLayout
  title="Important Announcements | Dr. Smile Dental Group"
  description="Important announcements and updates from Dr. Smile Dental Group."
>
  <section class="section">
    <div class="container">
      <p class="eyebrow">Announcements</p>
      <h1>Important Announcements</h1>

      {posts.length === 0 && (
        <p>No announcements at this time. Check back soon.</p>
      )}

      <div class="announcement-list">
        {posts.map((post) => (
          <article class="announcement">
            <h2>
              <a href={base + `blog/${post.slug}/`}>{post.data.title}</a>
            </h2>
            <time datetime={post.data.pubDate.toISOString()}>
              {post.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </article>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin-bottom: 8px;
  }
  .announcement-list {
    margin-top: 32px;
  }
  .announcement {
    padding: 16px 0;
    border-bottom: 1px solid var(--color-border);
  }
  .announcement h2 {
    font-size: 1.1rem;
    margin-bottom: 4px;
  }
  .announcement h2 a {
    color: var(--color-primary);
  }
  .announcement h2 a:hover {
    color: var(--color-accent);
  }
  .announcement time {
    color: var(--color-text-light);
    font-size: 0.875rem;
  }
</style>
```

- [ ] **Step 6: Build and verify**

```bash
npm run build
# Count blog post pages
ls dist/blog/ | wc -l
# Should be ~101 (100 posts + index.html)
ls dist/important-announcements/index.html
```

Expected: ~101 entries in `dist/blog/`, announcements page exists

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add blog with 100 posts and important announcements page"
```

---

### Task 11: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: Working Astro build (Tasks 1–10)
- Produces: Automated deployment to GitHub Pages on push to `main`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`</h1>

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the workflow file is valid YAML**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml')); print('Valid YAML')"
```

Expected: `Valid YAML`

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "feat: add GitHub Actions workflow for Pages deployment"
```

---

### Task 12: Final Verification and Cleanup

**Files:**
- Modify: `astro.config.mjs` (if needed)
- Modify: `src/pages/contact.astro` (update GA4 ID and Google Form URL when provided)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Final verified build

- [ ] **Step 1: Run a full build**

```bash
npm run build
```

Expected: No errors, `dist/` contains all pages

- [ ] **Step 2: Verify all pages exist in the build output**

```bash
for page in index about faqs services oral-surgery cosmetic-care invisalign-orthodontcs all-on-four-prosthetics dental-implant-guide dental-veneers-guide dental-invisalign-treatment location financing contact privacy-policy terms-and-conditions blog important-announcements; do
  if [ -f "dist/$page/index.html" ]; then
    echo "OK: $page"
  else
    echo "MISSING: $page"
  fi
done
```

Expected: All 16 pages show `OK`

- [ ] **Step 3: Verify sitemap was generated**

```bash
ls dist/sitemap-index.xml
cat dist/sitemap-0.xml | head -20
```

Expected: Sitemap files exist with URLs

- [ ] **Step 4: Verify robots.txt**

```bash
cat dist/robots.txt
```

Expected: Contains `Sitemap:` line pointing to the sitemap

- [ ] **Step 5: Check for console errors in the HTML**

```bash
# Verify no broken image references
grep -oP 'src="[^"]*"' dist/index.html | while read -r src; do
  img_path=$(echo "$src" | sed 's/src="//;s/"//')
  if [ ! -f "dist/$img_path" ] && [ ! -f "dist/images/$(basename $img_path)" ]; then
    echo "WARNING: Image not found: $img_path"
  fi
done
```

Expected: No warnings (or only warnings for external URLs)

- [ ] **Step 6: Final commit and tag**

```bash
git add .
git commit -m "chore: final verification and cleanup"
git tag v1.0.0
```

---

## Self-Review

**Spec coverage:**
- ✅ Static Astro site — Tasks 1–12
- ✅ High Lighthouse (no JS except GA4, optimized images, semantic HTML) — Tasks 1, 2, 4
- ✅ Google Form placeholder — Task 8
- ✅ 17 pages — Tasks 4–9, 10
- ✅ Blog with 100 posts — Task 10
- ✅ GitHub Pages deployment — Task 11
- ✅ Subdirectory base path — Task 1
- ✅ GA4 — Task 2
- ✅ Structured data — Task 2
- ✅ Sitemap — Tasks 1, 12
- ✅ robots.txt — Task 1

**Placeholder scan:**
- Google Form URL: `https://forms.gle/PLACEHOLDER` — intentional, user will provide later
- GA4 ID: `G-XXXXXXXXXX` — intentional, user will provide later
- No other TBDs or TODOs

**Type consistency:**
- `BaseLayout` props: `title`, `description`, `canonicalUrl` — consistent across all pages
- `ServiceCard` props: `image`, `title`, `description`, `href` — consistent
- `Testimonial` props: `quote`, `author` — consistent
- `CtaBanner` props: `heading`, `subheading`, `buttonLabel`, `buttonHref` — consistent
- Blog collection schema: `title`, `description`, `pubDate`, `category` — consistent
