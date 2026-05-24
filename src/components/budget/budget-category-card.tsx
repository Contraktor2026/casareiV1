"use client";

import type { BudgetCategory } from "@/types/budget";
import { BudgetProgressBar } from "./budget-progress-bar";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetCategoryCard({ category, onOpen }: { category: BudgetCategory; onOpen?: (category: BudgetCategory) => void }) {
  const percent = Math.round((category.spent / 80000) * 100);
  const categoryProgress = category.planned ? Math.round((category.spent / category.planned) * 100) : 0;
  const difference = category.planned - category.spent;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(category)}
      className="rounded-[2rem] border border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff7f3)] p-6 text-left shadow-[0_18px_48px_rgba(114,36,62,0.085)] ring-1 ring-casarei-primary-light/18 transition hover:-translate-y-0.5 hover:border-casarei-primary-light/45 hover:shadow-[0_24px_68px_rgba(114,36,62,0.13)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl font-medium text-casarei-primary-deep">{category.name}</h3>
          <p className="mt-1 text-sm text-casarei-muted">{percent}% do orçamento</p>
        </div>
        <span className="rounded-full border border-casarei-primary-light/30 bg-white/86 px-3 py-1 text-xs font-semibold text-casarei-primary-deep shadow-sm">
          {category.priority}
        </span>
      </div>
      <strong className="mt-5 block font-serif text-3xl text-casarei-primary-deep">{money(category.spent)}</strong>
      <p className="mt-1 text-sm text-casarei-muted">previsto: {money(category.planned)}</p>
      <div className="mt-4">
        <BudgetProgressBar value={categoryProgress} />
      </div>
      <p className="mt-3 text-sm text-casarei-text">
        {difference >= 0 ? `${money(difference)} de folga` : `${money(Math.abs(difference))} acima do previsto`}
      </p>
    </button>
  );
}
