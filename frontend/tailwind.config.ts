import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        primary: {
            DEFAULT: '#57ADE0', // Primary color Blue
            light: '#add7f0',   // Light variant
            dark: '#217bb0',    // Dark variant
          },
        secondary: {
          DEFAULT: '#F5D029', // Secondary color Yellow
          light: '#fae58a',   // Light variant
          dark: '#b09108',    // Dark variant
        },
      },
    },
  },
  plugins: [],
};
export default config;
