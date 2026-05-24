import type { RsvpTemplate, RsvpTemplateSettings } from "@/types/guests";

export const mockRsvpTemplates: RsvpTemplate[] = [
  {
    id: "romantico-classico",
    name: "Romântico clássico",
    description: "Floral, creme e serifado.",
    mood: "Delicado e atemporal",
    palette: ["#FFF7F2", "#D4537E", "#7A4A43"],
    serif: true,
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "moderno-elegante",
    name: "Moderno elegante",
    description: "Minimalista, clean e sofisticado.",
    mood: "Leve e editorial",
    palette: ["#FFFFFF", "#111111", "#D8C7BD"],
    serif: true,
    cover: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "praia",
    name: "Praia",
    description: "Claro, leve e tropical elegante.",
    mood: "Solar e calmo",
    palette: ["#F7FBFA", "#77B6B2", "#EBCB9C"],
    serif: false,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "noturno-sofisticado",
    name: "Noturno sofisticado",
    description: "Preto, dourado e luxo.",
    mood: "Dramático e premium",
    palette: ["#171214", "#C8A96A", "#FFF8EC"],
    serif: true,
    cover: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "boho",
    name: "Boho",
    description: "Terroso, orgânico e delicado.",
    mood: "Natural e afetuoso",
    palette: ["#FAF3E7", "#B8795D", "#6C4D3F"],
    serif: true,
    cover: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=900&q=80"
  }
];

export const defaultRsvpSettings: RsvpTemplateSettings = {
  coverPhoto: mockRsvpTemplates[0].cover,
  couplePhoto: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
  primaryColor: "#D4537E",
  backgroundColor: "#FFF7F2",
  fontStyle: "Serifada elegante",
  heroPhrase: "Estamos muito felizes em compartilhar esse momento com você.",
  message: "Mariana & Rafael querem celebrar esse dia especial com você.",
  buttonText: "Confirmar presença",
  countdown: true,
  music: false,
  map: true,
  dressCode: true,
  extraMessage: true,
  limitCompanions: true,
  allowChildren: true,
  requirePhone: false,
  requireCompanionName: true,
  requireFoodRestriction: false,
  ceremonyConfirmation: true,
  partyConfirmation: true,
  dinnerConfirmation: false,
  customFinalMessage: true
};
