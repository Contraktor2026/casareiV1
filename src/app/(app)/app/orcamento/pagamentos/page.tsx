"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarDays, CheckCircle2, Clock3, Receipt, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getVendorFinancePayments, subscribeVendorFinancePayments, updateVendorFinancePaymentStatus } from "@/lib/client/vendor-finance-sync";
import { budgetPayments } from "@/lib/mock/budget";
import type { BudgetPayment } from "@/types/budget";

const today = new Date("2026-05-23T12:00:00");

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function daysBetween(date: string) {
  const due = new Date(`${date}T12:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function sortByDueDate(payments: BudgetPayment[]) {
  return [...payments].sort((a, b) => new Date(`${a.dueDate}T12:00:00`).getTime() - new Date(`${b.dueDate}T12:00:00`).getTime());
}

export default function Page() {
  const [vendorPayments, setVendorPayments] = useState<BudgetPayment[]>([]);
  const [paidOverrides, setPaidOverrides] = useState<Record<string, true>>({});
  const allPayments = useMemo(
    () => sortByDueDate([...vendorPayments, ...budgetPayments].map((payment) => (paidOverrides[payment.id] ? { ...payment, status: "pago" } : payment))),
    [paidOverrides, vendorPayments]
  );

  useEffect(() => {
    setVendorPayments(getVendorFinancePayments());
    return subscribeVendorFinancePayments(() => setVendorPayments(getVendorFinancePayments()));
  }, []);

  const paid = allPayments.filter((payment) => payment.status === "pago");
  const open = allPayments.filter((payment) => payment.status !== "pago");
  const overdue = open.filter((payment) => payment.status === "atrasado" || daysBetween(payment.dueDate) < 0);
  const thisWeek = open.filter((payment) => {
    const days = daysBetween(payment.dueDate);
    return days >= 0 && days <= 7;
  });
  const upcoming = open.filter((payment) => daysBetween(payment.dueDate) > 7);
  const payableTotal = open.reduce((sum, payment) => sum + payment.amount, 0);
  const paidTotal = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const nextPayment = open[0];

  function markAsPaid(payment: BudgetPayment) {
    if (payment.source === "fornecedor") {
      updateVendorFinancePaymentStatus(payment.id, "pago");
      setVendorPayments(getVendorFinancePayments());
    }
    setPaidOverrides((current) => ({ ...current, [payment.id]: true }));
  }

  return (
    <div className="-mx-4 -mt-6 min-h-screen bg-[#FFF8F4] pb-28 md:-mx-8 lg:-mx-11 lg:pb-12">
      <main className="mx-auto max-w-6xl space-y-5 px-4 pt-4 md:px-8 lg:px-11">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_42px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <Button asChild variant="outline" className="mb-4 h-10 rounded-full bg-white">
            <Link href="/app/orcamento">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Financeiro
            </Link>
          </Button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#993556]">Pagamentos</p>
          <h1 className="mt-2 font-serif text-4xl leading-none text-[#4B1528] md:text-5xl">O que pagar primeiro</h1>
          <p className="mt-3 text-sm leading-6 text-[#6F5B57]">
            {nextPayment ? `Próximo pagamento: ${nextPayment.supplier}, ${money(nextPayment.amount)}, ${dueText(daysBetween(nextPayment.dueDate)).toLowerCase()}.` : "Nenhum pagamento pendente."}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Metric label="Pago" value={money(paidTotal)} tone="ok" icon={<CheckCircle2 />} />
            <Metric label="A pagar" value={money(payableTotal)} tone="warn" icon={<Clock3 />} />
            <Metric label="Atrasado" value={money(overdue.reduce((sum, payment) => sum + payment.amount, 0))} tone="danger" icon={<AlertTriangle />} />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <PaymentGroup
            title="Atrasados"
            description={overdue.length ? "Resolva estes primeiro." : "Nada atrasado agora."}
            tone="danger"
            payments={overdue}
            onMarkPaid={markAsPaid}
          />
          <PaymentGroup
            title="Vencem em até 7 dias"
            description={thisWeek.length ? "Pagamentos que precisam de atenção nesta semana." : "Nenhum vencimento nesta semana."}
            tone="warn"
            payments={thisWeek}
            onMarkPaid={markAsPaid}
          />
          <PaymentGroup
            title="Próximos pagamentos"
            description="O que vem depois da semana atual."
            tone="info"
            payments={upcoming}
            onMarkPaid={markAsPaid}
          />
          <PaymentGroup
            title="Pagos"
            description="Histórico do que já foi quitado."
            tone="ok"
            payments={paid.slice().reverse()}
            onMarkPaid={markAsPaid}
          />
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, tone, icon }: { label: string; value: string; tone: "ok" | "warn" | "danger"; icon: ReactNode }) {
  return (
    <article className={`rounded-2xl p-3 text-center ${toneBg(tone)}`}>
      <span className="mx-auto grid h-8 w-8 place-items-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <strong className="mt-1 block text-sm md:text-base">{value}</strong>
      <p className="mt-1 text-[11px] opacity-75">{label}</p>
    </article>
  );
}

function PaymentGroup({ title, description, payments, tone, onMarkPaid }: { title: string; description: string; payments: BudgetPayment[]; tone: "ok" | "warn" | "danger" | "info"; onMarkPaid: (payment: BudgetPayment) => void }) {
  return (
    <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
      <div className="mb-4 flex items-start gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneBg(tone)} [&>svg]:h-5 [&>svg]:w-5`}>
          {tone === "ok" ? <CheckCircle2 /> : tone === "danger" ? <AlertTriangle /> : tone === "warn" ? <Clock3 /> : <CalendarDays />}
        </span>
        <div>
          <h2 className="font-serif text-2xl text-[#4B1528]">{title}</h2>
          <p className="mt-1 text-sm text-[#8A716D]">{description}</p>
        </div>
      </div>
      <div className="space-y-2">
        {payments.length ? payments.map((payment) => <PaymentRow key={payment.id} payment={payment} onMarkPaid={() => onMarkPaid(payment)} />) : <p className="rounded-2xl bg-[#FFF8F4] p-4 text-sm text-[#8A716D]">Sem itens aqui.</p>}
      </div>
    </section>
  );
}

function PaymentRow({ payment, onMarkPaid }: { payment: BudgetPayment; onMarkPaid: () => void }) {
  const days = daysBetween(payment.dueDate);
  const paid = payment.status === "pago";
  const tone = paid ? "ok" : payment.status === "atrasado" || days < 0 ? "danger" : days <= 7 ? "warn" : "info";

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-[#F0E1DD] bg-[#FFF8F4] p-4">
      <DateBadge date={payment.dueDate} tone={tone} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#2A1A1F]">{payment.supplier}</p>
        <p className="mt-0.5 text-xs text-[#8A716D]">{payment.category} · {money(payment.amount)}</p>
      </div>
      <div className="text-right">
        <Receipt className={`ml-auto h-4 w-4 ${paid ? "text-[#3B6D11]" : "text-[#8A716D]"}`} aria-hidden />
        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${toneBg(tone)}`}>
          {paid ? "Pago" : dueText(days)}
        </span>
        {!paid ? (
          <button type="button" onClick={onMarkPaid} className="mt-2 block rounded-full bg-[#EAF3DE] px-3 py-1 text-[11px] font-bold text-[#27500A]">
            Marcar como pago
          </button>
        ) : null}
      </div>
    </article>
  );
}

function DateBadge({ date, tone }: { date: string; tone: "ok" | "warn" | "danger" | "info" }) {
  const parsed = new Date(`${date}T12:00:00`);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(parsed).replace(".", "").toUpperCase();

  return (
    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-center ${toneBg(tone)}`}>
      <span>
        <strong className="block text-xl leading-none">{day}</strong>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.08em]">{month}</span>
      </span>
    </span>
  );
}

function toneBg(tone: "ok" | "warn" | "danger" | "info") {
  if (tone === "danger") return "bg-[#FCEBEB] text-[#791F1F]";
  if (tone === "warn") return "bg-[#FAEEDA] text-[#633806]";
  if (tone === "info") return "bg-[#FBEAF0] text-[#72243E]";
  return "bg-[#EAF3DE] text-[#27500A]";
}

function dueText(days: number) {
  if (days < 0) return `${Math.abs(days)} dia(s) vencido`;
  if (days === 0) return "Vence hoje";
  return `Em ${days} dia(s)`;
}
