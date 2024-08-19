import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  outDir: "./docs",
  site: "http://cletusigwe.com",
  base: "/sandra",
  build: {
    assets: "_assets",
  },
});
