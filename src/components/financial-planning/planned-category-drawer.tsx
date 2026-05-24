import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { PlannedCategory, PlannedCategoryFormValues, PlannedPriority } from "@/types/financial-planning";

type PlannedCategoryDrawerProps = {
  category: PlannedCategory | null;
  onClose: () => void;
  onSave: (id: string, values: PlannedCategoryFormValues) => void;
};

const priorities: PlannedPriority[] = ["Alta", "Media", "Baixa"];
const inputClassName =
  "h-12 w-full rounded-2xl border border-casarei-border-soft bg-white/90 px-4 text-sm text-casarei-text outline-none transition focus:border-casarei-primary";

export function PlannedCategoryDrawer({ category, onClose, onSave }: PlannedCategoryDrawerProps) {
  const [values, setValues] = useState<PlannedCategoryFormValues | null>(null);

  useEffect(() => {
    if (!category) return;
    setValues({
      name: category.name,
      plannedAmount: category.plannedAmount,
      priority: category.priority,
      reason: category.reason,
      note: category.note
    });
  }, [category]);

  if (!category || !values) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-casarei-ink/35 p-3 backdrop-blur-sm md:items-center md:justify-center">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-[1.75rem] border border-white/80 bg-[#fffdf9] p-5 shadow-[0_24px_80px_rgba(42,26,31,0.22)] md:max-w-2xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Categoria planejada</p>
            <h2 className="font-serif text-3xl text-casarei-primary-deep">Editar {category.name}</h2>
            <p className="mt-1 text-sm leading-6 text-casarei-muted">
              Ajuste o plano antes de transformar essa decisao em contrato ou pagamento real.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-casarei-border-soft bg-white p-2">
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
            Nome da categoria
            <input
              value={values.name}
              onChange={(event) => setValues((current) => current && { ...current, name: event.target.value })}
              className={inputClassName}
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
            Valor planejado
            <input
              type="number"
              value={values.plannedAmount}
              onChange={(event) =>
                setValues((current) => current && { ...current, plannedAmount: Number(event.target.value) })
              }
              className={inputClassName}
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
            Prioridade
            <select
              value={values.priority}
              onChange={(event) =>
                setValues((current) => current && { ...current, priority: event.target.value as PlannedPriority })
              }
              className={inputClassName}
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block space-y-2 text-sm font-semibold text-casarei-primary-deep">
          Motivo da prioridade
          <textarea
            value={values.reason}
            onChange={(event) => setValues((current) => current && { ...current, reason: event.target.value })}
            rows={3}
            className={`${inputClassName} min-h-28 py-3`}
          />
        </label>
        <label className="mt-4 block space-y-2 text-sm font-semibold text-casarei-primary-deep">
          Observacao
          <textarea
            value={values.note}
            onChange={(event) => setValues((current) => current && { ...current, note: event.target.value })}
            rows={3}
            className={`${inputClassName} min-h-28 py-3`}
          />
        </label>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => onSave(category.id, values)}>
            Salvar ajuste
          </Button>
        </div>
      </div>
    </div>
  );
}
