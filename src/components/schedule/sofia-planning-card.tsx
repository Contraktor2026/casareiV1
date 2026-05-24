import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type SofiaPlanningCardProps = {
  onCustomize: () => void;
};

export function SofiaPlanningCard({ onCustomize }: SofiaPlanningCardProps) {
  return (
    <section className="rounded-[18px] border border-[#f2d6d9] bg-[rgba(255,253,249,0.72)] p-5 shadow-[0_10px_30px_rgba(153,53,86,0.06)] md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-5">
          <div className="h-[84px] w-[84px] shrink-0 rounded-full bg-[radial-gradient(circle_at_50%_30%,#f8c9b7_0_20%,#6b3d35_21%_33%,#f1a4a5_34%_100%)]" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl text-[#3b1717]">Sofia</h2>
              <Sparkles className="h-4 w-4 text-[#d4537e]" aria-hidden />
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#2a1a1f]">
              Preparei uma sugestão de planejamento baseada no seu casamento 💕
              <br />
              Você pode ajustar tudo do seu jeito!
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-[#f0c5d2] bg-[#fff7f9] text-[#d4537e] hover:bg-[#fbeaf0]"
          onClick={onCustomize}
        >
          Personalizar planejamento
        </Button>
      </div>
    </section>
  );
}
