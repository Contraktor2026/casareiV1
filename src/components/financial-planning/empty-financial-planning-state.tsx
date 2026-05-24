import { HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyFinancialPlanningStateProps = {
  onStart: () => void;
};

export function EmptyFinancialPlanningState({ onStart }: EmptyFinancialPlanningStateProps) {
  return (
    <Card className="border-white/90 bg-white/88 p-8 text-center shadow-[0_18px_48px_rgba(114,36,62,0.08)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
        <HeartHandshake className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-4 font-serif text-3xl text-casarei-primary-deep">Vamos desenhar o investimento do casamento?</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-casarei-muted">
        Antes de fechar fornecedores, defina quanto vocês pretendem investir e o que realmente é prioridade.
      </p>
      <Button className="mt-5" onClick={onStart}>
        Comecar planejamento
      </Button>
    </Card>
  );
}
