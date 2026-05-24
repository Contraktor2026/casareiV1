import type { VendorStatus } from "@/types/vendors";
import { cn } from "@/lib/utils";

const tone: Record<VendorStatus, string> = {
  Cotando: "bg-casarei-primary-bg text-casarei-primary-deep ring-casarei-primary-light/50",
  "Em negociação": "bg-amber-50 text-amber-700 ring-amber-100",
  "Aguardando resposta": "bg-amber-50 text-amber-700 ring-amber-100",
  Fechado: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "Contrato pendente": "bg-casarei-primary-bg text-casarei-primary-deep ring-casarei-primary-light/50",
  "Contrato assinado": "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "Pagamento pendente": "bg-rose-50 text-rose-700 ring-rose-100",
  Pago: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Finalizado: "bg-slate-50 text-slate-700 ring-slate-100",
  Descartado: "bg-slate-50 text-slate-500 ring-slate-100"
};

export function VendorStatusBadge({ status }: { status: VendorStatus }) {
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1", tone[status])}>{status}</span>;
}
