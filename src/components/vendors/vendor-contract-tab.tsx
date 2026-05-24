import type { Vendor } from "@/types/vendors";
import { Button } from "@/components/ui/button";

export function VendorContractTab({ vendor }: { vendor: Vendor }) {
  return (
    <section className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Contrato enviado?" value={vendor.contract.sent ? "Sim" : "Ainda não"} />
        <Info label="Contrato assinado?" value={vendor.contract.signed ? "Sim" : "Ainda não"} />
        <Info label="Data assinatura" value={vendor.contract.signedAt ?? "-"} />
        <Info label="Arquivo" value={vendor.contract.fileName ?? "Contrato ainda não anexado."} />
      </div>
      <div className="mt-5 rounded-3xl bg-casarei-primary-bg/45 p-4 text-sm leading-6 text-casarei-text">
        Antes do pagamento final, confira prazos de entrega, multa e cancelamento.
      </div>
      <h3 className="mt-5 font-serif text-2xl text-casarei-primary-deep">Cláusulas importantes</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {vendor.contract.clauses.map((clause) => <span key={clause} className="rounded-full bg-casarei-primary-bg px-3 py-1 text-xs font-medium text-casarei-primary-deep">{clause}</span>)}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="button">Anexar contrato</Button>
        <Button type="button" variant="outline" className="bg-white">Marcar como assinado</Button>
        <Button type="button" variant="outline" className="bg-white">Abrir arquivo mockado</Button>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-casarei-primary-bg/45 p-4"><p className="text-xs text-casarei-muted">{label}</p><p className="mt-1 text-sm font-semibold text-casarei-primary-deep">{value}</p></div>;
}
