import type { GuestRsvpStatus } from "@/types/guests";

const RSVP_RESPONSES_KEY = "casarei:rsvp-responses";
const RSVP_SETTINGS_KEY = "casarei:rsvp-settings";

export type StoredRsvpResponse = {
  token: string;
  status: GuestRsvpStatus;
  adults: number;
  children: number;
  companionNames: string[];
  food: string;
  note: string;
  respondedAt: string;
};

export type StoredRsvpSettings = {
  initials: string;
  greeting: string;
  message: string;
  coverImageUrl: string;
  buttonText: string;
  allowCompanions: boolean;
  allowChildren: boolean;
  askFood: boolean;
};

export const defaultRsvpSettings: StoredRsvpSettings = {
  initials: "MA",
  greeting: "Oi, Mari!",
  message: "Será uma alegria ter você conosco neste dia tão especial.",
  buttonText: "Enviar confirmação",
  coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  allowCompanions: true,
  allowChildren: true,
  askFood: true
};

export function getStoredRsvpResponses(): StoredRsvpResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RSVP_RESPONSES_KEY);
    return raw ? (JSON.parse(raw) as StoredRsvpResponse[]) : [];
  } catch {
    return [];
  }
}

export function saveRsvpResponse(response: StoredRsvpResponse) {
  if (typeof window === "undefined") return;
  const current = getStoredRsvpResponses().filter((item) => item.token !== response.token);
  window.localStorage.setItem(RSVP_RESPONSES_KEY, JSON.stringify([response, ...current]));
}

export function getStoredRsvpSettings(): StoredRsvpSettings {
  if (typeof window === "undefined") return defaultRsvpSettings;
  try {
    const raw = window.localStorage.getItem(RSVP_SETTINGS_KEY);
    return raw ? { ...defaultRsvpSettings, ...(JSON.parse(raw) as Partial<StoredRsvpSettings>) } : defaultRsvpSettings;
  } catch {
    return defaultRsvpSettings;
  }
}

export function saveRsvpSettings(settings: StoredRsvpSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RSVP_SETTINGS_KEY, JSON.stringify(settings));
}
