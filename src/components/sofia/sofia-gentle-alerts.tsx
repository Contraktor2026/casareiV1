import { Heart } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SofiaAlert } from "@/types/sofia";

import { SofiaActionButton } from "./sofia-action-button";

export function SofiaGentleAlerts({ alerts }: { alerts: SofiaAlert[] }) {
  return (
    <Card className="border-white/90 bg-[linear-gradient(135deg,#fff7e9,#fffdf9)] p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
      <div className="flex items-start gap-3">
        <Heart className="mt-1 h-5 w-5 text-casarei-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Alertas com carinho</p>
          <h2 className="font-serif text-3xl text-casarei-primary-deep">Detalhes que merecem atenção</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-white/80 bg-white/72 p-4">
            <p className="font-serif text-xl text-casarei-primary-deep">{alert.title}</p>
            <p className="mt-1 text-sm leading-6 text-casarei-text">{alert.text}</p>
            <div className="mt-3">
              <SofiaActionButton action={alert.action} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
