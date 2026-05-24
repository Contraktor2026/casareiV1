import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1120px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        casarei: {
          app: "var(--casarei-app-bg)",
          surface: "var(--casarei-surface)",
          "text-primary": "var(--casarei-text-primary)",
          "text-secondary": "var(--casarei-text-secondary)",
          pink: "var(--casarei-pink)",
          "pink-hover": "var(--casarei-pink-hover)",
          "pink-soft": "var(--casarei-pink-soft)",
          green: "var(--casarei-green)",
          "green-soft": "var(--casarei-green-soft)",
          terracotta: "var(--casarei-terracotta)",
          "blue-soft": "var(--casarei-blue-soft)",
          gold: "var(--casarei-gold)",
          primary: "var(--casarei-primary)",
          "primary-dark": "var(--casarei-primary-dark)",
          "primary-deep": "var(--casarei-primary-deep)",
          "primary-light": "var(--casarei-primary-light)",
          "primary-bg": "var(--casarei-primary-bg)",
          cream: "var(--neutral-cream)",
          ink: "var(--neutral-ink)",
          text: "var(--neutral-text)",
          muted: "var(--neutral-muted)",
          border: "var(--neutral-border)",
          "border-soft": "var(--neutral-border-soft)",
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          whatsapp: "var(--whatsapp)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;
