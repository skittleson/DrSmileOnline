// Canonical EN→ES path map, as a single source of truth for hreflang pairs.
// The nav display map in components/Header.astro is intentionally separate
// (it's UI copy); this one is for SEO and must stay in sync with the actual
// routes under src/pages/ and src/pages/es/.
//
// Path format: site-relative, trailing slash, no base prefix.
// `en: '/'` means the EN root. `es: null` means there is no Spanish counterpart
// (the EN page is the only version — e.g. blog, 404).

export interface LocalePair {
  en: string;
  es: string | null;
}

export const localePairs: LocalePair[] = [
  { en: '/', es: '/es/' },
  { en: '/about/', es: '/es/nosotros/' },
  { en: '/faqs/', es: '/es/preguntas-frecuentes/' },
  { en: '/services/', es: '/es/servicios/' },
  { en: '/oral-surgery/', es: '/es/cirugia-bucal/' },
  { en: '/cosmetic-care/', es: '/es/cuidado-cosmetico/' },
  { en: '/invisalign-orthodontcs/', es: '/es/invisalign-ortodoncia/' },
  { en: '/all-on-four-prosthetics/', es: '/es/all-on-four/' },
  { en: '/dental-implant-guide/', es: '/es/guia-implantes/' },
  { en: '/dental-veneers-guide/', es: '/es/guia-carillas/' },
  { en: '/dental-invisalign-treatment/', es: '/es/tratamiento-invisalign/' },
  { en: '/location/', es: '/es/ubicacion/' },
  { en: '/financing/', es: '/es/financiamiento/' },
  { en: '/important-announcements/', es: '/es/anuncios-importantes/' },
  { en: '/contact/', es: '/es/contacto/' },
  { en: '/privacy-policy/', es: '/es/politica-de-privacidad/' },
  { en: '/terms-and-conditions/', es: '/es/terminos-y-condiciones/' },
  { en: '/newport-beach/', es: '/es/newport-beach/' },
  { en: '/san-pedro/', es: '/es/san-pedro/' },
  { en: '/torrance/', es: '/es/torrance/' },
  { en: '/lomita/', es: '/es/lomita/' },
];

// Resolve the ES counterpart for a given EN site-relative path (or vice-versa).
// Returns null when the page has no counterpart (e.g. blog, 404).
export function counterpartPath(
  path: string,
  from: 'en' | 'es',
): string | null {
  const pair = localePairs.find((p) =>
    from === 'en' ? p.en === path : p.es === path,
  );
  if (!pair) return null;
  return from === 'en' ? pair.es : pair.en;
}
