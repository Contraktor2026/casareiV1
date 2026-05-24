import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type SofiaHeroProps = {
  message: string;
  onGuide: () => void;
};

export function SofiaHero({ message, onGuide }: SofiaHeroProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#fffdf9_0%,#fff8f2_45%,#fbeaf0_100%)] p-5 shadow-[0_26px_80px_rgba(114,36,62,0.13)] ring-1 ring-casarei-primary-light/20 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Assistente digital da noiva</p>
          <h1 className="mt-2 font-serif text-5xl font-medium leading-tight text-casarei-primary-deep">Sofia</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-text md:text-base">
            Sua assistente digital para organizar o casamento com mais leveza.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/90 bg-white/88 p-5 shadow-[0_22px_58px_rgba(114,36,62,0.12)]">
          <div className="flex items-center gap-2 text-casarei-primary">
            <Sparkles className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold">Sofia</span>
          </div>
          <p className="mt-3 font-serif text-2xl leading-tight text-casarei-primary-deep">{message}</p>
          <Button className="mt-5 w-full" onClick={onGuide}>
            Me orientar agora
          </Button>
        </div>
      </div>
    </section>
  );
}
