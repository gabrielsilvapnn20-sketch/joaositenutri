import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F8F7F2", 2: "#F0EEE6" },
        mint: { DEFAULT: "#E2F1E5", 2: "#CDE8D4" },
        leaf: { DEFAULT: "#2E9C5A", deep: "#114E2F", soft: "#7CC596" },
        ink: { DEFAULT: "#16271D", 2: "#3A4A40" },
        mute: "#6E7B72",
        sand: "#F2EADA",
        sun: "#F4C152",
        line: "rgba(22,39,29,0.12)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { blob: "42% 58% 55% 45% / 48% 42% 58% 52%" },
      boxShadow: {
        soft: "0 1px 2px rgba(22,39,29,.04), 0 12px 32px -12px rgba(22,39,29,.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
