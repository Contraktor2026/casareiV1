"use client";

import type { QuoteProposal } from "@/types/quotes";
import { getUserId } from "@/lib/client/supabase-auth";

function proposalsKey(): string {
  const uid = getUserId();
  return uid ? `casarei:${uid}:quote-proposals` : "casarei:quote-proposals";
}

export function getStoredProposals(): QuoteProposal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(proposalsKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredProposals(proposals: QuoteProposal[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(proposalsKey(), JSON.stringify(proposals));
}
