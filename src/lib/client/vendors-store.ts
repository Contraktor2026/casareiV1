"use client";

import type { Vendor } from "@/types/vendors";

const VENDORS_KEY = "casarei:vendors";
const PENDING_CATEGORIES_KEY = "casarei:pending-vendor-categories";

export function getStoredVendors(): Vendor[] {
  if (typeof window === "undefined") return [];
  return readArray<Vendor>(VENDORS_KEY);
}

export function saveStoredVendors(vendors: Vendor[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  window.dispatchEvent(new CustomEvent("casarei:vendors-updated"));
}

export function upsertStoredVendor(vendor: Vendor) {
  const current = getStoredVendors();
  const exists = current.some((item) => item.id === vendor.id);
  saveStoredVendors(exists ? current.map((item) => (item.id === vendor.id ? vendor : item)) : [vendor, ...current]);
}

export function getStoredPendingCategories(): string[] {
  if (typeof window === "undefined") return [];
  return readArray<string>(PENDING_CATEGORIES_KEY);
}

export function saveStoredPendingCategories(categories: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_CATEGORIES_KEY, JSON.stringify(categories));
}

function readArray<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
