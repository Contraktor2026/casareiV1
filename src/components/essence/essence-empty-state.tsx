import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EssenceEmptyStateProps = {
  onAdd: () => void;
};

export function EssenceEmptyState({ onAdd }: EssenceEmptyStateProps) {
  return (
    <Card className="border-white/80 bg-white/86 p-8 text-center shadow-[0_16px_44px_rgba(114,36,62,0.08)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
        <Heart className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-4 font-serif text-3xl text-casarei-primary-deep">Vamos descobrir a essência do casamento?</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-casarei-muted">
        Você não precisa salvar mil imagens. Comece com 3 referências que realmente representam o que vocês querem
        viver.
      </p>
      <Button className="mt-5" onClick={onAdd}>
        Adicionar primeira referencia
      </Button>
    </Card>
  );
}
