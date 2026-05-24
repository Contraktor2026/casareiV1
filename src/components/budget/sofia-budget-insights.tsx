import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

export function SofiaBudgetInsights() {
  return (
    <Card className="border-casarei-primary-light/45 bg-[linear-gradient(135deg,#fff2f6,#fffdf9)] p-6 shadow-[0_20px_54px_rgba(114,36,62,0.10)] ring-1 ring-white/80">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-casarei-primary shadow-[0_10px_24px_rgba(114,36,62,0.10)]">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Sofia</p>
          <p className="mt-2 font-serif text-2xl leading-tight text-casarei-primary-deep">
            Mari, vocês já organizaram boa parte do orçamento.
          </p>
          <p className="mt-3 text-sm leading-6 text-casarei-text">
            Agora vale acompanhar os próximos pagamentos para evitar correria perto do casamento, sem transformar isso
            em uma planilha pesada.
          </p>
        </div>
      </div>
    </Card>
  );
}
