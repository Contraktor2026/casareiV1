import { AlertCircle, FileText, ReceiptText, Timer, Heart } from "lucide-react";

import type { Vendor } from "@/types/vendors";

export function VendorAttentionPoints({ vendors }: { vendors: Vendor[] }) {
  const points = [
    {
      label: "Contratos",
      value: `${vendors.filter((vendor) => !vendor.contract.signed).length} ainda não assinados`,
      icon: FileText
    },
    {
      label: "Pagamentos",
      value: `${vendors.filter((vendor) => vendor.payments.some((payment) => payment.status === "proximo")).length} próximos`,
      icon: ReceiptText
    },
    {
      label: "Arquivos",
      value: `${vendors.filter((vendor) => !vendor.contract.sent).length} sem contrato anexado`,
      icon: AlertCircle
    },
    {
      label: "Entregas",
      value: `${vendors.filter((vendor) => vendor.deliveries.some((delivery) => !delivery.dueDate)).length} sem data`,
      icon: Timer
    }
  ];

  return (
    <section className="rounded-[2rem] border border-casarei-primary-light/40 bg-white/88 p-5 shadow-[0_18px_50px_rgba(114,36,62,0.07)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-casarei-primary">
            <Heart className="h-5 w-5" aria-hidden />
            <h2 className="font-serif text-2xl text-casarei-primary-deep">Pontos de atenção</h2>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-casarei-text">
            Mari, esses pontos não precisam assustar. Eles só ajudam você a não deixar nada importante passar.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[560px]">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.label}
                className="rounded-2xl border border-casarei-primary-light/50 bg-[linear-gradient(135deg,#fff7fa,#fffdf9)] p-4 shadow-[0_12px_30px_rgba(114,36,62,0.08)] ring-1 ring-white/70"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-casarei-primary text-white shadow-[0_10px_22px_rgba(212,83,126,0.25)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{point.label}</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-casarei-primary-deep">{point.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
