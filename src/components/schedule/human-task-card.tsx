import { Check, Edit3, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScheduleTask } from "@/types/schedule";

type HumanTaskCardProps = {
  task: ScheduleTask;
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
  onMore: (task: ScheduleTask) => void;
};

const humanTitles: Record<string, string> = {
  "Revisar convidados pendentes": "Vale revisar os convidados que ainda não responderam.",
  "Confirmar proximo pagamento": "Vale confirmar o próximo pagamento com calma.",
  "Confirmar próximo pagamento": "Vale confirmar o próximo pagamento com calma.",
  "Escolher musicas da cerimonia": "A trilha da cerimônia já pode começar a ganhar forma.",
  "Escolher músicas da cerimônia": "A trilha da cerimônia já pode começar a ganhar forma.",
  "Agendar prova do vestido": "A prova do vestido merece um horário reservado.",
  "Revisar contrato da decoracao": "A decoração merece uma revisão carinhosa.",
  "Revisar contrato da decoração": "A decoração merece uma revisão carinhosa."
};

const humanContext: Record<string, string> = {
  Convidados: "Isso ajuda buffet, mesas e organização da cerimônia.",
  Orçamento: "Isso deixa os próximos dias mais leves e evita correria.",
  Cotações: "Isso ajuda vocês a escolher com mais clareza, sem se perder em propostas.",
  Fornecedores: "Isso evita combinados soltos e deixa os fornecedores alinhados.",
  Beleza: "Isso traz tranquilidade para a noiva viver essa etapa com calma.",
  Cerimônia: "Isso ajuda o grande dia a ficar mais parecido com vocês.",
  Documentos: "Cuidar aos poucos evita que vire correria depois.",
  Recepção: "Essa escolha ajuda a experiência dos convidados a ficar mais gostosa.",
  Outros: "Se fizer sentido para vocês, guardamos essa etapa com carinho."
};

export function HumanTaskCard({ task, onToggle, onEdit, onMore }: HumanTaskCardProps) {
  const isCompleted = task.status.toLowerCase().startsWith("conclu");
  const title = humanTitles[task.title] ?? task.title;
  const context = task.sofiaTip ?? humanContext[task.category] ?? task.description;

  return (
    <article
      className={cn(
        "rounded-[1.75rem] border border-white/90 bg-white/88 p-5 shadow-[0_16px_42px_rgba(114,36,62,0.075)] ring-1 ring-casarei-primary-light/12 transition hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(114,36,62,0.11)]",
        task.status === "Atrasada" && "bg-[linear-gradient(135deg,#fff7f3,#fffdf9)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">
            {task.period} • {formatDate(task.dueDate)}
          </p>
          <h3 className={cn("mt-2 font-serif text-2xl leading-tight text-casarei-primary-deep", isCompleted && "opacity-60 line-through")}>
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-casarei-text">{context}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(task)}
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition",
            isCompleted ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-primary-light bg-white text-transparent"
          )}
          aria-label={isCompleted ? "Marcar como pendente" : "Marcar como resolvido"}
        >
          <Check className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant={isCompleted ? "outline" : "default"} className={isCompleted ? "bg-white/80" : ""} onClick={() => onToggle(task)}>
          {isCompleted ? "Reabrir etapa" : "Marcar como resolvido"}
        </Button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="grid h-10 w-10 place-items-center rounded-full border border-casarei-border-soft bg-white/80 text-casarei-primary-deep"
            aria-label="Editar"
          >
            <Edit3 className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onMore(task)}
            className="grid h-10 w-10 place-items-center rounded-full border border-casarei-border-soft bg-white/80 text-casarei-primary-deep"
            aria-label="Mais opções"
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
