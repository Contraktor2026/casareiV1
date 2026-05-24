import { Heart } from "lucide-react";

import type { Guest } from "@/types/guests";
import { Card } from "@/components/ui/card";

export function GuestsImportantAlerts({ guests, onOpenBuffet }: { guests: Guest[]; onOpenBuffet: () => void }) {
  const restrictions = guests.filter((guest) => guest.food.buffetNotes).length;

  return (
    <Card className="surface-lift overflow-hidden border-casarei-primary-light/40 bg-gradient-to-br from-white via-white to-casarei-primary-bg/60 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-casarei-primary">
            <Heart className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold">Sofia</span>
          </div>
          <p className="mt-2 max-w-2xl font-serif text-2xl leading-tight text-casarei-primary-deep">
            Mari, antes de fechar buffet e mesas, vale revisar acompanhantes, crianças e restrições alimentares.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-text">
            O mais importante agora é cuidar dos detalhes humanos: quem vai, quem precisa de cuidado no buffet e quem ainda falta acomodar com carinho.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenBuffet}
          className="rounded-xl bg-casarei-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-casarei-primary/20 transition hover:bg-casarei-primary-dark"
        >
          Ver {restrictions || 9} cuidados do buffet
        </button>
      </div>
    </Card>
  );
}
