"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { mockPlanningSuggestions } from "@/lib/mock/schedule";
import type { PlanningMoment, PlanningSuggestion, ScheduleTask } from "@/types/schedule";

type PlanningCustomizationModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (tasks: ScheduleTask[]) => void;
};

const moments: PlanningMoment[] = ["Agora", "Próximas semanas", "Próximos meses", "Perto do casamento"];

export function PlanningCustomizationModal({ open, onClose, onApply }: PlanningCustomizationModalProps) {
  const [suggestions, setSuggestions] = useState<PlanningSuggestion[]>(mockPlanningSuggestions);
  const selectedCount = suggestions.filter((item) => item.isKept && item.status !== "Removida").length + 26;

  const grouped = useMemo(() => {
    return moments.map((moment) => ({
      moment,
      tasks: suggestions.filter((task) => task.moment === moment)
    }));
  }, [suggestions]);

  if (!open) return null;

  function updateSuggestion(id: string, patch: Partial<PlanningSuggestion>) {
    setSuggestions((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  }

  function apply() {
    onApply(
      suggestions
        .filter((task) => task.isKept && task.status !== "Removida")
        .map(({ moment: _moment, sofiaExplanation, ...task }) => ({
          ...task,
          id: crypto.randomUUID(),
          status: "Pendente",
          notes: task.notes || sofiaExplanation,
          history: ["Mantida a partir do planejamento da Sofia"]
        }))
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#2a1a1f]/30 p-0 backdrop-blur-sm md:p-6">
      <div className="flex min-h-full items-end md:items-center md:justify-center">
        <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(42,26,31,0.18)] md:max-w-5xl md:rounded-[28px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="font-serif text-3xl text-[#3b1717]">Personalize seu cronograma</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7b6a70]">
                A Sofia preparou uma sugestão com base no seu casamento. Mantenha o que faz sentido,
                remova o que não combina e ajuste do seu jeito.
              </p>
            </div>
            <span className="rounded-full bg-[#fbeaf0] px-4 py-2 text-sm font-semibold text-[#d4537e]">
              {selectedCount} tarefas selecionadas
            </span>
          </div>

          <div className="mt-6 grid gap-5">
            {grouped.map((group) => (
              <section key={group.moment}>
                <h3 className="font-serif text-2xl text-[#3b1717]">{group.moment}</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {group.tasks.map((task) => (
                    <SuggestionCard key={task.id} task={task} onUpdate={(patch) => updateSuggestion(task.id, patch)} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="bg-[#d4537e] text-white hover:bg-[#993556]" onClick={apply}>Aplicar planejamento</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SuggestionCard({ task, onUpdate }: { task: PlanningSuggestion; onUpdate: (patch: Partial<PlanningSuggestion>) => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  function saveEdit() {
    onUpdate({ title });
    setEditing(false);
  }

  function removeSuggestion() {
    if (!confirmPermanentDelete({ itemName: task.title, context: "Essa sugestão será removida do planejamento." })) return;
    onUpdate({ isKept: false, status: "Removida" });
  }

  return (
    <article className="rounded-2xl border border-[#f2d6d9] bg-[#fff8f8] p-4">
      {editing ? (
        <input className="h-11 w-full rounded-xl border border-[#f2d6d9] px-3 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" value={title} onChange={(event) => setTitle(event.target.value)} />
      ) : (
        <h4 className="font-medium text-[#2a1a1f]">{task.title}</h4>
      )}
      <p className="mt-2 text-xs font-semibold text-[#d4537e]">{task.category} · {task.priority} · {task.dueDate}</p>
      <p className="mt-3 text-sm leading-6 text-[#4d3f44]">{task.sofiaExplanation}</p>
      <p className="mt-3 text-xs text-[#7b6a70]">Se isso não combina com o casamento de vocês, pode remover sem culpa.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" className="bg-[#d4537e] text-white hover:bg-[#993556]" onClick={() => onUpdate({ isKept: true, status: "Pendente" })}>
          Manter
        </Button>
        <Button size="sm" variant="outline" onClick={removeSuggestion}>
          Remover
        </Button>
        {editing ? (
          <Button size="sm" variant="outline" onClick={saveEdit}>Salvar edição</Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Editar</Button>
        )}
      </div>
    </article>
  );
}
