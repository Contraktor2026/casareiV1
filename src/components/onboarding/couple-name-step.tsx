import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type CoupleNameStepProps = {
  brideName: string;
  partnerName: string;
  onChange: (field: "brideName" | "partnerName", value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function CoupleNameStep({ brideName, partnerName, onChange, onNext, onBack }: CoupleNameStepProps) {
  return (
    <OnboardingStepShell
      eyebrow="Personalização"
      title="Como vocês querem ser chamados aqui dentro?"
      subtitle="O Casarei vai personalizar toda a jornada de vocês."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="grid gap-4">
          <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
            Nome da noiva
            <input
              value={brideName}
              onChange={(event) => onChange("brideName", event.target.value)}
              placeholder="Mariana"
              className="h-14 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 text-base outline-none focus:border-casarei-primary"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
            Nome parceiro(a)
            <input
              value={partnerName}
              onChange={(event) => onChange("partnerName", event.target.value)}
              placeholder="Rafael"
              className="h-14 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 text-base outline-none focus:border-casarei-primary"
            />
          </label>
        </div>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}
