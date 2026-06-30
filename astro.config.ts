import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://kaizin-lab.github.io",
  base: "/sotajs-website/",
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
