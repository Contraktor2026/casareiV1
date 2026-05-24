import { Button } from "@/components/ui/button";
import type { ScheduleFilters } from "@/types/schedule";
import { schedulePriorities } from "@/lib/mock/schedule";
import { cn } from "@/lib/utils";

type TaskFiltersDrawerProps = {
  open: boolean;
  filters: ScheduleFilters;
  onChange: (filters: ScheduleFilters) => void;
  onClose: () => void;
  onClear: () => void;
};

const statuses: ScheduleFilters["status"][] = ["Todas", "Pendentes", "Concluídas", "Atrasadas"];
const sources: ScheduleFilters["source"][] = ["Todas", "Sofia", "Manual"];

export function TaskFiltersDrawer({ open, filters, onChange, onClose, onClear }: TaskFiltersDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2a1a1f]/30 backdrop-blur-sm">
      <aside className="ml-auto flex min-h-full items-end md:items-stretch md:justify-end">
        <div className="w-full rounded-t-[28px] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(42,26,31,0.18)] md:min-h-full md:max-w-md md:rounded-none">
          <h2 className="font-serif text-3xl text-[#3b1717]">Filtrar cronograma</h2>
          <div className="mt-6 space-y-6">
            <FilterGroup title="Status" options={statuses} value={filters.status} onPick={(status) => onChange({ ...filters, status: status as ScheduleFilters["status"] })} />
            <FilterGroup title="Prioridade" options={["Todas", ...schedulePriorities]} value={filters.priority} onPick={(priority) => onChange({ ...filters, priority: priority as ScheduleFilters["priority"] })} />
            <FilterGroup title="Origem" options={sources} value={filters.source} onPick={(source) => onChange({ ...filters, source: source as ScheduleFilters["source"] })} />
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Button className="bg-[#d4537e] text-white hover:bg-[#993556]" onClick={onClose}>Aplicar filtros</Button>
            <Button variant="outline" onClick={onClear}>Limpar filtros</Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function FilterGroup({ title, options, value, onPick }: { title: string; options: string[]; value: string; onPick: (value: string) => void }) {
  return (
    <section>
      <p className="text-sm font-semibold text-[#2a1a1f]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onPick(option)}
            className={cn(
              "rounded-full border border-[#f2d6d9] px-4 py-2 text-sm text-[#7b6a70]",
              value === option && "border-[#d4537e] bg-[#fbeaf0] font-semibold text-[#d4537e]"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
