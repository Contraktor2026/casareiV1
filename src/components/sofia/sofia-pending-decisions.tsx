import { Compass } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SofiaDecision } from "@/types/sofia";

import { SofiaActionButton } from "./sofia-action-button";

export function SofiaPendingDecisions({ decisions }: { decisions: SofiaDecision[] }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Decisões pendentes</p>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">Escolhas que destravam o caminho</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {decisions.map((decision) => (
          <Card key={decision.id} className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
            <Compass className="h-5 w-5 text-casarei-primary" aria-hidden />
            <h3 className="mt-3 font-serif text-2xl text-casarei-primary-deep">{decision.title}</h3>
            <p className="mt-2 text-sm leading-6 text-casarei-muted">{decision.reason}</p>
            <p className="mt-3 rounded-2xl bg-casarei-primary-bg/55 p-3 text-sm leading-5 text-casarei-text">
              {decision.impact}
            </p>
            <div className="mt-4">
              <SofiaActionButton action={decision.action} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
