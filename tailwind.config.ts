import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0D0E0C", 2: "#151713", 3: "#1E201B" },
        bone: { DEFAULT: "#ECE9E1", 2: "#D9D5CA" },
        mute: "#8B8980",
        signal: { DEFAULT: "#FF5A1F", soft: "#FF8A5C" },
        line: "rgba(236,233,225,0.12)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.055em" },
    },
  },
  plugins: [],
} satisfies Config;
