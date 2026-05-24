import type { ScheduleTask } from "@/types/schedule";

import type { WeddingPhase } from "./wedding-timeline";
import { GuidedTaskCard } from "./guided-task-card";

type CurrentPhaseCardProps = {
  phase: WeddingPhase;
  tasks: ScheduleTask[];
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
};

export function CurrentPhaseCard({ phase, tasks, onToggle, onEdit }: CurrentPhaseCardProps) {
  const pendingCount = tasks.filter((task) => !task.status.toLowerCase().startsWith("conclu")).length;
  const doneCount = tasks.length - pendingCount;

  return (
    <section className="rounded-[2rem] border border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 shadow-[0_20px_54px_rgba(114,36,62,0.09)] md:p-6">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Sua fase atual</p>
          <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">
            Vocês estão na fase: {phase.label} antes do casamento.
          </h2>
          <p className="mt-3 text-sm leading-6 text-casarei-text">{phase.description}</p>
          <p className="mt-4 rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm text-casarei-primary-deep">
            {pendingCount} para cuidar agora • {doneCount} já resolvidas
          </p>
        </div>
        <div className="grid gap-3">
          {tasks.map((task) => (
            <GuidedTaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
