import { Heart } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { EssencePaletteColor } from "@/types/essence";

import { EssencePalette } from "./essence-palette";
import { SofiaEssenceCard } from "./sofia-essence-card";

type WeddingEssenceHeroProps = {
  coupleName: string;
  dominantStyle: string;
  emotionalMood: string;
  palette: EssencePaletteColor[];
  sofiaInsight: string;
};

export function WeddingEssenceHero({
  coupleName,
  dominantStyle,
  emotionalMood,
  palette,
  sofiaInsight
}: WeddingEssenceHeroProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,253,249,0.98),rgba(251,234,240,0.72))] p-5 shadow-[0_18px_48px_rgba(114,36,62,0.09)] md:p-7">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-center">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Direcao criativa</p>
            <h1 className="mt-2 font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-[3rem]">
              A essência do casamento de {coupleName}
            </h1>
            <p className="mt-3 text-base text-casarei-primary-deep">{dominantStyle}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-text">
              Uma curadoria pequena e intencional para transformar referências soltas em escolhas claras para o grande
              dia: {emotionalMood}.
            </p>
          </div>

          <EssencePalette palette={palette} />
        </div>

        <div className="space-y-4">
          <SofiaEssenceCard insight={sofiaInsight} />
          <Card className="border-white/80 bg-white/68 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
                <Heart className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-serif text-xl text-casarei-primary-deep">Curadoria, não feed infinito</p>
                <p className="mt-1 text-sm leading-5 text-casarei-muted">
                  Escolham poucas referências que realmente traduzem o que vocês querem sentir.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
