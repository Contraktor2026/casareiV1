"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BudgetCategory, BudgetPayment } from "@/types/budget";
import { PaymentStatusBadge } from "./payment-status-badge";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetCategoryDetails({ category, payments, onClose }: { category: BudgetCategory | null; payments: BudgetPayment[]; onClose: () => void }) {
  if (!category) return null;
  const relatedPayments = payments.filter((payment) => category.payments.includes(payment.id));

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <aside className="absolute bottom-0 right-0 max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#fffdf9] p-5 shadow-2xl md:top-0 md:max-h-none md:max-w-xl md:rounded-l-[2rem] md:rounded-tr-none md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Categoria</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">{category.name}</h2>
            <p className="mt-1 text-sm text-casarei-muted">{category.supplier} • {category.contract}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info label="Orçamento ideal" value={money(category.planned)} />
          <Info label="Valor fechado" value={money(category.spent)} />
          <Info label="Compatibilidade" value={`${category.compatibility}%`} />
          <Info label="Prioridade" value={category.priority} />
        </div>

        <section className="mt-5 rounded-3xl border border-casarei-border-soft bg-white/82 p-4">
          <h3 className="font-serif text-xl text-casarei-primary-deep">O que está incluso</h3>
          <ul className="mt-3 space-y-2 text-sm text-casarei-text">
            {category.included.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </section>

        <section className="mt-5 rounded-3xl border border-casarei-border-soft bg-white/82 p-4">
          <h3 className="font-serif text-xl text-casarei-primary-deep">Pagamentos</h3>
          <div className="mt-3 space-y-3">
            {relatedPayments.length ? relatedPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3 rounded-2xl bg-casarei-primary-bg/40 p-3">
                <div>
                  <p className="text-sm font-semibold text-casarei-text">{payment.supplier}</p>
                  <p className="text-xs text-casarei-muted">{payment.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg text-casarei-primary-deep">{money(payment.amount)}</p>
                  <PaymentStatusBadge status={payment.status} />
                </div>
              </div>
            )) : <p className="text-sm text-casarei-muted">Sem parcelas cadastradas ainda.</p>}
          </div>
        </section>

        <p className="mt-5 rounded-3xl bg-casarei-primary-bg/55 p-4 text-sm leading-6 text-casarei-text">{category.notes}</p>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-casarei-primary-bg/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-casarei-muted">{label}</p>
      <p className="mt-1 font-serif text-2xl text-casarei-primary-deep">{value}</p>
    </div>
  );
}
