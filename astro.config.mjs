import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  base: '/DrSmileOnline/',
  site: 'https://skittleson.github.io',
  integrations: [sitemap()],
});
