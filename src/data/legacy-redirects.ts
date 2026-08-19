/**
 * Redirect map: legacy WordPress URLs (doctorsmileonline.com only) -> their
 * new Astro equivalent. Sourced from a 90-day GA4 pull (Aug 2026) filtered to
 * paths with >= 2 pageviews; see local-reports/redirect-map-2026-08-19.md
 * (gitignored scratch analysis) for the full cross-domain map, including the
 * 4 separate city-specific WordPress domains (drsmilenewport.com,
 * drsmilelomita.com, drsmilesanpedro.com, drsmiletorrance.com) that are NOT
 * handled here — those need registrar/Cloudflare-level domain forwarding,
 * which is outside this codebase's reach (GitHub Pages only serves one
 * custom domain per repo).
 *
 * `from` and `to` are both root-relative, WITHOUT the `/DrSmileOnline/` base
 * prefix (the consuming route applies `base` itself) and WITHOUT a leading
 * slash (see `[...legacyPath].astro`, which derives its route params from
 * this list). Every `to` value must correspond to a real page in this site —
 * see the build-time collision/validity check that consumes this file.
 *
 * Deliberately NOT included (see local-reports for the full rationale):
 * - Exact-slug matches (e.g. `/contact/` -> `/contact/`) — no redirect needed.
 * - Bot/scanner noise (`/wp-login.php`, `/admin.php`, etc.) — let these 404.
 * - Likely hacked/spam-injected paths (`/pain-tramadol/`, a bare hex-string
 *   slug) — let these 404; don't legitimize them with a redirect.
 * - Pages needing a real product decision before any redirect makes sense:
 *   `/thank-you/` (279 pageviews/90d — the live conversion-tracking page;
 *   the Astro contact form doesn't submit anywhere yet), `/testimonial/`,
 *   and 7 near-duplicate "meet the team/doctors" URLs (`/our-team`,
 *   `/dentists`, `/doctors`, `/meet-the-doctors`, `/meet-the-team`,
 *   `/our-doctors`, `/staff`) — no equivalent content type exists yet.
 */
export interface LegacyRedirect {
  from: string;
  to: string;
}

export const legacyRedirects: LegacyRedirect[] = [
  { from: 'dentist-san-pedro', to: 'san-pedro' }, // 1030 pageviews/90d on legacy site
  { from: 'dentist-lomita', to: 'lomita' }, // 690 pageviews/90d on legacy site
  { from: 'newport', to: 'newport-beach' }, // 86 pageviews/90d on legacy site
  { from: 'cta-form', to: 'contact' }, // 51 pageviews/90d on legacy site (paid-search landing page)
  { from: 'deep-teeth-cleaning-in-newport-beach-guide', to: 'blog/deep-teeth-cleaning-in-newport-beach-guide' }, // 25 pageviews/90d
  { from: 'dentist-torrance', to: 'torrance' }, // 18 pageviews/90d on legacy site
  { from: 'find-full-mouth-reconstruction-in-san-pedro', to: 'blog/find-full-mouth-reconstruction-in-san-pedro' }, // 16 pageviews/90d
  { from: 'prevention', to: 'services' }, // 14 pageviews/90d on legacy site
  { from: 'why-fee-for-dental-practices-offer-better-care-for-patients', to: 'blog/why-fee-for-dental-practices-offer-better-care-for-patients' }, // 13 pageviews/90d
  { from: 'oral-and-gut-bacteria-influence-your-stroke', to: 'blog/oral-and-gut-bacteria-influence-your-stroke' }, // 11 pageviews/90d
  { from: 'emergency-dentist-in-san-pedro', to: 'blog/emergency-dentist-in-san-pedro' }, // 9 pageviews/90d (paid-search pattern)
  { from: 'restorative-care', to: 'services' }, // 9 pageviews/90d on legacy site
  { from: 'choose-dental-veneers-in-lomita', to: 'blog/choose-dental-veneers-in-lomita' }, // 8 pageviews/90d
  { from: 'dental-infection-treatment-in-newport-beach', to: 'blog/dental-infection-treatment-in-newport-beach' }, // 8 pageviews/90d
  { from: 'best-dental-clinic-in-san-pedro-oral-health', to: 'blog/best-dental-clinic-in-san-pedro-oral-health' }, // 7 pageviews/90d
  { from: 'full-mouth-dental-implants-surgery', to: 'blog/full-mouth-dental-implants-surgery' }, // 7 pageviews/90d
  { from: 'what-is-cosmetic-dentistry-and-how-can-it-improve-your-smile', to: 'blog/what-is-cosmetic-dentistry-and-how-can-it-improve-your-smile' }, // 7 pageviews/90d
  { from: 'category/all-on-4-dental', to: 'blog' }, // 7 pageviews/90d (WP category archive)
  { from: 'best-affordable-dentist-in-san-pedro', to: 'blog/best-affordable-dentist-in-san-pedro' }, // 6 pageviews/90d
  { from: 'broken-tooth-repair-in-san-pedro', to: 'blog/broken-tooth-repair-in-san-pedro' }, // 6 pageviews/90d
  { from: 'complete-guide-to-dental-veneers-in-lomita', to: 'blog/complete-guide-to-dental-veneers-in-lomita' }, // 6 pageviews/90d
  { from: 'deep-cleaning-dentist-in-newport-beach', to: 'blog/deep-cleaning-dentist-in-newport-beach' }, // 6 pageviews/90d
  { from: 'dr-smile-membership-plan', to: 'blog/dr-smile-membership-plan' }, // 6 pageviews/90d
  { from: 'same-day-dentist-in-lomita-tooth-pain-relief', to: 'blog/same-day-dentist-in-lomita-tooth-pain-relief' }, // 6 pageviews/90d
  { from: 'sedation-dentistry-in-newport-beach-health', to: 'blog/sedation-dentistry-in-newport-beach-health' }, // 6 pageviews/90d
  { from: 'en-us', to: '' }, // 6 pageviews/90d (stray locale-switcher artifact) -> homepage
  { from: 'emergency-tooth-extraction-in-lomita', to: 'blog/emergency-tooth-extraction-in-lomita' }, // 5 pageviews/90d
  { from: 'full-mouth-reconstruction-in-san-pedro', to: 'blog/full-mouth-reconstruction-in-san-pedro' }, // 5 pageviews/90d
  { from: 'how-dental-insurance-works', to: 'blog/how-dental-insurance-works' }, // 5 pageviews/90d
  { from: 'how-to-choose-best-dental-clinic-in-lomita', to: 'blog/how-to-choose-best-dental-clinic-in-lomita' }, // 5 pageviews/90d
  { from: 'same-day-dental-implants-safe-benefits-risks', to: 'blog/same-day-dental-implants-safe-benefits-risks' }, // 5 pageviews/90d
  { from: 'where-to-get-affordable-teeth-whitening-in-lomita', to: 'blog/where-to-get-affordable-teeth-whitening-in-lomita' }, // 5 pageviews/90d
  { from: 'category/all-on-4-dental/page/2', to: 'blog' }, // 5 pageviews/90d (WP category archive pagination)
  { from: 'category/business', to: 'blog' }, // 5 pageviews/90d (WP category archive)
  { from: 'advanced-dental-care-in-san-pedro', to: 'blog/advanced-dental-care-in-san-pedro' }, // 4 pageviews/90d
  { from: 'all-on-4-dental-implants-newport-beach', to: 'blog/all-on-4-dental-implants-newport-beach' }, // 4 pageviews/90d
  { from: 'best-dental-clinic-in-newport-beach', to: 'blog/best-dental-clinic-in-newport-beach' }, // 4 pageviews/90d
  { from: 'best-walk-in-dentist-in-torrance', to: 'blog/best-walk-in-dentist-in-torrance' }, // 4 pageviews/90d
  { from: 'bleeding-gums-treatment-guide', to: 'blog/bleeding-gums-treatment-guide' }, // 4 pageviews/90d
  { from: 'cosmetic-dentist-in-newport-beach-tips', to: 'blog/cosmetic-dentist-in-newport-beach-tips' }, // 4 pageviews/90d
  { from: 'iv-sedation-safe-solution-for-dental-anxiety', to: 'blog/iv-sedation-safe-solution-for-dental-anxiety' }, // 4 pageviews/90d
  { from: 'need-to-know-about-all-on-4-dental-implants', to: 'blog/need-to-know-about-all-on-4-dental-implants' }, // 4 pageviews/90d
  { from: 'sedation-dentistry-in-newport-beach', to: 'blog/sedation-dentistry-in-newport-beach' }, // 4 pageviews/90d
  { from: 'sedation-dentistry-newport-beach', to: 'blog/sedation-dentistry-newport-beach' }, // 4 pageviews/90d
  { from: 'tag/advanced-dental-care-in-san-pedro', to: 'blog' }, // 4 pageviews/90d (WP tag archive)
  { from: 'affordable-teeth-whitening-in-lomita', to: 'blog/affordable-teeth-whitening-in-lomita' }, // 3 pageviews/90d
  { from: 'broken-tooth-repair-in-newport-beach', to: 'blog/broken-tooth-repair-in-newport-beach' }, // 3 pageviews/90d
  { from: 'contact-us', to: 'contact' }, // 3 pageviews/90d on legacy site
  { from: 'cosmetic-dentist-in-newport-beach-gummy-smile', to: 'blog/cosmetic-dentist-in-newport-beach-gummy-smile' }, // 3 pageviews/90d
  { from: 'cosmetic-dentistry-consultation-oc', to: 'blog/cosmetic-dentistry-consultation-oc' }, // 3 pageviews/90d
  { from: 'dental-implant-after-tooth-extraction', to: 'blog/dental-implant-after-tooth-extraction' }, // 3 pageviews/90d
  { from: 'dental-implants-in-san-pedro-oral-health', to: 'blog/dental-implants-in-san-pedro-oral-health' }, // 3 pageviews/90d
  { from: 'dental-veneer-care-tips-long-lasting-smile', to: 'blog/dental-veneer-care-tips-long-lasting-smile' }, // 3 pageviews/90d
  { from: 'dentist-newport', to: 'newport-beach' }, // 3 pageviews/90d on legacy site (paid-search pattern)
  { from: 'full-mouth-restoration-in-lomita-life-changing-benefits', to: 'blog/full-mouth-restoration-in-lomita-life-changing-benefits' }, // 3 pageviews/90d
  { from: 'how-to-prepare-for-all-on-4-dental-implant', to: 'blog/how-to-prepare-for-all-on-4-dental-implant' }, // 3 pageviews/90d
  { from: 'invisalign-aligning-your-smile-the-beautiful-way', to: 'blog/invisalign-aligning-your-smile-the-beautiful-way' }, // 3 pageviews/90d
  { from: 'invisalign-in-torrance-for-families', to: 'blog/invisalign-in-torrance-for-families' }, // 3 pageviews/90d
  { from: 'iv-sedation-a-gentle-approach-to-stress-free-dental-care', to: 'blog/iv-sedation-a-gentle-approach-to-stress-free-dental-care' }, // 3 pageviews/90d
  { from: 'locations/san-pedro-ca-dentist', to: 'san-pedro' }, // 3 pageviews/90d on legacy site
  { from: 'professional-gum-disease-treatment-in-lomita', to: 'blog/professional-gum-disease-treatment-in-lomita' }, // 3 pageviews/90d
  { from: 'same-day-dentist-in-torrance', to: 'blog/same-day-dentist-in-torrance' }, // 3 pageviews/90d
  { from: 'straighten-your-smile-discreetly-invisalign', to: 'blog/straighten-your-smile-discreetly-invisalign' }, // 3 pageviews/90d
  { from: 'tmj-treatment-guide-pain-relief', to: 'blog/tmj-treatment-guide-pain-relief' }, // 3 pageviews/90d
  { from: 'top-benefits-of-a-same-day-dentist-in-lomita', to: 'blog/top-benefits-of-a-same-day-dentist-in-lomita' }, // 3 pageviews/90d
  { from: 'why-choosing-family-dentist-in-san-pedro-matters', to: 'blog/why-choosing-family-dentist-in-san-pedro-matters' }, // 3 pageviews/90d
  { from: 'category/uncategorized', to: 'blog' }, // 3 pageviews/90d (WP category archive)
  { from: 'affordable-best-dentist-in-newport', to: 'blog/affordable-best-dentist-in-newport' }, // 2 pageviews/90d
  { from: 'benefits-of-full-mouth-dental-implants', to: 'blog/benefits-of-full-mouth-dental-implants' }, // 2 pageviews/90d
  { from: 'best-dentist-in-san-pedro-emergency', to: 'blog/best-dentist-in-san-pedro-emergency' }, // 2 pageviews/90d
  { from: 'best-family-dentist-in-torrance', to: 'blog/best-family-dentist-in-torrance' }, // 2 pageviews/90d
  { from: 'choosing-local-general-dentist-in-lomita', to: 'blog/choosing-local-general-dentist-in-lomita' }, // 2 pageviews/90d
  { from: 'cosmetic-dentist-in-newport-beach-smile', to: 'blog/cosmetic-dentist-in-newport-beach-smile' }, // 2 pageviews/90d
  { from: 'cosmetic-dentist-in-newport-beach-teeth-whitening', to: 'blog/cosmetic-dentist-in-newport-beach-teeth-whitening' }, // 2 pageviews/90d
  { from: 'cosmetic-dentist-in-newport-beach', to: 'blog/cosmetic-dentist-in-newport-beach' }, // 2 pageviews/90d
  { from: 'deep-gum-disease-treatment-in-lomita', to: 'blog/deep-gum-disease-treatment-in-lomita' }, // 2 pageviews/90d
  { from: 'dentist-lomita-2', to: 'lomita' }, // 2 pageviews/90d on legacy site (paid-search A/B variant)
  { from: 'does-invisalign-transform-your-smile', to: 'blog/does-invisalign-transform-your-smile' }, // 2 pageviews/90d
  { from: 'emergency-broken-tooth-repair-in-san-pedro', to: 'blog/emergency-broken-tooth-repair-in-san-pedro' }, // 2 pageviews/90d
  { from: 'full-mouth-restoration-in-lomita-pain-free', to: 'blog/full-mouth-restoration-in-lomita-pain-free' }, // 2 pageviews/90d
  { from: 'full-mouth-restoration-in-lomita-quality', to: 'blog/full-mouth-restoration-in-lomita-quality' }, // 2 pageviews/90d
  { from: 'gum-disease-treatment-in-lomita', to: 'blog/gum-disease-treatment-in-lomita' }, // 2 pageviews/90d
  { from: 'how-dentist-in-lomita-prevent-gum-disease', to: 'blog/how-dentist-in-lomita-prevent-gum-disease' }, // 2 pageviews/90d
  { from: 'how-gum-disease-treatment-in-lomita', to: 'blog/how-gum-disease-treatment-in-lomita' }, // 2 pageviews/90d
  { from: 'how-to-choose-best-family-dentist-in-lomita', to: 'blog/how-to-choose-best-family-dentist-in-lomita' }, // 2 pageviews/90d
  { from: 'implant_dentist_in_newport_beach', to: 'newport-beach' }, // 2 pageviews/90d on legacy site
  { from: 'local-dentists-in-newport-beach', to: 'blog/local-dentists-in-newport-beach' }, // 2 pageviews/90d
  { from: 'overcome-dental-anxiety-with-sedation-dentistry', to: 'blog/overcome-dental-anxiety-with-sedation-dentistry' }, // 2 pageviews/90d
  { from: 'periodontist-gum-disease-treatment-in-lomita', to: 'blog/periodontist-gum-disease-treatment-in-lomita' }, // 2 pageviews/90d
  { from: 'sedation-dentistry-in-newport-beach-comfort', to: 'blog/sedation-dentistry-in-newport-beach-comfort' }, // 2 pageviews/90d
  { from: 'sedation-dentistry-in-orange-county', to: 'blog/sedation-dentistry-in-orange-county' }, // 2 pageviews/90d
  { from: 'silent-connection-gum-disease-stomach-cancer', to: 'blog/silent-connection-gum-disease-stomach-cancer' }, // 2 pageviews/90d
  { from: 'stem-cells-in-oral-surgery', to: 'blog/stem-cells-in-oral-surgery' }, // 2 pageviews/90d
  { from: 'urgent-dental-care-in-newport-beach', to: 'blog/urgent-dental-care-in-newport-beach' }, // 2 pageviews/90d
  { from: 'urgent-dental-care-in-torrance-relief', to: 'blog/urgent-dental-care-in-torrance-relief' }, // 2 pageviews/90d
  { from: 'what-to-expect-full-mouth-restoration-in-lomita', to: 'blog/what-to-expect-full-mouth-restoration-in-lomita' }, // 2 pageviews/90d
  { from: 'category/dental-implants', to: 'blog' }, // 2 pageviews/90d (WP category archive)
  { from: 'category/health-wellness', to: 'blog' }, // 2 pageviews/90d (WP category archive)
  { from: 'category/important-announcements', to: 'blog' }, // 2 pageviews/90d (WP category archive)
  { from: 'category/iv-sedation', to: 'blog' }, // 2 pageviews/90d (WP category archive)
  { from: 'tag/laugh', to: 'blog' }, // 2 pageviews/90d (WP tag archive)

  // --- 2026-08-19 top-up from the 365-day GA4 dead-URL pull (property 446120868,
  //     doctorsmileonline.com only). See local-reports/404-handling-strategy.md.
  //     Existing entries above are NOT duplicated here.
  //
  //     STAGED FOR CUTOVER: the WordPress site is still live; these stubs only
  //     take effect once this Astro site becomes the live doctorsmileonline.com.
  //     They do NOT fix the current WordPress 404s (handle those on WP now — see
  //     local-reports/wordpress-404-consultant-response.md).

  // Legacy .html office/service pages -> nearest live page.
  { from: 'san-pedro-office.html', to: 'san-pedro' }, // 49 pageviews/365d
  { from: 'dentist-in-newport.html', to: 'newport-beach' }, // 7
  { from: 'emergency-newport.html', to: 'newport-beach' }, // 6
  { from: 'Lomita-Office.html', to: 'lomita' }, // 5
  { from: 'dentist-in-san-pedro.html', to: 'san-pedro' }, // 2
  { from: 'emergency-dentist-in-san-pedro.html', to: 'san-pedro' }, // 2
  { from: 'invisalign.html', to: 'invisalign-orthodontcs' }, // 3 (note: the live slug is intentionally misspelled)
  { from: 'services.html', to: 'services' }, // 3
  { from: 'offices.html', to: 'location' }, // 4
  { from: 'wisdom-tooth.html', to: 'oral-surgery' }, // 2
  { from: 'denture.html', to: 'services' }, // 3
  { from: 'appointment.html', to: 'contact' }, // 1
  { from: 'specific-service/contact.html', to: 'contact' }, // 2

  // Old team/nav slugs -> /about/ (no dedicated team page exists yet).
  { from: 'doctors', to: 'about' }, // 20 pageviews/365d
  { from: 'our-team', to: 'about' }, // 20
  { from: 'meet-the-doctors', to: 'about' }, // 19
  { from: 'meet-the-team', to: 'about' }, // 19
  { from: 'our-doctors', to: 'about' }, // 19
  { from: 'dentists', to: 'about' }, // 18
  { from: 'staff', to: 'about' }, // 17
  { from: 'about-us', to: 'about' }, // 10
  { from: 'aboutus', to: 'about' }, // 4
  { from: 'providers', to: 'about' }, // 5
  { from: 'our-physicians/dr-kayvon-javid', to: 'about' }, // 2

  // Contact / booking slugs -> /contact/ (or the matching city page).
  { from: 'contactus', to: 'contact' }, // 4 pageviews/365d
  { from: 'contacts', to: 'contact' }, // 4
  { from: 'new-patients', to: 'contact' }, // 9
  { from: 'appointments', to: 'contact' }, // 1
  { from: 'contact-us-lomita-ca', to: 'lomita' }, // 16
  { from: 'contact-us-san-pedro-ca', to: 'san-pedro' }, // 2

  // Service slugs -> nearest live service page.
  { from: 'oral-surgery', to: 'oral-surgery' }, // 12 pageviews/365d (trailing-slash/case artifact)
  { from: 'crowns-bridges', to: 'services' }, // 8
  { from: 'root-canals', to: 'services' }, // 7
  { from: 'root-canal', to: 'services' }, // 4
  { from: 'orthodontics', to: 'invisalign-orthodontcs' }, // 5
  { from: 'tmj', to: 'oral-surgery' }, // 5
  { from: 'tmj-treatment', to: 'oral-surgery' }, // 2
  { from: 'gum-disease-treatments', to: 'services' }, // 3
  { from: 'pinhole-surgical-treatment', to: 'services' }, // 6
  { from: 'complex-dentistry', to: 'services' }, // 5
  { from: 'cosmetic-dentistry', to: 'cosmetic-care' }, // 4
  { from: 'veneers-vs-crowns', to: 'dental-veneers-guide' }, // 7
  { from: 'dental-implants-or-dentures', to: 'dental-implant-guide' }, // 6
  { from: 'emergency-dentistry', to: 'services' }, // 3

  // Legacy /locations/{city}-ca-dentist/ landing pages -> the matching /{city}/ page.
  // (locations/san-pedro-ca-dentist is already mapped above.)
  { from: 'locations/torrance-ca-dentist', to: 'torrance' }, // 3 pageviews/365d
  { from: 'locations/lomita-ca-dentist', to: 'lomita' }, // 3
  { from: 'locations/newport-beach-ca-dentist', to: 'newport-beach' }, // 2
  // Whittier is NOT a served office -> send to the location finder, never a page.
  { from: 'locations/whittier-ca-dentist', to: 'location' }, // 3
];
