import type { ScheduleTask } from "@/types/schedule";

import { GuidedTaskCard } from "./guided-task-card";

type CurrentFocusTasksProps = {
  tasks: ScheduleTask[];
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
};

export function CurrentFocusTasks({ tasks, onToggle, onEdit }: CurrentFocusTasksProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">O que fazer agora</p>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">O que merece atenção agora</h2>
        <p className="mt-1 text-sm leading-6 text-casarei-muted">
          Poucos passos, escolhidos para destravar o planejamento sem sobrecarregar.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {tasks.slice(0, 3).map((task) => (
          <GuidedTaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} compact />
        ))}
      </div>
    </section>
  );
}
