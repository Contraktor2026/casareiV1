import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { essenceTags, referenceOrigins } from "@/lib/mock/essence";
import type { KeyReference, ReferenceFormValues } from "@/types/essence";

const inputClassName =
  "h-12 w-full rounded-2xl border border-casarei-border-soft bg-white/90 px-4 text-sm font-normal text-casarei-text outline-none transition placeholder:text-casarei-muted/70 focus:border-casarei-primary";

type AddReferenceModalProps = {
  open: boolean;
  reference?: KeyReference | null;
  onClose: () => void;
  onSave: (values: ReferenceFormValues, editingId?: string) => void;
};

const emptyValues: ReferenceFormValues = {
  title: "",
  imageUrl: "",
  category: "",
  reason: "",
  represents: "",
  tags: [],
  origin: "site",
  relatedVendor: ""
};

export function AddReferenceModal({ open, reference, onClose, onSave }: AddReferenceModalProps) {
  const [values, setValues] = useState<ReferenceFormValues>(emptyValues);

  useEffect(() => {
    if (!open) return;
    if (reference) {
      setValues({
        title: reference.title,
        imageUrl: reference.imageUrl,
        category: reference.category,
        reason: reference.reason,
        represents: reference.emotionalTag,
        tags: reference.tags,
        origin: reference.origin,
        relatedVendor: reference.relatedVendor ?? ""
      });
      return;
    }
    setValues(emptyValues);
  }, [open, reference]);

  if (!open) return null;

  function toggleTag(tag: ReferenceFormValues["tags"][number]) {
    setValues((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag]
    }));
  }

  function submit() {
    if (!values.title.trim() || !values.category.trim()) return;
    onSave(values, reference?.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-casarei-ink/35 p-3 backdrop-blur-sm md:items-center md:justify-center">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-[1.75rem] border border-white/80 bg-[#fffdf9] p-5 shadow-[0_24px_80px_rgba(42,26,31,0.22)] md:max-w-3xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Curadoria da essência</p>
            <h2 className="font-serif text-3xl text-casarei-primary-deep">
              {reference ? "Editar referencia" : "Adicionar referencia"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-casarei-muted">
              Escolha referências que realmente representam o que vocês querem sentir no grande dia.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-casarei-border-soft bg-white p-2 text-casarei-muted transition hover:text-casarei-primary"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Titulo da referencia">
            <input
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ex: Mesa posta delicada"
              className={inputClassName}
            />
          </Field>
          <Field label="Categoria">
            <input
              value={values.category}
              onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
              placeholder="Ex: Decoração, fotografia, vestido..."
              className={inputClassName}
            />
          </Field>
          <Field label="Imagem ou link">
            <input
              value={values.imageUrl}
              onChange={(event) => setValues((current) => ({ ...current, imageUrl: event.target.value }))}
              placeholder="Cole um link de imagem ou referencia"
              className={inputClassName}
            />
          </Field>
          <Field label="Origem">
            <select
              value={values.origin}
              onChange={(event) => setValues((current) => ({ ...current, origin: event.target.value as ReferenceFormValues["origin"] }))}
              className={inputClassName}
            >
              {referenceOrigins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </Field>
          <Field label="O que você gostou nessa referência?">
            <textarea
              value={values.reason}
              onChange={(event) => setValues((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Ex: luz quente, flores naturais, mesa leve..."
              className={`${inputClassName} min-h-28 py-3`}
            />
          </Field>
          <Field label="Por que representa vocês?">
            <textarea
              value={values.represents}
              onChange={(event) => setValues((current) => ({ ...current, represents: event.target.value }))}
              placeholder="Ex: acolhedor, delicado, romantico..."
              className={`${inputClassName} min-h-28 py-3`}
            />
          </Field>
          <Field label="Fornecedor relacionado, opcional">
            <input
              value={values.relatedVendor}
              onChange={(event) => setValues((current) => ({ ...current, relatedVendor: event.target.value }))}
              placeholder="Ex: Decoradora, fotografo..."
              className={inputClassName}
            />
          </Field>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-casarei-primary-deep">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {essenceTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={
                  values.tags.includes(tag)
                    ? "rounded-full bg-casarei-primary px-3 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-casarei-border-soft bg-white px-3 py-2 text-sm text-casarei-muted"
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit}>
            {reference ? "Salvar referencia" : "Adicionar referencia"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
      <span>{label}</span>
      {children}
    </label>
  );
}
