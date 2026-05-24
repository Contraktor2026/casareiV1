import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FinancialPlanningComparison } from "@/types/financial-planning";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

type PlannedVsActualSummaryProps = {
  comparison: FinancialPlanningComparison;
};

export function PlannedVsActualSummary({ comparison }: PlannedVsActualSummaryProps) {
  return (
    <Card className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
      <p className="text-sm font-semibold text-casarei-primary">Planejado x Fechado</p>
      <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Visao geral, sem virar controle real</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Info label="Planejado" value={money(comparison.planned)} />
        <Info label="Já comprometido" value={money(comparison.committed)} />
        <Info label="Ainda em aberto" value={money(comparison.open)} />
      </div>
      <Button asChild variant="outline" className="mt-5 w-full bg-white">
        <Link href="/app/orcamento">Ver orçamento real</Link>
      </Button>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-casarei-primary-light/20 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl text-casarei-primary-deep">{value}</p>
    </div>
  );
}
