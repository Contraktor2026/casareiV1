import type { Vendor } from "@/types/vendors";
import { Button } from "@/components/ui/button";

export function VendorContactsTab({ vendor }: { vendor: Vendor }) {
  const items = [
    ["Responsável", vendor.responsible],
    ["WhatsApp", vendor.whatsapp],
    ["Telefone", vendor.phone],
    ["Email", vendor.email],
    ["Instagram", vendor.instagram],
    ["Site", vendor.site],
    ["Endereço", vendor.address],
    ["Atendimento", vendor.serviceHours]
  ];
  return (
    <section className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value]) => <div key={label} className="rounded-2xl bg-casarei-primary-bg/45 p-4"><p className="text-xs text-casarei-muted">{label}</p><p className="mt-1 text-sm font-semibold text-casarei-primary-deep">{value || "-"}</p></div>)}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="whatsapp"><a href={`https://wa.me/${vendor.whatsapp}`} target="_blank" rel="noreferrer">Abrir WhatsApp</a></Button>
        <Button type="button" variant="outline" className="bg-white">Copiar telefone</Button>
        <Button type="button" variant="outline" className="bg-white">Copiar email</Button>
        <Button asChild variant="outline" className="bg-white"><a href={`https://instagram.com/${vendor.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">Abrir Instagram</a></Button>
      </div>
    </section>
  );
}
