"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { guestGroups } from "@/lib/mock/guests";
import type { Guest } from "@/types/guests";

type GuestFormModalProps = {
  open: boolean;
  guest?: Guest | null;
  onClose: () => void;
  onSave: (guest: Guest, addAnother?: boolean) => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  group: string;
  relation: string;
  companionsAllowed: boolean;
  companionsAllowedCount: number;
  childrenCount: number;
  foodNote: string;
  tableName: string;
  notes: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  group: guestGroups[0] ?? "Família",
  relation: "",
  companionsAllowed: false,
  companionsAllowedCount: 0,
  childrenCount: 0,
  foodNote: "",
  tableName: "",
  notes: ""
};

export function GuestFormModal({ open, guest, onClose, onSave }: GuestFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (!guest) {
      setForm(emptyForm);
      setError("");
      return;
    }

    setForm({
      firstName: guest.firstName,
      lastName: guest.lastName,
      phone: guest.phone,
      email: guest.email,
      group: guest.group,
      relation: guest.relation,
      companionsAllowed: guest.companions.allowed,
      companionsAllowedCount: guest.companions.allowedCount,
      childrenCount: guest.children.count,
      foodNote: guest.food.buffetNotes,
      tableName: guest.table.name,
      notes: guest.notes
    });
    setError("");
  }, [guest, open]);

  if (!open) {
    return null;
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildGuest(): Guest | null {
    if (!form.firstName.trim()) {
      setError("Nome e obrigatorio.");
      return null;
    }

    const id = guest?.id ?? crypto.randomUUID();
    return {
      id,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      nickname: form.firstName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      group: form.group,
      relation: form.relation.trim() || "Pessoa querida",
      side: guest?.side ?? "couple",
      notes: form.notes,
      rsvp: guest?.rsvp ?? {
        status: "pending",
        invitationSent: false,
        viewed: false,
        responded: false,
        remindersSent: 0,
        token: `guest-${id}`,
        lastInteraction: "Ainda não recebeu o convite"
      },
      companions: {
        allowed: form.companionsAllowed,
        allowedCount: form.companionsAllowed ? Number(form.companionsAllowedCount) : 0,
        confirmedCount: guest?.companions.confirmedCount ?? 0,
        names: guest?.companions.names ?? []
      },
      children: {
        count: Number(form.childrenCount),
        names: Array.from({ length: Number(form.childrenCount) }).map((_, index) => ({ name: `Crianca ${index + 1}`, age: 5 }))
      },
      food: {
        vegetarian: form.foodNote.toLowerCase().includes("vegetar"),
        vegan: form.foodNote.toLowerCase().includes("vegan"),
        intolerance: form.foodNote.toLowerCase().includes("lactose") || form.foodNote.toLowerCase().includes("gluten") ? form.foodNote : "",
        allergies: form.foodNote.toLowerCase().includes("alerg") ? form.foodNote : "",
        buffetNotes: form.foodNote
      },
      table: {
        name: form.tableName,
        group: form.tableName ? "Grupo principal" : "",
        affinities: [form.group],
        avoidWith: []
      },
      internalNote: guest?.internalNote ?? "",
      ceremonialNote: guest?.ceremonialNote ?? "",
      buffetNote: form.foodNote,
      history: guest?.history ?? [{ label: "convidado adicionado", date: "hoje" }]
    };
  }

  function submit(addAnother = false) {
    const nextGuest = buildGuest();
    if (!nextGuest) return;
    onSave(nextGuest, addAnother);
    if (addAnother) {
      setForm(emptyForm);
      setError("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar formulario" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 flex max-h-[92vh] w-full max-w-3xl -translate-x-1/2 flex-col rounded-t-[2rem] bg-[#fffdf9] shadow-2xl md:top-1/2 md:max-h-[88vh] md:-translate-y-1/2 md:rounded-[2rem]">
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-casarei-primary">{guest ? "Editar pessoa querida" : "Novo convidado"}</p>
              <h2 className="mt-1 font-serif text-3xl font-medium text-casarei-primary-deep">
                {guest ? "Ajustar detalhes" : "Adicionar convidado"}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-5 w-5" aria-hidden />
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <TextField label="Nome" value={form.firstName} onChange={(value) => update("firstName", value)} />
            <TextField label="Sobrenome" value={form.lastName} onChange={(value) => update("lastName", value)} />
            <TextField label="WhatsApp" value={form.phone} onChange={(value) => update("phone", value)} />
            <TextField label="Email" value={form.email} onChange={(value) => update("email", value)} />
            <label className="space-y-2 text-sm font-medium text-casarei-text">
              Grupo
              <select value={form.group} onChange={(event) => update("group", event.target.value)} className="w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary">
                {guestGroups.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </label>
            <TextField label="Relacao" value={form.relation} onChange={(value) => update("relation", value)} />
            <label className="flex items-center gap-3 rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm text-casarei-text">
              <input type="checkbox" checked={form.companionsAllowed} onChange={(event) => update("companionsAllowed", event.target.checked)} />
              Permite acompanhante
            </label>
            <TextField label="Qtd. acompanhantes" type="number" value={String(form.companionsAllowedCount)} onChange={(value) => update("companionsAllowedCount", Number(value))} />
            <TextField label="Criancas" type="number" value={String(form.childrenCount)} onChange={(value) => update("childrenCount", Number(value))} />
            <TextField label="Mesa" value={form.tableName} onChange={(value) => update("tableName", value)} />
            <TextArea label="Restricoes alimentares" value={form.foodNote} onChange={(value) => update("foodNote", value)} />
            <TextArea label="Observacoes" value={form.notes} onChange={(value) => update("notes", value)} />
          </div>

          {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        </div>
        <div className="shrink-0 border-t border-[#EEE6E1] bg-[#fffdf9] px-5 pb-6 pt-4 md:px-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {!guest && (
              <Button type="button" variant="outline" onClick={() => submit(true)}>
                Salvar e adicionar outro
              </Button>
            )}
            <Button type="button" onClick={() => submit(false)}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm font-medium text-casarei-text">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm font-medium text-casarei-text md:col-span-2">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
    </label>
  );
}
