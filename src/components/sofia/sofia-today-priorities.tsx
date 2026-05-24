import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { SofiaPriority } from "@/types/sofia";

import { SofiaActionButton } from "./sofia-action-button";

export function SofiaTodayPriorities({ priorities }: { priorities: SofiaPriority[] }) {
  return (
    <Card className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
      <p className="text-sm font-semibold text-casarei-primary">Prioridades de hoje</p>
      <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">So tres coisas</h2>
      <div className="mt-5 space-y-3">
        {priorities.slice(0, 3).map((priority) => (
          <div key={priority.id} className="rounded-2xl border border-casarei-primary-light/20 bg-[linear-gradient(135deg,#fffdf9,#fff7f3)] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-casarei-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xl text-casarei-primary-deep">{priority.title}</p>
                <p className="mt-1 text-sm leading-5 text-casarei-muted">{priority.detail}</p>
                <div className="mt-3">
                  <SofiaActionButton action={priority.action} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
