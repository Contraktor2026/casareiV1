import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

type SofiaEssenceCardProps = {
  insight: string;
};

export function SofiaEssenceCard({ insight }: SofiaEssenceCardProps) {
  return (
    <Card className="border-casarei-primary-light/45 bg-white/84 p-4 shadow-[0_14px_36px_rgba(114,36,62,0.08)]">
      <div className="flex items-center gap-2 text-casarei-primary">
        <Sparkles className="h-4 w-4" aria-hidden />
        <span className="text-sm font-semibold">Sofia</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-casarei-text">{insight}</p>
    </Card>
  );
}
