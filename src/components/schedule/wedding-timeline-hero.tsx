import { CalendarHeart, Map, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type WeddingTimelineHeroProps = {
  onCustomize: () => void;
  onMap: () => void;
};

export function WeddingTimelineHero({ onCustomize, onMap }: WeddingTimelineHeroProps) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#fffdf9_0%,#fff8f2_44%,#fbeaf0_100%)] p-6 shadow-[0_26px_80px_rgba(114,36,62,0.12)] ring-1 ring-casarei-primary-light/20 md:p-9">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-casarei-primary">
            <CalendarHeart className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold">Planejamento guiado</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-5xl">
            Cronograma do casamento
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-casarei-text">
            Vamos organizar um passo de cada vez.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/90 bg-white/88 p-5 shadow-[0_20px_52px_rgba(114,36,62,0.10)]">
          <div className="flex items-center gap-2 text-casarei-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            <span className="text-sm font-semibold">Sofia</span>
          </div>
          <p className="mt-3 font-serif text-2xl leading-tight text-casarei-primary-deep">
            Mari, preparei um cronograma baseado na data, convidados e estilo do casamento.
          </p>
          <div className="mt-5 grid gap-2">
            <Button type="button" onClick={onCustomize}>
              Personalizar planejamento
            </Button>
            <Button type="button" variant="outline" className="bg-white/80" onClick={onMap}>
              <Map className="h-4 w-4" aria-hidden />
              Ver mapa completo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
