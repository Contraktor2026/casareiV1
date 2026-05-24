import { Edit3, SlidersHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

type FinancialPlanningHeroProps = {
  totalPlanned: number;
  onEditValue: () => void;
  onAdjustPriorities: () => void;
};

export function FinancialPlanningHero({ totalPlanned, onEditValue, onAdjustPriorities }: FinancialPlanningHeroProps) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#fffdf9_0%,#fff8f2_48%,#fbeaf0_100%)] p-5 shadow-[0_26px_80px_rgba(114,36,62,0.12)] ring-1 ring-casarei-primary-light/20 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Estrategia antes dos contratos</p>
          <h1 className="mt-2 font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-5xl">
            Planejamento financeiro
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-text md:text-base">
            Defina como vocês querem distribuir o investimento do casamento antes de começar a fechar fornecedores.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/90 bg-white/88 p-5 shadow-[0_20px_52px_rgba(114,36,62,0.10)]">
          <p className="text-sm font-semibold text-casarei-primary">Quanto vocês pretendem investir?</p>
          <strong className="mt-2 block font-serif text-4xl font-medium text-casarei-primary-deep">{money(totalPlanned)}</strong>
          <p className="mt-2 text-sm leading-6 text-casarei-muted">
            Esse é o valor planejado para orientar as decisões do casamento.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="button" onClick={onEditValue}>
          <Edit3 className="h-4 w-4" aria-hidden />
          Editar valor planejado
        </Button>
        <Button type="button" variant="outline" className="bg-white/80" onClick={onAdjustPriorities}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Ajustar prioridades
        </Button>
        <Button type="button" variant="outline" className="bg-white/80" onClick={onAdjustPriorities}>
          <Sparkles className="h-4 w-4" aria-hidden />
          Ver sugestao da Sofia
        </Button>
      </div>
    </section>
  );
}
