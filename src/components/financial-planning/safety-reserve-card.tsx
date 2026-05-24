import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

type SafetyReserveCardProps = {
  totalPlanned: number;
  percent: number;
  onChange: (percent: number) => void;
};

export function SafetyReserveCard({ totalPlanned, percent, onChange }: SafetyReserveCardProps) {
  const amount = Math.round((totalPlanned * percent) / 100);

  return (
    <Card className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Reserva para imprevistos</p>
          <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">{money(amount)}</h2>
          <p className="mt-1 text-sm leading-6 text-casarei-muted">
            Uma margem de seguranca ajuda a evitar sustos perto do casamento.
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[5, 10, 15].map((option) => (
          <Button
            key={option}
            type="button"
            variant={percent === option ? "default" : "outline"}
            className={percent === option ? "" : "bg-white"}
            onClick={() => onChange(option)}
          >
            {option}%
          </Button>
        ))}
      </div>
    </Card>
  );
}
