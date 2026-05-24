import { HeartHandshake } from "lucide-react";

import { ProgressBar } from "@/components/shared/progress-bar";
import { Card } from "@/components/ui/card";
import { mockCouple, mockEmotionalMilestones } from "@/lib/mock/casarei";

export function EmotionalProgress() {
  return (
    <Card className="surface-lift overflow-hidden border-0 bg-white">
      <div className="bg-gradient-to-br from-casarei-primary-bg via-white to-casarei-cream p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-casarei-primary-dark">
              Jornada da Mari
            </p>
            <h2 className="mt-2 font-serif text-4xl font-medium leading-tight text-casarei-primary-deep">
              {mockCouple.progress}% do caminho já tem forma.
            </h2>
          </div>
          <div className="gentle-float flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-casarei-primary">
            <HeartHandshake className="h-6 w-6" aria-hidden />
          </div>
        </div>
        <ProgressBar className="mt-5" value={mockCouple.progress} />
      </div>
      <div className="grid grid-cols-2 gap-px bg-casarei-border-soft">
        {mockEmotionalMilestones.map((item) => (
          <div key={item.label} className="bg-white p-4">
            <p className="font-serif text-2xl text-casarei-primary-deep">{item.value}%</p>
            <p className="mt-1 text-xs leading-5 text-casarei-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
