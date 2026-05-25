"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { budgetCategories } from "@/lib/mock/budget";

export function AddExpenseModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (message: string) => void }) {
  const [supplier, setSupplier] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(budgetCategories[0]?.name ?? "Buffet");

  if (!open) return null;

  function save() {
    if (!supplier.trim() || !amount.trim()) return;
    onSave(`Gasto de R$ ${amount} com ${supplier} adicionado.`);
    setSupplier("");
    setAmount("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 rounded-t-[2rem] bg-[#fffdf9] p-5 shadow-2xl md:top-1/2 md:-translate-y-1/2 md:rounded-[2rem] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Novo gasto</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Adicionar decisão ao orçamento</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Fornecedor" value={supplier} onChange={setSupplier} placeholder="Ex: Luz de Domingo" />
          <Field label="Valor" value={amount} onChange={setAmount} placeholder="Ex: 8500" />
          <label className="text-sm font-medium text-casarei-text">
            Categoria
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 outline-none focus:border-casarei-primary">
              {budgetCategories.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <Field label="Entrada" value="" onChange={() => undefined} placeholder="Opcional" />
          <Field label="Parcelas" value="" onChange={() => undefined} placeholder="Ex: 3" />
          <Field label="Vencimento" value="" onChange={() => undefined} placeholder="Ex: 2026-06-10" />
        </div>
        <label className="mt-4 block text-sm font-medium text-casarei-text">
          Observações
          <textarea rows={3} className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" placeholder="O que essa decisão representa para vocês?" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" className="bg-white" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={save}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-medium text-casarei-text">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 outline-none focus:border-casarei-primary" />
    </label>
  );
}
