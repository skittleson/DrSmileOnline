# WordPress → Astro migration: analytics findings, redirect plan, cutover notes

Working notes from a GA4-driven analysis of the live WordPress sites ahead of
cutting `doctorsmileonline.com` over to this Astro build. Source data: GA4
property `446120868`, pulled via the `google-analytics-data` Python SDK with
a service-account key, last 90 days as of 2026-08-19. Full per-URL redirect
tables live in `local-reports/redirect-map-2026-08-19.md` (gitignored scratch
output — regenerate from GA4 if needed, this doc has the actionable summary).

## What's live today (context for everything below)

The GA4 property tracks the **current production WordPress sites**, not this
Astro repo — there is zero traffic from the GitHub Pages build. Five separate
WordPress installs currently exist:

- `doctorsmileonline.com` — the flagship/hub site (highest volume: ~1,640
  sessions/30d)
- `drsmilenewport.com`, `drsmilelomita.com`, `drsmilesanpedro.com`,
  `drsmiletorrance.com` — four separate city-specific WordPress installs

`public/CNAME` in this repo already contains `doctorsmileonline.com`, and
`.github/workflows/deploy.yml` deploys `dist/` to GitHub Pages on every push
to `main` — so the custom-domain wiring is pre-staged, but DNS for
`doctorsmileonline.com` still points at the live WordPress host today. This
doc assumes the eventual plan is: DNS for `doctorsmileonline.com` moves to
GitHub Pages, and this Astro build becomes the site at that domain. The four
sister domains are a separate, unresolved decision (see "Sister domains"
below) — they do not automatically come along for the ride.

## Cutover changes required in this repo (not yet made — do NOT change until DNS is ready)

Right now `astro.config.mjs` has:
```js
base: '/DrSmileOnline/',
site: 'https://skittleson.github.io',
```
This is correct for previewing on `skittleson.github.io/DrSmileOnline/`. Once
`doctorsmileonline.com` DNS actually points at GitHub Pages, a custom domain
on a GitHub Pages *project* site is served from the domain root, not a
subpath — so at cutover time this needs to become:
```js
base: '/',
site: 'https://doctorsmileonline.com',
```
Every page/component in this codebase computes `base` from
`import.meta.env.BASE_URL` and builds links as `${base}/path/`, so this
should cascade correctly through canonical URLs, hreflang, sitemap, and the
legacy-redirect stubs (`src/data/legacy-redirects.ts` /
`src/pages/[...legacyPath].astro`) without further code changes — those all
resolve through `SITE`/`BASE_URL` at build time, not hardcoded strings.

**One already-documented exception**: `seo.md`'s "Known gaps" section flags
that blog Markdown content contains **hardcoded absolute links** like
`/DrSmileOnline/blog/...` in a few posts, which are NOT base-relative — they
only work today because the site happens to live at that exact subpath. At
cutover, any such links will silently 404 (they'd need to be
`/blog/...` post-cutover). Grep `src/content/blog/*.md` for `/DrSmileOnline/`
before flipping the base and fix any hits.

**Sequencing recommendation**: don't flip `base`/`site` until DNS is actually
being cut over — changing it earlier breaks the `skittleson.github.io`
preview URL still in use for review. Treat this as a same-day change paired
with the DNS switch.

## Redirect map (legacy WordPress URLs → Astro)

101 legacy `doctorsmileonline.com` URLs with real traffic (≥2 pageviews/90d)
now have working redirect stubs shipped in this repo
(`src/data/legacy-redirects.ts`, consumed by `src/pages/[...legacyPath].astro`).
Each generates a static HTML page with `<meta http-equiv="refresh">` + a
matching `rel="canonical"` — the standard soft-301 pattern for a host with no
server-side redirect support. Verified: all 101 stubs resolve to a real page,
none collide with existing routes, none appear in `sitemap-0.xml` (they're
`noindex`).

**Deliberately excluded from the redirect map** (see
`src/data/legacy-redirects.ts` header comment for full rationale):
- Exact-slug matches — no redirect needed, the URL is already correct.
- Bot/scanner noise (`/wp-login.php`, `/admin.php`, etc.) and probable
  hacked/spam paths (`/pain-tramadol/`, a bare hex-string slug) — let these
  404 rather than legitimizing them with a redirect.
- **Needs a product decision before any redirect makes sense** (no code
  changes were made for these):
  - `/thank-you/` — 279 pageviews/90d, the live conversion-completion page.
    No equivalent in Astro; the contact form doesn't submit anywhere yet
    (see "Conversion tracking gap" below).
  - `/testimonial/` — 54 combined pageviews/90d across all 4 city domains.
    No reviews/testimonials content exists on the new site at all.
  - Team/bio pages — `/our-team`, `/dentists`, `/doctors`,
    `/meet-the-doctors`, `/meet-the-team`, `/our-doctors`, `/staff` (29
    combined pageviews/90d) — no "meet the team" page exists yet.

**Paid-search-critical** (verify against live Google Ads campaigns before the
old domain is decommissioned — letting these lapse into a bare 404 wastes ad
spend and resets Quality Score):
- `doctorsmileonline.com/dentist-san-pedro/` — 1,030 pv/90d, now → `/san-pedro/`
- `doctorsmileonline.com/dentist-lomita/` — 690 pv/90d, now → `/lomita/`
- `doctorsmileonline.com/cta-form/` — 51 pv/90d, now → `/contact/`
- `doctorsmileonline.com/dentist-torrance/` — 18 pv/90d, now → `/torrance/`
- Plus ~14 more lower-volume "service + city" PPC-pattern URLs (full list in
  `local-reports/redirect-map-2026-08-19.md`)

## Sister domains (drsmilenewport.com, drsmilelomita.com, drsmilesanpedro.com, drsmiletorrance.com)

**Out of scope for this codebase** — GitHub Pages serves exactly one custom
domain per repo, so these four domains can't be redirected by anything living
in this Astro build. They need one of:
- Registrar-level domain forwarding (simple, but most registrars don't
  preserve the full path — e.g. `drsmilelomita.com/about/` forwarding to
  `doctorsmileonline.com/about/` specifically, not just the bare domain).
- Cloudflare Redirect Rules, with each domain's nameservers pointed at
  Cloudflare (free tier) — supports real path-level 301s, the better option
  if path preservation matters (per-domain traffic: newport 63 URLs, lomita
  41, san pedro 40, torrance 37, all ≥2 pv/90d — see the full report).

This needs whoever holds registrar/DNS access for those four domains; flag it
as an explicit pre-launch action item, not an assumed default.

## Conversion tracking gap (blocks measuring anything post-launch)

- **No GA4/GTM snippet exists anywhere in `src/` or `public/`.** Confirmed via
  `grep -rIln "googletagmanager\|gtag(\|GTM-"` — zero matches. Whatever
  tracking is live on WordPress today does not carry over automatically.
- **The contact form doesn't submit anywhere.** `src/pages/contact.astro`
  posts to `action={${base}/contact/}` — itself, with no backend (static
  site, no serverless function configured). No `/thank-you/` page, no
  `generate_lead`-equivalent event.
- Recommend both get wired up (GA4/GTM tag + a real form backend, e.g.
  Formspree/Netlify Forms + a thank-you redirect) before launch — otherwise
  the site goes live with no way to measure whether anything here worked, and
  the biggest fix below (paid-landing-page message match) can't be validated.

## Marketing psychology findings (from the live WordPress GA4 data)

Three concrete, data-backed findings, each mapped to a mental model with a
specific implication for the Astro build.

### 1. Paid Search visitors bounce far more than Organic — even on the identical page

| Page | Channel | Bounce rate | Engagement rate |
|---|---|---|---|
| `/torrance` | Organic Search | 17% | 83% |
| `/torrance` | Paid Search | 41% | 59% |
| `/dentist-san-pedro` (dedicated ad landing page) | Paid Search | 53% | 47% |
| `/dentist-lomita` (dedicated ad landing page) | Paid Search | 49% | 51% |

Same page, same content, radically different behavior by channel — not an
audience-quality difference, a **Framing Effect / message-match failure**.
The ad promises something specific (e.g. "Emergency Dentist San Pedro,"
"24-Hour Dentist Lomita" — real ad-group patterns per the redirect map's
paid-search-critical list); the visitor expects that promise confirmed
instantly and lands on a generic city page instead. Compounded by the
**Curse of Knowledge**: the page assumes visitors already know who Dr. Smile
is, but a cold paid-search click doesn't.

**Implication for Astro**: build dedicated landing-page variants (or a
dynamic headline via UTM/query param) for the top paid keywords that restate
the ad's exact promise in the H1. San Pedro + Lomita paid landing pages alone
represent ~1,720 pageviews/90d at engagement ~30 points below what the same
content gets organically — highest-leverage fix in this analysis.

### 2. Mobile form abandonment is ~2x worse than desktop

`form_start` → `generate_lead` (actual completion), last 30 days:

| Device | form_start | generate_lead | Drop-off |
|---|---|---|---|
| Desktop | 90 | 18 | 80% |
| Mobile | 88 | 5 | **94%** |

Sitewide only 23 of 178 form-starts (13%) become a real lead, and most of
that gap is mobile — **Activation Energy**: small screens and long forms
cost disproportionately more effort per field on mobile, and there's no
**Zeigarnik Effect** nudge (no save-progress, no abandoned-form follow-up) to
pull people back once they start.

**Implication for Astro**: once the contact form gets a real backend,
prioritize fewer required fields, a **Goal-Gradient** progress indicator if
multi-step, and correct mobile input types (`autocomplete`, `inputmode="tel"`
etc.). Given phone is the dominant channel (#3 below), treat the form as
secondary, not the thing to over-invest in.

### 3. Tap-to-call is the practice's real primary conversion channel, not the contact form

Combined `Phone tel: link click` + `Call Now Button Track` = 331 events/30d
vs. `form_start` = 178 and `generate_lead` = 23. Phone is ~2x form-starts and
~14x actual form completions. This is why the sitewide utility-bar phone
widget was the first fix shipped this session (see below) — **Activation
Energy** again: a `tel:` tap is the lowest-friction conversion action
available (**BJ Fogg model**: Ability is near-perfect for a phone tap,
near-zero for a multi-field mobile form).

Secondary note: the FAQ page's strong numbers (88% engagement, 12% bounce)
suggest it's already doing real objection-handling work before the call
(**Loss Aversion / Regret Aversion** — dental patients delay treatment out of
cost/fear anxiety, then regret waiting) — worth preserving that role in the
new site's nav priority, not treating FAQ as an afterthought page.

## Shipped this session (Astro codebase changes)

- **`src/components/UtilityBar.astro`** — replaced the sitewide "📞 Call Us"
  text link (which pointed to `/location/`, requiring a page nav before any
  phone number was tappable) with a `<details>/<summary>` disclosure listing
  all 4 real location numbers as direct `tel:` links, sourced from
  `src/data/locations.ts`. No fake/single "main line" invented — matches the
  already-documented decision in `AGENTS.md` that there's no single sitewide
  number. Verified on all 148 pages (EN + ES, same shared component).
- **`src/data/legacy-redirects.ts`** + **`src/pages/[...legacyPath].astro`**
  — 101 static soft-redirect stubs for legacy `doctorsmileonline.com` URLs
  (see "Redirect map" above).
- **`astro.config.mjs`** — sitemap `filter` extended to also exclude the new
  redirect-stub routes (they're `noindex`, same treatment as `/404/`).
