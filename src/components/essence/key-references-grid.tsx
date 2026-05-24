import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { KeyReference } from "@/types/essence";

import { KeyReferenceCard } from "./key-reference-card";

type KeyReferencesGridProps = {
  references: KeyReference[];
  onAdd: () => void;
  onEdit: (reference: KeyReference) => void;
  onRemove: (id: string) => void;
  onToggleMain: (id: string) => void;
};

export function KeyReferencesGrid({ references, onAdd, onEdit, onRemove, onToggleMain }: KeyReferencesGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Referências que definem vocês</p>
          <h2 className="font-serif text-3xl text-casarei-primary-deep">O que representa vocês</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-casarei-muted">
            Poucas imagens, escolhidas com intenção. A ideia é orientar decisões, não criar outro mural infinito.
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar referencia
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {references.map((reference) => (
          <KeyReferenceCard
            key={reference.id}
            reference={reference}
            onEdit={onEdit}
            onRemove={onRemove}
            onToggleMain={onToggleMain}
          />
        ))}
      </div>
    </section>
  );
}
