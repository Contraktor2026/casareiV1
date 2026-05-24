import { Edit3, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { KeyReference } from "@/types/essence";

type KeyReferenceCardProps = {
  reference: KeyReference;
  onEdit: (reference: KeyReference) => void;
  onRemove: (id: string) => void;
  onToggleMain: (id: string) => void;
};

export function KeyReferenceCard({ reference, onEdit, onRemove, onToggleMain }: KeyReferenceCardProps) {
  return (
    <Card className="group overflow-hidden border-white/80 bg-white/88 shadow-[0_14px_38px_rgba(114,36,62,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(114,36,62,0.12)]">
      <div
        className="min-h-[220px] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(42,26,31,0.08), rgba(42,26,31,0.34)), url(${reference.imageUrl})` }}
      >
        <div className="flex h-full min-h-[220px] items-start justify-between p-4">
          <span className="rounded-full bg-white/86 px-3 py-1 text-xs font-semibold text-casarei-primary-deep shadow-sm">
            {reference.category}
          </span>
          {reference.isMain ? (
            <span className="rounded-full bg-casarei-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Principal
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="font-serif text-2xl text-casarei-primary-deep">{reference.title}</p>
          <p className="mt-2 text-sm leading-6 text-casarei-text">{reference.reason}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-casarei-primary-bg px-3 py-1 text-xs font-semibold text-casarei-primary">
            {reference.emotionalTag}
          </span>
          {reference.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full border border-casarei-border-soft bg-white px-3 py-1 text-xs text-casarei-muted">
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button variant="outline" size="sm" onClick={() => onEdit(reference)}>
            <Edit3 className="h-3.5 w-3.5" aria-hidden />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(reference)}>
            Substituir
          </Button>
          <Button variant="outline" size="sm" onClick={() => onToggleMain(reference.id)}>
            <Star className="h-3.5 w-3.5" aria-hidden />
            Principal
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRemove(reference.id)}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Remover
          </Button>
        </div>
      </div>
    </Card>
  );
}
