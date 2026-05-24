import { Button } from "@/components/ui/button";
import type { SchedulePeriod, ScheduleTask } from "@/types/schedule";

type TaskDetailsDrawerProps = {
  task: ScheduleTask | null;
  onClose: () => void;
  onDuplicate: (task: ScheduleTask) => void;
  onMove: (task: ScheduleTask, period: SchedulePeriod) => void;
  onImportant: (task: ScheduleTask) => void;
  onRemove: (task: ScheduleTask) => void;
};

export function TaskDetailsDrawer({ task, onClose, onDuplicate, onMove, onImportant, onRemove }: TaskDetailsDrawerProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2a1a1f]/30 backdrop-blur-sm">
      <aside className="ml-auto flex min-h-full items-end md:items-stretch md:justify-end">
        <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(42,26,31,0.18)] md:min-h-full md:max-w-lg md:rounded-none">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4537e]">Detalhes da tarefa</p>
          <h2 className="mt-3 font-serif text-3xl text-[#3b1717]">{task.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#4d3f44]">{task.description}</p>

          <div className="mt-6 grid gap-3 rounded-2xl border border-[#f2d6d9] bg-[#fff8f8] p-4 text-sm">
            <Info label="Categoria" value={task.category} />
            <Info label="Prioridade" value={task.priority} />
            <Info label="Prazo" value={task.dueDate || "Sem prazo definido"} />
            <Info label="Status" value={task.status} />
            <Info label="Origem" value={task.source === "sofia" ? "Sofia" : "Manual"} />
          </div>

          <section className="mt-5 rounded-2xl bg-[#fbeaf0] p-4">
            <p className="font-serif text-xl text-[#3b1717]">Sugestão da Sofia</p>
            <p className="mt-2 text-sm leading-6 text-[#4d3f44]">
              {task.sofiaTip ?? "Essa tarefa ajuda a deixar a semana mais leve."}
            </p>
          </section>

          <section className="mt-5">
            <p className="font-semibold text-[#2a1a1f]">Histórico</p>
            <ul className="mt-2 space-y-2 text-sm text-[#7b6a70]">
              {(task.history ?? ["Tarefa criada no cronograma"]).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <div className="mt-6 grid gap-3">
            <Button variant="outline" onClick={() => onDuplicate(task)}>Duplicar tarefa</Button>
            <div className="grid grid-cols-3 gap-2">
              {(["Esta semana", "Este mês", "Mais pra frente"] as SchedulePeriod[]).map((period) => (
                <Button key={period} variant="outline" className="text-xs" onClick={() => onMove(task, period)}>
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={() => onImportant(task)}>Marcar como importante</Button>
            <Button variant="outline" className="border-[#f0c5d2] text-[#d4537e]" onClick={() => onRemove(task)}>
              Remover do cronograma
            </Button>
            <Button className="bg-[#d4537e] text-white hover:bg-[#993556]" onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#7b6a70]">{label}</span>
      <span className="font-medium text-[#2a1a1f]">{value}</span>
    </div>
  );
}
