"use client";

import { Copy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Vendor } from "@/types/vendors";

export function VendorCeremonialSummaryModal({ open, vendors, onClose }: { open: boolean; vendors: Vendor[]; onClose: () => void }) {
  if (!open) return null;
  const closed = vendors.filter((vendor) => vendor.status.includes("Fechado") || vendor.contract.signed);
  const summary = closed.map((vendor) => `${vendor.category}: ${vendor.name} | ${vendor.phone} | ${vendor.nextMilestone} | ${vendor.ceremonialNote}`).join("\n");

  async function copy() {
    await navigator.clipboard?.writeText(summary);
  }

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 overflow-y-auto rounded-t-[2rem] bg-[#fffdf9] p-5 shadow-2xl md:top-1/2 md:-translate-y-1/2 md:rounded-[2rem] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Resumo para cerimonial</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Tudo que precisa estar à mão</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" aria-hidden /></Button>
        </div>
        <div className="mt-5 space-y-3">
          {closed.map((vendor) => (
            <div key={vendor.id} className="rounded-3xl border border-casarei-border-soft bg-white/88 p-4">
              <p className="font-serif text-xl text-casarei-primary-deep">{vendor.name}</p>
              <p className="mt-1 text-sm text-casarei-muted">{vendor.category} • {vendor.phone}</p>
              <p className="mt-2 text-sm leading-6 text-casarei-text">{vendor.nextMilestone}</p>
              <p className="mt-1 text-sm text-casarei-muted">{vendor.ceremonialNote}</p>
            </div>
          ))}
        </div>
        <Button type="button" className="mt-5 w-full" onClick={copy}><Copy className="h-4 w-4" aria-hidden />Copiar resumo</Button>
      </div>
    </div>
  );
}
