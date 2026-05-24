import { X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type SofiaGuidanceModalProps = {
  open: boolean;
  title: string;
  text: string;
  steps: string[];
  onClose: () => void;
};

export function SofiaGuidanceModal({ open, title, text, steps, onClose }: SofiaGuidanceModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-casarei-ink/35 p-3 backdrop-blur-sm md:items-center md:justify-center">
      <div className="w-full rounded-[1.75rem] border border-white/80 bg-[#fffdf9] p-5 shadow-[0_24px_80px_rgba(42,26,31,0.22)] md:max-w-2xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Me orientar agora</p>
            <h2 className="font-serif text-3xl text-casarei-primary-deep">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-casarei-text">{text}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-casarei-border-soft bg-white p-2">
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl border border-casarei-primary-light/20 bg-casarei-primary-bg/45 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white font-serif text-lg text-casarei-primary-deep">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-casarei-primary-deep">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Depois
          </Button>
          <Button asChild variant="outline" className="bg-white">
            <Link href="/app/cronograma">Ver cronograma</Link>
          </Button>
          <Button asChild>
            <Link href="/app/cronograma">Criar tarefas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
