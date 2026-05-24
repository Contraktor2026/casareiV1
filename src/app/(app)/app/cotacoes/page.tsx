"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Crown, FileImage, FileText, Heart, Keyboard, Lock, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveVendorFinancePayment } from "@/lib/client/vendor-finance-sync";
import { upsertStoredVendor } from "@/lib/client/vendors-store";
import { mockQuoteProposals, quoteCategories, quoteCategoryGuides } from "@/lib/mock/quotes";
import type { BudgetPaymentStatus } from "@/types/budget";
import type { QuoteCategory, QuoteProposal } from "@/types/quotes";
import type { Vendor, VendorCategory, VendorPayment } from "@/types/vendors";

const extraQuoteCategories: QuoteCategory[] = [
  "Vestido da noiva",
  "Beleza da noiva",
  "Música e DJ",
  "Cerimonial",
  "Convites",
  "Doces e bolo",
  "Bar e drinks",
  "Lembrancinhas",
  "Transporte",
  "Hospedagem",
  "Lua de mel",
  "Alianças",
  "Papelaria",
  "Celebrante",
  "Segurança",
  "Limpeza",
  "Gerador"
];

const todayIso = "2026-05-24";
const weekBeforeWeddingIso = "2026-10-05";

type PaymentPlanMode = "avista" | "parcelado";
type PaymentPlanItem = {
  name: string;
  amount: number;
  dueDate: string;
  method: string;
  status: BudgetPaymentStatus;
};
type PaymentPlan = {
  mode: PaymentPlanMode;
  totalValue: number;
  payments: PaymentPlanItem[];
};
type ManualQuoteData = {
  vendor: string;
  priceLabel: string;
  summary: string;
  method: string;
  dueDate: string;
  observations: string;
};

const importedProposal: QuoteProposal = {
  id: "foto-importada",
  vendor: "Memória em Flor",
  category: "Fotografia",
  price: 15200,
  priceLabel: "R$ 15.200",
  shortSummary: "Proposta importada com cobertura longa, álbum e entrega afetiva.",
  compatibility: 89,
  compatibilityReasons: ["estilo romântico", "inclui álbum", "boa cobertura", "ligeiramente acima do orçamento"],
  sofiaNote: "A leitura simulada mostra uma proposta forte para lembranças impressas, mas vale confirmar deslocamento.",
  includes: ["10h de cobertura", "álbum", "segundo fotógrafo", "galeria online", "reels"],
  notIncluded: ["drone", "deslocamento fora da região"],
  strengths: ["álbum incluso", "boa cobertura", "estilo delicado"],
  attentionPoints: ["sem drone", "confirmar deslocamento"],
  experienceDifference: "Traz álbum e segundo fotógrafo, mas não inclui drone.",
  emotionalReasons: ["estética", "segurança", "custo-benefício"],
  isFavorite: false,
  details: {
    "Horas de cobertura": "10h",
    "Fotos aproximadas": 620,
    "Álbum incluso": true,
    Drone: false,
    Reels: true,
    "Segundo fotógrafo": true,
    "Prazo de entrega": "60 dias",
    "Estilo fotográfico": "romântico natural"
  }
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export default function QuotesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<QuoteCategory>("Fotografia");
  const [categories, setCategories] = useState<QuoteCategory[]>([...quoteCategories, ...extraQuoteCategories]);
  const [proposals, setProposals] = useState<QuoteProposal[]>(mockQuoteProposals);
  const [message, setMessage] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [closingProposal, setClosingProposal] = useState<QuoteProposal | null>(null);
  const [newCategory, setNewCategory] = useState("");

  const activeProposals = proposals.filter((proposal) => proposal.category === activeCategory);
  const favorites = proposals.filter((proposal) => proposal.isFavorite);
  const categoriesWithQuotes = categories.filter((category) => proposals.some((proposal) => proposal.category === category));
  const bestCompatibility = activeProposals.slice().sort((a, b) => b.compatibility - a.compatibility)[0];
  const cheapest = activeProposals.filter((proposal) => proposal.price > 0).slice().sort((a, b) => a.price - b.price)[0];
  const mostComplete = activeProposals.slice().sort((a, b) => b.includes.length - a.includes.length)[0];
  const categoryGuide = quoteCategoryGuides.find((guide) => guide.category === activeCategory);

  const categorySummaries = useMemo(
    () =>
      categories.map((category) => {
        const categoryProposals = proposals.filter((proposal) => proposal.category === category);
        const prices = categoryProposals.map((proposal) => proposal.price).filter(Boolean);
        const favorite = categoryProposals.find((proposal) => proposal.isFavorite);
        return {
          category,
          count: categoryProposals.length,
          min: prices.length ? Math.min(...prices) : 0,
          max: prices.length ? Math.max(...prices) : 0,
          favorite,
          status: categoryProposals.length === 0 ? "sem cotação" : categoryProposals.length >= 2 ? "pronta para comparar" : "em análise"
        };
      }),
    [categories, proposals]
  );

  function toggleFavorite(id: string) {
    setProposals((current) => current.map((proposal) => (proposal.id === id ? { ...proposal, isFavorite: !proposal.isFavorite } : proposal)));
  }

  function importProposal(method: "PDF" | "JPEG", fileName?: string) {
    setActiveCategory("Fotografia");
    setProposals((current) => (current.some((proposal) => proposal.id === importedProposal.id) ? current : [importedProposal, ...current]));
    setMessage(`${method} importado${fileName ? ` (${fileName})` : ""}: a proposta apareceu em Fotografia.`);
  }

  function addManualProposal(data: ManualQuoteData) {
    const vendorName = data.vendor.trim() || "Fornecedor manual";
    const priceLabel = formatManualPrice(data.priceLabel);
    const summary = data.summary || "Orçamento preenchido manualmente.";
    const manualProposal: QuoteProposal = {
      ...importedProposal,
      id: `manual-${Date.now()}`,
      vendor: vendorName,
      category: activeCategory,
      price: numberFromCurrency(priceLabel),
      priceLabel,
      shortSummary: summary,
      compatibility: 70,
      compatibilityReasons: ["informações manuais", "pronto para comparar"],
      sofiaNote: "Complete os detalhes para uma comparação mais precisa.",
      includes: ["Informações adicionadas manualmente"],
      notIncluded: [],
      strengths: ["orçamento salvo"],
      attentionPoints: ["revisar informações antes de comparar"],
      experienceDifference: "Orçamento manual salvo para comparação.",
      emotionalReasons: ["manual"],
      isFavorite: false,
      details: {
        Valor: priceLabel,
        "Forma de pagamento": data.method,
        Vencimento: data.dueDate ? formatDate(data.dueDate) : "A definir",
        Resumo: summary,
        Observações: data.observations || "Sem observações."
      }
    };

    setProposals((current) => [manualProposal, ...current]);
    setShowManualForm(false);
    setMessage(`Orçamento de ${vendorName} adicionado em ${activeCategory}.`);
  }

  function addCategory() {
    const cleanName = newCategory.trim();
    if (!cleanName) return;
    const existing = categories.find((category) => category.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      setActiveCategory(existing);
      setShowCategoryForm(false);
      setNewCategory("");
      return;
    }
    setCategories((current) => [...current, cleanName]);
    setActiveCategory(cleanName);
    setNewCategory("");
    setShowCategoryForm(false);
  }

  function closeVendor(proposal: QuoteProposal, plan: PaymentPlan) {
    const vendorId = `fechado-${proposal.id}-${Date.now()}`;
    const vendorPayments: VendorPayment[] = plan.payments.map((payment) => {
      const financePayment = saveVendorFinancePayment({
        vendorId,
        supplier: proposal.vendor,
        category: proposal.category,
        amount: payment.amount,
        dueDate: payment.dueDate,
        method: payment.method,
        status: payment.status
      });

      return {
        id: financePayment.id,
        name: payment.name,
        amount: payment.amount,
        dueDate: payment.dueDate,
        status: payment.status,
        method: payment.method
      };
    });
    const paidValue = vendorPayments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0);
    const nextPayment = vendorPayments.find((payment) => payment.status !== "pago");
    const vendor: Vendor = {
      id: vendorId,
      name: proposal.vendor,
      category: normalizeVendorCategory(proposal.category),
      status: "Fechado",
      responsible: proposal.vendor.split(" ")[0],
      whatsapp: "5511999999999",
      phone: "",
      email: `${vendorId}@casarei.demo`,
      instagram: "",
      site: "",
      city: "",
      address: "",
      serviceHours: "",
      totalValue: plan.totalValue,
      paidValue,
      nextPayment: nextPayment ? `${money(nextPayment.amount)} em ${formatDate(nextPayment.dueDate)}` : "Tudo pago",
      contract: { sent: false, signed: false, notes: `Fornecedor fechado a partir de uma cotação. Pagamento ${plan.mode === "avista" ? "à vista" : "parcelado"}.`, clauses: [] },
      included: proposal.includes,
      nextMilestone: "Cadastrar contrato e parcelas",
      importantNote: proposal.sofiaNote,
      payments: vendorPayments,
      deliveries: proposal.includes.map((item, index) => ({
        id: `${vendorId}-d${index}`,
        title: item,
        status: "pendente",
        dueDate: "A definir",
        note: "Confirmar entrega com fornecedor.",
        responsible: proposal.vendor
      })),
      notes: proposal.shortSummary,
      ceremonialNote: `${proposal.category}: ${proposal.shortSummary}`,
      history: [{ label: "fornecedor fechado pelas cotações", date: "hoje" }, { label: "parcelas enviadas ao financeiro", date: "hoje" }],
      sourceQuoteId: proposal.id,
      budgetCategory: proposal.category
    };

    upsertStoredVendor(vendor);
    setClosingProposal(null);
    setMessage(`${proposal.vendor} virou fornecedor. Complete contrato e pagamentos.`);
    router.push(`/app/fornecedores/${vendorId}`);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-white p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD] md:p-7">
        <div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Cotações</p>
            <h1 className="mt-2 font-serif text-4xl leading-none text-[#4B1528] md:text-5xl">Da proposta ao fornecedor</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F5B57]">
              Compare por categoria, escolha a melhor opção e transforme a cotação em fornecedor com contrato e pagamentos.
            </p>
            <p className="mt-3 max-w-2xl rounded-2xl bg-[#FFF8F4] px-4 py-3 text-sm font-semibold leading-6 text-[#4B1528]">
              Para adicionar um orçamento, escolha uma das 3 opções abaixo: importar PDF, importar imagem ou preencher manualmente.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 md:grid-cols-4">
          <TopMetric label="Recebidas" value={String(proposals.length)} />
          <TopMetric label="Categorias" value={String(categoriesWithQuotes.length)} />
          <TopMetric label="Favoritas" value={String(favorites.length)} />
          <TopMetric label="Prontas" value={String(categorySummaries.filter((item) => item.status === "pronta para comparar").length)} hideOnMobile />
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Adicionar orçamento</p>
          <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">Escolha como quer cadastrar a cotação</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F5B57]">
            Você pode importar um PDF, enviar uma imagem do orçamento ou preencher as informações manualmente.
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ImportAction icon={<FileText />} title="Importar PDF" description="Use quando o fornecedor mandou uma proposta em PDF." onImport={(fileName) => importProposal("PDF", fileName)} accept="application/pdf,.pdf" />
          <ImportAction icon={<FileImage />} title="Importar imagem" description="Use para print, JPEG ou PNG do orçamento recebido." onImport={(fileName) => importProposal("JPEG", fileName)} accept="image/jpeg,.jpg,.jpeg,image/png,.png" />
          <button type="button" onClick={() => setShowManualForm(true)} className="flex min-h-[118px] items-start gap-3 rounded-2xl border border-[#F0C5D2] bg-white p-4 text-left shadow-[0_10px_28px_rgba(75,46,43,0.06)]">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FBEAF0] text-[#D4537E]">
              <Keyboard className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-sm text-[#4B1528]">Preencher manualmente</strong>
              <span className="mt-1 block text-xs leading-5 text-[#8A716D]">Use quando você quer digitar fornecedor, valor e resumo.</span>
            </span>
          </button>
        </div>
      </section>

      {message ? <p className="rounded-2xl bg-[#EAF3DE] px-4 py-3 text-sm font-bold text-[#27500A]">{message}</p> : null}

      <section className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <aside className="rounded-[28px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-3xl text-[#4B1528]">Categorias</h2>
            <button type="button" onClick={() => setShowCategoryForm((value) => !value)} className="text-sm font-bold text-[#D4537E]">Adicionar</button>
          </div>

          {showCategoryForm ? (
            <div className="mt-4 rounded-2xl bg-[#FFF8F4] p-3">
              <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nova categoria" className="h-11 w-full rounded-xl border border-[#F0E1DD] bg-white px-3 text-sm outline-none" />
              <Button type="button" onClick={addCategory} className="mt-2 h-10 w-full bg-[#D4537E]">Salvar categoria</Button>
            </div>
          ) : null}

          <div className="mt-4 space-y-2">
            {categorySummaries.map((summary) => (
              <button
                key={summary.category}
                type="button"
                onClick={() => setActiveCategory(summary.category)}
                className={activeCategory === summary.category ? "w-full rounded-2xl bg-[#FBEAF0] p-4 text-left ring-1 ring-[#ED93B1]" : "w-full rounded-2xl bg-[#FFF8F4] p-4 text-left ring-1 ring-[#F0E1DD]"}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#2A1A1F]">{summary.category}</p>
                    <p className="mt-1 text-xs text-[#8A716D]">{summary.count} proposta(s)</p>
                  </div>
                  <StatusPill status={summary.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#8A716D]">
                  <span>Menor<br /><b className="text-[#2A1A1F]">{summary.min ? money(summary.min) : "-"}</b></span>
                  <span>Maior<br /><b className="text-[#2A1A1F]">{summary.max ? money(summary.max) : "-"}</b></span>
                </div>
                {summary.favorite ? <p className="mt-2 text-xs font-bold text-[#D4537E]">Favorita: {summary.favorite.vendor}</p> : null}
              </button>
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          <section className="rounded-[28px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <button type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#8A716D] xl:hidden">
                  <ArrowLeft className="h-4 w-4" />
                  Categorias
                </button>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Detalhe da categoria</p>
                <h2 className="mt-1 font-serif text-4xl text-[#4B1528]">{activeCategory}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6F5B57]">
                  {categoryGuide?.description ?? "Compare valor, entrega, prazo e pontos de atenção antes de decidir."}
                </p>
              </div>
              <Button type="button" onClick={() => setMessage("Comparar orçamentos é um recurso Premium. Assine para liberar a comparação completa.")} className="h-12 rounded-2xl bg-[linear-gradient(135deg,#2a1a1f,#d4537e)] text-white">
                <Crown className="h-4 w-4" />
                Comparar orçamentos
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/18 px-2 py-1 text-[11px]">
                  <Lock className="h-3 w-3" />
                  Premium
                </span>
              </Button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <DecisionHint title="Mais barata" proposal={cheapest} />
              <DecisionHint title="Melhor compatibilidade" proposal={bestCompatibility} />
              <DecisionHint title="Mais completa" proposal={mostComplete} />
            </div>

            {categoryGuide ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryGuide.importantFields.map((field) => <span key={field} className="rounded-full bg-[#FBEAF0] px-3 py-1 text-xs font-bold text-[#72243E]">{field}</span>)}
              </div>
            ) : null}
          </section>

          {activeProposals.length ? (
            <section className="grid gap-4 lg:grid-cols-2">
              {activeProposals.map((proposal) => (
                <ProposalDecisionCard key={proposal.id} proposal={proposal} onFavorite={() => toggleFavorite(proposal.id)} onCloseVendor={() => setClosingProposal(proposal)} />
              ))}
            </section>
          ) : (
            <section className="rounded-[28px] bg-white p-8 text-center shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
              <p className="font-serif text-3xl text-[#4B1528]">Ainda não há cotações nessa categoria.</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8A716D]">Importe um PDF, uma imagem ou preencha manualmente para começar a comparar.</p>
              <Button type="button" onClick={() => setShowManualForm(true)} className="mt-5 bg-[#D4537E]">Adicionar cotação</Button>
            </section>
          )}
        </main>
      </section>

      {showManualForm ? <ManualQuoteModal category={activeCategory} onClose={() => setShowManualForm(false)} onSave={addManualProposal} /> : null}
      {closingProposal ? <CloseVendorPaymentModal proposal={closingProposal} onClose={() => setClosingProposal(null)} onConfirm={(plan) => closeVendor(closingProposal, plan)} /> : null}
    </div>
  );
}

function TopMetric({ label, value, hideOnMobile = false }: { label: string; value: string; hideOnMobile?: boolean }) {
  return (
    <div className={hideOnMobile ? "hidden rounded-2xl bg-[#FFF8F4] p-4 md:block" : "rounded-2xl bg-[#FFF8F4] p-4"}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p>
      <strong className="mt-1 block font-serif text-3xl text-[#4B1528]">{value}</strong>
    </div>
  );
}

function ImportAction({ icon, title, description, accept, onImport }: { icon: ReactNode; title: string; description: string; accept: string; onImport: (fileName?: string) => void }) {
  return (
    <label className="flex min-h-[118px] cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_10px_28px_rgba(75,46,43,0.06)] ring-1 ring-[#F0E1DD]">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FBEAF0] text-[#D4537E] [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <span>
        <strong className="block text-sm text-[#4B1528]">{title}</strong>
        <span className="mt-1 block text-xs leading-5 text-[#8A716D]">{description}</span>
      </span>
      <input type="file" accept={accept} className="sr-only" onChange={(event) => event.target.files?.[0] && onImport(event.target.files[0].name)} />
    </label>
  );
}

function StatusPill({ status }: { status: string }) {
  const className = status === "sem cotação" ? "bg-[#F8F4F1] text-[#8A716D]" : status === "pronta para comparar" ? "bg-[#EAF3DE] text-[#27500A]" : "bg-[#FAEEDA] text-[#633806]";
  return <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${className}`}>{status}</span>;
}

function DecisionHint({ title, proposal }: { title: string; proposal?: QuoteProposal }) {
  return (
    <div className="rounded-2xl bg-[#FFF8F4] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">{title}</p>
      {proposal ? (
        <>
          <strong className="mt-2 block text-sm text-[#2A1A1F]">{proposal.vendor}</strong>
          <p className="mt-1 text-xs text-[#8A716D]">{proposal.priceLabel} · {proposal.compatibility}%</p>
        </>
      ) : <p className="mt-2 text-sm text-[#8A716D]">Sem dados ainda.</p>}
    </div>
  );
}

function ProposalDecisionCard({ proposal, onFavorite, onCloseVendor }: { proposal: QuoteProposal; onFavorite: () => void; onCloseVendor: () => void }) {
  const [showSummary, setShowSummary] = useState(false);
  return (
    <article className="rounded-[26px] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] ring-1 ring-[#F0E1DD]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4537E]">{proposal.category}</p>
          <h3 className="mt-1 font-serif text-3xl leading-tight text-[#4B1528]">{proposal.vendor}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6F5B57]">{proposal.shortSummary}</p>
        </div>
        <button type="button" onClick={onFavorite} className={proposal.isFavorite ? "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#D4537E] text-white" : "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FBEAF0] text-[#D4537E]"} aria-label="Favoritar">
          <Heart className="h-5 w-5" fill={proposal.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#FFF8F4] p-4">
          <p className="text-xs text-[#8A716D]">Valor</p>
          <strong className="mt-1 block font-serif text-2xl text-[#4B1528]">{proposal.priceLabel}</strong>
        </div>
        <div className="rounded-2xl bg-[#FBEAF0] p-4">
          <p className="text-xs text-[#8A716D]">Compatibilidade</p>
          <strong className="mt-1 block font-serif text-2xl text-[#D4537E]">{proposal.compatibility}%</strong>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <MiniList title="Inclui" items={proposal.includes.slice(0, 4)} positive />
        <MiniList title="Atenção" items={proposal.attentionPoints.slice(0, 4)} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <Button type="button" variant="outline" onClick={() => setShowSummary(true)} className="bg-white">Ver resumo</Button>
        <Button type="button" variant="outline" onClick={onFavorite} className="bg-white">
          <Star className="h-4 w-4" />
          Favoritar
        </Button>
        <Button type="button" onClick={onCloseVendor} className="bg-[#D4537E] hover:bg-[#993556]">Fechar fornecedor</Button>
      </div>

      {showSummary ? <SummaryModal proposal={proposal} onClose={() => setShowSummary(false)} /> : null}
    </article>
  );
}

function MiniList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className="rounded-2xl bg-[#FFF8F4] p-4">
      <p className="text-sm font-bold text-[#4B1528]">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-[#6F5B57]">
        {items.length ? items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className={positive ? "mt-0.5 h-4 w-4 shrink-0 text-[#5F7752]" : "mt-0.5 h-4 w-4 shrink-0 text-[#B96F52]"} />
            {item}
          </li>
        )) : <li>Nenhum item informado.</li>}
      </ul>
    </div>
  );
}

function SummaryModal({ proposal, onClose }: { proposal: QuoteProposal; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 md:place-items-center md:p-6">
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-2xl md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">{proposal.category}</p>
            <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">{proposal.vendor}</h2>
            <p className="mt-2 text-sm font-bold text-[#D4537E]">{proposal.priceLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#FBEAF0]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-5 rounded-2xl bg-[#FFF8F4] p-4 text-sm leading-6 text-[#6F5B57]">{proposal.shortSummary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <MiniList title="Inclui" items={proposal.includes} positive />
          <MiniList title="Pontos de atenção" items={proposal.attentionPoints} />
          <MiniList title="Pontos fortes" items={proposal.strengths} positive />
          <MiniList title="Não inclui" items={proposal.notIncluded} />
        </div>
        <Button type="button" onClick={onClose} className="mt-5 h-12 w-full bg-[#D4537E]">Fechar resumo</Button>
      </section>
    </div>
  );
}

function ManualQuoteModal({ category, onClose, onSave }: { category: QuoteCategory; onClose: () => void; onSave: (data: ManualQuoteData) => void }) {
  const [vendor, setVendor] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [method, setMethod] = useState("Pix");
  const [dueDate, setDueDate] = useState(todayIso);
  const [summary, setSummary] = useState("");
  const [observations, setObservations] = useState("");
  const canSave = Boolean(vendor.trim() || priceLabel.trim() || summary.trim());

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 md:place-items-center md:p-6">
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-lg md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Orçamento manual</p>
            <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">Adicionar orçamento</h2>
            <p className="mt-1 text-sm text-[#8A716D]">Informe valor, pagamento e vencimento. Será salvo em {category}.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAF0]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          <ManualField label="Fornecedor" value={vendor} onChange={setVendor} placeholder="Ex: Memória em Flor" />
          <ManualField label="Valor" value={priceLabel} onChange={(value) => setPriceLabel(formatCurrencyInput(value))} placeholder="R$ 0,00" inputMode="numeric" />
          <div className="grid gap-3 sm:grid-cols-2">
            <ManualSelect label="Forma de pagamento" value={method} onChange={setMethod} options={["Pix", "Boleto", "Cartão de crédito", "Cartão de débito", "Transferência", "Dinheiro"]} />
            <ManualField label="Vencimento" value={dueDate} onChange={setDueDate} placeholder="" type="date" />
          </div>
          <label className="block rounded-2xl bg-[#FFF8F4] p-4">
            <span className="text-xs font-bold text-[#8A716D]">Resumo do orçamento</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} placeholder="Inclui, prazos, observações..." className="mt-2 w-full resize-none bg-transparent text-sm font-semibold text-[#4B1528] outline-none" />
          </label>
          <label className="block rounded-2xl bg-[#FFF8F4] p-4">
            <span className="text-xs font-bold text-[#8A716D]">Observações financeiras</span>
            <textarea value={observations} onChange={(event) => setObservations(event.target.value)} rows={3} placeholder="Ex: entrada, desconto, condição especial..." className="mt-2 w-full resize-none bg-transparent text-sm font-semibold text-[#4B1528] outline-none" />
          </label>
        </div>
        <Button type="button" disabled={!canSave} onClick={() => onSave({ vendor, priceLabel, summary, method, dueDate, observations })} className="mt-5 h-12 w-full bg-[#D4537E] disabled:opacity-50">Salvar orçamento manual</Button>
      </section>
    </div>
  );
}

function ManualField({ label, value, placeholder, onChange, type = "text", inputMode }: { label: string; value: string; placeholder: string; onChange: (value: string) => void; type?: string; inputMode?: "numeric" }) {
  return (
    <label className="block rounded-2xl bg-[#FFF8F4] p-4">
      <span className="text-xs font-bold text-[#8A716D]">{label}</span>
      <input type={type} inputMode={inputMode} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-[#4B1528] outline-none" />
    </label>
  );
}

function ManualSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block rounded-2xl bg-[#FFF8F4] p-4">
      <span className="text-xs font-bold text-[#8A716D]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-[#4B1528] outline-none">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function CloseVendorPaymentModal({
  proposal,
  onClose,
  onConfirm
}: {
  proposal: QuoteProposal;
  onClose: () => void;
  onConfirm: (plan: PaymentPlan) => void;
}) {
  const initialTotal = proposal.price || numberFromCurrency(proposal.priceLabel);
  const [mode, setMode] = useState<PaymentPlanMode>("parcelado");
  const [totalValue, setTotalValue] = useState(String(initialTotal || ""));
  const [installments, setInstallments] = useState("2");
  const [singlePayment, setSinglePayment] = useState<PaymentPlanItem>({
    name: "Pagamento à vista",
    amount: initialTotal,
    dueDate: todayIso,
    method: "Pix",
    status: "pendente"
  });
  const [parcelPayments, setParcelPayments] = useState<PaymentPlanItem[]>(suggestInstallments(initialTotal));
  const total = numberFromCurrency(totalValue);
  const activePayments = mode === "avista" ? [{ ...singlePayment, amount: total || singlePayment.amount }] : parcelPayments;
  const paymentsTotal = activePayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalsMatch = Math.abs(paymentsTotal - total) <= 1;
  const canConfirm = Boolean(total > 0 && totalsMatch && activePayments.every((payment) => payment.amount > 0 && payment.dueDate && payment.method));

  function updateTotalValue(value: string) {
    setTotalValue(value);
    const nextTotal = numberFromCurrency(value);
    if (mode === "parcelado") {
      setParcelPayments(buildInstallments(nextTotal, Math.max(1, Number(installments) || 1)));
    }
  }

  function updateInstallments(value: string) {
    setInstallments(value);
    const count = Math.max(1, Number(value) || 1);
    setParcelPayments(buildInstallments(total || initialTotal, count));
  }

  function updatePayment(index: number, field: keyof PaymentPlanItem, value: string) {
    setParcelPayments((current) =>
      current.map((payment, paymentIndex) =>
        paymentIndex === index
          ? { ...payment, [field]: field === "amount" ? numberFromCurrency(value) : value }
          : payment
      )
    );
  }

  function updateSingle(field: keyof PaymentPlanItem, value: string) {
    setSinglePayment((current) => ({ ...current, [field]: field === "amount" ? numberFromCurrency(value) : value }));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 md:place-items-center md:p-6">
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-3xl md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4537E]">Fechar fornecedor</p>
            <h2 className="mt-1 font-serif text-3xl text-[#4B1528]">Como será o pagamento?</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F5B57]">
              {proposal.vendor} será criado em Fornecedores e as parcelas entrarão automaticamente no Financeiro.
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FBEAF0]" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="block rounded-2xl bg-[#FFF8F4] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Fornecedor</span>
            <strong className="mt-1 block text-[#4B1528]">{proposal.vendor}</strong>
            <span className="mt-1 block text-sm text-[#8A716D]">{proposal.category}</span>
          </label>
          <label className="block rounded-2xl bg-[#FFF8F4] p-4">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Valor total</span>
            <input value={totalValue} onChange={(event) => updateTotalValue(event.target.value)} className="mt-1 h-9 w-full bg-transparent text-lg font-bold text-[#4B1528] outline-none" />
          </label>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#FFF8F4] p-2">
          <button type="button" onClick={() => setMode("avista")} className={mode === "avista" ? "h-11 rounded-xl bg-[#D4537E] text-sm font-bold text-white" : "h-11 rounded-xl text-sm font-bold text-[#8A716D]"}>
            À vista
          </button>
          <button type="button" onClick={() => setMode("parcelado")} className={mode === "parcelado" ? "h-11 rounded-xl bg-[#D4537E] text-sm font-bold text-white" : "h-11 rounded-xl text-sm font-bold text-[#8A716D]"}>
            Parcelado
          </button>
        </div>

        {mode === "avista" ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <PaymentField label="Pago em" type="date" value={singlePayment.dueDate} onChange={(value) => updateSingle("dueDate", value)} />
            <PaymentSelect label="Forma de pagamento" value={singlePayment.method} onChange={(value) => updateSingle("method", value)} />
            <PaymentSelect label="Status" value={singlePayment.status} onChange={(value) => updateSingle("status", value)} options={["pago", "pendente"]} />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="grid gap-3 md:grid-cols-[1fr_180px]">
              <p className="rounded-2xl bg-[#FFF8F4] p-4 text-sm leading-6 text-[#6F5B57]">
                Sugestão automática: 30% de entrada hoje e o restante 7 dias antes do casamento. Você pode editar cada parcela.
              </p>
              <PaymentField label="Número de parcelas" value={installments} onChange={updateInstallments} />
            </div>
            {parcelPayments.map((payment, index) => (
              <div key={`${payment.name}-${index}`} className="grid gap-3 rounded-2xl bg-[#FFF8F4] p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
                <PaymentField label="Nome" value={payment.name} onChange={(value) => updatePayment(index, "name", value)} />
                <PaymentField label="Valor" value={String(payment.amount)} onChange={(value) => updatePayment(index, "amount", value)} />
                <PaymentField label="Vencimento" type="date" value={payment.dueDate} onChange={(value) => updatePayment(index, "dueDate", value)} />
                <PaymentSelect label="Forma" value={payment.method} onChange={(value) => updatePayment(index, "method", value)} />
                <PaymentSelect label="Status" value={payment.status} onChange={(value) => updatePayment(index, "status", value)} options={["pago", "pendente", "proximo"]} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-[#FBEAF0] p-4 text-sm font-semibold text-[#72243E]">
          Total das parcelas: {money(paymentsTotal)} {Math.abs(paymentsTotal - total) > 1 ? `· diferença de ${money(Math.abs(paymentsTotal - total))}` : "· tudo certo"}
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-2">
          <Button type="button" variant="outline" onClick={onClose} className="h-12 bg-white">Cancelar</Button>
          <Button type="button" disabled={!canConfirm} onClick={() => onConfirm({ mode, totalValue: total, payments: activePayments })} className="h-12 bg-[#D4537E] hover:bg-[#993556] disabled:opacity-50">
            Criar fornecedor e enviar ao Financeiro
          </Button>
        </div>
      </section>
    </div>
  );
}

function PaymentField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[#F0E1DD] bg-white px-3 text-sm font-semibold text-[#4B1528] outline-none" />
    </label>
  );
}

function PaymentSelect({ label, value, onChange, options = ["Pix", "Boleto", "Cartão de crédito", "Cartão de débito", "Transferência", "Dinheiro"] }: { label: string; value: string; onChange: (value: string) => void; options?: string[] }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[#F0E1DD] bg-white px-3 text-sm font-semibold text-[#4B1528] outline-none">
        {options.map((option) => <option key={option} value={option}>{paymentStatusLabel(option)}</option>)}
      </select>
    </label>
  );
}

function formatManualPrice(value: string) {
  const cleanValue = value.trim();
  if (!cleanValue) return "Valor a definir";
  if (cleanValue.toLowerCase().includes("r$")) return cleanValue;
  const numericValue = Number(cleanValue.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numericValue) || numericValue <= 0) return cleanValue;
  return money(numericValue);
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  const cents = Number(digits || "0");
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function numberFromCurrency(value: string) {
  return Number(String(value).replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}

function suggestInstallments(total: number): PaymentPlanItem[] {
  if (!total) return buildInstallments(0, 2);
  return [
    { name: "Entrada 30%", amount: Math.round(total * 0.3), dueDate: todayIso, method: "Pix", status: "pendente" },
    { name: "Restante", amount: total - Math.round(total * 0.3), dueDate: weekBeforeWeddingIso, method: "Pix", status: "pendente" }
  ];
}

function buildInstallments(total: number, count: number): PaymentPlanItem[] {
  if (count === 1) return [{ name: "Parcela única", amount: total, dueDate: todayIso, method: "Pix", status: "pendente" }];
  const firstAmount = Math.round(total * 0.3);
  const remaining = Math.max(total - firstAmount, 0);
  const regularAmount = count > 1 ? Math.floor(remaining / (count - 1)) : remaining;

  return Array.from({ length: count }, (_, index) => {
    if (index === 0) return { name: "Entrada 30%", amount: firstAmount, dueDate: todayIso, method: "Pix", status: "pendente" };
    const isLast = index === count - 1;
    const amount = isLast ? remaining - regularAmount * (count - 2) : regularAmount;
    return {
      name: isLast ? "Parcela final" : `Parcela ${index + 1}`,
      amount,
      dueDate: isLast ? weekBeforeWeddingIso : addMonths(todayIso, index),
      method: "Pix",
      status: "pendente"
    };
  });
}

function addMonths(date: string, months: number) {
  const parsed = new Date(`${date}T12:00:00`);
  parsed.setMonth(parsed.getMonth() + months);
  return parsed.toISOString().slice(0, 10);
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
}

function paymentStatusLabel(value: string) {
  const labels: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    proximo: "Próximo"
  };
  return labels[value] ?? value;
}

function normalizeVendorCategory(category: string): VendorCategory {
  const normalized = category.toLowerCase();
  if (normalized.includes("música") || normalized.includes("musica") || normalized.includes("dj")) return "Música/DJ" as VendorCategory;
  if (normalized.includes("decor")) return "Decoração" as VendorCategory;
  if (normalized.includes("espa")) return "Espaço" as VendorCategory;
  if (normalized.includes("foto")) return "Fotografia";
  if (normalized.includes("film")) return "Filmagem";
  if (normalized.includes("buffet")) return "Buffet";
  if (normalized.includes("cerimonial")) return "Cerimonial";
  if (normalized.includes("vestido")) return "Vestido";
  if (normalized.includes("beleza")) return "Beleza";
  if (normalized.includes("doce") || normalized.includes("bolo")) return "Doces/Bolo";
  if (normalized.includes("bar")) return "Bar";
  if (normalized.includes("convite") || normalized.includes("papelaria")) return "Convites";
  if (normalized.includes("transporte")) return "Transporte";
  return "Outros";
}
