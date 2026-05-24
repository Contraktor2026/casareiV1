import { CheckCircle2, Clock3, FileText, WalletCards } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BudgetCategory, BudgetPayment } from "@/types/budget";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function isClosed(category: BudgetCategory) {
  return category.contract === "Fechado" || category.contract === "Pre-reservado" || category.contract === "PrÃ©-reservado";
}

export function BudgetDecisionOverview({
  categories,
  payments,
  onOpen
}: {
  categories: BudgetCategory[];
  payments: BudgetPayment[];
  onOpen: (category: BudgetCategory) => void;
}) {
  const closed = categories.filter(isClosed);
  const inDecision = categories.filter((category) => !isClosed(category));
  const upcoming = payments.filter((payment) => payment.status === "proximo");
  const upcomingTotal = upcoming.reduce((total, payment) => total + payment.amount, 0);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Resumo sem planilha</p>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">Onde o orçamento está agora</h2>
        <p className="mt-1 text-sm leading-6 text-casarei-muted">
          Primeiro, o que já virou decisão. Depois, o que ainda precisa de carinho.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="border-white/90 bg-white/92 p-6 shadow-[0_22px_60px_rgba(114,36,62,0.10)] ring-1 ring-casarei-primary-light/15">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fbeaf0] text-casarei-primary">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">Já fechado</p>
                  <h3 className="font-serif text-2xl text-casarei-primary-deep">{closed.length} escolhas encaminhadas</h3>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-muted">
                Estes itens já têm fornecedor definido ou pré-reserva. É aqui que você entende o que realmente saiu do
                campo das ideias.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-white">
              <Link href="/app/fornecedores">Ver fornecedores</Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {closed.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onOpen(category)}
                className="rounded-2xl border border-casarei-primary-light/20 bg-[linear-gradient(135deg,#fffdf9,#fff7f3)] p-4 text-left shadow-sm transition hover:border-casarei-primary-light hover:shadow-[0_12px_28px_rgba(114,36,62,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl text-casarei-primary-deep">{category.name}</p>
                    <p className="mt-1 text-xs text-casarei-muted">{category.supplier}</p>
                  </div>
                  <span className="rounded-full bg-[#fbeaf0] px-3 py-1 text-[11px] font-semibold text-casarei-primary">
                    {category.contract}
                  </span>
                </div>
                <p className="mt-3 font-serif text-2xl text-casarei-primary-deep">{money(category.spent)}</p>
                <p className="mt-1 text-xs leading-5 text-casarei-muted">{category.notes}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="border-white/90 bg-[linear-gradient(135deg,#fff7e9,#fffdf9)] p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-casarei-primary shadow-sm">
                <WalletCards className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">Próximos pagamentos</p>
                <h3 className="mt-1 font-serif text-2xl text-casarei-primary-deep">{money(upcomingTotal)}</h3>
                <p className="mt-1 text-sm text-casarei-muted">{upcoming.length} pagamentos nos próximos 30 dias</p>
              </div>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full bg-white/80">
              <Link href="/app/orcamento/pagamentos">Ver pagamentos</Link>
            </Button>
          </Card>

          <Card className="border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-casarei-primary shadow-sm">
                <Clock3 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">Ainda em decisão</p>
                <h3 className="mt-1 font-serif text-2xl text-casarei-primary-deep">{inDecision.length} categorias abertas</h3>
                <p className="mt-1 text-sm text-casarei-muted">{inDecision.map((category) => category.name).join(" • ")}</p>
              </div>
            </div>
          </Card>

          <Card className="border-white/90 bg-white/86 p-5 shadow-[0_14px_38px_rgba(114,36,62,0.06)]">
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 text-casarei-primary" aria-hidden />
              <p className="text-sm leading-6 text-casarei-text">
                Use as categorias abaixo apenas para comparar peso no orçamento. O controle principal fica no que já foi
                fechado e no que ainda está em decisão.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
