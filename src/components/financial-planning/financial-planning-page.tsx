"use client";

import { useMemo, useState } from "react";

import { financialPlanningMock } from "@/lib/mock/financial-planning";
import type { PlannedCategory, PlannedCategoryFormValues } from "@/types/financial-planning";

import { BudgetSimulationPanel } from "./budget-simulation-panel";
import { EmptyFinancialPlanningState } from "./empty-financial-planning-state";
import { FinancialPlanningHero } from "./financial-planning-hero";
import { PlannedBudgetDonut } from "./planned-budget-donut";
import { PlannedCategoryCard } from "./planned-category-card";
import { PlannedCategoryDrawer } from "./planned-category-drawer";
import { PlannedVsActualSummary } from "./planned-vs-actual-summary";
import { SafetyReserveCard } from "./safety-reserve-card";
import { SofiaPlanningSuggestion } from "./sofia-planning-suggestion";
import { WeddingPrioritiesSelector } from "./wedding-priorities-selector";

export function FinancialPlanningPage() {
  const [totalPlanned, setTotalPlanned] = useState(financialPlanningMock.totalPlanned);
  const [categories, setCategories] = useState(financialPlanningMock.categories);
  const [selectedPriorities, setSelectedPriorities] = useState(financialPlanningMock.selectedPriorities);
  const [reservePercent, setReservePercent] = useState(financialPlanningMock.safetyReservePercent);
  const [activeSimulation, setActiveSimulation] = useState(financialPlanningMock.simulations[0]?.id ?? "");
  const [selectedCategory, setSelectedCategory] = useState<PlannedCategory | null>(null);
  const [message, setMessage] = useState("");

  const normalizedCategories = useMemo(() => {
    const total = categories.reduce((sum, category) => sum + category.plannedAmount, 0) || totalPlanned;
    return categories.map((category) => ({
      ...category,
      percentage: (category.plannedAmount / total) * 100
    }));
  }, [categories, totalPlanned]);

  function togglePriority(priority: string) {
    setSelectedPriorities((current) => {
      if (current.includes(priority)) {
        return current.filter((item) => item !== priority);
      }
      if (current.length >= 5) {
        return [...current.slice(1), priority];
      }
      return [...current, priority];
    });
  }

  function editPlannedValue() {
    const nextValue = window.prompt("Qual valor vocês pretendem investir?", String(totalPlanned));
    if (!nextValue) return;
    const parsed = Number(nextValue.replace(/\D/g, ""));
    if (!parsed) return;
    setTotalPlanned(parsed);
    setMessage("Valor planejado atualizado com carinho.");
  }

  function saveCategory(id: string, values: PlannedCategoryFormValues) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? {
              ...category,
              name: values.name,
              plannedAmount: values.plannedAmount,
              priority: values.priority,
              reason: values.reason,
              note: values.note,
              status: "Ajustado pela noiva"
            }
          : category
      )
    );
    setSelectedCategory(null);
    setMessage("Planejamento ajustado com carinho.");
  }

  if (!financialPlanningMock) {
    return <EmptyFinancialPlanningState onStart={() => setMessage("Planejamento iniciado.")} />;
  }

  return (
    <div className="space-y-8 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(251,234,240,0.56),transparent_34%),linear-gradient(180deg,#fffaf7,#fffdf9_42%,#fbf4ef)] p-0 md:p-1">
      <FinancialPlanningHero
        totalPlanned={totalPlanned}
        onEditValue={editPlannedValue}
        onAdjustPriorities={() => {
          document.getElementById("financial-priorities")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      {message ? (
        <p className="rounded-2xl border border-casarei-primary-light/50 bg-white/85 px-4 py-3 text-sm font-semibold text-casarei-primary-deep">
          {message}
        </p>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <div id="financial-priorities">
          <WeddingPrioritiesSelector
            priorities={financialPlanningMock.availablePriorities}
            selected={selectedPriorities}
            onToggle={togglePriority}
          />
        </div>
        <SofiaPlanningSuggestion text={financialPlanningMock.sofiaText} suggestions={financialPlanningMock.sofiaSuggestions} />
      </section>

      <PlannedBudgetDonut categories={normalizedCategories} totalPlanned={totalPlanned} />

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Categorias planejadas</p>
          <h2 className="font-serif text-3xl text-casarei-primary-deep">Plano por categoria</h2>
          <p className="mt-1 text-sm leading-6 text-casarei-muted">
            Estes valores são previsões para guiar cotações. Os gastos reais continuam no módulo Orçamento.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {normalizedCategories.map((category) => (
            <PlannedCategoryCard key={category.id} category={category} onOpen={setSelectedCategory} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SafetyReserveCard totalPlanned={totalPlanned} percent={reservePercent} onChange={setReservePercent} />
        <BudgetSimulationPanel
          simulations={financialPlanningMock.simulations}
          activeId={activeSimulation}
          onSelect={setActiveSimulation}
        />
      </section>

      <PlannedVsActualSummary comparison={financialPlanningMock.comparison} />

      <PlannedCategoryDrawer category={selectedCategory} onClose={() => setSelectedCategory(null)} onSave={saveCategory} />
    </div>
  );
}
