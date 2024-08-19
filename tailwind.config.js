/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundImage: {
        beach: "url('/beach_compressed.jpg')",
      },
      fontFamily: {
        ibm_plex_mono: "IBM Plex Mono",
      },
    },
  },
  plugins: [],
};
