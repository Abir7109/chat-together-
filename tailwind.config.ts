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
        bg: {
          primary: "#F5F5F0",
          secondary: "#E6D8C3",
          tertiary: "#C2A68C",
        },
        sage: {
          DEFAULT: "#5D866C",
          light: "#7A9D86",
          dark: "#4A6B56",
        },
        tan: "#C2A68C",
        beige: "#E6D8C3",
        text: "#2C2C2C",
      },
      backdropBlur: {
        glass: "14px",
      },
      animation: {
        "pulse-typing": "pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
