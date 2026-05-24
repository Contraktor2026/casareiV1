import type { WeddingEssence } from "@/types/essence";

export const mockWeddingEssence: WeddingEssence = {
  coupleName: "Mariana & Rafael",
  dominantStyle: "Leve • romântico • elegante • acolhedor",
  emotionalMood: "luz quente, flores delicadas e uma atmosfera sem exageros",
  palette: [
    { name: "Off white", hex: "#FFFDF9", description: "base clara e delicada" },
    { name: "Rosé", hex: "#D4537E", description: "toque romântico e feminino" },
    { name: "Verde oliva", hex: "#7A8A65", description: "naturalidade e equilíbrio" },
    { name: "Dourado suave", hex: "#C8A96A", description: "brilho elegante, sem excesso" }
  ],
  references: [
    {
      id: "cerimonia-por-do-sol",
      title: "Cerimônia ao pôr do sol",
      category: "Cerimônia",
      reason: "A luz deixa tudo mais acolhedor e transforma a entrada em um momento inesquecível.",
      emotionalTag: "acolhedor",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop",
      tags: ["romantico", "natural", "elegante"],
      origin: "site",
      isMain: true
    },
    {
      id: "mesa-posta-delicada",
      title: "Mesa posta delicada",
      category: "Decoração",
      reason: "Mistura tons claros, texturas leves e uma sensação de recepção carinhosa.",
      emotionalTag: "delicado",
      imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&auto=format&fit=crop",
      tags: ["elegante", "classico", "leve"],
      origin: "pinterest",
      relatedVendor: "Decoradora",
      isMain: true
    },
    {
      id: "flores-claras",
      title: "Flores claras e naturais",
      category: "Flores",
      reason: "Tem romantismo sem pesar e combina com a ideia de um casamento luminoso.",
      emotionalTag: "romântico",
      imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&auto=format&fit=crop",
      tags: ["romantico", "natural", "sofisticado"],
      origin: "instagram",
      relatedVendor: "Decoradora",
      isMain: false
    },
    {
      id: "vestido-leve",
      title: "Vestido leve",
      category: "Noiva",
      reason: "Passa movimento, conforto e elegância, sem um visual formal demais.",
      emotionalTag: "leve",
      imageUrl: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&auto=format&fit=crop",
      tags: ["leve", "elegante", "romantico"],
      origin: "site",
      isMain: false
    },
    {
      id: "fotos-espontaneas",
      title: "Fotos espontâneas",
      category: "Fotografia",
      reason: "Mostra o dia como ele foi sentido, com risos, abraços e movimento real.",
      emotionalTag: "verdadeiro",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop",
      tags: ["natural", "intimista", "leve"],
      origin: "instagram",
      relatedVendor: "Fotógrafo",
      isMain: true
    },
    {
      id: "luz-quente",
      title: "Luz quente",
      category: "Iluminação",
      reason: "Cria um clima mais próximo, bonito nas fotos e confortável para os convidados.",
      emotionalTag: "intimista",
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&auto=format&fit=crop",
      tags: ["intimista", "sofisticado", "elegante"],
      origin: "print",
      relatedVendor: "Iluminação",
      isMain: false
    }
  ],
  lovedItems: [
    "flores naturais",
    "luz quente",
    "cerimônia intimista",
    "fotos espontâneas",
    "mesa delicada",
    "tons claros",
    "decoração leve"
  ],
  avoidedItems: [
    "excesso de brilho",
    "decoração pesada",
    "cores muito fortes",
    "luz fria",
    "festa formal demais",
    "visual artificial"
  ],
  briefing:
    "Queremos um casamento romântico, leve e elegante. Gostamos de flores naturais, tons suaves, luz quente e uma atmosfera acolhedora. Preferimos evitar excesso de brilho, decoração pesada e cores muito fortes.",
  sofiaInsight:
    "Mari, percebi que vocês gostam de luz quente, flores delicadas e uma atmosfera acolhedora. Isso aponta para um casamento romântico, elegante e sem exageros."
};

export const essenceTags = [
  "romantico",
  "moderno",
  "elegante",
  "leve",
  "sofisticado",
  "intimista",
  "natural",
  "classico",
  "praia",
  "boho"
] as const;

export const referenceOrigins = ["upload", "pinterest", "instagram", "print", "site", "outro"] as const;
