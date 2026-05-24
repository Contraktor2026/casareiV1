import type { Vendor } from "@/types/vendors";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function VendorsSummaryCards({ vendors, onStatus }: { vendors: Vendor[]; onStatus: (status: string) => void }) {
  const nextPayments = vendors.reduce((sum, vendor) => sum + vendor.payments.filter((payment) => payment.status === "proximo").reduce((total, payment) => total + payment.amount, 0), 0);
  const cards = [
    { title: "Fechados", value: "9 fornecedores contratados", sub: "2 contratos pendentes", cta: "Ver fechados", action: () => onStatus("Fechado") },
    { title: "Em negociação", value: "4 fornecedores em conversa", sub: "3 aguardando resposta", cta: "Ver negociações", action: () => onStatus("Em negociação") },
    { title: "Próximos pagamentos", value: `${money(nextPayments)} nos próximos 30 dias`, sub: "4 parcelas próximas", cta: "Ver pagamentos", action: () => onStatus("Pagamento pendente") },
    { title: "Atenção", value: "3 pontos precisam de revisão", sub: "contrato, prazo e comprovante", cta: "Revisar agora", action: () => onStatus("Contrato pendente") }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="surface-lift flex min-h-[220px] flex-col justify-between border-white/80 bg-gradient-to-br from-[#fff0f5] to-[#fffdf9] p-5 ring-1 ring-casarei-primary-light/20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{card.title}</p>
            <h3 className="mt-4 font-serif text-2xl font-medium leading-tight text-casarei-primary-deep">{card.value}</h3>
            <p className="mt-3 text-sm leading-6 text-casarei-muted">{card.sub}</p>
          </div>
          <Button type="button" variant="outline" className="mt-5 w-full bg-white/80" onClick={card.action}>{card.cta}</Button>
        </Card>
      ))}
    </section>
  );
}
