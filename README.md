# Dr. Smile Dental Group — Website

Static marketing site for Dr. Smile Dental Group, a multi-location dental practice
(Newport Beach, San Pedro, Torrance, Lomita, CA). Built with [Astro 5](https://astro.build/),
static output, deployed to GitHub Pages under the `/DrSmileOnline/` subpath.

## Quick start

```sh
npm ci
npm run dev        # local dev server
npm run build      # -> dist/
npm run preview    # serve dist/ locally
```

There is no `lint`, `test`, or `typecheck` script, and `astro check` is not set
up. The verification loop is: `npm run build` must complete (currently 148 pages),
then grep the actual `dist/**/*.html` output for the strings/hrefs you care about.
A successful build does **not** guarantee links resolve — see the base-path gotcha below.

## Gotcha: base path on every internal link

`astro.config.mjs` sets `base: '/DrSmileOnline/'`. Every page computes
`const base = import.meta.env.BASE_URL.replace(/\/+$/, '')` and internal links
**must** be built as `` href={`${base}/some-path/`} ``.

A bare relative href like `href="contact/"` resolves relative to the *current
page's* URL, not the site root — e.g. on `/location/` it becomes
`/location/contact/` (404). Always prefix with `${base}` in raw `<a>` tags.
(`ServiceCard.astro` and `CtaBanner.astro` already normalize `href` for you.)

## Internationalization

- English pages: `src/pages/*.astro` — Spanish pages: `src/pages/es/*.astro`.
- **Spanish slugs are translated, not mirrored filenames** — e.g. `faqs.astro` ↔
  `es/preguntas-frecuentes.astro`. The authoritative EN⇄ES slug map is in
  `Header.astro` (`enSlugs`/`esSlugs`) — check there before guessing a URL.
- `getTranslations(locale)` (`src/i18n/index.ts`) flattens `en.json`/`es.json`
  into dot-notation keys — access as `t['nav.home']`, not `t.nav.home`.
- The blog (`src/content/blog/`) is **English-only**, one shared collection.
  Spanish pages link to the same English `/blog/{slug}/` URLs — intentional.
- `src/pages/es/404.astro` builds as a normal route; the English `404.astro`
  carries a client-side redirect that bounces Spanish visitors on dead links to
  the real Spanish 404. Don't remove that without preserving the behavior.

## Location data

`src/data/locations.ts` is the single source of truth for the 4 real addresses,
phone numbers, and map queries. Each location has its **own** phone number —
there is no single sitewide main line.

The 8 per-city pages (`torrance.astro`, `san-pedro.astro`, `lomita.astro`,
`newport-beach.astro`, and their `es/` equivalents) do **not** import from it —
they pass `address`/`phone`/`mapQuery` as hardcoded props into
`LocationPage.astro`/`LocationPageEs.astro`. If a location's address or phone
changes, update `locations.ts` **and** both the EN and ES page for that city.

CTAs generally say "Find Your Location" / "Call your local office" and link to
`/location/` or `/contact/`, since there's no single number to put on a button.

## Known intentional oddity

`src/pages/invisalign-orthodontcs.astro` — the slug is misspelled ("orthodontcs",
missing the "o") and is a real, live, already-indexed URL, referenced with the
same typo from `Header.astro`. Do not "fix" the spelling without adding a
redirect for the old URL.

## Deployment

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs
`npm ci && npm run build` (Node 20) and deploys `dist/` to GitHub Pages.
No lint/test gate.

## Further reading

- [accessibility.md](accessibility.md) — current a11y state, gotchas, known gaps.
- [seo.md](seo.md) — current SEO state (canonicals, hreflang, schema, sitemap), gotchas, known gaps.
- [google-business-profile.md](google-business-profile.md) — canonical NAP for the 4 locations, GBP↔website consistency rules, gotchas, known gaps.
