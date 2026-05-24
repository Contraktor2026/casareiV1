import type { BudgetPayment } from "@/types/budget";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetCalendarView({ payments }: { payments: BudgetPayment[] }) {
  const months = Array.from(new Set(payments.map((payment) => payment.month)));

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {months.map((month) => {
        const monthPayments = payments.filter((payment) => payment.month === month);
        return (
          <div key={month} className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5 shadow-[0_14px_36px_rgba(114,36,62,0.06)]">
            <h3 className="font-serif text-2xl text-casarei-primary-deep">{month}</h3>
            <div className="mt-4 space-y-3">
              {monthPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-casarei-text">
                    {payment.category}
                    {payment.source === "fornecedor" ? " - fornecedores" : ""}
                  </span>
                  <strong className="font-serif text-lg text-casarei-primary-deep">{money(payment.amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
