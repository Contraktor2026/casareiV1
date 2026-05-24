import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetSummaryCards() {
  const cards = [
    { title: "Comprometido", value: money(52300), sub: "14 fornecedores fechados", tone: "from-[#fff0f5] to-[#fffdf9]" },
    { title: "Próximos pagamentos", value: money(8400), sub: "3 pagamentos nos próximos 30 dias", href: "/app/orcamento/pagamentos", cta: "Ver pagamentos", tone: "from-[#fbeaf0] to-[#fff8f8]" },
    { title: "Maiores prioridades", value: "Fotografia • Buffet • Espaço", sub: "43% do orçamento total", tone: "from-[#fff7e9] to-[#fffdf9]" },
    { title: "Espaço para ajustes", value: money(12500), sub: "Ainda existe margem para novas decisões.", tone: "from-[#fff2f5] to-[#fdf7f1]" }
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`flex min-h-[220px] flex-col justify-between border-white/90 bg-gradient-to-br ${card.tone} p-6 shadow-[0_18px_46px_rgba(114,36,62,0.09)] ring-1 ring-casarei-primary-light/20 transition hover:-translate-y-0.5 hover:shadow-[0_24px_62px_rgba(114,36,62,0.12)]`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{card.title}</p>
            <h3 className="mt-4 font-serif text-2xl font-medium leading-tight text-casarei-primary-deep">{card.value}</h3>
            <p className="mt-3 text-sm leading-6 text-casarei-muted">{card.sub}</p>
          </div>
          {card.href && (
            <Button asChild variant="outline" className="mt-5 w-full bg-white/80">
              <Link href={card.href}>{card.cta}</Link>
            </Button>
          )}
        </Card>
      ))}
    </section>
  );
}
