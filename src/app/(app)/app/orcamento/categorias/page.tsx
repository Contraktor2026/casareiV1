"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getVendorFinancePayments, subscribeVendorFinancePayments } from "@/lib/client/vendor-finance-sync";
import { budgetCategories, budgetPayments } from "@/lib/mock/budget";
import type { BudgetCategory, BudgetPayment } from "@/types/budget";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export default function Page() {
  const [vendorPayments, setVendorPayments] = useState<BudgetPayment[]>([]);
  const [selected, setSelected] = useState<BudgetCategory | null>(null);
  const allPayments = useMemo(() => [...vendorPayments, ...budgetPayments], [vendorPayments]);

  useEffect(() => {
    setVendorPayments(getVendorFinancePayments());
    return subscribeVendorFinancePayments(() => setVendorPayments(getVendorFinancePayments()));
  }, []);

  const categories = budgetCategories.map((category) => {
    const payments = allPayments.filter((payment) => payment.category.toLowerCase() === category.name.toLowerCase());
    const used = Math.max(category.spent, payments.reduce((sum, payment) => sum + payment.amount, 0));
    return { ...category, spent: used };
  });

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#FFF8F4] pb-36 md:-mx-8 lg:-mx-11 lg:pb-12">
      <main className="mx-auto max-w-5xl space-y-5 px-4 pt-4 md:px-8 lg:px-11">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_42px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <Button asChild variant="outline" className="mb-4 h-10 rounded-full bg-white">
            <Link href="/app/orcamento">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Financeiro
            </Link>
          </Button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#993556]">Categorias</p>
          <h1 className="mt-2 font-serif text-4xl leading-none text-[#4B1528]">Onde o dinheiro está indo</h1>
          <p className="mt-3 text-sm leading-6 text-[#6F5B57]">Cada categoria mostra previsto, usado, saldo e um status simples.</p>
        </section>

        <section className="space-y-3">
          {categories.map((category) => <CategoryLine key={category.id} category={category} onClick={() => setSelected(category)} />)}
        </section>
      </main>
      <CategoryModal category={selected} payments={allPayments} onClose={() => setSelected(null)} />
    </div>
  );
}

function CategoryLine({ category, onClick }: { category: BudgetCategory; onClick: () => void }) {
  const balance = category.planned - category.spent;
  const percent = category.planned ? Math.min(100, Math.round((category.spent / category.planned) * 100)) : 0;
  const tone = balance < 0 ? "danger" : percent >= 80 ? "warn" : "ok";

  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[22px] bg-white p-4 text-left shadow-[0_10px_28px_rgba(75,46,43,0.06)] ring-1 ring-[#F0E1DD]">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-[#2A1A1F]">{category.name}</p>
            <p className="mt-1 text-xs text-[#8A716D]">{balance >= 0 ? `Você ainda tem ${money(balance)}` : `Passou ${money(Math.abs(balance))}`}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${toneBg(tone)}`}>{tone === "danger" ? "passou" : tone === "warn" ? "atenção" : "ok"}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#8A716D]">
          <span>Previsto<br /><b className="text-[#2A1A1F]">{money(category.planned)}</b></span>
          <span>Usado<br /><b className="text-[#2A1A1F]">{money(category.spent)}</b></span>
          <span>Saldo<br /><b className="text-[#2A1A1F]">{money(balance)}</b></span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F4ECE8]">
          <div className={`h-full rounded-full ${tone === "danger" ? "bg-[#E24B4A]" : tone === "warn" ? "bg-[#BA7517]" : "bg-[#639922]"}`} style={{ width: `${percent}%` }} />
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#B59A94]" />
    </button>
  );
}

function CategoryModal({ category, payments, onClose }: { category: BudgetCategory | null; payments: BudgetPayment[]; onClose: () => void }) {
  if (!category) return null;
  const related = payments.filter((payment) => payment.category.toLowerCase() === category.name.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 bg-[#2A1A1F]/35">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Fechar" />
      <aside className="absolute bottom-0 right-0 max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-2xl md:top-0 md:max-h-none md:max-w-xl md:rounded-l-[32px] md:rounded-tr-none">
        <h2 className="font-serif text-3xl text-[#4B1528]">{category.name}</h2>
        <p className="mt-2 text-sm text-[#8A716D]">{category.supplier}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Info label="Previsto" value={money(category.planned)} />
          <Info label="Usado" value={money(category.spent)} />
          <Info label="Saldo" value={money(category.planned - category.spent)} />
        </div>
        <h3 className="mt-6 font-serif text-2xl text-[#4B1528]">Pagamentos ligados</h3>
        <div className="mt-3 space-y-2">
          {related.length ? related.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#FFF8F4] p-4">
              <div>
                <p className="font-bold text-[#2A1A1F]">{payment.supplier}</p>
                <p className="text-xs text-[#8A716D]">{payment.dueDate}</p>
              </div>
              <strong className="text-[#4B1528]">{money(payment.amount)}</strong>
            </div>
          )) : <p className="rounded-2xl bg-[#FFF8F4] p-4 text-sm text-[#8A716D]">Sem pagamentos vinculados.</p>}
        </div>
        <Button type="button" onClick={onClose} className="mt-5 w-full bg-[#D4537E]">Fechar</Button>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#FFF8F4] p-3"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p><p className="mt-1 font-serif text-xl text-[#4B1528]">{value}</p></div>;
}

function toneBg(tone: "ok" | "warn" | "danger") {
  if (tone === "danger") return "bg-[#FCEBEB] text-[#791F1F]";
  if (tone === "warn") return "bg-[#FAEEDA] text-[#633806]";
  return "bg-[#EAF3DE] text-[#27500A]";
}
