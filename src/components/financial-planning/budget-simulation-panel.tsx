import { Wand2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { BudgetSimulation } from "@/types/financial-planning";

type BudgetSimulationPanelProps = {
  simulations: BudgetSimulation[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function BudgetSimulationPanel({ simulations, activeId, onSelect }: BudgetSimulationPanelProps) {
  const active = simulations.find((simulation) => simulation.id === activeId) ?? simulations[0];

  return (
    <Card className="border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff7f3)] p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <Wand2 className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Simule decisões</p>
          <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">O que muda no plano?</h2>
          <p className="mt-1 text-sm leading-6 text-casarei-muted">
            Uma simulacao simples para pensar antes de fechar fornecedores.
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {simulations.map((simulation) => (
          <button
            key={simulation.id}
            type="button"
            onClick={() => onSelect(simulation.id)}
            className={
              active.id === simulation.id
                ? "shrink-0 rounded-full bg-casarei-primary px-4 py-2 text-sm font-semibold text-white"
                : "shrink-0 rounded-full border border-casarei-border-soft bg-white px-4 py-2 text-sm font-semibold text-casarei-text"
            }
          >
            {simulation.title}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-white/80 bg-white/78 p-4">
        <p className="font-serif text-2xl text-casarei-primary-deep">{active.title}</p>
        <p className="mt-2 text-sm leading-6 text-casarei-muted">{active.description}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {active.impacts.map((impact) => (
            <div key={impact} className="rounded-2xl bg-casarei-primary-bg/60 px-4 py-3 text-sm leading-5 text-casarei-text">
              {impact}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
