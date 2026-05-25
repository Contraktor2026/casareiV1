import type { WeddingEssence } from "@/types/essence";

export const mockWeddingEssence: WeddingEssence = {
  coupleName: "Seu casamento",
  dominantStyle: "Estilo a definir",
  emotionalMood: "Adicione referências para criar a essência visual.",
  palette: [],
  references: [],
  lovedItems: [],
  avoidedItems: [],
  briefing: "",
  sofiaInsight: "Adicione referências reais para gerar um briefing útil para fornecedores."
};

export const essenceTags = ["romantico", "moderno", "elegante", "leve", "sofisticado", "intimista", "natural", "classico", "praia", "boho"] as const;
export const referenceOrigins = ["upload", "pinterest", "instagram", "print", "site", "outro"] as const;
