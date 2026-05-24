"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddTaskToMonthModal } from "@/components/schedule/add-task-to-month-modal";
import { MoveTaskModal } from "@/components/schedule/move-task-modal";
import { PlanningMapFilters } from "@/components/schedule/planning-map-filters";
import { PlanningMonthBlock } from "@/components/schedule/planning-month-block";
import { RemovedTasksToggle } from "@/components/schedule/removed-tasks-toggle";
import { SofiaPlanningMapCard } from "@/components/schedule/sofia-planning-map-card";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { defaultPlanningMapFilters, mockPlanningMapTasks, planningMonthGroups } from "@/lib/mock/planning-map";
import type { PlanningMapFiltersState, PlanningMapTask, PlanningMonthId } from "@/types/planning-map";

type PlanningMapProps = {
  onBack: () => void;
};

export function PlanningMap({ onBack }: PlanningMapProps) {
  const [tasks, setTasks] = useState<PlanningMapTask[]>(mockPlanningMapTasks);
  const [filters, setFilters] = useState<PlanningMapFiltersState>(defaultPlanningMapFilters);
  const [expanded, setExpanded] = useState<Record<PlanningMonthId, boolean>>(
    Object.fromEntries(planningMonthGroups.map((group) => [group.id, group.defaultExpanded])) as Record<PlanningMonthId, boolean>
  );
  const [editingTask, setEditingTask] = useState<PlanningMapTask | null>(null);
  const [targetMonth, setTargetMonth] = useState<PlanningMonthId | null>(null);
  const [movingTask, setMovingTask] = useState<PlanningMapTask | null>(null);
  const [toast, setToast] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!filters.showRemoved && task.status === "Removida") return false;
      const categoryMatch = filters.category === "Todas" || task.category === filters.category;
      const statusMatch = filters.status === "Todas" || task.status === filters.status;
      const sourceMatch =
        filters.source === "Todas" ||
        (filters.source === "Sofia" && task.source === "sofia") ||
        (filters.source === "Manual" && task.source === "manual");
      return categoryMatch && statusMatch && sourceMatch;
    });
  }, [filters, tasks]);

  function toggleExpanded(id: PlanningMonthId) {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  }

  function toggleTask(task: PlanningMapTask) {
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? { ...item, status: item.status === "Concluída" ? "Pendente" : "Concluída" }
          : item
      )
    );
    if (task.status !== "Concluída") {
      setToast("Mais um passo dado. Quando chegar a hora, a Sofia te lembra do próximo.");
    }
  }

  function saveTask(task: PlanningMapTask) {
    setTasks((current) => {
      const exists = current.some((item) => item.id === task.id);
      return exists ? current.map((item) => (item.id === task.id ? task : item)) : [task, ...current];
    });
    setEditingTask(null);
    setTargetMonth(null);
    setExpanded((current) => ({ ...current, [task.monthGroup]: true }));
    setToast("Pronto, essa fase ficou mais organizada.");
  }

  function removeTask(task: PlanningMapTask) {
    const confirmed = confirmPermanentDelete({ itemName: task.title, context: "Essa tarefa será removida do mapa de planejamento." });
    if (!confirmed) return;
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status: "Removida" } : item)));
    setToast("Tarefa removida sem culpa. A ideia é te guiar, não te sobrecarregar.");
  }

  function moveTask(task: PlanningMapTask, monthId: PlanningMonthId) {
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, monthGroup: monthId } : item)));
    setMovingTask(null);
    setExpanded((current) => ({ ...current, [monthId]: true }));
    setToast("Tarefa movida para outra fase do planejamento.");
  }

  return (
    <div className="space-y-5">
      <SofiaPlanningMapCard onBack={onBack} />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <RemovedTasksToggle checked={filters.showRemoved} onChange={(showRemoved) => setFilters({ ...filters, showRemoved })} />
        <Button className="bg-[#d4537e] text-white hover:bg-[#993556]" onClick={() => setTargetMonth("14-meses")}>
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar tarefa ao mapa
        </Button>
      </div>
      <PlanningMapFilters filters={filters} onChange={setFilters} />
      {toast ? <div className="rounded-2xl border border-[#f2d6d9] bg-[#fff7f9] px-4 py-3 text-sm text-[#d4537e]">{toast}</div> : null}
      <div className="space-y-4">
        {planningMonthGroups.map((group) => (
          <PlanningMonthBlock
            key={group.id}
            group={group}
            tasks={filteredTasks.filter((task) => task.monthGroup === group.id)}
            expanded={expanded[group.id]}
            onToggleExpanded={() => toggleExpanded(group.id)}
            onAdd={(monthId) => setTargetMonth(monthId)}
            onToggleTask={toggleTask}
            onEditTask={(task) => {
              setEditingTask(task);
              setTargetMonth(task.monthGroup);
            }}
            onRemoveTask={removeTask}
            onMoveTask={setMovingTask}
          />
        ))}
      </div>

      <Button
        className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-[#d4537e] p-0 text-white shadow-[0_12px_30px_rgba(212,83,126,0.35)] hover:bg-[#993556] lg:hidden"
        onClick={() => setTargetMonth("14-meses")}
        aria-label="Adicionar tarefa"
      >
        <Plus className="h-7 w-7" aria-hidden />
      </Button>

      <AddTaskToMonthModal
        open={Boolean(targetMonth)}
        monthId={targetMonth}
        editTask={editingTask}
        onClose={() => {
          setTargetMonth(null);
          setEditingTask(null);
        }}
        onSave={saveTask}
      />
      <MoveTaskModal task={movingTask} onClose={() => setMovingTask(null)} onMove={moveTask} />
    </div>
  );
}
