"use client";

import { FileImage, FileText, Keyboard, X } from "lucide-react";

type AddQuoteModalProps = {
  open: boolean;
  onClose: () => void;
  onChoose: (method: string) => void;
};

const options = [
  { label: "Importar PDF", icon: FileText, method: "PDF" },
  { label: "Importar imagem", icon: FileImage, method: "imagem" },
  { label: "Preencher manualmente", icon: Keyboard, method: "manual" }
];

export function AddQuoteModal({ open, onClose, onChoose }: AddQuoteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 md:place-items-center md:p-6">
      <section className="w-full rounded-t-[32px] bg-[#FFFDFC] p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-lg md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A716D]">Adicionar orcamento</p>
            <h2 className="mt-2 font-serif text-3xl text-[#4B2E2B]">Como deseja adicionar?</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1] text-[#4B2E2B]" aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          {options.map((option) => (
            <button
              key={option.method}
              type="button"
              onClick={() => onChoose(option.method)}
              className="flex items-center gap-4 rounded-2xl bg-[#F8F4F1] p-4 text-left transition hover:bg-[#F8E7EC]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFFDFC] text-[#D96C8A]">
                <option.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-semibold text-[#4B2E2B]">{option.label}</span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs leading-5 text-[#8A716D]">
          Nesta fase o arquivo fica preparado para preenchimento assistido. A estrutura ja deixa espaco para leitura com IA depois.
        </p>
      </section>
    </div>
  );
}
