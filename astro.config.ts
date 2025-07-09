import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeMermaid from "rehype-mermaid";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [[
      rehypeMermaid, 
      { 
        strategy: "img-svg", 
        dark: true,
        mermaidConfig: {
          flowchart: {
            useMaxWidth: false
          },
          sequence: {
            useMaxWidth: false
          },
          gantt: {
            useMaxWidth: false
          },
          journey: {
            useMaxWidth: false
          },
          timeline: {
            useMaxWidth: false
          },
          class: {
            useMaxWidth: false
          },
          state: {
            useMaxWidth: false
          },
          er: {
            useMaxWidth: false
          },
          pie: {
            useMaxWidth: false
          },
          quadrantChart: {
            useMaxWidth: false
          },
          xyChart: {
            useMaxWidth: false
          },
          requirement: {
            useMaxWidth: false
          },
          mindmap: {
            useMaxWidth: false
          },
          gitGraph: {
            useMaxWidth: false
          },
          c4: {
            useMaxWidth: false
          },
          sankey: {
            useMaxWidth: false
          }
        }
      }
    ]],
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
