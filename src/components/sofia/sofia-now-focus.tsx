import { Heart } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SofiaAlert, SofiaPriority } from "@/types/sofia";

import { SofiaActionButton } from "./sofia-action-button";

type SofiaNowFocusProps = {
  priorities: SofiaPriority[];
  alert: SofiaAlert;
  onMoreDetails: () => void;
  onReminder: () => void;
};

export function SofiaNowFocus({ priorities, alert, onMoreDetails, onReminder }: SofiaNowFocusProps) {
  const visiblePriorities = priorities.slice(0, 3);

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="border-white/90 bg-white/90 p-5 shadow-[0_22px_60px_rgba(114,36,62,0.09)] ring-1 ring-casarei-primary-light/15 md:p-7">
        <p className="text-sm font-semibold text-casarei-primary">O que merece carinho agora</p>
        <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Vamos por partes</h2>
        <div className="mt-6 space-y-3">
          {visiblePriorities.map((priority, index) => (
            <div
              key={priority.id}
              className={index === 0 ? "rounded-3xl border border-casarei-primary-light/30 bg-[linear-gradient(135deg,#fff2f6,#fffdf9)] p-5" : "hidden rounded-3xl border border-casarei-primary-light/20 bg-white/78 p-5 md:block"}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">
                    {index === 0 ? "Próximo passo" : `Depois disso`}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-casarei-primary-deep">{priority.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-casarei-muted">{priority.detail}</p>
                </div>
                <div className="shrink-0">
                  <SofiaActionButton action={priority.action} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-white/90 bg-[linear-gradient(135deg,#fff7e9,#fffdf9)] p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
        <div className="flex items-start gap-3">
          <Heart className="mt-1 h-5 w-5 text-casarei-primary" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Um detalhe importante</p>
            <h3 className="mt-1 font-serif text-2xl text-casarei-primary-deep">{alert.title}</h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-casarei-text">{alert.text}</p>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onReminder}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-casarei-primary px-4 text-sm font-semibold text-white transition hover:bg-casarei-primary-dark"
          >
            Enviar lembrete RSVP
          </button>
          <button
            type="button"
            onClick={onMoreDetails}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-casarei-border-soft bg-white/82 px-4 text-sm font-semibold text-casarei-primary-deep transition hover:border-casarei-primary-light"
          >
            Ver mais detalhes
          </button>
        </div>
      </Card>
    </section>
  );
}
