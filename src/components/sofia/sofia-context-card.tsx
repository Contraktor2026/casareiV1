import { CalendarDays, MapPin, Users, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SofiaWeddingContext } from "@/types/sofia";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function SofiaContextCard({ context }: { context: SofiaWeddingContext }) {
  return (
    <Card className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
      <p className="text-sm font-semibold text-casarei-primary">Memoria da Sofia</p>
      <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">{context.coupleName}</h2>
      <p className="mt-2 text-sm leading-6 text-casarei-muted">
        Como vocês escolheram um casamento {context.style}, faz sentido priorizar fornecedores com estética leve e
        atendimento cuidadoso.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info icon={CalendarDays} label="Data" value={context.weddingDate} />
        <Info icon={MapPin} label="Local" value={context.location} />
        <Info icon={Users} label="Convidados" value={`${context.guestCount} pessoas`} />
        <Info icon={Wallet} label="Planejado" value={money(context.plannedBudget)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {context.priorities.map((priority) => (
          <span key={priority} className="rounded-full bg-casarei-primary-bg px-3 py-1.5 text-xs font-semibold text-casarei-primary-deep">
            {priority}
          </span>
        ))}
      </div>
    </Card>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-casarei-primary-light/20 bg-white/76 p-3">
      <div className="flex items-center gap-2 text-casarei-primary">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-casarei-primary-deep">{value}</p>
    </div>
  );
}
