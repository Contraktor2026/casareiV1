import type { Vendor } from "@/types/vendors";
import { Button } from "@/components/ui/button";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function VendorPaymentsTab({ vendor }: { vendor: Vendor }) {
  return (
    <section className="space-y-3">
      {vendor.payments.length ? vendor.payments.map((payment) => (
        <article key={payment.id} className="rounded-3xl border border-casarei-border-soft bg-white/90 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-xl text-casarei-primary-deep">{payment.name}</p>
              <p className="text-sm text-casarei-muted">{payment.dueDate} • {payment.status}</p>
            </div>
            <strong className="font-serif text-2xl text-casarei-primary-deep">{money(payment.amount)}</strong>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="bg-white">Registrar pagamento</Button>
            <Button type="button" variant="outline" className="bg-white">Anexar comprovante</Button>
          </div>
        </article>
      )) : <Empty text="Nenhum pagamento registrado ainda." />}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-3xl border border-casarei-border-soft bg-white/90 p-6 text-sm text-casarei-muted">{text}</p>;
}
