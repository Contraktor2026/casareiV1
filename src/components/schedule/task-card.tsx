import { BriefcaseBusiness, Check, CheckSquare, Edit3, FileText, MoreVertical, Music, Shirt, Sparkles, Users, WalletCards } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ScheduleTask } from "@/types/schedule";

const categoryIcons = {
  Cerimônia: Music,
  Recepção: Sparkles,
  Convidados: Users,
  Beleza: Shirt,
  Fornecedores: BriefcaseBusiness,
  Documentos: FileText,
  Orçamento: WalletCards,
  Cotações: FileText,
  Outros: CheckSquare
};

type TaskCardProps = {
  task: ScheduleTask;
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
  onMore: (task: ScheduleTask) => void;
};

export function TaskCard({ task, onToggle, onEdit, onMore }: TaskCardProps) {
  const Icon = categoryIcons[task.category];
  const priorityColor = task.priority === "Alta" ? "#f04456" : task.priority === "Média" ? "#f6a91a" : "#70bf62";
  const isCompleted = task.status === "Concluída";

  return (
    <article
      className={cn(
        "grid gap-3 border-b border-[#f2d6d9] bg-[rgba(255,253,249,0.78)] p-4 last:border-b-0 transition hover:bg-[#fffaf8] lg:grid-cols-[92px_1fr_150px_92px] lg:items-center lg:px-5",
        task.status === "Atrasada" && "bg-[#fff6f4]"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task)}
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full border transition",
            isCompleted ? "border-[#d4537e] bg-[#d4537e] text-white" : "border-[#9f8c8d] bg-white text-transparent"
          )}
          aria-label={isCompleted ? "Marcar como pendente" : "Marcar como concluída"}
        >
          <Check className="h-4 w-4" aria-hidden />
        </button>
        <span className="hidden items-center gap-2 text-xs lg:flex">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColor }} />
          {task.priority}
        </span>
      </div>

      <div className="flex min-w-0 gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#fbeaf0] text-[#d4537e]">
          <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 lg:hidden">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: priorityColor }} />
            <span className="text-xs text-[#7b6a70]">{task.priority}</span>
            {task.isSuggestedBySofia ? <span className="text-xs text-[#d4537e]">Sofia</span> : null}
          </div>
          <p className={cn("font-medium text-[#2a1a1f]", isCompleted && "line-through opacity-60")}>{task.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#4d3f44]">{task.description}</p>
        </div>
      </div>

      <div className="text-sm lg:border-l lg:border-[#f2d6d9] lg:pl-6">
        {task.status === "Atrasada" ? <p className="font-bold text-[#d4537e]">Atenção</p> : null}
        <p className="text-[#2a1a1f]">{formatDate(task.dueDate)}</p>
      </div>

      <div className="flex items-center gap-4 lg:justify-end">
        <button
          className="grid h-9 w-9 place-items-center rounded-full border border-[#f2d6d9] bg-[#fff7f9]"
          onClick={() => onEdit(task)}
          aria-label="Editar tarefa"
        >
          <Edit3 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </button>
        <button onClick={() => onMore(task)} aria-label="Mais opções">
          <MoreVertical className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
