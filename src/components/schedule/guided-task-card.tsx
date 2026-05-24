import { Check, Edit3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScheduleTask } from "@/types/schedule";

type GuidedTaskCardProps = {
  task: ScheduleTask;
  onToggle: (task: ScheduleTask) => void;
  onEdit?: (task: ScheduleTask) => void;
  compact?: boolean;
};

const taskCopy: Record<string, { title: string; context: string }> = {
  "Revisar convidados pendentes": {
    title: "Vale revisar os convidados que ainda não responderam.",
    context: "Isso ajuda buffet, mesas e organização."
  },
  "Confirmar próximo pagamento": {
    title: "Vale confirmar o próximo pagamento.",
    context: "Esse cuidado evita correria com fornecedores nos próximos dias."
  },
  "Confirmar prÃ³ximo pagamento": {
    title: "Vale confirmar o próximo pagamento.",
    context: "Esse cuidado evita correria com fornecedores nos próximos dias."
  },
  "Revisar contrato da decoração": {
    title: "A decoração merece uma revisão carinhosa.",
    context: "Isso ajuda a alinhar atmosfera, fornecedores e orçamento."
  },
  "Revisar contrato da decoraÃ§Ã£o": {
    title: "A decoração merece uma revisão carinhosa.",
    context: "Isso ajuda a alinhar atmosfera, fornecedores e orçamento."
  },
  "Agendar prova do vestido": {
    title: "A prova do vestido pode ganhar uma data.",
    context: "Reservar esse momento traz tranquilidade para a noiva."
  },
  "Escolher músicas da cerimônia": {
    title: "A trilha da cerimônia já pode começar a ganhar forma.",
    context: "Essa escolha deixa o grande dia mais parecido com vocês."
  },
  "Escolher mÃºsicas da cerimÃ´nia": {
    title: "A trilha da cerimônia já pode começar a ganhar forma.",
    context: "Essa escolha deixa o grande dia mais parecido com vocês."
  }
};

export function GuidedTaskCard({ task, onToggle, onEdit, compact = false }: GuidedTaskCardProps) {
  const isDone = task.status.toLowerCase().startsWith("conclu");
  const copy = taskCopy[task.title] ?? { title: task.title, context: task.sofiaTip ?? task.description };

  if (isDone) {
    return (
      <article className="rounded-2xl border border-casarei-primary-light/20 bg-[linear-gradient(135deg,#f7fbf7,#fffdf9)] px-4 py-3 shadow-[0_8px_20px_rgba(114,36,62,0.045)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(task)}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-casarei-success/30 bg-casarei-success/12 text-casarei-success"
            aria-label="Reabrir etapa"
          >
            <Check className="h-4 w-4" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-casarei-primary-deep/70 line-through">{copy.title}</p>
            <p className="mt-0.5 text-xs text-casarei-muted">Resolvida em {formatDate(task.dueDate)}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" className="hidden text-casarei-muted sm:inline-flex" onClick={() => onToggle(task)}>
            Reabrir
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "rounded-[1.5rem] border border-white/90 bg-white/88 p-5 shadow-[0_14px_38px_rgba(114,36,62,0.075)] ring-1 ring-casarei-primary-light/10",
        task.status === "Atrasada" && "bg-[linear-gradient(135deg,#fff7f3,#fffdf9)]",
        compact && "p-4"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onToggle(task)}
          className={cn(
            "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition",
            isDone ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-primary-light bg-white text-transparent"
          )}
          aria-label={isDone ? "Reabrir etapa" : "Marcar como resolvido"}
        >
          <Check className="h-4 w-4" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{formatDate(task.dueDate)}</p>
          <h3 className={cn("mt-2 font-serif text-2xl leading-tight text-casarei-primary-deep", isDone && "line-through opacity-60")}>
            {copy.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-casarei-text">{copy.context}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="button" onClick={() => onToggle(task)} variant={isDone ? "outline" : "default"} className={isDone ? "bg-white" : ""}>
              {isDone ? "Reabrir etapa" : "Resolver isso"}
            </Button>
            {onEdit ? (
              <Button type="button" variant="outline" className="bg-white" onClick={() => onEdit(task)}>
                <Edit3 className="h-4 w-4" aria-hidden />
                Ajustar
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
