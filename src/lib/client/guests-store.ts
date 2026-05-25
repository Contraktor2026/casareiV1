"use client";

import type { Guest } from "@/types/guests";
import { getUserId } from "@/lib/client/supabase-auth";

function guestsKey(): string {
  const uid = getUserId();
  return uid ? `casarei:${uid}:guests` : "casarei:guests";
}

export function getStoredGuests(): Guest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(guestsKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredGuests(guests: Guest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(guestsKey(), JSON.stringify(guests));
  window.dispatchEvent(new CustomEvent("casarei:guests-updated"));
}
