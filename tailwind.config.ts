import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        s1: "var(--s1)",
        s2: "var(--s2)",
        s3: "var(--s3)",
        b1: "var(--b1)",
        b2: "var(--b2)",
        t1: "var(--t1)",
        t2: "var(--t2)",
        t3: "var(--t3)",
        ac: "var(--ac)",
        ac2: "var(--ac2)",
        live: "var(--live)",
        win: "var(--win)",
        loss: "var(--loss)",
        draw: "var(--draw)",
        // aliases semanticos para compatibilidad con codigo existente
        surface: "var(--s1)",
        surface2: "var(--s2)",
        surface3: "var(--s3)",
        border: "var(--b1)",
        border2: "var(--b2)",
        text: "var(--t1)",
        text2: "var(--t2)",
        text3: "var(--t3)",
        accent: "var(--ac)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      fontSize: {
        label: ["9px", { lineHeight: "1.4", letterSpacing: "0.12em" }],
        caption: ["11px", { lineHeight: "1.5" }],
        body: ["13px", { lineHeight: "1.5" }],
      },
    },
  },
} satisfies Config;

export default config;
