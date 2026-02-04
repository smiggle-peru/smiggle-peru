import type { Config } from "tailwindcss";

export default {
  // 🔒 Fuerza control por clase (y como no usamos `dark`, nunca entra)
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
} satisfies Config;
