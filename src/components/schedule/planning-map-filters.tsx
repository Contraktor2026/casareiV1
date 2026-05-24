import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { planningMapCategories } from "@/lib/mock/planning-map";
import type { PlanningMapFiltersState } from "@/types/planning-map";

type PlanningMapFiltersProps = {
  filters: PlanningMapFiltersState;
  onChange: (filters: PlanningMapFiltersState) => void;
};

export function PlanningMapFilters({ filters, onChange }: PlanningMapFiltersProps) {
  return (
    <section className="rounded-[22px] border border-[#f2d6d9] bg-[rgba(255,253,249,0.80)] p-4 shadow-[0_10px_30px_rgba(153,53,86,0.05)]">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#2a1a1f]">
        <Filter className="h-4 w-4" aria-hidden />
        Filtros do mapa
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Select
          label="Categoria"
          value={filters.category}
          options={planningMapCategories}
          onChange={(category) => onChange({ ...filters, category: category as PlanningMapFiltersState["category"] })}
        />
        <Select
          label="Status"
          value={filters.status}
          options={["Todas", "Pendente", "Concluída", "Atrasada", "Removida"]}
          onChange={(status) => onChange({ ...filters, status: status as PlanningMapFiltersState["status"] })}
        />
        <Select
          label="Origem"
          value={filters.source}
          options={["Todas", "Sofia", "Manual"]}
          onChange={(source) => onChange({ ...filters, source: source as PlanningMapFiltersState["source"] })}
        />
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full border-[#f0c5d2] bg-[#fff7f9] text-[#d4537e] md:w-auto"
        onClick={() => onChange({ category: "Todas", status: "Todas", source: "Todas", showRemoved: false })}
      >
        Limpar filtros
      </Button>
    </section>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-sm text-[#7b6a70]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-[#f2d6d9] bg-white px-3 text-sm text-[#2a1a1f] outline-none focus:ring-2 focus:ring-[#d4537e]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
