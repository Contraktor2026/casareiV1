import type { PlannedCategory } from "@/types/financial-planning";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

type PlannedCategoryCardProps = {
  category: PlannedCategory;
  onOpen: (category: PlannedCategory) => void;
};

export function PlannedCategoryCard({ category, onOpen }: PlannedCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(category)}
      className="rounded-[1.5rem] border border-white/90 bg-white/88 p-5 text-left shadow-[0_14px_38px_rgba(114,36,62,0.075)] ring-1 ring-casarei-primary-light/10 transition hover:-translate-y-0.5 hover:border-casarei-primary-light/50 hover:shadow-[0_20px_52px_rgba(114,36,62,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xl text-casarei-primary-deep">{category.name}</p>
          <p className="mt-1 text-xs text-casarei-muted">{Math.round(category.percentage)}% do total</p>
        </div>
        <span className="rounded-full border border-casarei-primary-light/30 bg-casarei-primary-bg/70 px-3 py-1 text-xs font-semibold text-casarei-primary-deep">
          {category.priority}
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl text-casarei-primary-deep">{money(category.plannedAmount)}</p>
      <p className="mt-2 text-sm leading-5 text-casarei-muted">{category.reason}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
        <span className="text-xs font-semibold text-casarei-primary">{category.status}</span>
      </div>
    </button>
  );
}
