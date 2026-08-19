# AGENTS.md

Static marketing site for **Dr. Smile Dental Group** — a real multi-location dental
*practice* (Newport Beach, San Pedro, Torrance, Lomita, CA), not an e-commerce site.
"Conversions" means phone calls / contact-form submits, not purchases.

Astro 5, static output, deployed to GitHub Pages under a subpath. No test suite,
no lint, no typecheck script configured — verify by building and inspecting `dist/`.

## Commands

```
npm run dev       # astro dev
npm run digests   # compute SHA-256 digests for the agent-skills index
npm run build     # node scripts/compute-digests.mjs && astro build -> dist/
npm run preview   # astro preview, serves dist/
```

`npm run build` runs `scripts/compute-digests.mjs` first — it recomputes the
SHA-256 `digest` fields in `public/.well-known/agent-skills/index.json` from the
actual SKILL.md files, then runs Astro. If you add or edit a SKILL.md artifact,
rebuild so the digest stays current.

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

### Required for every new blog post (SEO)

`src/pages/blog/[...slug].astro` auto-generates a `BlogPosting` JSON-LD block
for **every** post in the collection from its frontmatter — there is no
manual/per-post schema step, but the schema quality is only as good as the
frontmatter:

- **`description` is required in practice, not just schema-optional.** It
  feeds both `<meta name="description">` and the JSON-LD `description` field.
  Leaving it empty means the template falls back to `title`, so the meta
  description and headline become identical — thin and duplicate-looking to
  Google. Write a real 1–2 sentence summary.
- **`pubDate` must be the real publish date**, not a placeholder. It drives
  `datePublished`/`dateModified` in the schema, the visible byline date, and
  sort order on `/blog/`. Don't seed new posts with a copy-pasted date from
  another post.
- Outbound links to `doctorsmiledentalclinic.blogspot.com` or
  `medium.com/@drsmileonline247` automatically get
  `rel="nofollow ugc noopener" target="_blank"` injected by the
  `rehypeLegacyOutboundLinks` plugin (`src/utils/rehype-legacy-outbound-links.mjs`,
  wired in `astro.config.mjs`) — no per-link markup needed, and no other
  domains are affected. If a new post links to another *external* domain that
  should also be nofollow'd, add that hostname to `LEGACY_LINK_HOSTS` rather
  than hand-editing the Markdown link.
- If a post is a genuine duplicate/rewrite of an existing blogspot/medium post
  (most are), don't add `Article`/`BlogPosting` schema pointing at content
  that's substantively the same as the linked original — that's already
  handled here, just don't fight it by adding a second schema block.

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

## Agent-readiness (static-max)

The site publishes a set of machine-readable discovery artifacts for AI agents
and crawlers. All are static files under `public/`, copied verbatim to `dist/`.

- **robots.txt** — `public/robots.txt`: `User-agent: *` allow, explicit `Allow: /`
  blocks for 9 AI crawlers (GPTBot, OAI-SearchBot, Claude-Web, Google-Extended,
  Amazonbot, anthropic-ai, Bytespider, CCBot, Applebot-Extended) each with
  `Content-Signal: ai-train=yes, search=yes, ai-input=yes`, plus `Sitemap:` and
  `Agentmap:` lines.
- **Link headers** — `public/_headers` adds RFC 8288 `Link` response headers to
  the homepage (`/`): `rel="index"` → sitemap, `rel="describedby"` → `/about/`,
  `rel="service-doc"` → `/services/`.
- **ARD manifest** — `public/.well-known/ai-catalog.json` (4 entries: locations,
  services, contact, sitemap). Discovered via `<link rel="ai-catalog">` in
  `Base.astro` `<head>` and the `Agentmap:` line in robots.txt.
- **Agent Skills index** — `public/.well-known/agent-skills/index.json` (2 skills:
  `dr-smile-locations`, `dr-smile-services`), each pointing at a `SKILL.md`
  artifact. SHA-256 digests are computed by `scripts/compute-digests.mjs` and
  wired into `npm run build`.
- **MCP Server Card** — `public/.well-known/mcp/server-card.json` (declarative
  placeholder; the endpoint does not yet serve a live MCP server).
- **llms.txt** — `public/llms.txt`, a human/LLM-readable summary of the practice.

**Not done** (need a backend, out of scope for static): OAuth/OIDC discovery,
Protected Resource, Auth.md, WebMCP, DNS-AID, Markdown-for-Agents, and a real
MCP server runtime.

## Misc

- `local-reports/` is gitignored — scratch analysis output, never commit here.
- No `engines` field; CI uses Node 20 via `actions/setup-node`.
- Package manager is npm only (`package-lock.json`, no other lockfile).
