export type EssenceTag =
  | "romantico"
  | "moderno"
  | "elegante"
  | "leve"
  | "sofisticado"
  | "intimista"
  | "natural"
  | "classico"
  | "praia"
  | "boho";

export type ReferenceOrigin = "upload" | "pinterest" | "instagram" | "print" | "site" | "outro";

export type EssencePaletteColor = {
  name: string;
  hex: string;
  description: string;
};

export type KeyReference = {
  id: string;
  title: string;
  category: string;
  reason: string;
  emotionalTag: string;
  imageUrl: string;
  tags: EssenceTag[];
  origin: ReferenceOrigin;
  relatedVendor?: string;
  isMain: boolean;
};

export type WeddingEssence = {
  coupleName: string;
  dominantStyle: string;
  emotionalMood: string;
  palette: EssencePaletteColor[];
  references: KeyReference[];
  lovedItems: string[];
  avoidedItems: string[];
  briefing: string;
  sofiaInsight: string;
};

export type ReferenceFormValues = {
  title: string;
  imageUrl: string;
  category: string;
  reason: string;
  represents: string;
  tags: EssenceTag[];
  origin: ReferenceOrigin;
  relatedVendor: string;
};
