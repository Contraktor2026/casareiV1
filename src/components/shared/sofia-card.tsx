import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

type SofiaCardProps = {
  title?: string;
  children: ReactNode;
};

export function SofiaCard({ title = "Sofia sugere", children }: SofiaCardProps) {
  return (
    <Card className="border-casarei-primary-light bg-casarei-primary-bg p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-casarei-primary">
          <Sparkles className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-casarei-primary-deep">{title}</p>
          <div className="mt-1 text-sm leading-6 text-casarei-text">{children}</div>
        </div>
      </div>
    </Card>
  );
}
