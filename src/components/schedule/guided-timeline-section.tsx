import { EmptyTimelineState } from "@/components/schedule/empty-timeline-state";
import type { ScheduleTask } from "@/types/schedule";

import { HumanTaskCard } from "./human-task-card";

type GuidedTimelineSectionProps = {
  title: string;
  subtitle: string;
  tasks: ScheduleTask[];
  onCreate: () => void;
  onToggle: (task: ScheduleTask) => void;
  onEdit: (task: ScheduleTask) => void;
  onMore: (task: ScheduleTask) => void;
};

export function GuidedTimelineSection({ title, subtitle, tasks, onCreate, onToggle, onEdit, onMore }: GuidedTimelineSectionProps) {
  if (!tasks.length) {
    return <EmptyTimelineState type="all-done" onCreate={onCreate} />;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-casarei-muted">{subtitle}</p>
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <HumanTaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onMore={onMore} />
        ))}
      </div>
    </section>
  );
}
