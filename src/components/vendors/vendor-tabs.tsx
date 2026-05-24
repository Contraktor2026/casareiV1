"use client";

import { cn } from "@/lib/utils";

export const vendorTabs = ["Resumo", "Contrato", "Pagamentos", "Entregas", "Contatos", "Observações", "Histórico"] as const;
export type VendorTab = (typeof vendorTabs)[number];

export function VendorTabs({ active, onChange }: { active: VendorTab; onChange: (tab: VendorTab) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {vendorTabs.map((tab) => (
        <button key={tab} type="button" onClick={() => onChange(tab)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-semibold", active === tab ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-border-soft bg-white/80 text-casarei-text")}>{tab}</button>
      ))}
    </div>
  );
}
