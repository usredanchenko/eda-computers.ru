import type { Config } from "tailwindcss";
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { bg:"#0A0A0A", surface:"#101820", neon:{ cyan:"#00F0FF", magenta:"#FF00E6" } },
      boxShadow: { glow:"0 0 24px rgba(0,240,255,.35), 0 0 48px rgba(255,0,230,.25)" },
      fontFamily: { orbitron:["var(--font-orbitron)"], inter:["var(--font-inter)"] },
      screens: { xs: "380px" }
    }
  },
  plugins: [],
} satisfies Config;