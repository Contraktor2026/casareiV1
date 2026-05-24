"use client";

import { Search } from "lucide-react";

import { vendorCategories, vendorStatuses } from "@/lib/mock/vendors";
import type { VendorCategory, VendorStatus } from "@/types/vendors";
import { cn } from "@/lib/utils";

export function VendorFilters({
  query,
  status,
  category,
  onQuery,
  onStatus,
  onCategory
}: {
  query: string;
  status: "Todos" | VendorStatus;
  category: "Todos" | VendorCategory;
  onQuery: (value: string) => void;
  onStatus: (value: "Todos" | VendorStatus) => void;
  onCategory: (value: "Todos" | VendorCategory) => void;
}) {
  return (
    <section className="space-y-3 rounded-3xl border border-casarei-border-soft bg-white/86 p-4 shadow-[0_18px_50px_rgba(114,36,62,0.06)]">
      <label className="flex items-center gap-2 rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm text-casarei-muted">
        <Search className="h-4 w-4" aria-hidden />
        <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar fornecedor" className="w-full bg-transparent outline-none" />
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {vendorStatuses.map((item) => (
          <button key={item} type="button" onClick={() => onStatus(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-xs font-semibold", status === item ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-border-soft bg-white text-casarei-text")}>{item}</button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {vendorCategories.map((item) => (
          <button key={item} type="button" onClick={() => onCategory(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-xs font-medium", category === item ? "border-casarei-primary-light bg-casarei-primary-bg text-casarei-primary-deep" : "border-casarei-border-soft bg-white/70 text-casarei-muted")}>{item}</button>
        ))}
      </div>
    </section>
  );
}
