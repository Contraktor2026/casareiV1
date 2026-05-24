import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BudgetPayment } from "@/types/budget";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function UpcomingPaymentsCard({ payments }: { payments: BudgetPayment[] }) {
  const upcoming = payments.filter((payment) => payment.status === "proximo").slice(0, 3);

  return (
    <Card className="border-white/90 bg-white/88 p-6 shadow-[0_18px_48px_rgba(114,36,62,0.085)] ring-1 ring-casarei-primary-light/15">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-casarei-primary-deep">Proximos pagamentos</h2>
          <p className="mt-1 text-sm text-casarei-muted">Para acompanhar sem susto.</p>
        </div>
        <Button asChild variant="outline" className="bg-white">
          <Link href="/app/orcamento/pagamentos">Ver todos</Link>
        </Button>
      </div>
      <div className="mt-5 space-y-3">
        {upcoming.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between gap-4 rounded-2xl border border-casarei-primary-light/20 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-casarei-text">{payment.supplier}</p>
              <p className="text-xs text-casarei-muted">
                {payment.category} - {payment.dueDate}
                {payment.source === "fornecedor" ? " - fornecedores" : ""}
              </p>
            </div>
            <p className="font-serif text-xl text-casarei-primary-deep">{money(payment.amount)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
