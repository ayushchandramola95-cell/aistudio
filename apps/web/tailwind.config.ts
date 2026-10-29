import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        studio: {
          950: "#090A0F",
          900: "#0F111A",
          850: "#151824",
          800: "#1C2030",
          700: "#282E45",
          600: "#3D4666",
        },
        accent: {
          purple: "#7C3AED",
          indigo: "#6366F1",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
