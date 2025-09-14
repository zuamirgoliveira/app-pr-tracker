import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,css}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: { dark: "#1e3a5f", light: "#2563eb", accent: "#3b82f6" },
        bg: { gradient: { start: "#0f172a", end: "#1e293b" } },
        text: { light: "#f8fafc", secondary: "#cbd5e1" },
        border: { DEFAULT: "#334155" },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,0.08)" },
      fontFamily: {
        sans: ["Lexend Deca", ...defaultTheme.fontFamily.sans],
        michroma: ["Michroma", "sans-serif"],
        lexend: ["Lexend Deca", "sans-serif"],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;