import { Button } from "@/components/ui/button";
import { planningMonthGroups } from "@/lib/mock/planning-map";
import type { PlanningMapTask, PlanningMonthId } from "@/types/planning-map";

type MoveTaskModalProps = {
  task: PlanningMapTask | null;
  onClose: () => void;
  onMove: (task: PlanningMapTask, monthId: PlanningMonthId) => void;
};

export function MoveTaskModal({ task, onClose, onMove }: MoveTaskModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2a1a1f]/30 p-0 backdrop-blur-sm md:p-6">
      <div className="flex min-h-full items-end md:items-center md:justify-center">
        <section className="w-full rounded-t-[28px] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(42,26,31,0.18)] md:max-w-md md:rounded-[28px]">
          <h2 className="font-serif text-3xl text-[#3b1717]">Mover tarefa</h2>
          <p className="mt-2 text-sm text-[#7b6a70]">{task.title}</p>
          <div className="mt-5 grid gap-2">
            {planningMonthGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => onMove(task, group.id)}
                className="rounded-xl border border-[#f2d6d9] bg-[#fff8f8] px-4 py-3 text-left text-sm text-[#2a1a1f] hover:bg-[#fbeaf0]"
              >
                {group.title}
              </button>
            ))}
          </div>
          <Button variant="outline" className="mt-5 w-full" onClick={onClose}>Cancelar</Button>
        </section>
      </div>
    </div>
  );
}
