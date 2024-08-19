import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  outDir: "./docs",
  site: "https://cletusigwe.com/sandra",
});
