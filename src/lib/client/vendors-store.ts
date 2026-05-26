"use client";

import type { Vendor } from "@/types/vendors";
import { getUserId } from "@/lib/client/supabase-auth";

function vendorsKey(): string {
  const uid = getUserId();
  return uid ? `casarei:${uid}:vendors` : "casarei:vendors";
}

function pendingCategoriesKey(): string {
  const uid = getUserId();
  return uid ? `casarei:${uid}:pending-vendor-categories` : "casarei:pending-vendor-categories";
}

export function getStoredVendors(): Vendor[] {
  if (typeof window === "undefined") return [];
  return readArray<Vendor>(vendorsKey());
}

export function saveStoredVendors(vendors: Vendor[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(vendorsKey(), JSON.stringify(vendors));
  window.dispatchEvent(new CustomEvent("casarei:vendors-updated"));
}

export function upsertStoredVendor(vendor: Vendor) {
  const current = getStoredVendors();
  const exists = current.some((item) => item.id === vendor.id);
  saveStoredVendors(exists ? current.map((item) => (item.id === vendor.id ? vendor : item)) : [vendor, ...current]);
}

export function deleteStoredVendor(vendorId: string) {
  saveStoredVendors(getStoredVendors().filter((v) => v.id !== vendorId));
}

export function getStoredPendingCategories(): string[] {
  if (typeof window === "undefined") return [];
  return readArray<string>(pendingCategoriesKey());
}

export function saveStoredPendingCategories(categories: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(pendingCategoriesKey(), JSON.stringify(categories));
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
