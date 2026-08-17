import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  base: '/dr-smile-static/',
  site: 'https://skittleson.github.io',
  integrations: [sitemap()],
});
