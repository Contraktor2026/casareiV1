"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { planningMapCategories, planningMonthGroups } from "@/lib/mock/planning-map";
import type { PlanningMapCategory, PlanningMapPriority, PlanningMapTask, PlanningMonthId } from "@/types/planning-map";

type AddTaskToMonthModalProps = {
  open: boolean;
  monthId: PlanningMonthId | null;
  editTask?: PlanningMapTask | null;
  onClose: () => void;
  onSave: (task: PlanningMapTask) => void;
};

export function AddTaskToMonthModal({ open, monthId, editTask, onClose, onSave }: AddTaskToMonthModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PlanningMapCategory>("Outros");
  const [priority, setPriority] = useState<PlanningMapPriority>("Média");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(editTask?.title ?? "");
    setDescription(editTask?.description ?? "");
    setCategory(editTask?.category ?? "Outros");
    setPriority(editTask?.priority ?? "Média");
    setDueDate(editTask?.dueDate ?? "");
    setNotes(editTask?.notes ?? "");
    setError("");
  }, [editTask, open]);

  if (!open || !monthId) return null;

  const activeMonthId = monthId;
  const group = planningMonthGroups.find((item) => item.id === monthId);

  function save() {
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    onSave({
      id: editTask?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || "Nova tarefa adicionada ao mapa do planejamento.",
      category,
      monthGroup: activeMonthId,
      priority,
      dueDate,
      notes,
      status: editTask?.status ?? "Pendente",
      source: editTask?.source ?? "manual",
      suggestedBySofia: editTask?.suggestedBySofia ?? false
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#2a1a1f]/30 p-0 backdrop-blur-sm md:p-6">
      <div className="flex min-h-full items-end md:items-center md:justify-center">
        <section className="flex max-h-[92vh] w-full flex-col rounded-t-[28px] bg-[#fffdf9] shadow-[0_20px_60px_rgba(42,26,31,0.18)] md:max-w-2xl md:rounded-[28px]">
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="font-serif text-3xl text-[#3b1717]">{editTask ? "Editar tarefa" : "Nova tarefa"}</h2>
            <p className="mt-2 text-sm text-[#7b6a70]">{group?.title}</p>
            <div className="mt-6 grid gap-4">
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-12 rounded-xl border border-[#f2d6d9] px-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" placeholder="Ex: Confirmar horário com maquiadora" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 rounded-xl border border-[#f2d6d9] p-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" placeholder="Adicione detalhes importantes para lembrar depois" />
              <div className="grid gap-4 md:grid-cols-3">
                <Select label="Categoria" value={category} options={planningMapCategories.filter((item) => item !== "Todas")} onChange={(value) => setCategory(value as PlanningMapCategory)} />
                <Select label="Prioridade" value={priority} options={["Alta", "Média", "Baixa"]} onChange={(value) => setPriority(value as PlanningMapPriority)} />
                <label className="text-sm text-[#7b6a70]">
                  Prazo
                  <input value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" className="mt-2 h-12 w-full rounded-xl border border-[#f2d6d9] px-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" />
                </label>
              </div>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-20 rounded-xl border border-[#f2d6d9] p-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]" placeholder="Observações" />
            </div>
            {error ? <p className="mt-3 text-sm text-[#d4537e]">{error}</p> : null}
          </div>
          <div className="shrink-0 border-t border-[#f2d6d9] bg-[#fffdf9] px-6 pb-6 pt-4">
            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button className="bg-[#d4537e] text-white hover:bg-[#993556]" onClick={save}>Salvar tarefa</Button>
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
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#f2d6d9] bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#d4537e]">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
