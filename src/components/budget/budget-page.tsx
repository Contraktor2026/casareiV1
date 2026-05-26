"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Flower2,
  Music,
  Plus,
  Receipt,
  Shirt,
  Utensils,
  Wallet,
  X
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getOnboardingData } from "@/lib/client/supabase-auth";
import { getBudgetAllocation, getStoredVendorCategories, saveBudgetAllocation, saveStoredVendorCategories } from "@/lib/client/planning-store";
import { getStoredVendors, upsertStoredVendor } from "@/lib/client/vendors-store";
import { getVendorFinancePayments, saveVendorFinancePayment, subscribeVendorFinancePayments } from "@/lib/client/vendor-finance-sync";
import type { BudgetCategory, BudgetPayment, BudgetPaymentStatus } from "@/types/budget";
import type { Vendor, VendorCategory, VendorPayment } from "@/types/vendors";

const today = new Date();

type ExpenseMode = "existing" | "new" | "single";
type ExpenseDraft = {
  mode: ExpenseMode;
  vendorId: string;
  supplier: string;
  category: string;
  totalValue: string;
  amount: string;
  installments: string;
  dueDate: string;
  method: string;
  status: BudgetPaymentStatus;
  note: string;
  receiptName: string;
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function numberFromText(value: string) {
  return Number(value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  const cents = Number(digits || "0");
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatAllocationValue(value: number): string {
  if (!value) return "";
  const digits = String(Math.round(value * 100));
  return formatCurrencyInput(digits);
}

function daysBetween(date: string) {
  const due = new Date(`${date}T12:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function sortByDueDate(payments: BudgetPayment[]) {
  return [...payments].sort((a, b) => new Date(`${a.dueDate}T12:00:00`).getTime() - new Date(`${b.dueDate}T12:00:00`).getTime());
}

function parseBudgetRange(range: string): number {
  const nums = (range.match(/\d+/g) ?? []).map(Number);
  if (nums.length === 0) return 0;
  const thousands = range.toLowerCase().includes("mil") ? 1000 : 1;
  if (nums.length === 1) return nums[0] * thousands;
  return Math.round((nums[0] + nums[1]) / 2) * thousands;
}

export function BudgetPage() {
  const [vendorPayments, setVendorPayments] = useState<BudgetPayment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [message, setMessage] = useState("");
  const [allocationDraft, setAllocationDraft] = useState<{ [k: string]: string }>({});
  const [vendorCategories, setVendorCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState("");
  const allPayments = useMemo(() => sortByDueDate([...vendorPayments]), [vendorPayments]);

  useEffect(() => {
    setVendorPayments(getVendorFinancePayments());
    setVendors(getStoredVendors());
    const cats = getStoredVendorCategories();
    setVendorCategories(cats.length > 0 ? cats : ["Espaço", "Buffet", "Fotografia", "Decoração", "Música/DJ", "Cerimonial"]);
    const saved = getBudgetAllocation();
    const draft: { [k: string]: string } = {};
    (cats.length > 0 ? cats : ["Espaço", "Buffet", "Fotografia", "Decoração", "Música/DJ", "Cerimonial"]).forEach((cat) => {
      draft[cat] = saved[cat] ? formatAllocationValue(saved[cat]) : "";
    });
    setAllocationDraft(draft);
    return subscribeVendorFinancePayments(() => {
      setVendorPayments(getVendorFinancePayments());
      setVendors(getStoredVendors());
    });
  }, []);

  const plannedAmount = useMemo(() => parseBudgetRange(getOnboardingData()?.plannedBudget ?? ""), []);
  const paid = allPayments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0);
  const payable = allPayments.filter((payment) => payment.status !== "pago").reduce((sum, payment) => sum + payment.amount, 0);
  const committed = paid + payable;
  const available = Math.max(0, plannedAmount - committed);
  const overdue = allPayments.filter((payment) => payment.status === "atrasado" || daysBetween(payment.dueDate) < 0);
  const nextDue = sortByDueDate(allPayments.filter((payment) => payment.status !== "pago"))[0];
  const usedPercent = plannedAmount > 0 ? Math.min(100, Math.round((committed / plannedAmount) * 100)) : 0;

  const categorySummaries = useMemo(() => {
    const allocation = getBudgetAllocation();
    return vendorCategories.map((catName) => {
      const planned = allocation[catName] ?? 0;
      const linkedPayments = allPayments.filter((p) => p.category.toLowerCase() === catName.toLowerCase());
      const spent = linkedPayments.reduce((s, p) => s + p.amount, 0);
      const status: BudgetCategory["status"] =
        planned === 0 ? "aberta" : spent > planned ? "acima" : spent >= planned * 0.8 ? "atencao" : "dentro";
      return {
        id: catName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: catName,
        planned,
        spent,
        status,
        priority: "Media" as const,
        supplier: "",
        contract: "",
        compatibility: 0,
        included: [],
        notes: "",
        payments: [],
        linkedPayments,
      };
    });
  }, [vendorCategories, allPayments]);

  function addAllocationCategory() {
    const name = newCatInput.trim();
    if (!name || vendorCategories.includes(name)) return;
    const updated = [...vendorCategories, name];
    setVendorCategories(updated);
    setAllocationDraft((prev) => ({ ...prev, [name]: "" }));
    saveStoredVendorCategories(updated);
    setNewCatInput("");
  }

  function saveExpense(draft: ExpenseDraft) {
    const amount = numberFromText(draft.amount);
    const totalValue = numberFromText(draft.totalValue) || amount;
    const installments = Math.max(1, Number(draft.installments) || 1);
    const supplier = draft.mode === "existing" ? vendors.find((vendor) => vendor.id === draft.vendorId)?.name ?? draft.supplier : draft.supplier.trim();
    const vendorId = draft.mode === "single" ? `avulsa-${Date.now()}` : draft.mode === "new" ? `financeiro-${Date.now()}` : draft.vendorId;
    const category = draft.mode === "existing" ? vendors.find((vendor) => vendor.id === draft.vendorId)?.category ?? draft.category : draft.category;

    if (!amount || !draft.dueDate || !supplier) return;

    const payment = saveVendorFinancePayment({
      vendorId,
      supplier,
      category,
      amount,
      dueDate: draft.dueDate,
      method: draft.method,
      status: draft.status,
      note: draft.note
    });

    if (draft.mode !== "single") {
      const currentVendor = vendors.find((vendor) => vendor.id === vendorId);
      const vendorPayment: VendorPayment = {
        id: payment.id,
        name: `${draft.method} - ${formatDisplayDate(draft.dueDate)}`,
        amount,
        dueDate: draft.dueDate,
        status: draft.status,
        method: draft.method,
        receipt: draft.receiptName || undefined
      };
      const nextVendor = currentVendor
        ? applyPaymentToVendor(currentVendor, vendorPayment, totalValue)
        : createVendorFromExpense(vendorId, supplier, category, totalValue, vendorPayment, draft.note);
      upsertStoredVendor(nextVendor);
      setVendors(getStoredVendors());
    }

    setVendorPayments(getVendorFinancePayments());
    setShowExpenseModal(false);
    setMessage(`${supplier} entrou no Financeiro${draft.mode === "single" ? " como despesa avulsa." : " e no fornecedor vinculado."}`);
  }

  return (
    <>
      <div className="space-y-4 pb-4">
        {/* ── Hero ── */}
        <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_42px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#993556]">Financeiro</p>
          <h1 className="mt-1 font-serif text-3xl leading-none text-[#4B1528]">Seu dinheiro sem confusão</h1>
          <p className="mt-3 text-sm leading-6 text-[#6F5B57]">
            {plannedAmount > 0
              ? <>Você ainda pode gastar <strong className="text-[#3B6D11]">{money(available)}</strong>.{" "}</>
              : "Cadastre seu orçamento no onboarding para ver o disponível. "}
            {nextDue ? <>O próximo pagamento vence {dueText(daysBetween(nextDue.dueDate)).toLowerCase()}.</> : "Nenhum vencimento em aberto."}
          </p>

          <div className="mt-4 rounded-[22px] bg-[#FFF8F4] p-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <strong className="font-serif text-4xl font-medium text-[#2A1A1F]">{money(committed)}</strong>
              <span className="text-sm text-[#8A716D]">{plannedAmount > 0 ? `usado de ${money(plannedAmount)}` : "comprometido"}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#F4ECE8]">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#ED93B1,#D4537E)]" style={{ width: `${usedPercent}%` }} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="Disponível" value={plannedAmount > 0 ? money(available) : "—"} tone="ok" icon={<Wallet />} />
            <MetricCard label="A pagar" value={money(payable)} tone="warn" icon={<Clock3 />} href="/app/orcamento/pagamentos?tab=pendente" />
            <MetricCard label="Pago" value={money(paid)} tone="ok" icon={<CheckCircle2 />} href="/app/orcamento/pagamentos?tab=pago" />
            <MetricCard label="Atrasado" value={money(overdue.reduce((sum, payment) => sum + payment.amount, 0))} tone="danger" icon={<AlertTriangle />} href="/app/orcamento/pagamentos?tab=atrasado" />
          </div>
        </section>

        {/* ── Distribuir orçamento ── */}
        <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_42px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setShowAllocation((v) => !v)}>
            <div className="text-left">
              <p className="font-serif text-xl text-[#4B1528]">Distribuir orçamento</p>
              <p className="mt-0.5 text-xs text-[#8A716D]">Defina quanto reservar para cada fornecedor</p>
            </div>
            <ChevronRight className={`h-5 w-5 shrink-0 text-[#8A716D] transition-transform ${showAllocation ? "rotate-90" : ""}`} />
          </button>
          {showAllocation && (
            <div className="mt-4 space-y-3">
              {plannedAmount > 0 && (() => {
                const allocTotal = Object.values(allocationDraft).reduce((s, v) => s + (numberFromText(v) || 0), 0);
                const remaining = plannedAmount - allocTotal;
                return (
                  <div className="flex items-baseline gap-2 rounded-2xl bg-[#FFF8F4] px-4 py-3">
                    <strong className="font-serif text-2xl text-[#4B1528]">{money(Math.max(0, remaining))}</strong>
                    <span className="text-xs text-[#8A716D]">restante de {money(plannedAmount)}</span>
                    {remaining < 0 && (
                      <span className="rounded-full bg-[#FCEBEB] px-2 py-0.5 text-[11px] font-bold text-[#791F1F]">
                        {money(Math.abs(remaining))} acima
                      </span>
                    )}
                  </div>
                );
              })()}
              {vendorCategories.map((cat) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="flex-1 text-sm font-semibold text-[#4B1528]">{cat}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={allocationDraft[cat] ?? ""}
                    onChange={(e) => setAllocationDraft((prev) => ({
                      ...prev,
                      [cat]: formatCurrencyInput(e.target.value),
                    }))}
                    onBlur={() => {
                      const out: { [k: string]: number } = {};
                      Object.entries(allocationDraft).forEach(([k, v]) => {
                        const n = numberFromText(v);
                        if (n > 0) out[k] = n;
                      });
                      saveBudgetAllocation(out);
                    }}
                    className="w-36 rounded-2xl border border-[#EEE6E1] bg-[#FFF8F4] px-3 py-2 text-right text-sm font-semibold text-[#2A1A1F] outline-none focus:border-[#D4537E]"
                  />
                </div>
              ))}
              {/* Nova categoria */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addAllocationCategory();
                  }}
                  placeholder="Nova categoria..."
                  className="flex-1 rounded-2xl border border-dashed border-[#D4537E]/40 bg-[#FFF8F4] px-3 py-2 text-sm font-semibold text-[#4B1528] outline-none placeholder:text-[#C4B0AA] focus:border-[#D4537E]"
                />
                <button
                  type="button"
                  onClick={addAllocationCategory}
                  disabled={!newCatInput.trim()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#D4537E] text-white disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Adicionar gasto ── */}
        <button type="button" onClick={() => setShowExpenseModal(true)} className="flex w-full items-center gap-3 rounded-[22px] bg-[#D4537E] p-4 text-left text-white shadow-[0_16px_36px_rgba(212,83,126,0.22)]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20"><Plus className="h-5 w-5" /></span>
          <span>
            <strong className="block text-base">Adicionar gasto</strong>
            <span className="mt-0.5 block text-sm text-white/80">Fornecedor ou despesa avulsa</span>
          </span>
        </button>

        {/* ── Próximos pagamentos ── */}
        {allPayments.filter((p) => p.status !== "pago").length > 0 && (
          <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#993556]">Agenda financeira</p>
                <h2 className="mt-0.5 font-serif text-2xl text-[#4B1528]">Próximos pagamentos</h2>
              </div>
              <Link href="/app/orcamento/pagamentos" className="text-xs font-bold text-[#D4537E]">Ver tudo</Link>
            </div>
            <div className="space-y-2">
              {allPayments.filter((p) => p.status !== "pago").slice(0, 5).map((payment) => (
                <DueRow key={payment.id} payment={payment} />
              ))}
            </div>
          </section>
        )}

        {message ? <p className="rounded-2xl bg-[#EAF3DE] px-4 py-3 text-sm font-bold text-[#27500A]">{message}</p> : null}

        {/* ── Categorias ── */}
        <SimplePanel title="Categorias" action={<Link href="/app/orcamento/categorias">Ver todas</Link>}>
          <div className="space-y-2">
            {categorySummaries.slice(0, 5).map((category) => (
              <CategoryRow key={category.id} category={category} onOpen={() => setSelectedCategory(category)} />
            ))}
          </div>
        </SimplePanel>

        {/* ── Alertas ── */}
        {overdue.length > 0 && (
          <SimplePanel title="Alertas">
            <div className="space-y-2">
              <p className="rounded-2xl bg-[#FCEBEB] p-4 text-sm leading-6 text-[#791F1F]">
                Tem {money(overdue.reduce((sum, payment) => sum + payment.amount, 0))} atrasado. Comece por esses pagamentos.
              </p>
              {overdue.slice(0, 3).map((payment) => <DueRow key={payment.id} payment={payment} compact />)}
            </div>
          </SimplePanel>
        )}
      </div>

      <CategoryDetailModal category={selectedCategory} payments={allPayments} onClose={() => setSelectedCategory(null)} />
      {showExpenseModal ? <ExpenseModal vendors={vendors} onClose={() => setShowExpenseModal(false)} onSave={saveExpense} /> : null}
    </>
  );
}

function MetricCard({ label, value, tone, icon, href }: { label: string; value: string; tone: "ok" | "warn" | "danger"; icon: ReactNode; href?: string }) {
  const cls = `rounded-2xl p-4 ${toneBg(tone)} ${href ? "transition active:scale-[0.97] cursor-pointer" : ""}`;
  const body = (
    <>
      <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <strong className="mt-1 block font-serif text-2xl">{value}</strong>
      {href && <span className="mt-1.5 block text-[10px] font-bold opacity-50">ver detalhes →</span>}
    </>
  );
  if (href) return <Link href={href} className={cls}>{body}</Link>;
  return <article className={cls}>{body}</article>;
}


function SimplePanel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-[#4B1528]">{title}</h2>
        {action ? <div className="text-sm font-bold text-[#D4537E]">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function CategoryRow({ category, onOpen }: { category: BudgetCategory; onOpen: () => void }) {
  const percent = category.planned ? Math.min(100, Math.round((category.spent / category.planned) * 100)) : 0;
  const balance = category.planned - category.spent;
  const tone = balance < 0 ? "danger" : percent >= 80 ? "warn" : "ok";
  const Icon = categoryIcon(category.name);

  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 rounded-2xl border border-[#F0E1DD] bg-[#FFF8F4] p-4 text-left">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneBg(tone)}`}><Icon className="h-5 w-5" /></span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <strong className="block truncate text-sm text-[#2A1A1F]">{category.name}</strong>
            <span className="mt-0.5 block text-xs text-[#8A716D]">Saldo: {money(balance)}</span>
          </span>
          <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${badgeTone(tone)}`}>{statusText(tone)}</span>
        </span>
        <span className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#8A716D]">
          <span>Previsto<br /><b className="text-[#2A1A1F]">{money(category.planned)}</b></span>
          <span>Usado<br /><b className="text-[#2A1A1F]">{money(category.spent)}</b></span>
          <span>{percent}%<br /><b className="text-[#2A1A1F]">do limite</b></span>
        </span>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white">
          <span className={`block h-full rounded-full ${barTone(tone)}`} style={{ width: `${percent}%` }} />
        </span>
      </span>
      <ChevronRight className="h-4 w-4 text-[#B59A94]" />
    </button>
  );
}

function DueRow({ payment, compact = false }: { payment: BudgetPayment; compact?: boolean }) {
  const days = daysBetween(payment.dueDate);
  const tone = payment.status === "atrasado" || days < 0 ? "danger" : days <= 7 ? "warn" : "ok";
  const parsed = new Date(`${payment.dueDate}T12:00:00`);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(parsed);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(parsed).replace(".", "").toUpperCase();
  return (
    <Link
      href="/app/orcamento/pagamentos"
      className={`flex items-center gap-3 rounded-2xl ${compact ? "bg-[#FFF8F4]" : "bg-[#FFF8F4]"} p-3 transition active:scale-[0.98]`}
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center ${toneBg(tone)}`}>
        <span>
          <strong className="block text-base leading-none">{day}</strong>
          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.04em]">{month}</span>
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#2A1A1F]">{payment.supplier}</p>
        <p className="mt-0.5 text-xs text-[#8A716D]">{payment.category}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-[#2A1A1F]">{money(payment.amount)}</p>
        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeTone(tone)}`}>{dueText(days)}</span>
      </div>
    </Link>
  );
}

function CategoryDetailModal({ category, payments, onClose }: { category: BudgetCategory | null; payments: BudgetPayment[]; onClose: () => void }) {
  if (!category) return null;
  const relatedPayments = payments.filter((payment) => payment.category.toLowerCase() === category.name.toLowerCase());
  const balance = category.planned - category.spent;

  return (
    <div className="fixed inset-0 z-50 bg-[#2A1A1F]/35" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={onClose} />
      <aside className="absolute bottom-0 right-0 max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-2xl md:top-0 md:max-h-none md:max-w-xl md:rounded-l-[32px] md:rounded-tr-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Categoria</p>
            <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">{category.name}</h2>
            <p className="mt-1 text-sm text-[#8A716D]">{balance >= 0 ? `Ainda sobram ${money(balance)}` : `Passou ${money(Math.abs(balance))} do limite`}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#FBEAF0]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Info label="Previsto" value={money(category.planned)} />
          <Info label="Usado" value={money(category.spent)} />
          <Info label="Saldo" value={money(balance)} />
        </div>
        <section className="mt-5">
          <h3 className="font-serif text-2xl text-[#4B1528]">Fornecedores e pagamentos</h3>
          <div className="mt-3 space-y-2">
            {relatedPayments.length ? relatedPayments.map((payment) => <DueRow key={payment.id} payment={payment} />) : <p className="rounded-2xl bg-[#FFF8F4] p-4 text-sm text-[#8A716D]">Sem parcelas vinculadas ainda.</p>}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ExpenseModal({ vendors, onClose, onSave }: { vendors: Vendor[]; onClose: () => void; onSave: (draft: ExpenseDraft) => void }) {
  const [draft, setDraft] = useState<ExpenseDraft>({
    mode: "existing",
    vendorId: vendors[0]?.id ?? "",
    supplier: "",
    category: vendors[0]?.category ?? "Outros",
    totalValue: "",
    amount: "",
    installments: "1",
    dueDate: "",
    method: "Pix",
    status: "pendente",
    note: "",
    receiptName: ""
  });
  const selectedVendor = vendors.find((vendor) => vendor.id === draft.vendorId);
  const canSave = Boolean(numberFromText(draft.amount) && draft.dueDate && (draft.mode === "existing" ? draft.vendorId : draft.supplier.trim()));

  function update<K extends keyof ExpenseDraft>(field: K, value: ExpenseDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  useEffect(() => {
    if (!selectedVendor) return;
    setDraft((current) => ({ ...current, supplier: selectedVendor.name, category: selectedVendor.category, totalValue: String(selectedVendor.totalValue || "") }));
  }, [selectedVendor]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 md:place-items-center md:p-6">
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-2xl md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Adicionar despesa</p>
            <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">De onde vem esse gasto?</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#FBEAF0]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ModeButton active={draft.mode === "existing"} onClick={() => update("mode", "existing")} title="Fornecedor" />
          <ModeButton active={draft.mode === "new"} onClick={() => update("mode", "new")} title="Novo" />
          <ModeButton active={draft.mode === "single"} onClick={() => update("mode", "single")} title="Avulsa" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {draft.mode === "existing" ? (
            <Field label="Fornecedor existente">
              <select value={draft.vendorId} onChange={(event) => update("vendorId", event.target.value)} className={controlClass}>
                {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
              </select>
            </Field>
          ) : (
            <TextField label={draft.mode === "new" ? "Nome do fornecedor" : "Nome da despesa"} value={draft.supplier} onChange={(value) => update("supplier", value)} placeholder="Ex: Buffet Amora" />
          )}
          <TextField label="Categoria" value={draft.category} onChange={(value) => update("category", value)} placeholder="Ex: Buffet" />
          <TextField label="Valor total contratado" value={draft.totalValue} onChange={(value) => update("totalValue", formatCurrencyInput(value))} placeholder="R$ 0,00" inputMode="numeric" />
          <TextField label="Valor desta parcela" value={draft.amount} onChange={(value) => update("amount", formatCurrencyInput(value))} placeholder="R$ 0,00" inputMode="numeric" />
          <TextField label="Parcelas" value={draft.installments} onChange={(value) => update("installments", value)} placeholder="1" />
          <Field label="Vencimento">
            <input type="date" value={draft.dueDate} onChange={(event) => update("dueDate", event.target.value)} className={controlClass} />
          </Field>
          <Field label="Forma de pagamento">
            <select value={draft.method} onChange={(event) => update("method", event.target.value)} className={controlClass}>
              {["Pix", "Boleto", "Cartão de crédito", "Cartão de débito", "Transferência", "Dinheiro"].map((method) => <option key={method}>{method}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={draft.status} onChange={(event) => update("status", event.target.value as BudgetPaymentStatus)} className={controlClass}>
              <option value="pendente">Pendente</option>
              <option value="proximo">Próximo</option>
              <option value="atrasado">Atrasado</option>
              <option value="pago">Pago</option>
            </select>
          </Field>
          <TextField label="Contrato/comprovante" value={draft.receiptName} onChange={(value) => update("receiptName", value)} placeholder="Nome do arquivo ou link" />
          <TextField label="Observação" value={draft.note} onChange={(value) => update("note", value)} placeholder="Ex: sinal do contrato" />
        </div>

        <Button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="mt-5 h-12 w-full bg-[#D4537E] text-white hover:bg-[#993556] disabled:opacity-50">
          Salvar despesa
        </Button>
      </section>
    </div>
  );
}

function ModeButton({ active, title, onClick }: { active: boolean; title: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={active ? "h-11 rounded-2xl bg-[#D4537E] text-sm font-bold text-white" : "h-11 rounded-2xl bg-[#FFF8F4] text-sm font-bold text-[#8A716D]"}>{title}</button>;
}

const controlClass = "h-11 w-full rounded-xl border border-[#F0E1DD] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#2A1A1F] outline-none focus:border-[#D4537E]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block rounded-2xl bg-[#FFF8F4] p-4 text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}<div className="mt-2">{children}</div></label>;
}

function TextField({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; inputMode?: "numeric" }) {
  return <Field label={label}><input value={value} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={controlClass} /></Field>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#FFF8F4] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p><p className="mt-1 font-serif text-2xl text-[#4B1528]">{value}</p></div>;
}

function applyPaymentToVendor(vendor: Vendor, payment: VendorPayment, totalValue: number): Vendor {
  const payments = [payment, ...vendor.payments.filter((item) => item.id !== payment.id)];
  const paidValue = payments.filter((item) => item.status === "pago").reduce((sum, item) => sum + item.amount, 0);
  const next = payments.find((item) => item.status !== "pago");
  return {
    ...vendor,
    totalValue: Math.max(vendor.totalValue, totalValue),
    paidValue,
    nextPayment: next ? `${money(next.amount)} em ${formatDisplayDate(next.dueDate)}` : "Tudo pago",
    payments
  };
}

function createVendorFromExpense(id: string, supplier: string, category: string, totalValue: number, payment: VendorPayment, note: string): Vendor {
  return {
    id,
    name: supplier,
    category: normalizeVendorCategory(category),
    status: payment.status === "pago" ? "Pagamento pendente" : "Fechado",
    responsible: supplier,
    whatsapp: "",
    phone: "",
    email: "",
    instagram: "",
    site: "",
    city: "",
    address: "",
    serviceHours: "",
    totalValue,
    paidValue: payment.status === "pago" ? payment.amount : 0,
    nextPayment: payment.status === "pago" ? "Tudo pago" : `${money(payment.amount)} em ${formatDisplayDate(payment.dueDate)}`,
    contract: { sent: false, signed: false, notes: "Criado pelo módulo Financeiro.", clauses: [] },
    included: [],
    nextMilestone: "Completar dados do fornecedor",
    importantNote: note,
    payments: [payment],
    deliveries: [],
    notes: note || "Fornecedor criado a partir de uma despesa financeira.",
    ceremonialNote: "",
    history: [{ label: "criado pelo financeiro", date: "hoje" }],
    budgetCategory: category
  };
}


function normalizeVendorCategory(category: string): VendorCategory {
  const normalized = category.toLowerCase();
  if (normalized.includes("música") || normalized.includes("musica") || normalized.includes("dj")) return "Música/DJ" as VendorCategory;
  if (normalized.includes("decor")) return "Decoração" as VendorCategory;
  if (normalized.includes("espa")) return "Espaço" as VendorCategory;
  if (normalized.includes("foto")) return "Fotografia";
  if (normalized.includes("buffet")) return "Buffet";
  if (normalized.includes("cerimonial")) return "Cerimonial";
  if (normalized.includes("vestido")) return "Vestido";
  return "Outros";
}

function categoryIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes("espa")) return Building2;
  if (lower.includes("buffet")) return Utensils;
  if (lower.includes("foto")) return Camera;
  if (lower.includes("decor")) return Flower2;
  if (lower.includes("música") || lower.includes("musica")) return Music;
  if (lower.includes("vestido")) return Shirt;
  return CircleDollarSign;
}

function toneBg(tone: "ok" | "warn" | "danger") {
  if (tone === "danger") return "bg-[#FCEBEB] text-[#791F1F]";
  if (tone === "warn") return "bg-[#FAEEDA] text-[#633806]";
  return "bg-[#EAF3DE] text-[#27500A]";
}

function badgeTone(tone: "ok" | "warn" | "danger") {
  return toneBg(tone);
}

function barTone(tone: "ok" | "warn" | "danger") {
  if (tone === "danger") return "bg-[#E24B4A]";
  if (tone === "warn") return "bg-[#BA7517]";
  return "bg-[#639922]";
}

function statusText(tone: "ok" | "warn" | "danger") {
  if (tone === "danger") return "passou";
  if (tone === "warn") return "atenção";
  return "ok";
}

function dueText(days: number) {
  if (days < 0) return `${Math.abs(days)} dia(s) vencido`;
  if (days === 0) return "vence hoje";
  return `em ${days} dia(s)`;
}

function formatDisplayDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
}
