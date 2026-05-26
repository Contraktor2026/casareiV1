"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  CakeSlice,
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  MessageCircle,
  Music,
  Palette,
  Plus,
  Search,
  Scissors,
  Sparkles,
  Store,
  Trash2,
  Utensils,
  UserRound,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { deleteStoredVendor, getStoredPendingCategories, getStoredVendors, saveStoredPendingCategories, upsertStoredVendor } from "@/lib/client/vendors-store";
import type { QuoteProposal } from "@/types/quotes";
import type { Vendor, VendorStatus } from "@/types/vendors";
import { SofiaQuotePanel } from "./sofia-quote-panel";
import { VendorFormModal } from "./vendor-form-modal";

const tabs = ["Já fechados", "Ainda cotando", "Faltam contratar", "Todos"] as const;
type VendorsTab = (typeof tabs)[number];

const initialPendingCategories = ["Musica", "Celebrante", "Beleza", "Cerimonial", "Transporte", "Doces"];

const categorySuggestions: Record<string, Array<{ name: string; role: string; image: string }>> = {
  Musica: [
    { name: "Banda Elegance", role: "Musica ao vivo", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=160&h=160&fit=crop" },
    { name: "DJ Lucas Ferraz", role: "DJ", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop" },
    { name: "Quarteto Harmonia", role: "Musica classica", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=160&h=160&fit=crop" }
  ],
  Celebrante: [
    { name: "Celebrante Paula", role: "Cerimonia afetiva", image: "https://images.unsplash.com/photo-1529634892229-7f4e0f6d8d56?w=160&h=160&fit=crop" },
    { name: "Ritos da Serra", role: "Celebrante", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=160&h=160&fit=crop" }
  ],
  Beleza: [
    { name: "Bella Make Beauty", role: "Dia da noiva", image: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=160&h=160&fit=crop" }
  ]
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [proposals, setProposals] = useState<QuoteProposal[]>([]);
  const [activeTab, setActiveTab] = useState<VendorsTab>("Já fechados");
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingDetail, setPendingDetail] = useState<string | null>(null);
  const [newPendingCategory, setNewPendingCategory] = useState("");
  const [showPendingCategoryForm, setShowPendingCategoryForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorFormStatus, setVendorFormStatus] = useState<VendorStatus>("Cotando");
  const [vendorFormCategory, setVendorFormCategory] = useState<Vendor["category"]>("Fotografia");
  const [quoteDetailCategory, setQuoteDetailCategory] = useState<string | null>(null);
  const [sofiaCategory, setSofiaCategory] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState({ Fechados: true, Cotando: true, Pendentes: true, Cancelados: false });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setVendors(getStoredVendors());
    const storedCategories = getStoredPendingCategories();
    setPendingCategories(storedCategories.length ? storedCategories : initialPendingCategories);
  }, []);

  const closedVendors = useMemo(
    () => vendors.filter((vendor) => ["Fechado", "Contrato assinado", "Pagamento pendente", "Pago", "Finalizado"].includes(vendor.status)),
    [vendors]
  );
  const attentionVendors = useMemo(
    () =>
      vendors
        .filter((vendor) => {
          const hasOpenContract = ["Fechado", "Contrato pendente", "Pagamento pendente"].includes(vendor.status) && !vendor.contract.signed;
          const hasNextPayment = vendor.nextPayment !== "A definir" && vendor.nextPayment !== "Tudo pago";
          const needsReply = ["Cotando", "Em negociação", "Aguardando resposta"].includes(vendor.status);
          return hasOpenContract || hasNextPayment || needsReply;
        })
        .slice(0, 5),
    [vendors]
  );
  const quoteCategories = useMemo(() => Array.from(new Set(proposals.map((proposal) => proposal.category))), [proposals]);
  const sofiaProposals = sofiaCategory ? proposals.filter((proposal) => proposal.category === sofiaCategory) : [];
  const allVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return vendors.filter((vendor) => {
      const matchesQuery = !normalizedQuery || `${vendor.name} ${vendor.category}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        (statusFilters.Fechados && ["Fechado", "Contrato assinado", "Pagamento pendente", "Pago", "Finalizado"].includes(vendor.status)) ||
        (statusFilters.Cotando && ["Cotando", "Em negociacao", "Aguardando resposta"].includes(vendor.status)) ||
        (statusFilters.Pendentes && ["Contrato pendente"].includes(vendor.status)) ||
        (statusFilters.Cancelados && vendor.status === "Descartado");
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilters, vendors]);

  function addVendor(vendor: Vendor, addAnother?: boolean) {
    setVendors((current) => [vendor, ...current]);
    upsertStoredVendor(vendor);
    setMessage("Fornecedor salvo.");
    if (!addAnother) setShowVendorForm(false);
  }

  function openVendorForm(status: VendorStatus, category: Vendor["category"] = "Fotografia") {
    setVendorFormStatus(status);
    setVendorFormCategory(category);
    setShowVendorForm(true);
  }

  function addPendingCategory() {
    const cleanName = newPendingCategory.trim();
    if (!cleanName) return;
    if (pendingCategories.some((category) => category.toLowerCase() === cleanName.toLowerCase())) {
      setMessage("Essa categoria ja esta na lista.");
      setNewPendingCategory("");
      return;
    }
    const next = [cleanName, ...pendingCategories];
    setPendingCategories(next);
    saveStoredPendingCategories(next);
    setNewPendingCategory("");
    setShowPendingCategoryForm(false);
    setMessage(`${cleanName} entrou em pendentes.`);
  }

  function deletePendingCategory(category: string) {
    const canDelete = confirmPermanentDelete({ itemName: `"${category}"`, context: "Essa categoria sairá da lista de fornecedores pendentes." });
    if (!canDelete) return;
    const next = pendingCategories.filter((item) => item !== category);
    setPendingCategories(next);
    saveStoredPendingCategories(next);
    if (pendingDetail === category) setPendingDetail(null);
    setMessage(`${category} removido dos pendentes.`);
  }

  function deleteVendor(id: string) {
    const vendor = vendors.find((v) => v.id === id);
    const canDelete = confirmPermanentDelete({ itemName: vendor?.name ?? "este fornecedor", context: "Ele será removido da lista de fornecedores." });
    if (!canDelete) return;
    deleteStoredVendor(id);
    setVendors((current) => current.filter((v) => v.id !== id));
    setMessage("Fornecedor removido.");
  }

  function goToQuotes() {
    router.push("/app/cotacoes");
  }

  function toggleFavorite(id: string) {
    setProposals((current) => current.map((proposal) => (proposal.id === id ? { ...proposal, isFavorite: !proposal.isFavorite } : proposal)));
    setMessage("Favorito atualizado.");
  }

  function closeVendorFromProposal(proposal: QuoteProposal) {
    const vendor: Vendor = {
      id: `fechado-${proposal.id}-${Date.now()}`,
      name: proposal.vendor,
      category: normalizeVendorCategory(proposal.category),
      status: "Fechado",
      responsible: proposal.vendor.split(" ")[0],
      whatsapp: "5511999999999",
      phone: "(11) 99999-9999",
      email: "",
      instagram: "",
      site: "",
      city: "",
      address: "",
      serviceHours: "",
      totalValue: proposal.price,
      paidValue: 0,
      nextPayment: "A definir",
      contract: { sent: false, signed: false, notes: "Fornecedor fechado, mas contrato ainda nao assinado.", clauses: [] },
      included: proposal.includes,
      nextMilestone: "Assinar contrato e registrar primeiro pagamento",
      importantNote: proposal.sofiaNote,
      payments: [],
      deliveries: [],
      notes: proposal.shortSummary,
      ceremonialNote: `${proposal.category}: ${proposal.shortSummary}`,
      history: [{ label: "fornecedor fechado pela Sofia", date: "hoje" }],
      sourceQuoteId: proposal.id,
      budgetCategory: proposal.category
    };
    addVendor(vendor);
    setSofiaCategory(null);
    setActiveTab("Já fechados");
  }

  if (pendingDetail) {
    return (
      <div className="space-y-4 pb-4">
        <button
          type="button"
          onClick={() => setPendingDetail(null)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#D96C8A]"
        >
          <ChevronLeft className="h-4 w-4" />
          Fornecedores
        </button>
        <PendingDetail
          category={pendingDetail}
          onAdd={() => openVendorForm("Cotando", normalizeVendorCategory(pendingDetail))}
          onSofia={() => {
            setSofiaCategory(pendingDetail);
            setPendingDetail(null);
          }}
        />
        {renderModals()}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <TabBar active={activeTab} onChange={setActiveTab} />
      {message ? <p className="rounded-2xl bg-[#EEF3EA] px-4 py-3 text-xs font-semibold text-[#4B2E2B]">{message}</p> : null}
      {activeTab === "Já fechados" ? (
        <ClosedTab
          vendors={closedVendors}
          attentionVendors={attentionVendors}
          pendingCount={pendingCategories.length}
          onInvite={() => openVendorForm("Fechado")}
          onGoPending={() => setActiveTab("Faltam contratar")}
        />
      ) : null}
      {activeTab === "Ainda cotando" ? (
        <QuotesTab
          categories={quoteCategories}
          proposals={proposals}
          onCompare={setSofiaCategory}
          selectedCategory={quoteDetailCategory}
          onOpenCategory={setQuoteDetailCategory}
          onCloseCategory={() => setQuoteDetailCategory(null)}
          onAddQuote={goToQuotes}
          onPending={setPendingDetail}
        />
      ) : null}
      {activeTab === "Faltam contratar" ? (
        <PendingTab
          categories={pendingCategories}
          onOpen={setPendingDetail}
          onAddCategory={() => setShowPendingCategoryForm(true)}
          onDeleteCategory={deletePendingCategory}
        />
      ) : null}
      {activeTab === "Todos" ? (
        <AllTab
          vendors={allVendors}
          query={query}
          onQuery={setQuery}
          onFilter={() => setShowFilter(true)}
          onDelete={deleteVendor}
        />
      ) : null}
      {renderModals()}
    </div>
  );

  function renderModals() {
    return (
      <>
        <SofiaQuotePanel
          open={Boolean(sofiaCategory)}
          category={sofiaCategory ?? ""}
          proposals={sofiaProposals.length ? sofiaProposals : proposals.filter((proposal) => proposal.category === "Fotografia")}
          onClose={() => setSofiaCategory(null)}
          onFavorite={toggleFavorite}
          onShowDetails={() => setActiveTab("Ainda cotando")}
          onCloseVendor={closeVendorFromProposal}
        />
        <VendorFormModal
          open={showVendorForm}
          onClose={() => setShowVendorForm(false)}
          onSave={addVendor}
          initialStatus={vendorFormStatus}
          initialCategory={vendorFormCategory}
          eyebrow={vendorFormStatus === "Fechado" ? "Fornecedor ja fechado" : "Novo fornecedor"}
          title={vendorFormStatus === "Fechado" ? "Incluir fornecedor fechado" : "Adicionar fornecedor"}
        />
        {showPendingCategoryForm ? (
          <Sheet title="Nova categoria" onClose={() => setShowPendingCategoryForm(false)}>
            <input
              value={newPendingCategory}
              onChange={(event) => setNewPendingCategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addPendingCategory();
              }}
              autoFocus
              placeholder="Ex: Bar, papelaria, seguranca..."
              className="mt-4 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-[#F8F4F1] px-4 text-sm text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
            />
            <Button type="button" onClick={addPendingCategory} className="mt-4 w-full bg-[#D96C8A] hover:bg-[#C85D7B]">Adicionar categoria</Button>
          </Sheet>
        ) : null}
        {showFilter ? (
          <Sheet title="Filtrar fornecedores" onClose={() => setShowFilter(false)}>
            <div className="mt-5 space-y-4">
              {Object.entries(statusFilters).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between rounded-2xl bg-[#F8F4F1] p-4 text-sm font-semibold text-[#4B2E2B]">
                  {filterLabel(key)}
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(event) => setStatusFilters((current) => ({ ...current, [key]: event.target.checked }))}
                    className="h-5 w-5 accent-[#D96C8A]"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => setStatusFilters({ Fechados: true, Cotando: true, Pendentes: true, Cancelados: false })}>Limpar</Button>
              <Button type="button" onClick={() => setShowFilter(false)} className="bg-[#D96C8A] hover:bg-[#C85D7B]">Aplicar</Button>
            </div>
          </Sheet>
        ) : null}
      </>
    );
  }
}


function CategoryMark({ category, compact = false, large = false }: { category: string; compact?: boolean; large?: boolean }) {
  const normalized = category.toLowerCase();
  const size = large ? "h-16 w-16 rounded-full" : compact ? "h-11 w-11 rounded-2xl" : "h-12 w-12 rounded-2xl";
  const iconSize = large ? "h-6 w-6" : "h-5 w-5";

  if (normalized.includes("foto")) {
    return <span className={`grid shrink-0 place-items-center bg-[#EEF1F4] text-[#6E7F91] ${size}`}><Camera className={iconSize} /></span>;
  }
  if (normalized.includes("buffet") || normalized.includes("bar")) {
    return <span className={`grid shrink-0 place-items-center bg-[#F7EEDC] text-[#9A6A2F] ${size}`}><Utensils className={iconSize} /></span>;
  }
  if (normalized.includes("decor") || normalized.includes("flores")) {
    return <span className={`grid shrink-0 place-items-center bg-[#F8E7EC] text-[#D96C8A] ${size}`}><Palette className={iconSize} /></span>;
  }
  if (normalized.includes("cerimonial") || normalized.includes("celebrante")) {
    return <span className={`grid shrink-0 place-items-center bg-[#EEF3EA] text-[#5F7752] ${size}`}><UserRound className={iconSize} /></span>;
  }
  if (normalized.includes("beleza")) {
    return <span className={`grid shrink-0 place-items-center bg-[#FBEEE8] text-[#B96F52] ${size}`}><Scissors className={iconSize} /></span>;
  }
  if (normalized.includes("música") || normalized.includes("musica") || normalized.includes("dj")) {
    return <span className={`grid shrink-0 place-items-center bg-[#EEF1F4] text-[#6E7F91] ${size}`}><Music className={iconSize} /></span>;
  }
  if (normalized.includes("doce") || normalized.includes("bolo")) {
    return <span className={`grid shrink-0 place-items-center bg-[#F8E7EC] text-[#D96C8A] ${size}`}><CakeSlice className={iconSize} /></span>;
  }

  return <span className={`grid shrink-0 place-items-center bg-[#F8F4F1] text-[#8A716D] ${size}`}><Store className={iconSize} /></span>;
}

function DesktopVendorCard({ vendor }: { vendor: Vendor }) {
  const pendingAmount = Math.max(vendor.totalValue - vendor.paidValue, 0);
  const paidPercent = vendor.totalValue ? Math.min(100, Math.round((vendor.paidValue / vendor.totalValue) * 100)) : 0;

  return (
    <article className="group overflow-hidden rounded-[22px] bg-[#FFFDFC] shadow-[0_14px_38px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] transition hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(75,46,43,0.10)]">
      <div className={vendor.contract.signed ? "h-px bg-[#9CAF88]/70" : "h-px bg-[#D28B6E]/70"} />
      <div className="grid gap-4 p-4 md:grid-cols-[minmax(240px,1fr)_minmax(300px,1.15fr)_auto] md:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <CategoryMark category={vendor.category} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/app/fornecedores/${vendor.id}`} className="truncate font-serif text-xl leading-tight text-[#4B2E2B]">{vendor.name}</Link>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${vendor.contract.signed ? statusTone("Contrato assinado") : statusTone("Contrato pendente")}`}>
                {vendor.contract.signed ? "Assinado" : "Contrato pendente"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#8A716D]">{vendor.category}</p>
            <p className="mt-2 line-clamp-1 text-xs leading-5 text-[#8A716D]">{vendor.nextMilestone}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8F4F1] p-3">
          <div className="grid gap-3 md:grid-cols-3">
            <FinanceMetric label="Total" value={money(vendor.totalValue)} tone="total" />
            <FinanceMetric label="Pago" value={money(vendor.paidValue)} tone="paid" />
            <FinanceMetric label="Pendente" value={money(pendingAmount)} tone="next" />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8A716D]">
              <span>Proximo pagamento</span>
              <span className="text-[#B96F52]">{vendor.nextPayment}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDE4DF]">
              <div className="h-full rounded-full bg-[#9CAF88]" style={{ width: `${paidPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button asChild variant="outline" size="sm" className="border-[#EEE6E1] bg-[#FFFDFC] text-[#4B2E2B]">
            <Link href={`/app/fornecedores/${vendor.id}`}>Detalhes</Link>
          </Button>
          <Button asChild size="icon" className="h-9 w-9 rounded-full bg-[#25D366] hover:bg-[#1DB954]">
            <a href={`https://wa.me/${vendor.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

function DesktopVendorLine({ vendor }: { vendor: Vendor }) {
  return (
    <div className="flex items-center gap-4 border-b border-[#EEE6E1] p-4 last:border-b-0 hover:bg-[#F8F4F1]">
      <CategoryMark category={vendor.category} compact />
      <Link href={`/app/fornecedores/${vendor.id}`} className="min-w-0 flex-1">
        <p className="font-bold text-[#4B2E2B]">{vendor.name}</p>
        <p className="text-sm text-[#8A716D]">{vendor.category}</p>
      </Link>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(vendor.status)}`}>{statusLabel(vendor.status)}</span>
      <a href={`https://wa.me/${vendor.whatsapp}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white hover:bg-[#1DB954]" aria-label="WhatsApp">
        <MessageCircle className="h-4 w-4" />
      </a>
      <Link href={`/app/fornecedores/${vendor.id}`} aria-label="Abrir detalhes">
        <ChevronRight className="h-4 w-4 text-[#8A716D]" />
      </Link>
    </div>
  );
}

function DesktopQuoteCard({
  category,
  count,
  onOpen,
  onCompare,
  onAddQuote
}: {
  category: string;
  count: number;
  onOpen: () => void;
  onCompare: () => void;
  onAddQuote: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[22px] bg-[#FFFDFC] shadow-[0_14px_38px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] transition hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(75,46,43,0.10)]">
      <div className="h-px bg-[#A8B7C7]/70" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <CategoryMark category={category} />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A716D]">Orçando</p>
              <button type="button" onClick={onOpen} className="block max-w-full text-left">
                <h3 className="truncate font-serif text-2xl leading-tight text-[#4B2E2B] hover:text-[#D96C8A]">{category}</h3>
              </button>
              <p className="mt-1 text-sm text-[#8A716D]">{count} proposta{count === 1 ? "" : "s"} recebida{count === 1 ? "" : "s"}</p>
            </div>
          </div>
          <span className="rounded-full bg-[#EEF1F4] px-3 py-1 text-xs font-bold text-[#6E7F91]">{count}</span>
        </div>
        <div className="mt-4 rounded-2xl bg-[#F8F4F1] p-3">
          <p className="text-xs leading-5 text-[#8A716D]">A Sofia compara preco, entrega, estilo e pontos de atencao sem planilha.</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={onOpen} className="border-[#EEE6E1] bg-[#FFFDFC]">Ver orçamentos</Button>
          <Button type="button" variant="outline" onClick={onAddQuote} className="border-[#F3C7D2] bg-[#FFFDFC] text-[#D96C8A]">
            <Plus className="h-4 w-4" />
            Incluir orçamento
          </Button>
        </div>
        <Button type="button" onClick={onCompare} className="mt-2 w-full bg-[#D96C8A] hover:bg-[#C85D7B]">
          <Sparkles className="h-4 w-4" />
          Comparar com Sofia
        </Button>
      </div>
    </article>
  );
}

function QuoteCategoryDetail({
  category,
  proposals,
  onBack,
  onAddQuote,
  onCompare
}: {
  category: string;
  proposals: QuoteProposal[];
  onBack: () => void;
  onAddQuote: () => void;
  onCompare: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-[#8A716D] hover:text-[#4B2E2B]">
            <ChevronLeft className="h-4 w-4" />
            Voltar para categorias
          </button>
          <h2 className="font-serif text-4xl text-[#4B2E2B]">{category}</h2>
          <p className="mt-1 text-sm text-[#8A716D]">{proposals.length} orçamento{proposals.length === 1 ? "" : "s"} recebido{proposals.length === 1 ? "" : "s"} para comparar com calma.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onAddQuote} className="border-[#F3C7D2] bg-[#FFFDFC] text-[#D96C8A]">
            <Plus className="h-4 w-4" />
            Incluir orçamento
          </Button>
          <Button type="button" onClick={onCompare} className="bg-[#D96C8A] hover:bg-[#C85D7B]">
            <Sparkles className="h-4 w-4" />
            Comparar com Sofia
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {proposals.length ? proposals.map((proposal) => (
          <article key={proposal.id} className="rounded-[22px] bg-[#FFFDFC] p-4 shadow-[0_14px_38px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <CategoryMark category={proposal.category} compact />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[#4B2E2B]">{proposal.vendor}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#8A716D]">{proposal.shortSummary}</p>
                </div>
              </div>
              <div className="shrink-0 rounded-2xl bg-[#F7EEDC] px-4 py-3 text-right ring-1 ring-[#E9D6AD]">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A716D]">Valor</p>
                <p className="mt-1 text-sm font-bold text-[#7B5C2E]">{proposal.price ? money(proposal.price) : proposal.priceLabel}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {proposal.includes.slice(0, 4).map((item) => (
                <span key={item} className="rounded-full bg-[#EEF3EA] px-3 py-1 text-xs font-semibold text-[#5F7752]">{item}</span>
              ))}
            </div>
            {proposal.attentionPoints.length ? (
              <p className="mt-3 text-xs font-semibold text-[#B96F52]">Atenção: {proposal.attentionPoints.slice(0, 2).join(", ")}</p>
            ) : null}
          </article>
        )) : (
          <div className="rounded-[22px] bg-[#FFFDFC] p-6 text-sm text-[#8A716D] shadow-[0_14px_38px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            Nenhum orçamento cadastrado nessa categoria ainda.
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopPendingCard({ category, onOpen, onAdd, onDelete }: { category: string; onOpen: () => void; onAdd: () => void; onDelete: () => void }) {
  return (
    <article className="group overflow-hidden rounded-[22px] bg-[#FFFDFC] shadow-[0_14px_38px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] transition hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(75,46,43,0.10)]">
      <div className="h-px bg-[#D28B6E]/70" />
      <div className="p-4">
        <div className="flex gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FBEEE8] text-[#B96F52]">
            {category === "Musica" ? <Music className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A716D]">Ainda falta contratar</p>
            <h3 className="truncate font-serif text-2xl leading-tight text-[#4B2E2B]">{category}</h3>
            <p className="mt-1 text-sm leading-5 text-[#8A716D]">Veja sugestoes ou adicione um fornecedor para orcar.</p>
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#B96F52] transition hover:bg-[#FBEEE8]"
            aria-label={`Excluir ${category}`}
            title="Excluir categoria"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={onOpen} className="border-[#EEE6E1] bg-[#FFFDFC]">Encontrar fornecedores</Button>
          <Button type="button" onClick={onAdd} className="bg-[#D96C8A] hover:bg-[#C85D7B]">Adicionar</Button>
        </div>
      </div>
    </article>
  );
}

function DesktopCarePanel({ contractPending, upcomingPayments }: { contractPending: Vendor[]; upcomingPayments: Vendor[] }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
        <div className="flex items-center gap-2 text-[#D96C8A]">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-bold">Sofia</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#4B2E2B]">O mais importante agora e assinar contratos pendentes e manter os proximos pagamentos visiveis.</p>
      </div>
      <PanelList title="Contratos pendentes" vendors={contractPending} empty="Tudo assinado por aqui." />
      <PanelList title="Proximos pagamentos" vendors={upcomingPayments} empty="Nenhum pagamento proximo." payment />
    </aside>
  );
}

function DesktopSofiaPanel({ onAddBudget }: { onAddBudget: () => void }) {
  return (
    <aside className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-center gap-2 text-[#D96C8A]">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm font-bold">Sofia ajuda a decidir</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#4B2E2B]">Compare entrega, preco, estilo e pontos de atencao sem abrir uma planilha fria.</p>
      <Button type="button" onClick={onAddBudget} className="mt-5 w-full bg-[#D96C8A] hover:bg-[#C85D7B]">
        <Plus className="h-4 w-4" />
        Adicionar orçamento
      </Button>
    </aside>
  );
}

function DesktopAttentionPanel({ vendors, pendingCount, onPending }: { vendors: Vendor[]; pendingCount: number; onPending: () => void }) {
  return (
    <section className="rounded-[30px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B96F52]">Precisa de atenção</p>
          <h2 className="mt-1 font-serif text-3xl text-[#4B2E2B]">Resolva primeiro</h2>
          <p className="mt-1 text-sm text-[#8A716D]">Contratos pendentes, próximos pagamentos e fornecedores que ainda precisam de retorno.</p>
        </div>
        <Button type="button" variant="outline" onClick={onPending} className="border-[#F3C7D2] bg-[#FFFDFC] text-[#D96C8A]">
          Ver pendências ({pendingCount})
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {vendors.length ? vendors.slice(0, 3).map((vendor) => <AttentionCard key={vendor.id} vendor={vendor} />) : (
          <p className="rounded-2xl bg-[#EEF3EA] p-4 text-sm font-semibold text-[#5F7752]">Tudo certo por aqui.</p>
        )}
      </div>
    </section>
  );
}

function AttentionBlock({ vendors, pendingCount, onGoPending }: { vendors: Vendor[]; pendingCount: number; onGoPending: () => void }) {
  return (
    <section className="mt-4 rounded-3xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B96F52]">Precisa de atenção</p>
          <p className="mt-1 text-sm text-[#8A716D]">O que resolver antes de seguir.</p>
        </div>
        <button type="button" onClick={onGoPending} className="rounded-full bg-[#F8E7EC] px-3 py-2 text-xs font-bold text-[#D96C8A]">
          Pendências {pendingCount}
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {vendors.length ? vendors.slice(0, 3).map((vendor) => <AttentionCard key={vendor.id} vendor={vendor} compact />) : (
          <p className="rounded-2xl bg-[#EEF3EA] p-3 text-sm font-semibold text-[#5F7752]">Tudo certo por aqui.</p>
        )}
      </div>
    </section>
  );
}

function AttentionCard({ vendor, compact = false }: { vendor: Vendor; compact?: boolean }) {
  const reason = !vendor.contract.signed && ["Fechado", "Contrato pendente", "Pagamento pendente"].includes(vendor.status)
    ? "Contrato pendente"
    : vendor.nextPayment !== "A definir" && vendor.nextPayment !== "Tudo pago"
      ? `Próx. pagamento: ${vendor.nextPayment}`
      : "Aguardando resposta";

  return (
    <Link href={`/app/fornecedores/${vendor.id}`} className={compact ? "flex items-center gap-3 rounded-2xl bg-[#FBEEE8] p-3" : "flex items-center gap-3 rounded-2xl bg-[#FBEEE8] p-4"}>
      <CategoryMark category={vendor.category} compact />
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-sm text-[#4B2E2B]">{vendor.name}</strong>
        <span className="mt-0.5 block truncate text-xs font-semibold text-[#B96F52]">{reason}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-[#B96F52]" />
    </Link>
  );
}

function PanelList({ title, vendors, empty, payment = false }: { title: string; vendors: Vendor[]; empty: string; payment?: boolean }) {
  return (
    <div className="rounded-[24px] bg-[#FFFDFC] p-4 shadow-[0_12px_36px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
      <h3 className="font-serif text-xl text-[#4B2E2B]">{title}</h3>
      <div className="mt-3 space-y-2">
        {vendors.length ? vendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={`/app/fornecedores/${vendor.id}`}
            className={payment ? "block rounded-2xl bg-[#FBEEE8] px-3 py-2 ring-1 ring-[#F3D8CC]" : "block rounded-2xl bg-[#F8F4F1] px-3 py-2"}
          >
            <p className="text-sm font-bold text-[#4B2E2B]">{vendor.name}</p>
            <p className={payment ? "mt-1 text-xs font-semibold text-[#B96F52]" : "mt-1 text-xs text-[#8A716D]"}>
              {payment ? vendor.nextPayment : "Contrato ainda nao assinado"}
            </p>
          </Link>
        )) : <p className="text-sm text-[#8A716D]">{empty}</p>}
      </div>
    </div>
  );
}

function FinanceMetric({ label, value, tone }: { label: string; value: string; tone: "total" | "paid" | "next" }) {
  const text = {
    total: "text-[#7B5C2E]",
    paid: "text-[#5F7752]",
    next: "text-[#B96F52]"
  }[tone];

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#8A716D]">{label}</p>
      <p className={`mt-0.5 text-sm font-bold leading-5 ${text}`}>{value}</p>
    </div>
  );
}

function TabBar({ active, onChange }: { active: VendorsTab; onChange: (tab: VendorsTab) => void }) {
  return (
    <nav className="mb-4 grid grid-cols-4 border-b border-[#EEE6E1] text-xs font-semibold text-[#4B2E2B]">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={active === tab ? "border-b-2 border-[#D96C8A] px-2 py-3 text-[#D96C8A]" : "px-2 py-3"}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

function ClosedTab({
  vendors,
  onInvite
}: {
  vendors: Vendor[];
  attentionVendors: Vendor[];
  pendingCount: number;
  onInvite: () => void;
  onGoPending: () => void;
}) {
  return (
    <section>
      <h2 className="text-base font-bold text-[#4B2E2B]">Fornecedores fechados</h2>
      <p className="text-xs text-[#8A716D]">{vendors.length + 1} contratados</p>
      <div className="mt-3 space-y-3">
        <CasareiAppCard />
        {vendors.map((vendor) => (
          <VendorRow key={vendor.id} vendor={vendor} />
        ))}
      </div>
      <Button type="button" onClick={onInvite} className="mt-4 h-12 w-full rounded-xl bg-[#D96C8A] hover:bg-[#C85D7B]">
        <Plus className="h-4 w-4" />
        Convidar fornecedor
      </Button>
    </section>
  );
}

function CasareiAppCard() {
  return (
    <article className="rounded-2xl bg-[#FFFDFC] p-3 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-center gap-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]">
          <Heart className="h-6 w-6" fill="currentColor" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#4B2E2B]">casarei</p>
          <p className="text-xs text-[#8A716D]">App de planejamento</p>
          <span className="mt-1 inline-flex rounded-full bg-[#EEF3EA] px-2 py-1 text-[10px] font-semibold text-[#5F7752]">
            Ativo
          </span>
          <p className="mt-2 inline-flex rounded-full bg-[#F8F4F1] px-2 py-1 text-[10px] font-semibold text-[#4B2E2B]">
            Plano Gratuito
          </p>
          <p className="mt-2 inline-flex rounded-full bg-[#F7EEDC] px-2 py-1 text-xs font-bold text-[#7B5C2E]">
            R$ 0 / mês
          </p>
        </div>
      </div>
    </article>
  );
}

function VendorRow({ vendor }: { vendor: Vendor }) {
  const pendingAmount = Math.max(vendor.totalValue - vendor.paidValue, 0);
  return (
    <article className="rounded-2xl bg-[#FFFDFC] p-3 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <div className="flex items-center gap-3">
        <CategoryMark category={vendor.category} large />
        <Link href={`/app/fornecedores/${vendor.id}`} className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#4B2E2B]">{vendor.name}</p>
          <p className="text-xs text-[#8A716D]">{vendor.category}</p>
          <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${vendor.contract.signed ? statusTone("Contrato assinado") : statusTone("Contrato pendente")}`}>
            {vendor.contract.signed ? "Contrato assinado" : "Contrato pendente"}
          </span>
          <p className="mt-2 inline-flex rounded-full bg-[#FBEEE8] px-2 py-1 text-[10px] font-semibold text-[#B96F52]">
            Prox. pagamento: {vendor.nextPayment}
          </p>
          <p className="mt-2 inline-flex rounded-full bg-[#F8F4F1] px-2 py-1 text-[10px] font-semibold text-[#4B2E2B]">
            Pendente: {money(pendingAmount)}
          </p>
          <p className="mt-2 inline-flex rounded-full bg-[#F7EEDC] px-2 py-1 text-xs font-bold text-[#7B5C2E]">
            {money(vendor.totalValue)}
          </p>
        </Link>
        <div className="grid gap-3">
          <ChevronRight className="h-4 w-4 text-[#D96C8A]" />
          <a href={`https://wa.me/${vendor.whatsapp}`} target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-white" aria-label="WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function QuotesTab({
  categories,
  proposals,
  selectedCategory,
  onOpenCategory,
  onCloseCategory,
  onCompare,
  onAddQuote,
  onPending
}: {
  categories: string[];
  proposals: QuoteProposal[];
  selectedCategory: string | null;
  onOpenCategory: (category: string) => void;
  onCloseCategory: () => void;
  onCompare: (category: string) => void;
  onAddQuote: (category?: string | null) => void;
  onPending: (category: string) => void;
}) {
  if (selectedCategory) {
    const categoryProposals = proposals.filter((proposal) => proposal.category === selectedCategory);
    return (
      <section>
        <button type="button" onClick={onCloseCategory} className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-[#8A716D]">
          <ChevronLeft className="h-4 w-4" />
          Categorias
        </button>
        <div className="mb-4 rounded-3xl bg-[#FFFDFC] p-5 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <div className="flex items-center gap-3">
            <CategoryMark category={selectedCategory} compact />
            <div>
              <h2 className="font-serif text-3xl leading-tight text-[#4B2E2B]">{selectedCategory}</h2>
              <p className="mt-1 text-xs text-[#8A716D]">{categoryProposals.length} orçamento{categoryProposals.length === 1 ? "" : "s"} recebido{categoryProposals.length === 1 ? "" : "s"}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <Button type="button" onClick={() => onCompare(selectedCategory)} className="h-11 rounded-xl bg-[#D96C8A] hover:bg-[#C85D7B]">
              <Sparkles className="h-4 w-4" />
              Comparar com Sofia
            </Button>
            <Button type="button" variant="outline" onClick={() => onAddQuote(selectedCategory)} className="h-11 rounded-xl border-[#F3C7D2] text-[#D96C8A]">
              <Plus className="h-4 w-4" />
              Incluir orçamento
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {categoryProposals.map((proposal) => (
            <article key={proposal.id} className="rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#4B2E2B]">{proposal.vendor}</p>
                  <p className="mt-1 text-xs leading-5 text-[#8A716D]">{proposal.shortSummary}</p>
                </div>
                <p className="shrink-0 rounded-xl bg-[#F7EEDC] px-3 py-2 text-xs font-bold text-[#7B5C2E]">{proposal.price ? money(proposal.price) : proposal.priceLabel}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <HeroCard title="Voce esta orçando por categoria." text="Compare propostas e peca ajuda para a Sofia decidir." avatar />
      <h2 className="mt-5 text-base font-bold text-[#4B2E2B]">Categorias em orçamento</h2>
      <div className="mt-3 space-y-3">
        {categories.map((category) => {
          const count = proposals.filter((proposal) => proposal.category === category).length;
          return (
            <article key={category} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
              <CategoryMark category={category} compact />
              <button type="button" onClick={() => onOpenCategory(category)} className="min-w-0 flex-1 text-left">
                <p className="text-sm font-bold text-[#4B2E2B]">{category}</p>
                <p className="text-xs text-[#8A716D]">{count} proposta{count === 1 ? "" : "s"} recebida{count === 1 ? "" : "s"}</p>
              </button>
              <Button type="button" variant="outline" onClick={() => count ? onOpenCategory(category) : onPending(category)} className="h-11 rounded-xl border-[#F3C7D2] px-3 text-xs text-[#D96C8A]">
                {count ? "Ver orçamentos" : "Encontrar"}
              </Button>
              <button
                type="button"
                onClick={() => onAddQuote(category)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F8E7EC] text-[#D96C8A]"
                aria-label={`Incluir orçamento em ${category}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </article>
          );
        })}
      </div>
      <Button type="button" onClick={() => onAddQuote(null)} variant="outline" className="mt-4 h-12 w-full rounded-xl border-[#F3C7D2] text-[#D96C8A]">
        <Plus className="h-4 w-4" />
        Adicionar orçamento
      </Button>
    </section>
  );
}

function PendingTab({
  categories,
  onOpen,
  onAddCategory,
  onDeleteCategory
}: {
  categories: string[];
  onOpen: (category: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (category: string) => void;
}) {
  return (
    <section>
      <HeroCard title="Faltam poucos para seu time ficar completo!" text={`Voce ainda tem ${categories.length} categorias para contratar.`} />
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#4B2E2B]">Categorias pendentes</h2>
        <button type="button" onClick={onAddCategory} className="text-xs font-bold text-[#D96C8A]">Adicionar</button>
      </div>
      <div className="mt-3 space-y-3">
        {categories.map((category) => (
          <article key={category} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]">
              {category === "Musica" ? <Music className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            </div>
            <button type="button" onClick={() => onOpen(category)} className="min-w-0 flex-1 text-left">
              <p className="text-sm font-bold text-[#4B2E2B]">{category}</p>
              <p className="text-xs text-[#8A716D]">Ainda nao contratado</p>
            </button>
            <Button type="button" variant="outline" onClick={() => onOpen(category)} className="h-10 rounded-xl border-[#F3C7D2] px-3 text-xs text-[#D96C8A]">Encontrar fornecedores</Button>
            <button
              type="button"
              onClick={() => onDeleteCategory(category)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#B96F52] transition hover:bg-[#FBEEE8]"
              aria-label={`Excluir ${category}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function PendingDetail({ category, onAdd, onSofia }: { category: string; onAdd: () => void; onSofia: () => void }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const suggestions = categorySuggestions[category] ?? categorySuggestions.Musica;
  const visibleSuggestions = expanded
    ? [...suggestions, { name: `${category} Prime`, role: "Sugestao adicional", image: "https://images.unsplash.com/photo-1529634892229-7f4e0f6d8d56?w=160&h=160&fit=crop" }]
    : suggestions;
  return (
    <section>
      <div className="mb-6 flex items-center gap-4 rounded-3xl bg-[#FFFDFC] p-5 shadow-[0_8px_28px_rgba(75,46,43,0.07)]">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]">
          <Music className="h-7 w-7" />
        </div>
        <p className="text-sm leading-6 text-[#4B2E2B]">Encontre a opcao perfeita para cada momento do seu casamento.</p>
      </div>
      <h2 className="text-base font-bold text-[#4B2E2B]">Sugestoes para voce</h2>
      <div className="mt-3 overflow-hidden rounded-2xl bg-[#FFFDFC] shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
        {visibleSuggestions.map((item) => (
          <div key={item.name} className="flex items-center gap-3 border-b border-[#EEE6E1] p-4 last:border-b-0">
            <div className="h-11 w-11 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#4B2E2B]">{item.name}</p>
              <p className="text-xs text-[#8A716D]">{item.role}</p>
            </div>
            <button
              type="button"
              onClick={() => setFavorites((current) => current.includes(item.name) ? current.filter((name) => name !== item.name) : [...current, item.name])}
              className={favorites.includes(item.name) ? "text-[#D96C8A]" : "text-[#8A716D]"}
              aria-label="Favoritar sugestao"
            >
              <Heart className="h-5 w-5" fill={favorites.includes(item.name) ? "currentColor" : "none"} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setExpanded((value) => !value)} className="w-full p-4 text-sm font-bold text-[#D96C8A]">
          {expanded ? "Ver menos sugestoes" : "Ver mais sugestoes"}
        </button>
      </div>
      <div className="mt-4 rounded-3xl bg-[#F8E7EC] p-5">
        <p className="text-sm font-bold text-[#4B2E2B]">Dica da Sofia</p>
        <p className="mt-2 text-sm leading-6 text-[#4B2E2B]">A {category.toLowerCase()} cria atmosfera no seu dia. Me conte mais sobre o estilo que voces imaginam?</p>
        <Button type="button" variant="outline" onClick={onSofia} className="mt-4 w-full rounded-xl border-[#F3C7D2] bg-[#FFFDFC] text-[#D96C8A]">Conversar com a Sofia</Button>
      </div>
      <Button type="button" onClick={onAdd} className="mt-4 h-12 w-full rounded-xl bg-[#D96C8A] hover:bg-[#C85D7B]">
        <Plus className="h-4 w-4" />
        Adicionar fornecedor
      </Button>
    </section>
  );
}

function AllTab({ vendors, query, onQuery, onFilter, onDelete }: { vendors: Vendor[]; query: string; onQuery: (value: string) => void; onFilter: () => void; onDelete: (id: string) => void }) {
  return (
    <section>
      <div className="mb-4 grid grid-cols-[1fr_auto] gap-3">
        <label className="flex h-12 items-center gap-2 rounded-2xl bg-[#FFFDFC] px-4 ring-1 ring-[#EEE6E1]">
          <Search className="h-4 w-4 text-[#8A716D]" />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar fornecedor" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <button type="button" onClick={onFilter} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFFDFC] ring-1 ring-[#EEE6E1]" aria-label="Filtrar">
          <Filter className="h-5 w-5 text-[#4B2E2B]" />
        </button>
      </div>
      <h2 className="text-base font-bold text-[#4B2E2B]">Todos os fornecedores ({vendors.length})</h2>
      <div className="mt-3 overflow-hidden rounded-2xl bg-[#FFFDFC] shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="flex items-center gap-2 border-b border-[#EEE6E1] px-4 last:border-b-0">
            <Link href={`/app/fornecedores/${vendor.id}`} className="flex flex-1 items-center gap-3 py-4 min-w-0">
              <CategoryMark category={vendor.category} compact />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#4B2E2B]">{vendor.name}</p>
                <p className="text-xs text-[#8A716D]">{vendor.category}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusTone(vendor.status)}`}>
                {statusLabel(vendor.status)}
              </span>
              <ChevronRight className="h-4 w-4 text-[#8A716D]" />
            </Link>
            <button type="button" onClick={() => onDelete(vendor.id)} className="shrink-0 grid h-8 w-8 place-items-center rounded-full text-[#D96C8A] hover:bg-[#F8E7EC]" aria-label="Excluir">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroCard({ title, text, avatar = false }: { title: string; text: string; avatar?: boolean }) {
  return (
    <div className="flex min-h-[120px] items-center justify-between rounded-3xl bg-[#FFFDFC] p-5 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <div className="max-w-[230px]">
        <p className="text-sm font-bold leading-5 text-[#4B2E2B]">{title}</p>
        <p className="mt-2 text-xs leading-5 text-[#8A716D]">{text}</p>
      </div>
      <div className={avatar ? "h-20 w-20 rounded-full bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop')] bg-cover bg-center" : "grid h-20 w-20 place-items-center rounded-2xl bg-[#F8E7EC] text-[#D96C8A]"}>
        {!avatar ? <Heart className="h-8 w-8" /> : null}
      </div>
    </div>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 md:place-items-center md:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-[#FFFDFC] p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#4B2E2B]">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1]">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}


function filterLabel(label: string) {
  return label === "Cotando" ? "Orçando" : label;
}

function statusLabel(status: string) {
  return status === "Cotando" ? "Orçando" : status;
}

function normalizeVendorCategory(category: string): Vendor["category"] {
  const normalized = category.toLowerCase();
  if (normalized.includes("musica") || normalized.includes("dj")) return "Música/DJ";
  if (normalized.includes("beleza")) return "Beleza";
  if (normalized.includes("cerimonial")) return "Cerimonial";
  if (normalized.includes("bar")) return "Bar";
  if (normalized.includes("convite") || normalized.includes("papelaria")) return "Convites";
  if (normalized.includes("foto")) return "Fotografia";
  if (normalized.includes("buffet")) return "Buffet";
  if (normalized.includes("decor")) return "Decoração";
  return "Outros";
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("assinado") || normalized.includes("fechado") || normalized.includes("pago") || normalized.includes("finalizado")) {
    return "bg-[#EEF3EA] text-[#5F7752]";
  }

  if (normalized.includes("cotando") || normalized.includes("negocia") || normalized.includes("aguardando")) {
    return "bg-[#F7EEDC] text-[#9A6A2F]";
  }

  if (normalized.includes("pendente") || normalized.includes("proximo") || normalized.includes("próximo")) {
    return "bg-[#FBEEE8] text-[#B96F52]";
  }

  if (normalized.includes("atrasado") || normalized.includes("descartado") || normalized.includes("cancelado")) {
    return "bg-[#FBE6E6] text-[#B94A48]";
  }

  return "bg-[#EEF1F4] text-[#6E7F91]";
}
