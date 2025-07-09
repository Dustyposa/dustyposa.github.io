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
          theme: 'dark',
          themeVariables: {
            // 流程图颜色配置
            primaryColor: '#1f2937',
            primaryTextColor: '#f9fafb',
            primaryBorderColor: '#6b7280',
            lineColor: '#9ca3af',
            sectionBkgColor: '#374151',
            altSectionBkgColor: '#4b5563',
            gridColor: '#6b7280',
            secondaryColor: '#374151',
            tertiaryColor: '#4b5563',
            // 节点颜色
            background: '#1f2937',
            mainBkg: '#374151',
            secondBkg: '#4b5563',
            tertiaryBkg: '#6b7280',
            // 文字颜色
            textColor: '#f9fafb',
            darkTextColor: '#f9fafb',
            // 边框和线条
            stroke: '#9ca3af',
            fill: '#374151',
            // 特殊节点颜色
            nodeBkg: '#374151',
            nodeBorder: '#9ca3af',
            clusterBkg: '#4b5563',
            clusterBorder: '#6b7280',
            defaultLinkColor: '#9ca3af',
            titleColor: '#f9fafb',
            edgeLabelBackground: '#1f2937',
            // 流程图特定配置
            flowchartNodeBkg: '#374151',
            flowchartNodeBorder: '#9ca3af',
            flowchartLinkColor: '#9ca3af',
            flowchartInvTextColor: '#f9fafb'
          },
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
