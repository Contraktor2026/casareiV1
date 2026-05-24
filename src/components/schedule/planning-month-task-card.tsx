import { Check, Edit3, MoveRight, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PlanningMapTask } from "@/types/planning-map";

type PlanningMonthTaskCardProps = {
  task: PlanningMapTask;
  onToggle: (task: PlanningMapTask) => void;
  onEdit: (task: PlanningMapTask) => void;
  onRemove: (task: PlanningMapTask) => void;
  onMove: (task: PlanningMapTask) => void;
};

export function PlanningMonthTaskCard({ task, onToggle, onEdit, onRemove, onMove }: PlanningMonthTaskCardProps) {
  const isDone = task.status === "Concluída";
  const isRemoved = task.status === "Removida";
  const priorityColor = task.priority === "Alta" ? "#f04456" : task.priority === "Média" ? "#f6a91a" : "#70bf62";

  return (
    <article
      className={cn(
        "rounded-2xl border border-[#f2d6d9] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5",
        task.status === "Atrasada" && "bg-[#fff6f4]",
        isRemoved && "opacity-55"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task)}
          className={cn(
            "mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border",
            isDone ? "border-[#d4537e] bg-[#d4537e] text-white" : "border-[#9f8c8d] bg-white text-transparent"
          )}
          aria-label={isDone ? "Marcar como pendente" : "Marcar como concluída"}
        >
          <Check className="h-4 w-4" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColor }} />
            <span className="text-xs text-[#7b6a70]">{task.priority}</span>
            <span className="rounded-full bg-[#fbeaf0] px-2 py-0.5 text-xs text-[#d4537e]">{task.category}</span>
            {task.suggestedBySofia ? <span className="text-xs text-[#d4537e]">Sofia</span> : null}
          </div>
          <h4 className={cn("mt-2 font-medium text-[#2a1a1f]", isDone && "line-through opacity-60")}>{task.title}</h4>
          <p className="mt-1 text-xs leading-5 text-[#7b6a70]">{task.description}</p>
          <p className="mt-2 text-xs font-medium text-[#2a1a1f]">{formatDate(task.dueDate)} · {task.status}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="grid h-9 w-9 place-items-center rounded-full border border-[#f2d6d9] bg-[#fff7f9]" onClick={() => onEdit(task)} aria-label="Editar">
          <Edit3 className="h-4 w-4" aria-hidden />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full border border-[#f2d6d9] bg-[#fff7f9]" onClick={() => onMove(task)} aria-label="Mover">
          <MoveRight className="h-4 w-4" aria-hidden />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full border border-[#f2d6d9] bg-[#fff7f9] text-[#d4537e]" onClick={() => onRemove(task)} aria-label="Remover">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
