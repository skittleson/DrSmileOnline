import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeLegacyOutboundLinks } from './src/utils/rehype-legacy-outbound-links.mjs';
import { remarkNapVars } from './src/utils/remark-nap-vars.mjs';
import { legacyRedirects } from './src/data/legacy-redirects.ts';

const legacyRedirectSlugs = new Set(legacyRedirects.map((r) => r.from));

export default defineConfig({
  base: '/DrSmileOnline/',
  site: 'https://skittleson.github.io',
  integrations: [
    sitemap({
      filter: (page) => {
        // 404 pages are crawlable-but-noindex (see Base.astro `noindex`
        // prop); exclude them so we're not asking Google to index a URL
        // we've also told it not to index.
        if (page.endsWith('/404/')) return false;
        // Legacy-URL redirect stubs (src/pages/[...legacyPath].astro) are
        // also noindex -- they exist only to soft-301 old WordPress URLs
        // to their new home. Exclude them the same way; the *target* pages
        // they point at are already in the sitemap on their own.
        const slug = page.replace(/^https?:\/\/[^/]+\/DrSmileOnline\//, '').replace(/\/$/, '');
        return !legacyRedirectSlugs.has(slug);
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkNapVars],
    rehypePlugins: [rehypeLegacyOutboundLinks],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
