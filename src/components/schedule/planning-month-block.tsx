import { ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlanningMapTask, PlanningMonthGroup } from "@/types/planning-map";
import { PlanningMonthTaskCard } from "@/components/schedule/planning-month-task-card";

type PlanningMonthBlockProps = {
  group: PlanningMonthGroup;
  tasks: PlanningMapTask[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onAdd: (monthId: PlanningMonthGroup["id"]) => void;
  onToggleTask: (task: PlanningMapTask) => void;
  onEditTask: (task: PlanningMapTask) => void;
  onRemoveTask: (task: PlanningMapTask) => void;
  onMoveTask: (task: PlanningMapTask) => void;
};

export function PlanningMonthBlock({
  group,
  tasks,
  expanded,
  onToggleExpanded,
  onAdd,
  onToggleTask,
  onEditTask,
  onRemoveTask,
  onMoveTask
}: PlanningMonthBlockProps) {
  const visibleTasks = tasks.filter((task) => task.status !== "Removida");
  const completed = visibleTasks.filter((task) => task.status === "Concluída").length;
  const progress = visibleTasks.length ? Math.round((completed / visibleTasks.length) * 100) : 0;

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#f2d6d9] bg-[rgba(255,253,249,0.86)] shadow-[0_10px_30px_rgba(153,53,86,0.06)]">
      <button className="flex w-full flex-col gap-4 p-5 text-left md:flex-row md:items-center md:justify-between" onClick={onToggleExpanded}>
        <div>
          <h3 className="font-serif text-2xl text-[#3b1717]">{group.title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#7b6a70]">{group.sofiaMessage}</p>
          <p className="mt-2 text-xs font-medium text-[#d4537e]">
            {visibleTasks.length} tarefas · {completed} concluídas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[#f3e8e5]">
            <div className="h-full rounded-full bg-[#d4537e]" style={{ width: `${progress}%` }} />
          </div>
          <ChevronDown className={cn("h-5 w-5 transition", expanded && "rotate-180")} aria-hidden />
        </div>
      </button>
      {expanded ? (
        <div className="border-t border-[#f2d6d9] p-5">
          <div className="mb-4 flex justify-end">
            <Button variant="outline" className="border-[#f0c5d2] bg-[#fff7f9] text-[#d4537e]" onClick={() => onAdd(group.id)}>
              <Plus className="h-4 w-4" aria-hidden />
              Adicionar neste mês
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {tasks.length ? (
              tasks.map((task) => (
                <PlanningMonthTaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onEdit={onEditTask}
                  onRemove={onRemoveTask}
                  onMove={onMoveTask}
                />
              ))
            ) : (
              <div className="rounded-2xl bg-[#fff7f9] p-5 text-sm text-[#7b6a70]">
                Nenhuma tarefa neste período com os filtros atuais.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
