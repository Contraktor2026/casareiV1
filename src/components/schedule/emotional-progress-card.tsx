import { Heart } from "lucide-react";

type EmotionalProgressCardProps = {
  completed: number;
};

export function EmotionalProgressCard({ completed }: EmotionalProgressCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/90 bg-white/82 p-5 shadow-[0_16px_42px_rgba(114,36,62,0.07)]">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <Heart className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="font-serif text-2xl text-casarei-primary-deep">{completed} etapas já ganharam forma</p>
          <p className="mt-1 text-sm leading-6 text-casarei-muted">
            Seu casamento está tomando forma com calma e clareza.
          </p>
        </div>
      </div>
    </section>
  );
}
