import { cn } from "@/lib/utils";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type WeddingPrioritiesStepProps = {
  options: string[];
  selected: string[];
  onToggle: (priority: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function WeddingPrioritiesStep({ options, selected, onToggle, onNext, onBack }: WeddingPrioritiesStepProps) {
  return (
    <OnboardingStepShell
      eyebrow="Prioridades"
      title="O que mais importa para vocês?"
      subtitle="Escolha o que a Sofia deve proteger quando sugerir planejamento, cotações e orçamento."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="flex flex-wrap gap-3">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className={cn(
                  "rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
                  active ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-border-soft bg-white text-casarei-text"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-sm font-semibold text-casarei-primary">{selected.length} prioridades selecionadas</p>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}
