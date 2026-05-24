import { Heart } from "lucide-react";

type TimelineEmotionalProgressProps = {
  completed: number;
  total: number;
};

export function TimelineEmotionalProgress({ completed, total }: TimelineEmotionalProgressProps) {
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-[1.75rem] border border-white/90 bg-white/82 p-5 shadow-[0_16px_42px_rgba(114,36,62,0.07)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
            <Heart className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-serif text-2xl text-casarei-primary-deep">{completed} etapas já ganharam forma</p>
            <p className="mt-1 text-sm leading-6 text-casarei-muted">
              Seu planejamento está andando. Não precisa resolver tudo hoje.
            </p>
          </div>
        </div>
        <div className="min-w-[220px]">
          <div className="h-2.5 overflow-hidden rounded-full bg-[#f3e8e5]">
            <div className="h-full rounded-full bg-casarei-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-right text-xs font-semibold text-casarei-primary">{progress}% organizado</p>
        </div>
      </div>
    </section>
  );
}
