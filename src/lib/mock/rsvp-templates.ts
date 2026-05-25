import type { RsvpTemplate, RsvpTemplateSettings } from "@/types/guests";

export const mockRsvpTemplates: RsvpTemplate[] = [];

export const defaultRsvpSettings: RsvpTemplateSettings = {
  coverPhoto: "",
  couplePhoto: "",
  primaryColor: "#D96C8A",
  backgroundColor: "#FFF8F4",
  fontStyle: "serif",
  heroPhrase: "",
  message: "",
  buttonText: "Confirmar presença",
  countdown: true,
  music: false,
  map: false,
  dressCode: false,
  extraMessage: false,
  limitCompanions: true,
  allowChildren: true,
  requirePhone: true,
  requireCompanionName: true,
  requireFoodRestriction: true,
  ceremonyConfirmation: true,
  partyConfirmation: true,
  dinnerConfirmation: true,
  customFinalMessage: false
};
