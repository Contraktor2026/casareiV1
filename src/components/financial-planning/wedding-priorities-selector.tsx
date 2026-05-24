import { Heart } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WeddingPrioritiesSelectorProps = {
  priorities: string[];
  selected: string[];
  onToggle: (priority: string) => void;
};

export function WeddingPrioritiesSelector({ priorities, selected, onToggle }: WeddingPrioritiesSelectorProps) {
  return (
    <Card className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15 md:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <Heart className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Prioridades do casamento</p>
          <h2 className="font-serif text-3xl text-casarei-primary-deep">O que é prioridade para vocês?</h2>
          <p className="mt-1 text-sm leading-6 text-casarei-muted">
            Marquem de 3 a 5 pontos. A Sofia usa isso para orientar onde investir mais e onde economizar com calma.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {priorities.map((priority) => {
          const active = selected.includes(priority);
          return (
            <button
              key={priority}
              type="button"
              onClick={() => onToggle(priority)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                active
                  ? "border-casarei-primary bg-casarei-primary text-white shadow-[0_10px_24px_rgba(212,83,126,0.20)]"
                  : "border-casarei-border-soft bg-white text-casarei-text hover:border-casarei-primary-light"
              )}
            >
              {priority}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs font-semibold text-casarei-primary">{selected.length} prioridades selecionadas</p>
    </Card>
  );
}
