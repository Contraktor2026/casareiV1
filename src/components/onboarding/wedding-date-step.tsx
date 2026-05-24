import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "@/types/onboarding";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type WeddingDateStepProps = {
  date: string;
  mode: OnboardingData["weddingDateMode"];
  onDateChange: (value: string) => void;
  onModeChange: (mode: OnboardingData["weddingDateMode"]) => void;
  onNext: () => void;
  onBack: () => void;
};

export function WeddingDateStep({ date, mode, onDateChange, onModeChange, onNext, onBack }: WeddingDateStepProps) {
  return (
    <OnboardingStepShell
      eyebrow="Data"
      title="Quando esse dia especial deve acontecer?"
      subtitle="Mesmo que ainda não esteja totalmente definido, a Sofia consegue montar um caminho com você."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <CalendarDays className="h-7 w-7" aria-hidden />
        </div>
        <input
          type={mode === "month" ? "month" : "date"}
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          disabled={mode === "unknown"}
          className="mt-5 h-14 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 text-base outline-none disabled:opacity-50"
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            ["exact", "Data exata"],
            ["month", "Mes aproximado"],
            ["unknown", "Ainda não definido"]
          ].map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={mode === value ? "default" : "outline"}
              className={cn(mode !== value && "bg-white")}
              onClick={() => onModeChange(value as OnboardingData["weddingDateMode"])}
            >
              {label}
            </Button>
          ))}
        </div>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}
