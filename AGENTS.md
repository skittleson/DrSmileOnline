# AGENTS.md

Static marketing site for **Dr. Smile Dental Group** — a real multi-location dental
*practice* (Newport Beach, San Pedro, Torrance, Lomita, CA), not an e-commerce site.
"Conversions" means phone calls / contact-form submits, not purchases.

Astro 5, static output, deployed to GitHub Pages under a subpath. No test suite,
no lint, no typecheck script configured — verify by building and inspecting `dist/`.

## Commands

```
npm run dev       # astro dev
npm run build     # astro build -> dist/
npm run preview   # astro preview, serves dist/
```

There is no `lint`, `test`, or `typecheck` script. `astro check` is *not* set up
(it needs `@astrojs/check` installed and will prompt interactively to install it —
don't run it assuming it works). The only real verification loop is:
`npm run build` (must complete with the expected page count, currently 148) then
grep the actual `dist/**/*.html` output for the strings/hrefs you care about.
Build succeeding does **not** mean links resolve — see the base-path gotcha below.

CI (`.github/workflows/deploy.yml`): push to `main` → `npm ci && npm run build` →
deploy `dist/` to GitHub Pages. No lint/test gate.

## Critical gotcha: base path prefix on every internal link

`astro.config.mjs` sets `base: '/DrSmileOnline/'`. Every page computes
`const base = import.meta.env.BASE_URL.replace(/\/+$/, '')` and internal links
**must** be built as `` href={`${base}/some-path/`} ``.

A bare relative href like `href="contact/"` or `href={someSlug}` is **not** safe —
it resolves relative to the *current page's* URL, not the site root. A link on
`/location/` written as `href="newport-beach/"` resolves to
`/location/newport-beach/` (404) instead of `/newport-beach/`. This exact bug hit
~24 links across `financing.astro`, `faqs.astro`, `location.astro`, and the city
pages in one session — always prefix with `${base}`, never leave a bare relative
string in an `<a href>`.

`ServiceCard.astro` and `CtaBanner.astro` already normalize whatever `href` you
pass them (`base + (href.startsWith('/') ? href : '/' + href)`), so pages that go
through those components are safe. Raw `<a>` tags in page templates are not.

## i18n

- English pages live at `src/pages/*.astro`; Spanish at `src/pages/es/*.astro`.
- **Spanish slugs are translated, not mirrored filenames** — e.g. `faqs.astro` ↔
  `es/preguntas-frecuentes.astro`, `location.astro` ↔ `es/ubicacion.astro`,
  `contact.astro` ↔ `es/contacto.astro`, `services.astro` ↔ `es/servicios.astro`.
  The authoritative EN⇄ES slug map is in `Header.astro` (`enSlugs`/`esSlugs`) —
  check there before guessing a Spanish URL.
- `getTranslations(locale)` (`src/i18n/index.ts`) flattens the nested
  `en.json`/`es.json` into dot-notation keys — access as `t['nav.home']`, not
  `t.nav.home`.
- The blog (`src/content/blog/`) is **English-only**, one shared collection, no
  Spanish equivalent. Spanish pages that link to blog posts link to the same
  English `/blog/{slug}/` URLs — this is intentional, not a missing feature.
- Astro's flat-file `404.html` handling only applies to the top-level
  `src/pages/404.astro`. `src/pages/es/404.astro` builds as a normal route
  (`/es/404/`), and GitHub Pages only ever serves one root `404.html` for any
  unmatched path. The English 404 page carries a client-side redirect script
  (`if (pathname.startsWith(base + '/es/')) location.replace(...)`) so Spanish
  visitors who hit a dead link get bounced to the real Spanish 404 content —
  don't remove that script without preserving that behavior another way.
- `LocationPage.astro` / `LocationPageEs.astro` are two parallel components (not
  one parameterized by locale) — matches the rest of the codebase's
  one-page-per-locale pattern. Don't "consolidate" them; keep edits mirrored.

## Location data

`src/data/locations.ts` is the single source of truth for the 4 real addresses,
phone numbers, and map queries (each location has its **own** real phone number —
there is no single sitewide "main line" anymore). `LocationCards.astro`,
`contact.astro`/`es/contacto.astro`, and `Base.astro`'s Dentist schema import
from it directly.

**The 8 per-city pages do NOT import from it** — `torrance.astro`, `san-pedro.astro`,
`lomita.astro`, `newport-beach.astro` (and their `es/` equivalents) each pass
`address`/`phone`/`mapQuery` as hardcoded string props into `LocationPage.astro`/
`LocationPageEs.astro`. If a location's address or phone changes, you must update
it in `locations.ts` *and* in both the EN and ES page for that city (8 files total,
minus the one you're updating in `locations.ts`) — there's no single edit point.

CTAs that used to say "Call us" now generally say "Find Your Location" /
"Call your local office" and link to `/location/` or `/contact/`, since there's
no single number to put on a button.

## Content collection

`src/content.config.ts` defines the `blog` collection (glob-loaded from
`src/content/blog/*.md`). Schema requires `title`, `pubDate` (coerced to Date,
used for sort order on `/blog/`), and optional `description`/`category` (the
`category` field is defined but currently unused by any page). A new post
missing `pubDate` will fail the build.

## Known intentional oddity

`src/pages/invisalign-orthodontcs.astro` — the slug is misspelled ("orthodontcs",
missing the "o") and is a real, live, already-indexed URL. It's referenced
correctly (with the same typo) from `Header.astro`'s `enSlugs.invisalign`. Do not
"fix" the spelling without adding a redirect for the old URL.

## Design tokens

Actual implemented tokens are in `src/styles/global.css` (`--color-primary:
#1A7A6E`, `--color-accent: #E9A03B`, `--space-*`, `--radius*`, `.btn`/
`.btn-accent`/`.btn-outline`, `.section`/`.section-surface`/`.container`).
`DESIGN-REPORT.md` at the repo root is early-stage *research* (competitor
analysis, a different candidate palette) from before the current implementation
— it does not reflect what's actually built. Don't treat it as current.

## Misc

- `local-reports/` is gitignored — scratch analysis output, never commit here.
- No `engines` field; CI uses Node 20 via `actions/setup-node`.
- Package manager is npm only (`package-lock.json`, no other lockfile).
