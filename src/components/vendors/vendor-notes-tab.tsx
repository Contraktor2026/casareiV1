"use client";

import { useState } from "react";
import type { Vendor } from "@/types/vendors";

export function VendorNotesTab({ vendor }: { vendor: Vendor }) {
  const [notes, setNotes] = useState(vendor.notes || "");
  const [ceremonial, setCeremonial] = useState(vendor.ceremonialNote || "");
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <label className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5 text-sm font-semibold text-casarei-primary-deep">
        Observações da noiva
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={7} className="mt-3 w-full resize-none rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm font-normal leading-6 text-casarei-text outline-none focus:border-casarei-primary" placeholder="Adicione informações importantes para lembrar depois." />
      </label>
      <label className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5 text-sm font-semibold text-casarei-primary-deep">
        Informações para cerimonial
        <textarea value={ceremonial} onChange={(event) => setCeremonial(event.target.value)} rows={7} className="mt-3 w-full resize-none rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm font-normal leading-6 text-casarei-text outline-none focus:border-casarei-primary" placeholder="O que o cerimonial precisa saber?" />
      </label>
    </section>
  );
}
