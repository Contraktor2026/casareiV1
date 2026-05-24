import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockSofiaMessages } from "@/lib/mock/casarei";

export function SofiaCompanionCard() {
  const message = mockSofiaMessages[0];

  return (
    <Card className="surface-lift soft-appear border-casarei-primary-light bg-casarei-primary-bg p-5">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-casarei-primary">
          <Sparkles className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-casarei-primary-dark">Sofia</p>
          <h2 className="mt-2 font-serif text-2xl font-medium leading-tight text-casarei-primary-deep">
            {message.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-casarei-text">{message.message}</p>
          <div className="mt-4 flex gap-2">
            <Button size="sm">Ver próximos passos</Button>
            <Button size="sm" variant="outline">Depois</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
