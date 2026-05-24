import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type OnboardingActionsProps = {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  hideBack?: boolean;
};

export function OnboardingActions({ onBack, onNext, nextLabel = "Continuar", backLabel = "Voltar", hideBack = false }: OnboardingActionsProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
      {!hideBack ? (
        <Button type="button" variant="outline" className="bg-white/80" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </Button>
      ) : null}
      <Button type="button" size="lg" onClick={onNext}>
        {nextLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}
