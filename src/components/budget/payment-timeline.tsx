import type { BudgetPayment } from "@/types/budget";
import { PaymentStatusBadge } from "./payment-status-badge";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function PaymentTimeline({ payments }: { payments: BudgetPayment[] }) {
  return (
    <section className="space-y-3">
      {payments.map((payment) => (
        <article key={payment.id} className="rounded-3xl border border-casarei-border-soft bg-white/90 p-4 shadow-[0_14px_36px_rgba(114,36,62,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-xl text-casarei-primary-deep">{payment.supplier}</p>
              <p className="mt-1 text-sm text-casarei-muted">
                {payment.category} - {payment.dueDate}
                {payment.method ? ` - ${payment.method}` : ""}
                {payment.source === "fornecedor" ? " - vindo de Fornecedores" : ""}
              </p>
            </div>
            <PaymentStatusBadge status={payment.status} />
          </div>
          <strong className="mt-4 block font-serif text-3xl text-casarei-primary-deep">{money(payment.amount)}</strong>
        </article>
      ))}
    </section>
  );
}
