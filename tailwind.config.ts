import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,css}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#588604",    // Green
        secondary: "#a76b47",  // Brownish-orange
        accent: "#022b4d",     // Dark blue
        background: "#ffffff", // Light background
        text: "#10192c",       // Dark text
        dark: {
          primary: "#405c03",   // Dark mode green
          secondary: "#6b422c", // Dark mode brownish-orange
          accent: "#011a31",    // Dark mode blue
          background: "#0a0a0a",
          text: "#e5e7eb"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
};

export default config;
