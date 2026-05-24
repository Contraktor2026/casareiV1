import type { BudgetPaymentStatus } from "@/types/budget";
import { cn } from "@/lib/utils";

const labels: Record<BudgetPaymentStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  proximo: "Próximo",
  atrasado: "Precisa atenção"
};

const styles: Record<BudgetPaymentStatus, string> = {
  pago: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  pendente: "bg-casarei-primary-bg text-casarei-primary-deep ring-casarei-primary-light/50",
  proximo: "bg-amber-50 text-amber-700 ring-amber-100",
  atrasado: "bg-rose-50 text-rose-700 ring-rose-100"
};

export function PaymentStatusBadge({ status }: { status: BudgetPaymentStatus }) {
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1", styles[status])}>{labels[status]}</span>;
}
