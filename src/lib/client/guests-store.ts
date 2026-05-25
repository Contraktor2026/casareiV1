"use client";

import type { Guest } from "@/types/guests";

const GUESTS_KEY = "casarei:guests";

export function getStoredGuests(): Guest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredGuests(guests: Guest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
  window.dispatchEvent(new CustomEvent("casarei:guests-updated"));
}
