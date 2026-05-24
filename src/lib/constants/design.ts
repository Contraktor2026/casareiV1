export const designTokens = {
  colors: {
    primary: "#D4537E",
    primaryDark: "#993556",
    primaryDeep: "#72243E",
    primaryLight: "#F4C0D1",
    primaryBg: "#FBEAF0",
    ink: "#1a1a1a",
    text: "#444441",
    muted: "#888780",
    border: "#D3D1C7",
    borderSoft: "#E5E3DA",
    cream: "#FAF3E7",
    success: "#1D9E75",
    warning: "#BA7517",
    danger: "#E24B4A",
    whatsapp: "#25D366"
  },
  radius: {
    card: "16px",
    control: "12px",
    pill: "999px"
  },
  fonts: {
    serif: "Playfair Display",
    sans: "Inter"
  }
} as const;

export const appNavigation = [
  { href: "/app", label: "Inicio", icon: "Home" },
  { href: "/app/convidados", label: "Convidados", icon: "Users" },
  { href: "/app/presenca-mesas", label: "Presença", icon: "Heart" },
  { href: "/app/orcamento", label: "Financeiro", icon: "Wallet" },
  { href: "/app/sofia", label: "Sofia", icon: "Sparkles" }
] as const;
