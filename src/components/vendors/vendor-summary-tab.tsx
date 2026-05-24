import { Sparkles } from "lucide-react";

import type { Vendor } from "@/types/vendors";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function VendorSummaryTab({ vendor }: { vendor: Vendor }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Info label="Valor total" value={money(vendor.totalValue)} />
          <Info label="Valor pago" value={money(vendor.paidValue)} />
          <Info label="Saldo restante" value={money(vendor.totalValue - vendor.paidValue)} />
          <Info label="Próximo pagamento" value={vendor.nextPayment} />
          <Info label="Contrato" value={vendor.contract.signed ? "Assinado" : vendor.contract.sent ? "Enviado" : "Pendente"} />
          <Info label="Responsável" value={vendor.responsible} />
        </div>
        <h3 className="mt-6 font-serif text-2xl text-casarei-primary-deep">Principais itens inclusos</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {vendor.included.map((item) => <span key={item} className="rounded-full bg-casarei-primary-bg px-3 py-1 text-xs font-medium text-casarei-primary-deep">{item}</span>)}
        </div>
      </section>
      <aside className="rounded-[2rem] border border-casarei-primary-light/40 bg-casarei-primary-bg/55 p-5">
        <div className="flex items-center gap-2 text-casarei-primary">
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="text-sm font-semibold">Sofia</span>
        </div>
        <p className="mt-3 font-serif text-2xl leading-tight text-casarei-primary-deep">
          Esse fornecedor já está no radar do casamento.
        </p>
        <p className="mt-2 text-sm leading-6 text-casarei-text">
          Agora vale acompanhar o próximo pagamento, o contrato e o marco: {vendor.nextMilestone}.
        </p>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-casarei-primary-bg/45 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-casarei-muted">{label}</p>
      <p className="mt-1 font-serif text-xl text-casarei-primary-deep">{value}</p>
    </div>
  );
}
