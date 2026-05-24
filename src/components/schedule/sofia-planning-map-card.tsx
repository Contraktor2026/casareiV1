import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type SofiaPlanningMapCardProps = {
  onBack: () => void;
};

export function SofiaPlanningMapCard({ onBack }: SofiaPlanningMapCardProps) {
  return (
    <section className="rounded-[22px] border border-[#f2d6d9] bg-[rgba(255,253,249,0.86)] p-5 shadow-[0_10px_30px_rgba(153,53,86,0.06)] md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fbeaf0] text-[#d4537e]">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[#3b1717]">Sofia ✨</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4d3f44]">
              Esse é o mapa completo do seu planejamento. Você não precisa resolver tudo agora.
              Eu vou te mostrar o que importa em cada fase, no tempo certo.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-[#f0c5d2] bg-[#fff7f9] text-[#d4537e] hover:bg-[#fbeaf0]"
          onClick={onBack}
        >
          Voltar para minhas prioridades
        </Button>
      </div>
    </section>
  );
}
