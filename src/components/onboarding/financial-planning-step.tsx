import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type FinancialPlanningStepProps = {
  ranges: string[];
  selected: string;
  onPick: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function FinancialPlanningStep({ ranges, selected, onPick, onNext, onBack }: FinancialPlanningStepProps) {
  return (
    <OnboardingStepShell
      eyebrow="Planejamento financeiro"
      title="Quanto vocês pretendem investir?"
      subtitle="Isso ajuda a Sofia a sugerir caminhos mais equilibrados, sem tratar o casamento como uma planilha."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <Wallet className="h-7 w-7" aria-hidden />
        </div>
        <div className="mt-5 grid gap-3">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onPick(range)}
              className={cn(
                "rounded-2xl border px-5 py-4 text-left font-serif text-2xl transition hover:-translate-y-0.5",
                selected === range
                  ? "border-casarei-primary bg-casarei-primary-bg text-casarei-primary-deep"
                  : "border-casarei-border-soft bg-white text-casarei-primary-deep"
              )}
            >
              {range}
            </button>
          ))}
        </div>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}
