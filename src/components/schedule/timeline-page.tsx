"use client";

import { useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CurrentFocusTasks } from "@/components/schedule/current-focus-tasks";
import { CurrentPhaseCard } from "@/components/schedule/current-phase-card";
import { EmotionalProgressCard } from "@/components/schedule/emotional-progress-card";
import { FloatingAddButton } from "@/components/schedule/floating-add-button";
import { FuturePhaseAccordion } from "@/components/schedule/future-phase-accordion";
import { GuidedTaskCard } from "@/components/schedule/guided-task-card";
import { PlanningCustomizationModal } from "@/components/schedule/planning-customization-modal";
import { PlanningMap } from "@/components/schedule/planning-map";
import { SofiaPlanningHero } from "@/components/schedule/sofia-planning-hero";
import { TaskDetailsDrawer } from "@/components/schedule/task-details-drawer";
import { TaskFiltersDrawer } from "@/components/schedule/task-filters-drawer";
import { TaskFormModal } from "@/components/schedule/task-form-modal";
import { WeddingTimeline, type WeddingPhase } from "@/components/schedule/wedding-timeline";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { mockScheduleTasks } from "@/lib/mock/schedule";
import { cn } from "@/lib/utils";
import type { ScheduleFilters, SchedulePeriod, ScheduleTask } from "@/types/schedule";

const defaultFilters: ScheduleFilters = {
  status: "Todas",
  priority: "Todas",
  source: "Todas"
};

const phases: WeddingPhase[] = [
  {
    id: "12-10",
    label: "12-10 meses",
    title: "Base do sonho",
    description: "As primeiras grandes escolhas já começam a dar forma ao casamento.",
    status: "done",
    taskIds: ["6", "7"]
  },
  {
    id: "10-8",
    label: "10-8 meses",
    title: "Fornecedores principais",
    description: "Agora é hora de estruturar os principais fornecedores e proteger as decisões que impactam buffet, fotos, decoração e experiência dos convidados.",
    status: "current",
    taskIds: ["1", "2", "5", "7"]
  },
  {
    id: "8-6",
    label: "8-6 meses",
    title: "Estilo e detalhes",
    description: "Essa fase ajuda a transformar referências em escolhas práticas para cerimônia, beleza e recepção.",
    status: "next",
    taskIds: ["3", "4", "11"]
  },
  {
    id: "6-4",
    label: "6-4 meses",
    title: "Experiência dos convidados",
    description: "Quando a base estiver clara, o cuidado com convidados e detalhes da festa ganha mais espaço.",
    status: "next",
    taskIds: ["8", "9"]
  },
  {
    id: "4-2",
    label: "4-2 meses",
    title: "Confirmações",
    description: "Aqui entram revisões finais, alinhamentos e tarefas que dependem de respostas dos convidados.",
    status: "next",
    taskIds: ["10"]
  },
  {
    id: "Ultimos 30 dias",
    label: "Últimos 30 dias",
    title: "Respirar e confirmar",
    description: "A reta final é sobre confirmar, delegar e viver o momento com mais calma.",
    status: "next",
    taskIds: ["10"]
  }
];

type Scope = "Agora" | "Próximas" | "Concluídas";

export function TimelinePage() {
  const [tasks, setTasks] = useState<ScheduleTask[]>(mockScheduleTasks);
  const [activePhaseId, setActivePhaseId] = useState("10-8");
  const [scope, setScope] = useState<Scope>("Agora");
  const [filters, setFilters] = useState<ScheduleFilters>(defaultFilters);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formTask, setFormTask] = useState<ScheduleTask | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [detailsTask, setDetailsTask] = useState<ScheduleTask | null>(null);
  const [toast, setToast] = useState("");
  const [viewMode, setViewMode] = useState<"journey" | "planning-map">("journey");

  const visibleTasks = useMemo(() => tasks.filter((task) => task.status !== "Removida" && task.isKept), [tasks]);
  const completedTasks = visibleTasks.filter(isDone);
  const activePhase = phases.find((phase) => phase.id === activePhaseId) ?? phases[1];

  const filteredTasks = useMemo(() => {
    return visibleTasks.filter((task) => {
      const statusMatch =
        filters.status === "Todas" ||
        (filters.status === "Pendentes" && task.status === "Pendente") ||
        (filters.status.toLowerCase().startsWith("conclu") && isDone(task)) ||
        (filters.status === "Atrasadas" && task.status === "Atrasada");
      const priorityMatch = filters.priority === "Todas" || task.priority === filters.priority;
      const sourceMatch =
        filters.source === "Todas" ||
        (filters.source === "Sofia" && task.source === "sofia") ||
        (filters.source === "Manual" && task.source === "manual");

      return statusMatch && priorityMatch && sourceMatch;
    });
  }, [filters, visibleTasks]);

  const focusTasks = filteredTasks
    .filter((task) => !isDone(task) && (task.period === "Esta semana" || task.priority === "Alta" || task.status === "Atrasada"))
    .slice(0, 3);

  const currentPhaseTasks = sortTasksForPhase(getTasksForPhase(activePhase, filteredTasks));
  const futurePhases = phases
    .filter((phase) => phase.status === "next" && phase.id !== activePhase.id)
    .map((phase) => ({ phase, tasks: sortTasksForPhase(getTasksForPhase(phase, filteredTasks)) }));

  const nextTasks = filteredTasks.filter((task) => !isDone(task) && !focusTasks.some((item) => item.id === task.id));

  function openCreate() {
    setFormMode("create");
    setFormTask(null);
    setIsFormOpen(true);
  }

  function openEdit(task: ScheduleTask) {
    setFormMode("edit");
    setFormTask(task);
    setIsFormOpen(true);
  }

  function saveTask(task: ScheduleTask) {
    setTasks((current) => {
      const exists = current.some((item) => item.id === task.id);
      return exists ? current.map((item) => (item.id === task.id ? task : item)) : [task, ...current];
    });
    setIsFormOpen(false);
    setToast(formMode === "create" ? "Pronto, mais uma etapa organizada." : "Alteração salva com carinho.");
  }

  function toggleTask(task: ScheduleTask) {
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status: isDone(item) ? "Pendente" : ("Concluída" as ScheduleTask["status"]) } : item
      )
    );
    if (!isDone(task)) {
      setToast("Mais um passo dado. Seu planejamento está tomando forma.");
    }
  }

  function duplicateTask(task: ScheduleTask) {
    setTasks((current) => [{ ...task, id: crypto.randomUUID(), title: `Cópia de ${task.title}`, status: "Pendente" }, ...current]);
    setDetailsTask(null);
    setToast("Tarefa duplicada para você ajustar com calma.");
  }

  function moveTask(task: ScheduleTask, period: SchedulePeriod) {
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, period } : item)));
    setDetailsTask(null);
    setToast("Tarefa movida no cronograma.");
  }

  function markImportant(task: ScheduleTask) {
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, priority: "Alta" } : item)));
    setDetailsTask(null);
    setToast("Marcada como importante.");
  }

  function removeTask(task: ScheduleTask) {
    const confirmed = confirmPermanentDelete({ itemName: task.title, context: "Essa tarefa será removida do cronograma." });
    if (!confirmed) return;
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status: "Removida", isKept: false } : item)));
    setDetailsTask(null);
    setToast("Tarefa removida sem culpa.");
  }

  function applyPlanning(planningTasks: ScheduleTask[]) {
    setTasks((current) => [...planningTasks, ...current]);
    setIsPlanningOpen(false);
    setToast("Seu cronograma está ganhando forma.");
  }

  function clearFilters() {
    setFilters(defaultFilters);
  }

  if (viewMode === "planning-map") {
    return <PlanningMap onBack={() => setViewMode("journey")} />;
  }

  return (
    <div className="space-y-7">
      <SofiaPlanningHero onCustomize={() => setIsPlanningOpen(true)} onJourney={() => setViewMode("planning-map")} />

      {toast ? (
        <div className="rounded-2xl border border-casarei-primary-light/40 bg-white/86 px-4 py-3 text-sm font-semibold text-casarei-primary-deep">
          {toast}
        </div>
      ) : null}

      <CurrentFocusTasks tasks={focusTasks} onToggle={toggleTask} onEdit={openEdit} />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <EmotionalProgressCard completed={completedTasks.length} />
        <div className="grid gap-3 sm:grid-cols-[0.85fr_1.35fr] lg:min-w-[460px]">
          <Button variant="outline" className="h-14 bg-white/82 text-base" onClick={() => setIsFiltersOpen(true)}>
            <Filter className="h-4 w-4" aria-hidden />
            Ver filtros
          </Button>
          <Button
            className="h-14 rounded-2xl bg-casarei-primary text-base font-bold text-white shadow-[0_18px_38px_rgba(212,83,126,0.28)] transition hover:-translate-y-0.5 hover:bg-casarei-primary-dark hover:shadow-[0_22px_48px_rgba(212,83,126,0.34)]"
            onClick={openCreate}
          >
            <Plus className="h-5 w-5" aria-hidden />
            Adicionar algo importante
          </Button>
        </div>
      </div>

      <ScopeSwitch value={scope} onChange={setScope} />

      {scope === "Agora" ? (
        <>
          <WeddingTimeline phases={phases} activePhaseId={activePhaseId} onSelect={setActivePhaseId} />
          <CurrentPhaseCard phase={activePhase} tasks={currentPhaseTasks} onToggle={toggleTask} onEdit={openEdit} />
          <FuturePhaseAccordion phases={futurePhases} onToggle={toggleTask} onEdit={openEdit} />
        </>
      ) : null}

      {scope === "Próximas" ? (
        <TaskGroup title="Próximas etapas" subtitle="Tudo que está guardado para depois, sem pressa." tasks={nextTasks} onToggle={toggleTask} onEdit={openEdit} />
      ) : null}

      {scope === "Concluídas" ? (
        <TaskGroup title="Etapas concluídas" subtitle="Aproveite essa sensação. Vocês estão no caminho." tasks={completedTasks} onToggle={toggleTask} onEdit={openEdit} />
      ) : null}

      <FloatingAddButton onClick={openCreate} />
      <TaskFormModal open={isFormOpen} mode={formMode} task={formTask} onClose={() => setIsFormOpen(false)} onSave={saveTask} />
      <PlanningCustomizationModal open={isPlanningOpen} onClose={() => setIsPlanningOpen(false)} onApply={applyPlanning} />
      <TaskFiltersDrawer open={isFiltersOpen} filters={filters} onChange={setFilters} onClose={() => setIsFiltersOpen(false)} onClear={clearFilters} />
      <TaskDetailsDrawer task={detailsTask} onClose={() => setDetailsTask(null)} onDuplicate={duplicateTask} onMove={moveTask} onImportant={markImportant} onRemove={removeTask} />
    </div>
  );
}

function ScopeSwitch({ value, onChange }: { value: Scope; onChange: (value: Scope) => void }) {
  const items: Scope[] = ["Agora", "Próximas", "Concluídas"];

  return (
    <div className="inline-flex rounded-2xl border border-white/80 bg-white/72 p-1 shadow-[0_12px_30px_rgba(114,36,62,0.06)]">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition",
            value === item ? "bg-casarei-primary text-white shadow-[0_10px_22px_rgba(212,83,126,0.20)]" : "text-casarei-muted hover:text-casarei-primary"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function TaskGroup({
  title,
  subtitle,
  tasks,
  onToggle,
  onEdit
}: {
  title: string;
  subtitle: string;
  tasks: ScheduleTask[];
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-casarei-muted">{subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <GuidedTaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} />
        ))}
      </div>
    </section>
  );
}

function getTasksForPhase(phase: WeddingPhase, tasks: ScheduleTask[]) {
  return phase.taskIds.map((id) => tasks.find((task) => task.id === id)).filter(Boolean) as ScheduleTask[];
}

function sortTasksForPhase(tasks: ScheduleTask[]) {
  return [...tasks].sort((a, b) => Number(isDone(a)) - Number(isDone(b)));
}

function isDone(task: ScheduleTask) {
  return task.status.toLowerCase().startsWith("conclu");
}
