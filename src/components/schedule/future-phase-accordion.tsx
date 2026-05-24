"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ScheduleTask } from "@/types/schedule";

import type { WeddingPhase } from "./wedding-timeline";
import { GuidedTaskCard } from "./guided-task-card";

type FuturePhaseAccordionProps = {
  phases: Array<{ phase: WeddingPhase; tasks: ScheduleTask[] }>;
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
};

export function FuturePhaseAccordion({ phases, onToggle, onEdit }: FuturePhaseAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Proximas fases</p>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">Guardadas para o momento certo</h2>
      </div>
      <div className="space-y-3">
        {phases.map(({ phase, tasks }) => {
          const open = openId === phase.id;
          const doneCount = tasks.filter((task) => task.status.toLowerCase().startsWith("conclu")).length;
          const pendingCount = tasks.length - doneCount;
          return (
            <div key={phase.id} className="rounded-[1.5rem] border border-white/90 bg-white/80 shadow-[0_12px_30px_rgba(114,36,62,0.055)]">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : phase.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{phase.label}</p>
                  <p className="mt-1 font-serif text-2xl text-casarei-primary-deep">{phase.title}</p>
                  <p className="mt-1 text-sm text-casarei-muted">
                    {pendingCount} aguardando{doneCount ? ` • ${doneCount} resolvidas` : ""}
                  </p>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-casarei-primary transition", open && "rotate-180")} aria-hidden />
              </button>
              {open ? (
                <div className="grid gap-3 border-t border-casarei-border-soft/70 p-5">
                  {tasks.map((task) => (
                    <GuidedTaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} compact />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
