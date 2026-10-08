import { defineConfig } from 'astro/config';

export default defineConfig({
  // Astro bakes `site` into canonical URLs and social cards. The deploy
  // workflow sets SITE_URL to the host you actually serve from; set it yourself
  // for a local build you mean to ship. A share preview pointing at the wrong
  // host is the one mistake here that other sites act on.
  site: process.env.SITE_URL || 'https://example.one9x.app',
  // output: 'static' is the default. An adapter or output: 'server' produces a
  // build that needs a runtime, which is not deployable as files.
});
