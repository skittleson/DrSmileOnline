# Dr. Smile Dental Group — Website Design Research Report

Research date: 2026-08-17
Scope: US dental practice websites (2024–2026), award-winning and high-performing sites,
bilingual EN/ES patterns, WCAG 2.1 AA / ADA / HHS accessibility requirements.
Goal: inform a redesign of a multi-location Southern California dental group.

Method: live fetches of real sites (Aspen Dental, 1010 Dental, Invisalign, Tend Dental,
Skyline Dental, Grand Street Dental, West Coast Dental `/es/`, Happysmile LA `/en/`),
cross-referenced against trend roundups (HubSpot, DDSRank, RevenueWell, Insidea,
Dentplicity) and the W3C/DOJ/HHS accessibility standards.

> Note on sources: several "best of" listicles (HubSpot, DDSRank) rank dental-marketing
> agencies' own sites as examples. Treat their named *practices* (Tend, Skyline, Grand
> Street, etc.) as the real design references, not the agencies.

---

## 1. Top design patterns observed (ranked by frequency across sites)

| # | Pattern | Where seen | Why it works |
|---|---------|-----------|--------------|
| 1 | **Persistent top utility bar** — logo left, phone number, "Patient Portal" / "My Chart" login, and a primary "Book / Schedule" button always visible | Aspen, Invisalign, Grand Street, Tend, Happysmile | The two highest-value actions (call, book) are never more than one tap away. |
| 2 | **Location picker / "Find a dentist near you"** as a first-class nav item, with per-location subpages | Aspen (city+ZIP), Tend (city list), West Coast, Happysmile | Multi-location groups must resolve "which office?" before any service page. |
| 3 | **Full-bleed photographic hero** with a single H1, one sub-line, and ONE primary CTA | Invisalign, Tend, Skyline, Grand Street | Calm, human, trust-building; avoids the "amateur" wall-of-text hero. |
| 4 | **Services presented as icon+image cards in a grid** (not a text list) | 1010, Skyline, Happysmile, Tend | Scannable; each card is a deep link that doubles as an SEO page. |
| 5 | **Trust-signal band** — star rating + review count + insurance logos + accreditations | Aspen (4.6★/495), Skyline (Aetna/Cigna/Humana row), 1010 (review wall) | 77% of patients trust Google reviews; insurance logos lower the "will they take my plan?" barrier. |
| 6 | **Before/After or "Smile Gallery"** with a real transformation carousel | Grand Street, Happysmile, 1010, Invisalign (results) | The single most persuasive proof in cosmetic dentistry. |
| 7 | **Meet-the-doctor / team section** with headshots + bio links | 1010, Skyline, Happysmile, Tend | Humanizes the practice; patients choose the person, not the brand. |
| 8 | **New-patient offer / insurance & financing callout** near the fold | Skyline ("$155 new patient", CareCredit), Happysmile ("0% up to 24 mo") | Removes the #1 objection (cost) early. |
| 9 | **Sticky mobile CTA** (floating "Book" / "Call" bar) on small screens | Aspen, Grand Street, Tend | Thumb-reachable conversion on mobile, where most local search happens. |
| 10 | **Patient education / blog** as a content hub | 1010, Skyline, Happysmile | Long-tail SEO + authority; "tooth pain," "broken tooth," "Invisalign cost." |

Recurring micro-patterns:
- **Empathy-first copy** ("no judgment ever," "whether it's been 6 months or 6 years") — Tend.
- **Numbered "How it works" steps** (Invisalign 3-step) to de-risk a big-ticket decision.
- **Video testimonial / Instagram wall** (Invisalign, Grand Street) for social proof.
- **Skip-to-content link** and **"Accessible Version" toggle** (Tend) — accessibility as a visible feature.
- **Footer with hours, address, map, phone, privacy + accessibility statement** (Grand Street, 1010).

---

## 2. Color palette recommendations

Dental design clusters into three families. For a multi-location SC group that must read
"clean + trustworthy + a little premium," lead with a **cool clinical teal/blue** and a
warm accent.

### Primary recommendation (clean, modern, trustworthy)
| Role | Hex | Use |
|------|-----|-----|
| Primary brand (teal-blue) | `#1B6CA8` | Headings, primary buttons, nav |
| Deep navy (contrast/anchor) | `#0E2A47` | Footer, dark sections, body emphasis |
| Accent (coral/coral-teal) | `#FF7A59` | Primary CTA buttons, highlights, stars |
| Light surface | `#F4F9FC` | Section backgrounds, cards |
| Neutral text | `#1F2933` | Body copy (≥ 7:1 on white) |
| White | `#FFFFFF` | Base background |

Why: blue/teal = clinical trust (dominant across Aspen, Invisalign, Skyline, 1010).
Coral accent (Invisalign's "popcorn" energy, Grand Street's warmth) gives a human,
non-cold CTA that outperforms a same-hue blue button on conversion.

### Alternate: premium/cosmetic (if Dr. Smile leans cosmetic)
- Charcoal `#22272E` + Gold `#C8A24A` + White (Dallas Dental Specialists model) — formal, high-end.

### Alternate: family-friendly (if pediatric-heavy)
- Soft teal `#7FD1C8` + Sun yellow `#FFD166` + White (Happysmile / pediatric model) — warm, welcoming.

**Rules:**
- Keep to 1 primary + 1 accent + neutrals. Do not mix all three families.
- CTA accent must contrast ≥ 4.5:1 against its background for text, ≥ 3:1 for the button fill.
- Avoid pure red for "error/urgent" if the brand accent is already warm — reserve red strictly for errors.

---

## 3. Typography recommendations

Observed pattern: **one humanist sans for everything, or a serif display + sans body.**
Dental sites overwhelmingly use clean geometric/humanist sans (trust + readability).

| Role | Recommendation | Rationale |
|------|----------------|-----------|
| Display / headings | **Fraunces** or **DM Serif Display** (serif) *or* **Plus Jakarta Sans / Poppins** (sans) | Serif display adds "boutique/premium" (Grand Street, Tend). Sans display adds "modern clinical" (Invisalign, Skyline). Pick one per brand. |
| Body | **Inter** or **Public Sans** | Excellent screen legibility, strong accessibility, variable weights. |
| Mono (optional, for phone/numbers) | **JetBrains Mono** (used sparingly) | Makes phone numbers feel "tappable/precise." |

**Scale (modular, 1.25 ratio):**
- H1: `clamp(2.25rem, 5vw, 3.5rem)` / line-height 1.1
- H2: `1.75rem` / 1.2
- H3: `1.25rem` / 1.3
- Body: `1.0625rem` (17px) / line-height 1.6 — 16px minimum for body.
- Small/meta: `0.875rem` (14px) minimum; never below 14px.

**Rules:**
- Max 2 typefaces. Max 3–4 weights (400/500/600/700).
- Line length 45–75ch. Body line-height ≥ 1.5.
- Don't set body text below 16px; don't rely on letter-spacing for small caps.

---

## 4. Layout / structure recommendations

### Information architecture (multi-location group)
```
Home
├─ Services (grouped, not flat)
│   ├─ General & Preventive
│   ├─ Cosmetic
│   ├─ Orthodontics (Invisalign)
│   ├─ Restorative / Implants
│   └─ Emergency
├─ About (Meet the Doctors, Team, Technology, Our Story)
├─ Locations (per-office page: hours, map, phone, directions, photos)
├─ Patient Resources
│   ├─ New Patients (offer, insurance, financing)
│   ├─ Patient Forms (online intake)
│   ├─ FAQ
│   └─ Blog / Patient Education
├─ Reviews / Before & After
└─ Contact
```

### Homepage section order (best-performing)
1. **Utility bar** — phone, portal login, language toggle, "Book" button.
2. **Hero** — full-bleed photo, H1 (outcome, not feature), sub-line, single CTA + secondary "Call."
3. **Trust band** — star rating + count, insurance logos, "In-network with most PPOs."
4. **Services grid** — 3–6 icon/image cards → deep links.
5. **Why choose us / differentiators** — 3–4 short benefit blocks (same-day crowns, sedation, weekend hours).
6. **Meet the doctors** — headshots + bio links.
7. **Before/After or Smile Gallery** (if cosmetic).
8. **Patient stories / testimonials** — 3 quotes w/ name + neighborhood (Tend pattern).
9. **New-patient offer + insurance/financing** callout.
10. **Location selector / map** (multi-location).
11. **Final CTA band** — "Ready to smile?" + Book/Call.
12. **Footer** — hours, addresses, phone, privacy, accessibility statement, social.

### Mobile navigation
- Hamburger → full-screen or slide-in menu; **keep "Book" and "Call" as always-visible buttons** (not buried in the menu).
- Sticky bottom CTA bar on scroll (Book + Call).
- Tap targets ≥ 44×44px (WCAG 2.5.8 minimum; 2.5.5 enhanced = 44px).
- Accordion for nested service submenus (avoid mega-menus on mobile).

### Patterns vs. anti-patterns
- ✅ Cards/grids for services; carousels for testimonials/before-after (with pause control).
- ❌ Auto-playing video without a pause button (WCAG 2.2.2).
- ❌ Walls of text in the hero; "Web 2.0" drop shadows; stock-photo hand-pointing.
- ❌ More than one primary CTA competing in a single viewport.

---

## 5. i18n (EN/ES) implementation patterns

**Verified live patterns in Southern California:**
- **West Coast Dental** (multi-location CA): Spanish served on a **`/es/` subdirectory**
  (`westcoastdental.com/es/...`), full localized nav, insurance/financing pages, Medi-Cal
  page. English is the default root.
- **Happysmile LA**: English on **`/en/`**, Spanish on the **root** (Spanish-first), with a
  flag-based language toggle in the nav (TranslatePress plugin).
- **San Jose Dental Clinic**: bilingual on one page ("Hablamos español" + EN/ES copy inline).

### Recommended approach for Dr. Smile
1. **URL structure — subdirectory (preferred):** `drsmile.com/` (EN) + `drsmile.com/es/` (ES).
   - Both languages on the **same domain** (not subdomains) — keeps link equity, simpler.
   - EN as default root; ES under `/es/`. (West Coast Dental model — the closest analog.)
   - Alternative if the market is majority-Spanish-first: Spanish at root, English under `/en/`
     (Happysmile model). Decide by patient demographics per location.
2. **`hreflang` tags** on every page pair:
   ```html
   <link rel="alternate" hreflang="en" href="https://drsmile.com/services/" />
   <link rel="alternate" hreflang="es" href="https://drsmile.com/es/servicios/" />
   <link rel="alternate" hreflang="x-default" href="https://drsmile.com/services/" />
   ```
3. **Language toggle** — persistent, in the utility bar (EN | ES), **links to the
   equivalent page in the other language** (not just home). Use `<button>`/`<a>` with
   `aria-label="Cambiar a español"` / `"Switch to English"`. Show current language.
4. **Content strategy — localization, not translation:**
   - Professionally written/natively reviewed Spanish for: services, new-patient,
     insurance/financing, contact, FAQ. (Dentplicity: avoid Google Translate widgets.)
   - Localize, don't word-for-word: tone, idioms, and which services to emphasize can differ.
   - Localize the **contact path**: forms, click-to-call, online scheduling, and
     confirmation messages must all work in Spanish.
   - **Spanish keyword research** — don't translate the EN keyword list; research how
     Spanish-speaking patients actually phrase needs ("dentista cerca de mí," "implantes dentales").
   - **Google Business Profile**: note bilingual capability; respond to Spanish reviews in Spanish.
   - **Authentic representation**: photos/testimonials that reflect the community (with permission).
5. **Operational parity** — the website promising Spanish service must match the front desk:
   bilingual staff or reliable interpretation, translated intake/consent forms, Spanish phone handling.
6. **`<html lang="en">` / `<html lang="es">`** on every page; mark any inline mixed-language
   span with `lang="es"` (WCAG 3.1.2).

---

## 6. Accessibility checklist (WCAG 2.1 AA, healthcare-specific)

**Regulatory context (important for a dental group):**
- **HHS / Section 504 (45 CFR 84.84)**: recipients of federal financial assistance must make
  web content & mobile apps conform to **WCAG 2.1 Level AA**. Enforceable from **May 11, 2026**
  (large recipients ≥15 employees). Dental practices receiving Medicare/Medicaid funds are in scope.
- **ADA Title III**: private practices (even non-federal) face web-accessibility litigation;
  WCAG 2.1 AA is the de-facto defense standard.
- **Accessibility widgets/overlays are not sufficient** (HHS + DOJ guidance repeatedly).

### Perceivable
- [ ] **1.1.1** — All meaningful images have `alt` text (doctor headshots, service icons, before/after). Decorative images `alt=""`.
- [ ] **1.2.2** — Any pre-recorded video (testimonials, "how it works") has **captions**.
- [ ] **1.2.5** — Video with audio has **audio description** (or a text alternative).
- [ ] **1.3.1** — Headings used semantically (`h1`→`h6`), landmarks (`nav`, `main`, `footer`).
- [ ] **1.4.1** — Color is never the only indicator (e.g., "new patient" badge also has text/icon).
- [ ] **1.4.3** — Text contrast ≥ **4.5:1** (normal) / **3:1** (large). Verify brand teal `#1B6CA8` on white = ~5.3:1 ✅; coral `#FF7A59` on white FAILS for text — use only for fills/large elements.
- [ ] **1.4.4** — Text resizable to 200% without loss of function (use `rem`/`em`, no fixed `px` on text).
- [ ] **1.4.5** — No images of text (logos OK if text alternative present; never body copy as image).
- [ ] **1.4.10** — Reflow at 320px width, no 2D scrolling (except where justified).
- [ ] **1.4.11** — Non-text contrast (UI borders, icons, focus rings) ≥ **3:1**.
- [ ] **1.4.12** — Text spacing overrides (line-height 1.5, letter-spacing 0.12em, etc.) don't break layout.
- [ ] **1.4.13** — Hover/focus content dismissible, persistent, movable.

### Operable
- [ ] **2.1.1** — **All functionality keyboard-operable** (menus, carousels, modals, language toggle, booking widget).
- [ ] **2.1.2** — No keyboard traps (booking modals must be escapable and return focus).
- [ ] **2.2.2** — **Any autoplaying carousel/video has Pause/Stop/Hide** (testimonials, before-after).
- [ ] **2.4.1** — **"Skip to main content" link** as first focusable element (Tend, West Coast both have it).
- [ ] **2.4.2** — Every page has a descriptive `<title>`.
- [ ] **2.4.3** — Logical focus order (don't let a floating CTA steal early focus).
- [ ] **2.4.4** — Link purpose clear in context ("Book an appointment" not "click here").
- [ ] **2.4.7** — **Visible focus indicator** on all interactive elements (high-contrast ring).
- [ ] **2.4.11** — Focus not obscured by sticky headers/bottom CTA bar (common failure with sticky CTAs).
- [ ] **2.4.12** — Focus not obscured (enhanced) — fully visible.
- [ ] **2.5.7** — No drag-only interactions (before/after sliders must have a non-drag control).
- [ ] **2.5.8** — **Target size ≥ 24×24px** (AA); aim 44×44px for primary CTAs.

### Understandable
- [ ] **3.1.1** — `<html lang="en">` (or `es`) set.
- [ ] **3.1.2** — Inline Spanish on EN pages marked `lang="es"` (and vice versa).
- [ ] **3.1.5** — Reading level: patient-facing copy at ~8th-grade level; define/expand clinical jargon.
- [ ] **3.2.3** — **Consistent navigation** across all pages/locations.
- [ ] **3.2.4** — **Consistent identification** of components (the "Book" button looks/behaves the same everywhere).
- [ ] **3.3.1** — Form errors **identified in text** (not color only).
- [ ] **3.3.2** — **Labels** associated with all inputs (`<label for>`, not placeholder-as-label).
- [ ] **3.3.3** — Error suggestions ("Enter a 10-digit phone number").
- [ ] **3.3.4** — **Error prevention for legal/financial/data** — booking & payment forms: confirm before submit, allow back/edit, spell-check not required but confirmations required. **Critical for a healthcare intake form.**

### Robust
- [ ] **4.1.2** — All UI components expose **name, role, value** (custom dropdowns, carousels, tabs need proper ARIA).
- [ ] **4.1.3** — Status messages (form success, "booking confirmed") announced via `aria-live`/`role="status"`.

### Healthcare-specific additions
- [ ] **HIPAA-aware booking/forms** — don't collect PHI in analytics pixels; consent language.
- [ ] **Plain-language consent + privacy links** in footer (Grand Street, Happysmile both surface these).
- [ ] **Accessible PDFs** for patient forms (or better: online intake) — tagged, keyboard-navigable.
- [ ] **Screen-reader test** of the full booking flow (the #1 sued-upon flow in healthcare).
- [ ] **Color-vision-safe** palettes (avoid red/green-only status; add icon/text).
- [ ] **Reduced motion** — respect `prefers-reduced-motion` for carousels/parallax (Austin Family DDS parallax is a risk if not gated).

**Testing tools:** axe DevTools, WAVE, Lighthouse a11y, NVDA/VoiceOver manual pass,
keyboard-only pass, 200% zoom pass, contrast checker on every brand color pairing.

---

## 7. Specific examples with URLs

| Site | URL | What to learn |
|------|-----|---------------|
| Aspen Dental | `aspendental.com` | Multi-location group nav, location picker, utility bar, 4.6★ trust band, mega-menu service taxonomy. |
| Invisalign | `invisalign.com` | Hero with embedded ZIP "find a doctor," 3-step "how it works," video testimonials, cost/insurance transparency, accent-color CTA discipline. |
| Tend Dental | `hellotend.com` | **Best overall model for a premium multi-location group** — "no judgment" empathy copy, "Accessible Version" toggle, skip link, per-city subpages, 8,000+ review count, benefit checklist. |
| Skyline Dental | `sdentalnj.com` | Icon+image service cards grouped by patient intent ("I need a checkup," "I'm in pain"), insurance logo row, same-day-crown differentiator, new-patient offer. |
| Grand Street Dental | `grandstreetdental.com` | Before/After gallery, press/testimonial wall (Forbes, NY Mag, Madewell), Instagram feed, "Dentistry Redesigned" positioning, accessibility statement in footer. |
| 1010 Dental | `1010dental.com` | Service image-grid, doctor headshot grid, review wall, patient-education article hub. |
| West Coast Dental | `westcoastdental.com/es/` | **The EN/ES subdirectory reference** — full localized nav, Medi-Cal page, Spanish insurance/financing. |
| Happysmile LA | `happysmilesla.com/en/` | Spanish-first root + `/en/` toggle, flag-based switcher, bilingual service cards, 0% financing callout. |
| SmileSet (ex-SmileDirectClub) | `smileset.com` | Comparison table (aligners vs braces), quiz CTA, before/after gallery, subscription model. |
| HubSpot dental roundup | `blog.hubspot.com/website/dental-website-design` | 29-site trend synthesis (hero patterns, CTA placement, color schemes). |
| DDSRank 2025 roundup | `ddsrank.com/dental-seo/best-dental-websites-of-2025/` | "What makes a great dental site" 6-element framework. |
| Dentplicity bilingual guide | `dentplicity.com/blog/bilingual-spanish-dental-marketing-2026` | EN/ES localization, hreflang, Spanish SEO, operational parity. |

---

## 8. What makes a dental site look "professional" vs "amateur"

### Professional signals
- **One clear job per page** and one primary CTA per viewport.
- **Real photography** of the actual team, office, and patients (with consent) — not generic stock.
- **Consistent type & color system** (2 fonts, ≤3 colors, modular scale).
- **Trust artifacts**: verifiable reviews (source + count), insurance logos, accreditations,
  before/after with real results, press mentions.
- **Transparency**: new-patient pricing, insurance accepted, financing options, hours, directions.
- **Fast, responsive, keyboard-accessible** booking flow.
- **Bilingual execution that feels native**, not translated (correct clinical terms, natural tone).
- **Cohesive IA** — services grouped by patient need, not by internal department.
- **Subtle motion** (gated by `prefers-reduced-motion`) and polished micro-interactions.

### Amateur signals (avoid)
- Multiple competing CTAs; "click here" links; stock-photo dentists with perfect smiles.
- Auto-playing audio/video with no pause; parallax that disorients.
- Color-only meaning; low-contrast text; tiny tap targets; no visible focus states.
- Broken/missing alt text; placeholder copy ("Lorem," "Dentist in [City]" repeated).
- Translation-widget Spanish with wrong clinical terms; EN/ES pages that don't mirror each other.
- Non-responsive or "desktop-first" layout; sticky header that hides focus.
- No accessibility statement, no skip link, no keyboard path through booking.
- Inconsistent branding across locations (each office looks like a different practice).
- Dead links, outdated years, missing phone/address on mobile.

---

## 9. Quick-start recommendations for Dr. Smile Dental Group

1. **Adopt the Tend + Skyline hybrid**: Tend's premium empathy + accessibility posture,
   Skyline's intent-grouped service cards and insurance transparency.
2. **Brand system**: Primary `#1B6CA8`, accent `#FF7A59`, navy `#0E2A47`, surface `#F4F9FC`;
   Inter (body) + one display face (Fraunces for premium or Poppins for clinical).
3. **IA**: Services grouped by patient need; per-location pages; Patient Resources hub.
4. **i18n**: `/es/` subdirectory + `hreflang` + persistent EN|ES toggle + native-reviewed
   Spanish for services/new-patient/insurance/contact; Spanish keyword SEO + GBP bilingual.
5. **Accessibility**: build to WCAG 2.1 AA from day one (not retrofitted) — HHS 504 enforceable
   May 2026; test booking flow with a screen reader; add skip link, focus management,
   pause controls, `aria-live` status, 44px targets, `prefers-reduced-motion`.
6. **Conversion**: persistent Book+Call, sticky mobile CTA, new-patient offer above the fold,
   insurance logos, verifiable reviews, before/after gallery.
7. **Trust**: real team photos, press/testimonials, technology differentiators, transparent financing.
