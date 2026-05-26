"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { fullScheduleCategories, schedulePeriodOptions, schedulePriorities } from "@/lib/mock/schedule";
import type { ScheduleCategory, SchedulePeriod, SchedulePriority, ScheduleTask } from "@/types/schedule";

type TaskFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  task?: ScheduleTask | null;
  onClose: () => void;
  onSave: (task: ScheduleTask) => void;
};

export function TaskFormModal({ open, mode, task, onClose, onSave }: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ScheduleCategory>("Convidados");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<SchedulePriority>("Média");
  const [period, setPeriod] = useState<SchedulePeriod>("Esta semana");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setCategory(task?.category ?? "Convidados");
    setDueDate(task?.dueDate ?? "");
    setPriority(task?.priority ?? "Média");
    setPeriod(task?.period ?? "Esta semana");
    setNotes(task?.notes ?? "");
    setError("");
  }, [open, task]);

  if (!open) return null;

  function handleSave() {
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    const today = new Date("2026-05-13T00:00:00");
    const due = dueDate ? new Date(`${dueDate}T00:00:00`) : null;
    const status = task?.status === "Concluída" ? "Concluída" : due && due < today ? "Atrasada" : "Pendente";

    onSave({
      id: task?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || "Sem descrição por enquanto.",
      category,
      period,
      priority,
      dueDate,
      status,
      source: task?.source ?? "manual",
      isSuggestedBySofia: task?.isSuggestedBySofia ?? false,
      isKept: true,
      notes,
      sofiaTip: task?.sofiaTip,
      history: [...(task?.history ?? []), mode === "create" ? "Criada manualmente" : "Editada por Mariana"]
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#2a1a1f]/30 p-0 backdrop-blur-sm md:p-6">
      <div className="ml-auto flex min-h-full w-full items-end md:items-center md:justify-center">
        <section className="flex max-h-[92vh] w-full flex-col rounded-t-[28px] bg-[#fffdf9] shadow-[0_20px_60px_rgba(42,26,31,0.18)] md:max-w-2xl md:rounded-[28px]">
          <div className="shrink-0 border-b border-[#f2d6d9] px-6 pb-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[#3b1717]">{mode === "create" ? "Nova tarefa" : "Editar tarefa"}</h2>
                {task?.isSuggestedBySofia ? (
                  <p className="mt-1 text-xs text-[#d4537e]">Sugerida pela Sofia</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button className="h-9 rounded-full bg-[#d4537e] px-4 text-sm text-white hover:bg-[#993556]" onClick={handleSave}>
                  {mode === "create" ? "Salvar" : "Salvar"}
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={onClose}><X className="h-4 w-4" /></Button>
              </div>
            </div>
            {error ? <p className="mt-2 text-sm text-[#d4537e]">{error}</p> : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div className="grid gap-4">
              <input className="h-12 rounded-xl border border-[#f2d6d9] px-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Confirmar horário com maquiadora" />
              <textarea className="min-h-24 rounded-xl border border-[#f2d6d9] p-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Adicione detalhes importantes para lembrar depois" />
              <div className="grid gap-4 md:grid-cols-2">
                <Select label="Categoria" value={category} onChange={(value) => setCategory(value as ScheduleCategory)} options={fullScheduleCategories} />
                <label className="text-sm text-[#7b6a70]">
                  Prazo
                  <input className="mt-2 h-12 w-full rounded-xl border border-[#f2d6d9] px-4 text-sm text-[#2a1a1f] outline-none focus:ring-2 focus:ring-[#d4537e]" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                </label>
                <Select label="Prioridade" value={priority} onChange={(value) => setPriority(value as SchedulePriority)} options={schedulePriorities} />
                <Select label="Período" value={period} onChange={(value) => setPeriod(value as SchedulePeriod)} options={schedulePeriodOptions} />
              </div>
              <textarea className="min-h-20 rounded-xl border border-[#f2d6d9] p-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Observações" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-sm text-[#7b6a70]">
      {label}
      <select className="mt-2 h-12 w-full rounded-xl border border-[#f2d6d9] bg-white px-4 text-sm text-[#2a1a1f] outline-none focus:ring-2 focus:ring-[#d4537e]" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
