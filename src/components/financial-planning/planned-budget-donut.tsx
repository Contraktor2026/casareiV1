import type { PlannedCategory } from "@/types/financial-planning";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function conic(categories: PlannedCategory[]) {
  let start = 0;
  return categories
    .map((category) => {
      const end = start + category.percentage * 3.6;
      const segment = `${category.color} ${start}deg ${end}deg`;
      start = end;
      return segment;
    })
    .join(", ");
}

type PlannedBudgetDonutProps = {
  categories: PlannedCategory[];
  totalPlanned: number;
};

export function PlannedBudgetDonut({ categories, totalPlanned }: PlannedBudgetDonutProps) {
  const top = [...categories].sort((a, b) => b.plannedAmount - a.plannedAmount).slice(0, 5);

  return (
    <section className="rounded-[2rem] border border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 shadow-[0_22px_60px_rgba(114,36,62,0.10)] ring-1 ring-casarei-primary-light/15 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
        <div className="relative mx-auto grid h-72 w-72 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(232,220,215,0.8),0_24px_60px_rgba(114,36,62,0.13)]">
          <div className="absolute inset-5 rounded-full" style={{ background: `conic-gradient(${conic(categories)})` }} />
          <div className="relative grid h-40 w-40 place-items-center rounded-full bg-[#fffdf9] text-center shadow-inner">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">Planejado</p>
              <strong className="mt-1 block font-serif text-3xl text-casarei-primary-deep">{money(totalPlanned)}</strong>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-casarei-primary">Distribuicao planejada</p>
          <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Onde vocês imaginam investir</h2>
          <p className="mt-2 text-sm leading-6 text-casarei-muted">
            Esse gráfico mostra o plano, não os gastos fechados. Ele serve como guia para comparar cotações e tomar
            decisões.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {top.map((category) => (
              <div key={category.id} className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/78 p-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-casarei-primary-deep">{category.name}</p>
                  <p className="text-xs text-casarei-muted">
                    {money(category.plannedAmount)} • {Math.round(category.percentage)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
