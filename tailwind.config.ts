import type { Config } from "tailwindcss";

import daisyui from "daisyui";

import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        text: "var(--text)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      },

      scrollbar: ["rounded"],

      container: {
        screens: {
          DEFAULT: "1440px",
        },
        center: true,
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        
        "charging-bar": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "charging-bar": "charging-bar 5s linear",
      },
    },
  },
  plugins: [daisyui, scrollbarHide],
  daisyui: {
    themes: ["var(--background)"],
  },
} satisfies Config;
