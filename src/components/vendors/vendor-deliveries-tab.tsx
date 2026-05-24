import type { Vendor } from "@/types/vendors";

export function VendorDeliveriesTab({ vendor }: { vendor: Vendor }) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {vendor.deliveries.length ? vendor.deliveries.map((delivery) => (
        <article key={delivery.id} className="rounded-3xl border border-casarei-border-soft bg-white/90 p-4">
          <p className="font-serif text-xl text-casarei-primary-deep">{delivery.title}</p>
          <p className="mt-1 text-sm text-casarei-muted">{delivery.status} • prazo {delivery.dueDate}</p>
          <p className="mt-3 text-sm leading-6 text-casarei-text">{delivery.note}</p>
        </article>
      )) : <p className="rounded-3xl bg-white/90 p-6 text-sm text-casarei-muted">Nenhuma entrega cadastrada ainda.</p>}
    </section>
  );
}
