"use client";

import { FileImage, FileText, Keyboard } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuoteImportCardProps = {
  onImport: (method: "PDF" | "JPEG") => void;
  onManual: () => void;
};

export function QuoteImportCard({ onImport, onManual }: QuoteImportCardProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-casarei-primary-light bg-[linear-gradient(135deg,#fff7fa,#fffdf9)] p-5 shadow-[0_18px_52px_rgba(114,36,62,0.09)] ring-1 ring-white/70 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-casarei-primary text-white shadow-[0_10px_22px_rgba(212,83,126,0.25)]">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-medium text-casarei-primary-deep">Adicionar orçamento</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-casarei-text">
              Importe uma proposta em PDF ou JPEG, ou preencha as informações manualmente para comparar depois.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 md:min-w-[420px]">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-casarei-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-casarei-primary-deep">
            <FileText className="h-4 w-4" aria-hidden />
            Importar PDF
            <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => event.target.files?.[0] && onImport("PDF")} />
          </label>
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-casarei-primary-light bg-white px-4 text-sm font-semibold text-casarei-primary transition hover:bg-casarei-primary-bg">
            <FileImage className="h-4 w-4" aria-hidden />
            Importar JPEG
            <input type="file" accept="image/jpeg,.jpg,.jpeg" className="sr-only" onChange={(event) => event.target.files?.[0] && onImport("JPEG")} />
          </label>
          <Button type="button" variant="outline" onClick={onManual} className="h-11 border-casarei-primary-light bg-white text-casarei-primary">
            <Keyboard className="h-4 w-4" aria-hidden />
            Manual
          </Button>
        </div>
      </div>
    </section>
  );
}
