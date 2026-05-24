import { Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

export type WeddingPhaseStatus = "done" | "current" | "next";

export type WeddingPhase = {
  id: string;
  label: string;
  title: string;
  description: string;
  status: WeddingPhaseStatus;
  taskIds: string[];
};

type WeddingTimelineProps = {
  phases: WeddingPhase[];
  activePhaseId: string;
  onSelect: (id: string) => void;
};

export function WeddingTimeline({ phases, activePhaseId, onSelect }: WeddingTimelineProps) {
  return (
    <section className="rounded-[2rem] border border-white/90 bg-white/80 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.075)] md:p-6">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Timeline do casamento</p>
        <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">A jornada ate o grande dia</h2>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {phases.map((phase) => {
          const active = phase.id === activePhaseId;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelect(phase.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                active
                  ? "border-casarei-primary bg-casarei-primary text-white shadow-[0_16px_34px_rgba(212,83,126,0.20)]"
                  : "border-white/90 bg-white/82 text-casarei-primary-deep hover:border-casarei-primary-light"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">{phase.label}</span>
                {phase.status === "done" ? <Check className="h-4 w-4" aria-hidden /> : <Circle className="h-3 w-3" aria-hidden />}
              </div>
              <p className="mt-3 font-serif text-lg leading-tight">{phase.title}</p>
              <p className={cn("mt-2 text-xs leading-5", active ? "text-white/82" : "text-casarei-muted")}>
                {phase.status === "current" ? "Fase atual" : phase.status === "done" ? "Já encaminhada" : `${phase.taskIds.length} tarefas aguardando`}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
