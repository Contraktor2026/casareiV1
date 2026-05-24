import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

const ranges = [
  { label: "ate 50", count: 50 },
  { label: "50-100", count: 80 },
  { label: "100-150", count: 140 },
  { label: "150-250", count: 200 },
  { label: "250+", count: 280 }
];

type GuestCountStepProps = {
  range: string;
  onPick: (range: string, count: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function GuestCountStep({ range, onPick, onNext, onBack }: GuestCountStepProps) {
  return (
    <OnboardingStepShell
      eyebrow="Convidados"
      title="Quantas pessoas vocês imaginam celebrar com vocês?"
      subtitle="Isso ajuda a Sofia a montar um planejamento mais realista para buffet, espaço e RSVP."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <Users className="h-7 w-7" aria-hidden />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {ranges.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onPick(item.label, item.count)}
              className={cn(
                "rounded-2xl border px-5 py-5 text-left transition hover:-translate-y-0.5",
                range === item.label
                  ? "border-casarei-primary bg-casarei-primary-bg text-casarei-primary-deep"
                  : "border-casarei-border-soft bg-white text-casarei-text"
              )}
            >
              <span className="font-serif text-3xl">{item.label}</span>
              <span className="mt-1 block text-sm text-casarei-muted">convidados estimados</span>
            </button>
          ))}
        </div>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}
