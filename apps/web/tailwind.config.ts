import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        foreground: "#f8fafc",
        card: "#0f172a",
        cardBorder: "#1e293b",
        accent: "#0284c7",
        accentHover: "#0369a1",
        brandHighlight: "#38bdf8",
      },
    },
  },
  plugins: [],
};
export default config;
