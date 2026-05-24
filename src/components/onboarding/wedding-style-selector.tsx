import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WeddingStyleOption } from "@/types/onboarding";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type WeddingStyleSelectorProps = {
  options: WeddingStyleOption[];
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function WeddingStyleSelector({ options, selected, onToggle, onNext, onBack }: WeddingStyleSelectorProps) {
  return (
    <div>
      <OnboardingStepShell
        eyebrow="Estilo"
        title="Como vocês imaginam esse casamento?"
        subtitle="Escolha uma ou mais direções. Isso ajuda a Sofia a entender o clima que vocês querem viver."
      >
        <div className="grid max-h-[58vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {options.map((option) => {
            const active = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onToggle(option.id)}
                className={cn(
                  "group overflow-hidden rounded-[1.5rem] border bg-white text-left shadow-[0_14px_34px_rgba(114,36,62,0.08)] transition hover:-translate-y-0.5",
                  active ? "border-casarei-primary ring-2 ring-casarei-primary-light/45" : "border-white/90"
                )}
              >
                <div className="relative h-28 bg-cover bg-center" style={{ backgroundImage: `url(${option.imageUrl})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-casarei-ink/40 to-transparent" />
                  {active ? (
                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-casarei-primary">
                      <Check className="h-4 w-4" aria-hidden />
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="font-serif text-2xl text-casarei-primary-deep">{option.name}</p>
                  <p className="mt-1 text-sm leading-5 text-casarei-muted">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </OnboardingStepShell>
      <div className="mx-auto max-w-5xl">
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </div>
  );
}
