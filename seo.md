# SEO

Current state of SEO on the Dr. Smile site, plus the landmines a dev must know
before touching metadata, links, or content. This documents **what exists**,
not a target standard — gaps are listed at the bottom, clearly marked.

## What's implemented

- **Canonicals** — every page computes `const canonical = \`${import.meta.env.SITE}${base}/<slug>/\``
  and passes it to `Base.astro`, which emits `<link rel="canonical">`. `Base.astro`
  falls back to `new URL(Astro.url.pathname, Astro.site)` if none is passed.
- **Meta description** — every page passes a `description` prop; `Base.astro`
  emits `<meta name="description">`.
- **Open Graph** — `Base.astro` emits `og:title`, `og:description`, `og:type`,
  `og:url`, `og:site_name`.
- **Twitter** — `Base.astro` emits `twitter:card` (`summary`), `twitter:title`,
  `twitter:description`.
- **Structured data** — `Base.astro` emits a single `application/ld+json`
  `Dentist` schema on **every** page, with per-location `PostalAddress` entries
  pulled from `src/data/locations.ts`, plus `sameAs` (Facebook, Instagram) and
  `areaServed: 'Southern California'`. Additionally: `faqs.astro` emits
  `FAQPage` schema (built from the same `faqCategories` data the page renders),
  each city page (`LocationPage.astro` / `LocationPageEs.astro`) emits its own
  `Dentist` schema scoped to that location, and every blog post
  (`blog/[...slug].astro`) emits `BlogPosting` schema from its frontmatter
  (`title`, `description`, `pubDate`). Blog posts and city/FAQ pages therefore
  carry two `@type` blocks (sitewide `Dentist` + the page-specific one) — that's
  intentional, not a duplicate to remove.
- **Sitemap** — `@astrojs/sitemap` integration in `astro.config.mjs`; emits
  `sitemap-index.xml` + `sitemap-0.xml` into `dist/`. A `filter` excludes any
  URL ending in `/404/` (EN and ES) — the 404 pages are `noindex` (see below),
  so they shouldn't be in the sitemap either.
- **404 pages are `noindex, nofollow`** — `Base.astro` accepts a `noindex`
  prop; both `404.astro` and `es/404.astro` pass `noindex={true}`, emitting
  `<meta name="robots" content="noindex, nofollow">`. The pages remain
  crawlable/renderable (GitHub Pages still serves them for unmatched paths),
  they're just excluded from indexing.
- **robots.txt** — `public/robots.txt`: `User-agent: * / Allow: /` plus explicit
  `Allow: /` blocks for the major AI crawlers (GPTBot, OAI-SearchBot, Claude-Web,
  Google-Extended, Amazonbot, anthropic-ai, Bytespider, CCBot, Applebot-Extended),
  each carrying a `Content-Signal: ai-train=yes, search=yes, ai-input=yes` line,
  and `Sitemap: https://skittleson.github.io/DrSmileOnline/sitemap-index.xml`.
  Policy is allow-all (AI + search) — flip the `Allow` lines to `Disallow` and the
  `ai-train`/`ai-input` flags to `no` if the practice ever wants to opt out of
  AI training while keeping AI-search visibility.
- **Link headers (RFC 8288)** — `public/_headers` adds `Link` response headers to
  the homepage (`/`): `rel="index"` → sitemap, `rel="describedby"` → `/about/`,
  `rel="service-doc"` → `/services/`. GitHub Pages honors `_headers`.
- **Agent-readiness (static-max)** — a set of machine-readable discovery
  artifacts under `public/.well-known/` plus `public/llms.txt`:
  - **ARD manifest** — `public/.well-known/ai-catalog.json` (4 entries:
    locations, services, contact, sitemap). Discovered via the
    `<link rel="ai-catalog">` in `Base.astro` `<head>` and the `Agentmap:`
    line in `robots.txt`.
  - **Agent Skills index** — `public/.well-known/agent-skills/index.json`
    (2 skills: `dr-smile-locations`, `dr-smile-services`), each pointing at a
    `SKILL.md` artifact. SHA-256 digests are computed by
    `scripts/compute-digests.mjs` and wired into `npm run build` so they stay
    current.
  - **MCP Server Card** — `public/.well-known/mcp/server-card.json`
    (declarative placeholder; the endpoint does not yet serve a live MCP
    server).
  - **llms.txt** — `public/llms.txt`, a human/LLM-readable summary of the
    practice (locations, services, key pages).
  - **Not done** (need a backend, out of scope for static): OAuth/OIDC
    discovery, Protected Resource, Auth.md, WebMCP, DNS-AID,
    Markdown-for-Agents, and a real MCP server runtime.
- **hreflang** — every page (EN and ES) emits a reciprocal set, computed
  centrally in `Base.astro` from `src/i18n/locales.ts` (`localePairs` /
  `counterpartPath()`): a self-referencing tag for the page's own locale, an
  `alternate` tag for its counterpart (when one exists), and `x-default`
  pointing at the EN root. Pages with no counterpart (blog posts, 404) emit
  only the self tag + `x-default`. Do **not** re-add per-page
  `<link rel="alternate" hreflang>` blocks — `Base.astro` already emits them
  for every page; adding your own creates duplicate/conflicting tags.
- **Content-Security-Policy** — a single source: the `Content-Security-Policy`
  HTTP header in `public/_headers` (`/*`). There is no `<meta>` CSP in
  `Base.astro` (a duplicate `<meta http-equiv>` CSP was removed — having both
  an HTTP header and a meta tag risks drift and the meta version can't set
  `frame-ancestors`). `frame-src` allows `https://www.google.com` (the actual
  host used by `getMapEmbedSrc()` in `src/data/locations.ts` for the location
  page Maps iframes) plus `https://google.com` as a defensive fallback in case
  Google's embed host ever changes to the bare domain.
- **`<html lang>`** — set per page via the `locale` prop on `Base.astro`.
- **Blog** — English-only collection (`src/content/blog/*.md`), glob-loaded via
  `src/content.config.ts`. Spanish pages link to the same English
  `/blog/{slug}/` URLs — intentional, not a missing feature.
- **`site` + `base`** — `astro.config.mjs` sets `site: 'https://skittleson.github.io'`
  and `base: '/DrSmileOnline/'`. All canonicals and absolute URLs derive from
  these two values.

## Gotchas

- **Canonicals are per-page literals, not derived.** Each page hard-codes its
  own `const canonical = ...`. There is no single source. If you add a page,
  you must add its canonical line **and** a `{ en, es }` entry in
  `src/i18n/locales.ts` so `Base.astro` can emit the correct reciprocal
  hreflang pair for both locales.
- **The `invisalign-orthodontcs` typo is a live URL.**
  `src/pages/invisalign-orthodontcs.astro` is misspelled ("orthodontcs", missing
  the "o") and is already indexed. It's referenced with the same typo from
  `Header.astro`'s `enSlugs.invisalign`. Do **not** "fix" the spelling without
  adding a redirect for the old URL — you'll break the canonical, the hreflang
  pair, and the sitemap entry simultaneously.
- **Blog internal links use bare `/DrSmileOnline/...` paths.** Several blog
  posts (e.g. `family-dentist-in-newport-beach.md`, `find-best-dentist-in-lomita-for-emergencies.md`)
  contain hardcoded absolute-path links like
  `[...](/DrSmileOnline/blog/local-dentists-in-newport-beach/)`. These are
  **not** base-relative — they only work because the deployed site lives under
  that exact subpath. If the `base` or `site` config ever changes, these links
  silently 404. Prefer `${base}/...` in any new Markdown.
- **The `Dentist` schema is on every page, and blog posts also carry a
  `BlogPosting` block** (`src/pages/blog/[...slug].astro`) — two `@type`
  blocks per blog post is intentional (sitewide business identity +
  per-article schema), not a duplicate to clean up.
- **`sameAs` is hardcoded in `Base.astro`**, not in `locations.ts`. If the
  Facebook/Instagram handles change, update `Base.astro:27-28`, not the data
  file.
- **`telephone` in the top-level schema is `locations[0].phone`** — i.e. the
  Newport Beach line. There is no single sitewide number; the per-location
  `telephone` values are correct. Don't "consolidate" to one number.
- **`public/CNAME`** is a GitHub Pages deployment artifact (custom domain
  mapping), not SEO. Don't confuse it with sitemap/robots. Note: as of this
  writing `doctorsmileonline.com` (the CNAME target) resolves to a **different,
  live WordPress site**, not this Astro build — the domain/schema `url` field
  in `Base.astro` and this deployment are not currently the same site. Resolve
  which one is canonical before treating `doctorsmileonline.com` as this
  site's production domain.

## Known gaps (current, not requirements)

- **No `og:image` / `twitter:image`.** Share cards render without an image.
- **No `ImageObject`** for the doctor photos on `about.astro`.
- **No `VideoObject`** (no video content currently, so low priority).
- **Blog `description`/`category` fields** are defined in
  `src/content.config.ts` but `category` is unused by any page; `description`
  is optional and not all posts set it — see the "Required for every new blog
  post" note in `AGENTS.md`, which now treats `description` as required in
  practice (it feeds the `BlogPosting` schema's `description` field).
- **Blog `pubDate` is a placeholder for 102 of 103 posts.** All posts were
  seeded with `pubDate: 2024-01-01`; only
  `urgent-dental-care-in-newport-beach.md` has a real date (2026-04-13, matched
  to its blogspot source). The placeholder is user-visible in four templates
  (`blog/index.astro`, `blog/[...slug].astro`, `important-announcements.astro`,
  `es/anuncios-importantes.astro`) — and because `toLocaleDateString` renders
  UTC midnight in the viewer's local timezone, the 102 placeholder posts
  actually display as **"December 31, 2023"**, not 2024. It also drives sort
  order in all four; with all dates equal, ordering is effectively arbitrary
  (insertion order). It also now drives `datePublished`/`dateModified` in each
  post's `BlogPosting` schema, so the placeholder date is baked into structured
  data too, not just the visible byline. The real publish dates live on
  `doctorsmiledentalclinic.blogspot.com` (80 posts, Sept 2024–July 2026) and
  `medium.com/@drsmileonline247` (36 posts, 403-blocked); the local titles are
  paraphrased, so they can't be auto-mapped. Recovering them needs a slug→date
  list from the source.
