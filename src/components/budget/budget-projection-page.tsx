import { BudgetAlerts } from "./budget-alerts";
import { BudgetCategoryCard } from "./budget-category-card";
import { SofiaBudgetInsights } from "./sofia-budget-insights";
import { budgetCategories, budgetProjection } from "@/lib/mock/budget";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetProjectionPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,253,249,0.98),rgba(251,234,240,0.76))] p-5 shadow-[0_20px_60px_rgba(114,36,62,0.10)] md:p-8">
        <p className="text-sm font-semibold text-casarei-primary">Projeções</p>
        <h1 className="mt-2 font-serif text-4xl text-casarei-primary-deep">Para decidir antes de apertar</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-text">
          Uma leitura simples do caminho financeiro, sem assustar você com uma planilha.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <ProjectionCard title="Estimativa final" value={money(budgetProjection.finalEstimate)} />
        <ProjectionCard title="Margem restante" value={money(budgetProjection.remainingMargin)} />
        <ProjectionCard title="Risco de ultrapassar" value="Moderado" />
      </div>

      <SofiaBudgetInsights />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5">
          <h2 className="font-serif text-2xl text-casarei-primary-deep">Categorias mais caras</h2>
          <div className="mt-4 grid gap-3">
            {budgetCategories.filter((category) => budgetProjection.expensiveCategories.includes(category.name)).map((category) => (
              <BudgetCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5">
          <h2 className="font-serif text-2xl text-casarei-primary-deep">Ainda abertas</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {budgetProjection.openCategories.map((category) => (
              <span key={category} className="rounded-full bg-casarei-primary-bg px-4 py-2 text-sm font-medium text-casarei-primary-deep">{category}</span>
            ))}
          </div>
          <p className="mt-5 rounded-3xl bg-casarei-primary-bg/45 p-4 text-sm leading-6 text-casarei-text">{budgetProjection.sofiaNote}</p>
        </div>
      </section>
      <BudgetAlerts />
    </div>
  );
}

function ProjectionCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5 shadow-[0_16px_44px_rgba(114,36,62,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{title}</p>
      <strong className="mt-4 block font-serif text-3xl text-casarei-primary-deep">{value}</strong>
    </div>
  );
}
