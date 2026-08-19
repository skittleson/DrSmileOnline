# Google Business Profile

Canonical Name/Address/Phone (NAP) for the Dr. Smile locations, the consistency
rules that keep the website, structured data, and Google Business Profile (GBP)
agreements in sync, and the landmines a dev must know before touching any of
them. This documents **what exists** and **what must stay consistent**, not a
target standard — gaps are listed at the bottom, clearly marked.

## Canonical NAP (the four real locations)

Single source of truth: `src/data/locations.ts`. Every other surface (GBP
listings, the `Dentist` schema, the contact page, the city pages) must match
this table exactly.

| Location | Name | Address | Phone |
|---|---|---|---|
| Newport Beach | Dr. Smile Newport Beach | 2121 East Coast Hwy Ste 140, Newport Beach, CA 92660 | (949) 640-0222 |
| San Pedro | Dr. Smile San Pedro | 1622 S Gaffey St, San Pedro, CA 90731 | (310) 548-8128 |
| Torrance | Dr. Smile Torrance | 24667 Crenshaw Blvd D, Torrance, CA 90505 | (310) 325-8555 |
| Lomita | Dr. Smile Lomita | 2104 Pacific Coast Hwy #5, Lomita, CA 90717 | (310) 539-1111 |

- **Each location has its own phone number.** There is no single sitewide main
  line. Never "consolidate" to one number on the website or the GBP listings.
- **Hours are uniform** across all four: Mon–Fri 8AM–5PM, Sat by appointment,
  Sun closed. (Source: `locations.ts` `hoursEn`/`hoursEs` and `contact.astro`.)
- **`mapQuery`** per location is the string used to build Google Maps
  directions links (`getDirectionsUrl`) and map embeds (`getMapEmbedSrc`).

## Consistency rules (keep these in sync)

A NAP change must be applied to **all** of these, or the signals diverge and
local-pack ranking suffers:

1. **`src/data/locations.ts`** — the source of truth.
2. **The 8 per-city pages** — `newport-beach.astro`, `san-pedro.astro`,
   `torrance.astro`, `lomita.astro` (and their `es/` equivalents) pass
   `address`/`phone`/`mapQuery` as **hardcoded props** into
   `LocationPage.astro`/`LocationPageEs.astro`. They do **not** import from
   `locations.ts`. Update each EN + ES page for the affected city.
3. **The `Dentist` structured data** — `Base.astro` builds per-location
   `PostalAddress` + `telephone` entries directly from `locations.ts`, so this
   stays in sync automatically. The top-level `telephone` is `locations[0].phone`
   (Newport Beach).
4. **`contact.astro` / `es/contacto.astro`** — pull from `locations.ts`, so they
   stay in sync automatically.
5. **The live GBP listings** — four separate Google Business Profile listings
   (one per location). These are **not** in this repo; they live in Google
   Business Profile. A NAP change here does **not** update them. Update the GBP
   listings manually and keep the name/address/phone identical to the table
   above.

## Gotchas

- **Two domains are in play — `doctorsmileonline.com` is the real one.**
  `public/CNAME` is `doctorsmileonline.com`, and the privacy/terms pages and
  the `Dentist` schema (`Base.astro:24`) all reference
  `https://doctorsmileonline.com` — so that is the canonical production domain.
  But `astro.config.mjs` sets `site: 'https://skittleson.github.io'`, which is
  where every per-page **canonical URL** is actually generated
  (`${import.meta.env.SITE}${base}/...`). So the sitewide schema points at
  `doctorsmileonline.com` while the per-page canonicals point at
  `skittleson.github.io/DrSmileOnline/...`. The GBP listing's website field
  should be `https://doctorsmileonline.com` (matching CNAME + schema); the
  `site:` config value is the inconsistency to reconcile.
- **`sameAs` is hardcoded in `Base.astro`** (Facebook + Instagram), not in
  `locations.ts`. If the GBP listing's "website" or social links differ, update
  `Base.astro:27-28` to match — don't assume the data file is the source.
- **The blog links out to two other domains** — `doctorsmiledentalclinic.blogspot.com`
  (34 links) and `medium.com/@drsmileonline247` (37 links), ~71 links total across
  ~36 posts. If those
  domains are *also* claimed on GBP or cited in citations, they create
  competing NAP signals. Decide which domain is the real business domain and
  consolidate; the others should be deprecated or redirected.
- **GBP listings are per-location, not one listing.** A single "Dr. Smile
  Dental Group" listing covering all four cities is a GBP policy violation
  (one listing = one physical location). There must be four separate listings,
  each with its own address/phone from the table above.
- **The `invisalign-orthodontcs` slug typo** (missing "o") is a live, indexed
  URL referenced from `Header.astro`. It doesn't affect GBP directly, but if
  the GBP listing's description or website links reference that path, keep the
  typo or you'll 404.

## Known gaps (current, not requirements)

- **No GBP listing URLs are recorded anywhere in the repo.** There's no
  `google.com/maps` place link, no `@id` for the `Dentist` schema, and no
  `hasMap`/`geo` structured data. Adding a stable `@id` and the four GBP place
  URLs to the schema would strengthen the entity graph.
- **No `geo` (latitude/longitude) coordinates** in the schema — only street
  addresses. GBP uses geo; the schema could too.
- **No `openingHours`** in the `Dentist` schema, despite hours being uniform
  and known.
- **No review strategy or review-link** on the site. The `Dentist` schema has
  no `aggregateRating` (correct — don't fabricate), but there's no CTA to the
  GBP review page either.
- **`site:` config vs CNAME domain** — `astro.config.mjs` `site:` is
  `skittleson.github.io` while `public/CNAME` is `doctorsmileonline.com`. The
  per-page canonicals derive from `site:`, so they point at the GitHub Pages
  host, not the branded domain. Reconcile `site:` to `doctorsmileonline.com`
  (or confirm the CNAME mapping) so canonicals, schema, and GBP all agree.
