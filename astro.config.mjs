// import { defineConfig } from 'astro/config';
// import mdx from '@astrojs/mdx';
// import sitemap from '@astrojs/sitemap';
// import tailwind from "@astrojs/tailwind";

// export default defineConfig({
//   output: 'static',
//   integrations: [mdx(), sitemap(), tailwind()],
// });

import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import tailwind from "@astrojs/tailwind";

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({

  output: 'static',

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  integrations: [mdx(), sitemap(), tailwind()],

});
