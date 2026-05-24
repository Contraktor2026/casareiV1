import { Mail, MapPin, Phone, UserRound } from "lucide-react";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

type BasicInfoStepProps = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  onChange: (field: "fullName" | "phone" | "email" | "city" | "state", value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function BasicInfoStep({ fullName, phone, email, city, state, onChange, onNext, onBack }: BasicInfoStepProps) {
  return (
    <OnboardingStepShell
      eyebrow="Primeiros detalhes"
      title="Antes de começar, me conta quem está por aqui?"
      subtitle="Só o essencial para a Sofia personalizar sua jornada e deixar tudo com o seu jeito."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="grid gap-4">
          <Field icon={UserRound} label="Seu nome" value={fullName} placeholder="Mariana Silva" onChange={(value) => onChange("fullName", value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field icon={Phone} label="Telefone" value={phone} placeholder="(11) 99999-9999" onChange={(value) => onChange("phone", value)} />
            <Field icon={Mail} label="Email" value={email} placeholder="mari@email.com" onChange={(value) => onChange("email", value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_120px]">
            <Field icon={MapPin} label="Cidade" value={city} placeholder="Campinas" onChange={(value) => onChange("city", value)} />
            <Field label="Estado" value={state} placeholder="SP" maxLength={2} onChange={(value) => onChange("state", value.toUpperCase())} />
          </div>
        </div>
        <p className="mt-5 rounded-2xl bg-casarei-primary-bg/60 px-4 py-3 text-sm leading-6 text-casarei-text">
          Essas informações ficam mockadas por enquanto. Depois, elas ajudam a Sofia a lembrar cidade, fornecedores próximos e contatos importantes.
        </p>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  icon?: typeof UserRound;
  onChange: (value: string) => void;
};

function Field({ label, value, placeholder, maxLength, icon: Icon, onChange }: FieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-casarei-primary-deep">
      {label}
      <span className="flex h-14 items-center gap-3 rounded-2xl border border-casarei-border-soft bg-white px-4 transition focus-within:border-casarei-primary">
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-casarei-primary" aria-hidden /> : null}
        <input
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-casarei-text outline-none placeholder:text-casarei-muted/70"
        />
      </span>
    </label>
  );
}
