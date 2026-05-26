"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Camera,
  ChevronRight,
  CircleDollarSign,
  Flower2,
  Music,
  Plus,
  Shirt,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getBudgetAllocation,
  getStoredVendorCategories,
  saveBudgetAllocation,
  saveStoredVendorCategories,
} from "@/lib/client/planning-store";
import {
  getVendorFinancePayments,
  subscribeVendorFinancePayments,
} from "@/lib/client/vendor-finance-sync";
import type { BudgetPayment } from "@/types/budget";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Espaço: "O local onde acontece a cerimônia e/ou a festa.",
  Buffet: "Alimentação, bebidas e equipe de serviço.",
  Fotografia: "Fotos da cerimônia, recepção e making of.",
  Filmagem: "Vídeo do casamento — trailer, filme completo.",
  Decoração: "Flores, arranjos, iluminação e ambientação.",
  Cerimonial: "Assessoria para organizar e conduzir o dia.",
  "Música/DJ": "DJ, banda ou coral — trilha da festa.",
  Beleza: "Maquiagem, cabelo e tratamentos pré-casamento.",
  Vestido: "Vestido, veu, acessórios e ajustes.",
  "Convites": "Papelaria, convites e papelaria digital.",
  "Doces e bolo": "Bolo, docinhos, mesa de doces.",
  "Bar e drinks": "Drinks, bartender e coquetel.",
  Celebrante: "Celebrante para conduzir a cerimônia personalizada.",
  Transporte: "Transfer de noivos e/ou convidados.",
  Outros: "Despesas diversas não vinculadas a um fornecedor.",
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  const cents = Number(digits || "0");
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatAllocationValue(value: number): string {
  if (!value) return "";
  return formatCurrencyInput(String(Math.round(value * 100)));
}

function numberFromText(value: string) {
  return Number(value.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
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

function toneBg(tone: "ok" | "warn" | "danger" | "neutral") {
  if (tone === "danger") return "bg-[#FCEBEB] text-[#791F1F]";
  if (tone === "warn") return "bg-[#FAEEDA] text-[#633806]";
  if (tone === "neutral") return "bg-[#F3EEF0] text-[#6B4F5A]";
  return "bg-[#EAF3DE] text-[#27500A]";
}

function barTone(tone: "ok" | "warn" | "danger" | "neutral") {
  if (tone === "danger") return "bg-[#E24B4A]";
  if (tone === "warn") return "bg-[#BA7517]";
  if (tone === "neutral") return "bg-[#B59A94]";
  return "bg-[#639922]";
}

type CategorySummary = {
  name: string;
  planned: number;
  spent: number;
  payments: BudgetPayment[];
};

export default function Page() {
  const [vendorPayments, setVendorPayments] = useState<BudgetPayment[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allocationDraft, setAllocationDraft] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<CategorySummary | null>(null);
  const [newCatInput, setNewCatInput] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const cats = getStoredVendorCategories();
    const list = cats.length > 0 ? cats : ["Espaço", "Buffet", "Fotografia", "Decoração", "Música/DJ", "Cerimonial"];
    setCategories(list);
    const saved = getBudgetAllocation();
    const draft: Record<string, string> = {};
    list.forEach((cat) => {
      draft[cat] = saved[cat] ? formatAllocationValue(saved[cat]) : "";
    });
    setAllocationDraft(draft);
    setVendorPayments(getVendorFinancePayments());
    return subscribeVendorFinancePayments(() => setVendorPayments(getVendorFinancePayments()));
  }, []);

  const summaries = useMemo<CategorySummary[]>(() => {
    const allocation = getBudgetAllocation();
    return categories.map((name) => {
      const planned = allocation[name] ?? 0;
      const payments = vendorPayments.filter(
        (p) => p.category.toLowerCase() === name.toLowerCase()
      );
      const spent = payments.reduce((s, p) => s + p.amount, 0);
      return { name, planned, spent, payments };
    });
  }, [categories, vendorPayments]);

  const totalPlanned = summaries.reduce((s, c) => s + c.planned, 0);
  const totalSpent = summaries.reduce((s, c) => s + c.spent, 0);

  function saveAllocation() {
    const out: Record<string, number> = {};
    Object.entries(allocationDraft).forEach(([k, v]) => {
      const n = numberFromText(v);
      if (n > 0) out[k] = n;
    });
    saveBudgetAllocation(out);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  }

  function addCategory() {
    const name = newCatInput.trim();
    if (!name || categories.includes(name)) return;
    const updated = [...categories, name];
    setCategories(updated);
    setAllocationDraft((prev) => ({ ...prev, [name]: "" }));
    saveStoredVendorCategories(updated);
    setNewCatInput("");
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#FFF8F4] pb-36 md:-mx-8 lg:-mx-11 lg:pb-12">
      <main className="mx-auto max-w-5xl space-y-5 px-4 pt-4 md:px-8 lg:px-11">

        {/* ── Header ── */}
        <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_42px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <Button asChild variant="outline" className="mb-4 h-10 rounded-full bg-white">
            <Link href="/app/orcamento">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Financeiro
            </Link>
          </Button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#993556]">Categorias</p>
          <h1 className="mt-2 font-serif text-4xl leading-none text-[#4B1528] md:text-5xl">
            Onde o dinheiro está indo
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6F5B57]">
            Cada categoria mostra quanto você reservou e quanto já foi comprometido.
          </p>

          {totalPlanned > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#EAF3DE] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#3B6D11]/70">Distribuído</p>
                <strong className="mt-1 block font-serif text-2xl text-[#27500A]">{money(totalPlanned)}</strong>
              </div>
              <div className={`rounded-2xl p-4 ${totalSpent > totalPlanned ? "bg-[#FCEBEB]" : "bg-[#FFF8F4]"}`}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Comprometido</p>
                <strong className={`mt-1 block font-serif text-2xl ${totalSpent > totalPlanned ? "text-[#791F1F]" : "text-[#4B1528]"}`}>
                  {money(totalSpent)}
                </strong>
              </div>
            </div>
          )}
        </section>

        {/* ── Lista de categorias ── */}
        <section className="space-y-3">
          {summaries.map((cat) => {
            const percent = cat.planned ? Math.min(100, Math.round((cat.spent / cat.planned) * 100)) : 0;
            const balance = cat.planned - cat.spent;
            const tone: "ok" | "warn" | "danger" | "neutral" =
              cat.planned === 0 ? "neutral" : balance < 0 ? "danger" : percent >= 80 ? "warn" : "ok";
            const Icon = categoryIcon(cat.name);
            const desc = CATEGORY_DESCRIPTIONS[cat.name];

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelected(cat)}
                className="flex w-full items-center gap-4 rounded-[22px] bg-white p-4 text-left shadow-[0_10px_28px_rgba(75,46,43,0.06)] ring-1 ring-[#F0E1DD] transition active:scale-[0.99]"
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${toneBg(tone)}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span>
                      <strong className="block text-sm font-bold text-[#2A1A1F]">{cat.name}</strong>
                      {desc && <span className="mt-0.5 block text-xs text-[#8A716D]">{desc}</span>}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${toneBg(tone)}`}>
                      {cat.planned === 0
                        ? "sem limite"
                        : balance < 0
                        ? "passou"
                        : percent >= 80
                        ? "atenção"
                        : "ok"}
                    </span>
                  </span>
                  <span className="mt-2.5 grid grid-cols-3 gap-2 text-xs text-[#8A716D]">
                    <span>
                      Previsto
                      <br />
                      <b className="text-[#2A1A1F]">{cat.planned ? money(cat.planned) : "—"}</b>
                    </span>
                    <span>
                      Usado
                      <br />
                      <b className="text-[#2A1A1F]">{money(cat.spent)}</b>
                    </span>
                    <span>
                      Saldo
                      <br />
                      <b className={balance < 0 ? "text-[#791F1F]" : "text-[#2A1A1F]"}>
                        {cat.planned ? money(balance) : "—"}
                      </b>
                    </span>
                  </span>
                  {cat.planned > 0 && (
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#F4ECE8]">
                      <span
                        className={`block h-full rounded-full transition-all ${barTone(tone)}`}
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                  )}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#B59A94]" />
              </button>
            );
          })}
        </section>

        {/* ── Adicionar categoria ── */}
        <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <h2 className="font-serif text-xl text-[#4B1528]">Incluir nova categoria</h2>
          <p className="mt-1 text-xs text-[#8A716D]">Adicione fornecedores ou despesas que ainda não estão na lista.</p>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }}
              placeholder="Ex: Floricultura, Seguro, Lua de mel..."
              className="flex-1 rounded-2xl border border-dashed border-[#D4537E]/40 bg-[#FFF8F4] px-4 py-3 text-sm font-semibold text-[#4B1528] outline-none placeholder:text-[#C4B0AA] focus:border-[#D4537E]"
            />
            <button
              type="button"
              onClick={addCategory}
              disabled={!newCatInput.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#D4537E] text-white disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* ── Ajustar valores distribuídos ── */}
        <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <h2 className="font-serif text-xl text-[#4B1528]">Ajustar valores</h2>
          <p className="mt-1 text-xs text-[#8A716D]">Edite o quanto você reservou para cada categoria.</p>
          <div className="mt-4 space-y-3">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="flex-1 text-sm font-semibold text-[#4B1528]">{cat}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={allocationDraft[cat] ?? ""}
                  onChange={(e) =>
                    setAllocationDraft((prev) => ({
                      ...prev,
                      [cat]: formatCurrencyInput(e.target.value),
                    }))
                  }
                  className="w-36 rounded-2xl border border-[#EEE6E1] bg-[#FFF8F4] px-3 py-2 text-right text-sm font-semibold text-[#2A1A1F] outline-none focus:border-[#D4537E]"
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={saveAllocation}
            className={`mt-5 h-11 w-full font-bold transition ${
              savedNotice ? "bg-[#5F7752] hover:bg-[#5F7752]" : "bg-[#D4537E] hover:bg-[#993556]"
            }`}
          >
            {savedNotice ? "✓ Valores salvos!" : "Salvar distribuição"}
          </Button>
        </section>
      </main>

      {/* ── Modal de detalhe ── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-[#2A1A1F]/35" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" onClick={() => setSelected(null)} aria-label="Fechar" />
          <aside className="absolute bottom-0 right-0 max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-2xl md:top-0 md:max-h-none md:max-w-xl md:rounded-l-[32px] md:rounded-tr-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Categoria</p>
                <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">{selected.name}</h2>
                {CATEGORY_DESCRIPTIONS[selected.name] && (
                  <p className="mt-1 text-sm text-[#8A716D]">{CATEGORY_DESCRIPTIONS[selected.name]}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#FBEAF0]"
                aria-label="Fechar"
              >
                <X className="h-5 w-5 text-[#D4537E]" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["Previsto", selected.planned ? money(selected.planned) : "—"],
                ["Usado", money(selected.spent)],
                ["Saldo", selected.planned ? money(selected.planned - selected.spent) : "—"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#FFF8F4] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p>
                  <p className="mt-1 font-serif text-xl text-[#4B1528]">{value}</p>
                </div>
              ))}
            </div>

            {selected.planned > 0 && (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F4ECE8]">
                <div
                  className="h-full rounded-full bg-[#639922]"
                  style={{ width: `${Math.min(100, Math.round((selected.spent / selected.planned) * 100))}%` }}
                />
              </div>
            )}

            <h3 className="mt-6 font-serif text-2xl text-[#4B1528]">Pagamentos vinculados</h3>
            <div className="mt-3 space-y-2">
              {selected.payments.length ? (
                selected.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#FFF8F4] p-4"
                  >
                    <div>
                      <p className="font-bold text-[#2A1A1F]">{p.supplier}</p>
                      <p className="mt-0.5 text-xs text-[#8A716D]">
                        {p.dueDate} · {p.status}
                      </p>
                    </div>
                    <strong className="text-[#4B1528]">{money(p.amount)}</strong>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-[#FFF8F4] p-4 text-sm text-[#8A716D]">
                  Nenhum pagamento vinculado a esta categoria.
                </p>
              )}
            </div>
            <Button type="button" onClick={() => setSelected(null)} className="mt-5 w-full bg-[#D4537E]">
              Fechar
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
