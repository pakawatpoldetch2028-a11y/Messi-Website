// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH can be set as environment variables by a deploy
// workflow (see .github/workflows/deploy.yml). Locally they fall back to
// sensible defaults so `npm run dev` and `npm run build` just work.
//
// When you have a custom domain, put it in SITE_URL (for example
// https://messipoldetch.com) and set BASE_PATH to "/".
const site = process.env.SITE_URL ?? 'https://pakawatpoldetch2028-a11y.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [sitemap()],
  image: {
    // Images referenced from content files live in src/assets/images and are
    // optimised at build time (see src/lib/images.ts).
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    format: 'directory',
  },
});
