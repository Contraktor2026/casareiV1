"use client";

import { PencilLine } from "lucide-react";
import { useState } from "react";

import { budgetCategoryPlans } from "@/lib/mock/budget";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetCategoryPlanPanel() {
  const [activePlanId, setActivePlanId] = useState(budgetCategoryPlans[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(budgetCategoryPlans.map((plan) => [plan.id, plan.editableNote]))
  );
  const activePlan = budgetCategoryPlans.find((plan) => plan.id === activePlanId) ?? budgetCategoryPlans[0];

  if (!activePlan) return null;

  return (
    <section className="rounded-[2rem] border border-white/90 bg-[linear-gradient(135deg,#fff7f9,#fffdf9)] p-5 shadow-[0_22px_62px_rgba(114,36,62,0.11)] ring-1 ring-casarei-primary-light/20 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Plano por categoria</p>
          <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Guia financeiro da noiva</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-text">
            A Sofia sugere um caminho por categoria, mas vocês podem adaptar conforme o planejamento evolui.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {budgetCategoryPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setActivePlanId(plan.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activePlan.id === plan.id
                  ? "border-casarei-primary bg-casarei-primary text-white"
                  : "border-casarei-border-soft bg-white/80 text-casarei-text hover:border-casarei-primary-light"
              }`}
            >
              {plan.category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_14px_34px_rgba(114,36,62,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-muted">Categoria selecionada</p>
          <h3 className="mt-2 font-serif text-3xl text-casarei-primary-deep">{activePlan.category}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-casarei-primary-light/20 bg-casarei-primary-bg/60 p-4 shadow-sm">
              <p className="text-xs text-casarei-muted">Orçamento ideal</p>
              <strong className="mt-1 block font-serif text-2xl text-casarei-primary-deep">{money(activePlan.idealBudget)}</strong>
            </div>
            <div className="rounded-2xl border border-casarei-primary-light/20 bg-casarei-primary-bg/60 p-4 shadow-sm">
              <p className="text-xs text-casarei-muted">Momento sugerido</p>
              <strong className="mt-1 block text-sm leading-5 text-casarei-primary-deep">{activePlan.moment}</strong>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-casarei-text">{activePlan.guide}</p>
        </div>

        <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_14px_34px_rgba(114,36,62,0.07)]">
          <p className="text-sm font-semibold text-casarei-primary-deep">Decisões para acompanhar</p>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {activePlan.decisions.map((decision) => (
              <span key={decision} className="rounded-2xl border border-casarei-primary-light/20 bg-casarei-primary-bg/55 px-4 py-3 text-sm leading-5 text-casarei-text shadow-sm">
                {decision}
              </span>
            ))}
          </div>
          <label className="mt-5 block text-sm font-semibold text-casarei-primary-deep">
            Nota da noiva
            <div className="mt-2 flex items-start gap-2 rounded-2xl border border-casarei-border-soft bg-white px-4 py-3">
              <PencilLine className="mt-1 h-4 w-4 shrink-0 text-casarei-primary" aria-hidden />
              <textarea
                value={notes[activePlan.id] ?? ""}
                onChange={(event) => setNotes((current) => ({ ...current, [activePlan.id]: event.target.value }))}
                rows={3}
                className="w-full resize-none bg-transparent text-sm leading-6 text-casarei-text outline-none"
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
