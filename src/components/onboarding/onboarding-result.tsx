"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CalendarHeart, CheckCircle2, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateAndStorePlan } from "@/lib/client/planning-store";
import type { OnboardingData } from "@/types/onboarding";

type OnboardingResultProps = {
  data: OnboardingData;
  onBack: () => void;
};

export function OnboardingResult({ data, onBack }: OnboardingResultProps) {
  useEffect(() => {
    if (data.weddingDate && data.vendorTypes.length > 0) {
      generateAndStorePlan(data);
    }
  }, [data]);
  const bride = data.brideName || "Mari";
  const partner = data.partnerName || "seu amor";

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Sua jornada começou</p>
        <h1 className="mt-2 font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-6xl">
          {bride} & {partner}, o casamento de vocês já começou a ganhar forma.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-casarei-text">
          Agora vocês têm um espaço pensado para organizar tudo com mais clareza e leveza.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/app">Entrar no Casarei</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/80">
            <Link href="/app/cronograma">Ver meu planejamento</Link>
          </Button>
          <Button type="button" size="lg" variant="ghost" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_28px_80px_rgba(114,36,62,0.12)]">
        <Preview icon={CalendarHeart} title="Cronograma" text="Primeiros passos organizados por fase." />
        <Preview icon={MapPin} title="Localização" text={`${data.city || "Cidade"}${data.state ? ` - ${data.state}` : ""}`} />
        <Preview icon={Sparkles} title="Estrutura" text={`${data.weddingFormat} · ${data.ceremonyType} · ${data.partySize}`} />
        <Preview icon={CheckCircle2} title="Fornecedores" text={data.vendorTypes.slice(0, 4).join(" · ") || "Buffet · Fotografia · Cerimonial"} />
        <Preview icon={Sparkles} title="Sofia" text="Orientação acolhedora para decidir com calma." />
        <Preview icon={CheckCircle2} title="Prioridades" text={data.priorities.slice(0, 3).join(" • ") || "Fotografia • Convidados • Leveza"} />
      </div>
    </div>
  );
}

function Preview({ icon: Icon, title, text }: { icon: typeof CalendarHeart; title: string; text: string }) {
  return (
    <div className="mb-4 rounded-3xl border border-casarei-primary-light/20 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 last:mb-0">
      <div className="flex items-start gap-3">
        <Icon className="mt-1 h-5 w-5 text-casarei-primary" aria-hidden />
        <div>
          <p className="font-serif text-2xl text-casarei-primary-deep">{title}</p>
          <p className="mt-1 text-sm leading-6 text-casarei-muted">{text}</p>
        </div>
      </div>
    </div>
  );
}
