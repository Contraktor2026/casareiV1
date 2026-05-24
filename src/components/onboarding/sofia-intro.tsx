import { Sparkles } from "lucide-react";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type SofiaIntroProps = {
  onNext: () => void;
  onBack: () => void;
};

export function SofiaIntro({ onNext, onBack }: SofiaIntroProps) {
  return (
    <OnboardingStepShell
      eyebrow="Sua assistente"
      title="Oi, eu sou a Sofia."
      subtitle="Vou ajudar vocês a organizar o casamento passo a passo, sem transformar isso em uma planilha cansativa."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.12)]">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <Sparkles className="h-8 w-8" aria-hidden />
        </div>
        <p className="mt-6 font-serif text-3xl leading-tight text-casarei-primary-deep">
          Você não precisa resolver tudo hoje.
        </p>
        <p className="mt-3 text-sm leading-6 text-casarei-text">
          Primeiro eu conheço um pouco do casamento de vocês. Depois, transformo isso em próximos passos mais leves.
        </p>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}
