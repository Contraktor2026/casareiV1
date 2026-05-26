"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CakeSlice,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Download,
  FileText,
  FolderOpen,
  Heart,
  Instagram,
  MessageCircle,
  Music,
  Package,
  Palette,
  Pencil,
  Phone,
  Plus,
  Scissors,
  StickyNote,
  Store,
  Trash2,
  Upload,
  Utensils,
  UserRound,
  Wallet
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getVendorFinancePaymentsByVendor,
  saveVendorFinancePayment,
  updateVendorFinancePaymentStatus
} from "@/lib/client/vendor-finance-sync";
import { getStoredVendors, upsertStoredVendor } from "@/lib/client/vendors-store";
import type { Vendor, VendorDelivery, VendorPayment } from "@/types/vendors";
import { VendorPaymentModal } from "./vendor-payment-modal";

type ViewMode = "main" | "tarefas" | "contrato" | "arquivos" | "pacote" | "observacoes" | "financeiro";

type FileItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function CategoryMark({ category }: { category: string }) {
  const normalized = category.toLowerCase();
  if (normalized.includes("foto")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#EEF1F4] text-[#6E7F91]"><Camera className="h-8 w-8" /></span>;
  if (normalized.includes("buffet") || normalized.includes("bar")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#F7EEDC] text-[#9A6A2F]"><Utensils className="h-8 w-8" /></span>;
  if (normalized.includes("decor") || normalized.includes("flores")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]"><Palette className="h-8 w-8" /></span>;
  if (normalized.includes("cerimonial") || normalized.includes("celebrante")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#EEF3EA] text-[#5F7752]"><UserRound className="h-8 w-8" /></span>;
  if (normalized.includes("beleza")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#FBEEE8] text-[#B96F52]"><Scissors className="h-8 w-8" /></span>;
  if (normalized.includes("música") || normalized.includes("musica") || normalized.includes("dj")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#EEF1F4] text-[#6E7F91]"><Music className="h-8 w-8" /></span>;
  if (normalized.includes("doce") || normalized.includes("bolo")) return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]"><CakeSlice className="h-8 w-8" /></span>;
  return <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#F8F4F1] text-[#8A716D]"><Store className="h-8 w-8" /></span>;
}

function VendorAvatar({ category, instagram }: { category: string; instagram: string }) {
  const [imgError, setImgError] = useState(false);
  const handle = instagram.replace("@", "").trim();

  if (handle && !imgError) {
    return (
      <img
        src={`https://unavatar.io/instagram/${handle}`}
        alt={handle}
        className="h-20 w-20 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-[#EEE6E1]"
        onError={() => setImgError(true)}
      />
    );
  }
  return <CategoryMark category={category} />;
}

export function VendorDetailsPage({ vendor, vendorId }: { vendor: Vendor | null; vendorId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<ViewMode>("main");
  const [currentVendor, setCurrentVendor] = useState<Vendor>(() => vendor ?? createEmptyVendor(vendorId));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalKind, setPaymentModalKind] = useState<"contract" | "extra">("contract");
  const [savedMessage, setSavedMessage] = useState("");
  const [draft, setDraft] = useState(() => draftFromVendor(vendor ?? createEmptyVendor(vendorId)));
  const [includedText, setIncludedText] = useState((vendor ?? createEmptyVendor(vendorId)).included.join("\n"));
  const [payments, setPayments] = useState<VendorPayment[]>((vendor ?? createEmptyVendor(vendorId)).payments);
  const [deliveries, setDeliveries] = useState<VendorDelivery[]>((vendor ?? createEmptyVendor(vendorId)).deliveries);
  const [files, setFiles] = useState<FileItem[]>(initialFiles(vendor ?? createEmptyVendor(vendorId)));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    const stored = getStoredVendors().find((item) => item.id === vendorId) ?? null;
    const source = stored ?? vendor ?? createEmptyVendor(vendorId);
    const syncedPayments = mergeVendorPayments(source.payments, getVendorFinancePaymentsByVendor(source.id));
    const syncedVendor = { ...source, payments: syncedPayments };
    setCurrentVendor(syncedVendor);
    setDraft(draftFromVendor(syncedVendor));
    setIncludedText(syncedVendor.included.join("\n"));
    setPayments(syncedPayments);
    setDeliveries(syncedVendor.deliveries);
    setFiles(initialFiles(syncedVendor));
  }, [vendor, vendorId]);

  const includedItems = useMemo(() => includedText.split("\n").map((item) => item.trim()).filter(Boolean), [includedText]);
  const contractPayments = payments.filter((payment) => (payment.kind ?? "contract") === "contract");
  const paidValue = contractPayments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0);
  const totalValue = Number(draft.totalValue) || currentVendor.totalValue || 0;
  const pendingValue = Math.max(totalValue - paidValue, 0);
  const nextOpenPayment = contractPayments.find((payment) => payment.status !== "pago");
  const pendingDeliveries = deliveries.filter((d) => d.status !== "concluido");
  const doneDeliveries = deliveries.filter((d) => d.status === "concluido");

  function update<K extends keyof typeof draft>(field: K, value: (typeof draft)[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  }

  function persist(overrides?: Partial<Vendor>) {
    const updated: Vendor = {
      ...currentVendor,
      ...overrides,
      name: draft.name,
      category: draft.category as Vendor["category"],
      status: draft.status as Vendor["status"],
      responsible: draft.responsible,
      whatsapp: draft.whatsapp,
      phone: draft.phone,
      email: draft.email,
      instagram: draft.instagram,
      totalValue,
      paidValue,
      nextPayment: nextOpenPayment ? `${money(nextOpenPayment.amount)} em ${formatDisplayDate(nextOpenPayment.dueDate)}` : "Tudo pago",
      contract: {
        ...currentVendor.contract,
        signed: draft.contractStatus === "assinado",
        sent: draft.contractStatus === "assinado" || draft.contractStatus === "enviado",
        signedAt: draft.signedAt || undefined,
        externalLink: draft.contractLink || undefined,
        notes: draft.contractNotes
      },
      included: includedItems,
      payments,
      deliveries,
      notes: draft.notes,
      importantNote: draft.notes,
      ceremonialNote: `${draft.category}: ${draft.notes}`
    };
    setCurrentVendor(updated);
    upsertStoredVendor(updated);
    setSavedMessage("Salvo.");
  }

  function addPayment(payment: { amount: number; dueDate: string; method: string; status: "pago" | "pendente" | "proximo"; description?: string; kind?: "contract" | "extra" }) {
    const kind = payment.kind ?? "contract";
    const description = payment.description?.trim();
    const paymentName = kind === "extra" ? description || "Despesa extra" : `${payment.method} - ${formatDisplayDate(payment.dueDate)}`;
    const financePayment = saveVendorFinancePayment({
      vendorId: currentVendor.id,
      supplier: kind === "extra" && description ? `${draft.name} - ${description}` : draft.name,
      category: draft.category,
      amount: payment.amount,
      dueDate: payment.dueDate,
      method: payment.method,
      status: payment.status,
      note: description,
      vendorPaymentKind: kind,
      vendorPaymentName: paymentName
    });
    const vendorPayment: VendorPayment = {
      id: financePayment.id,
      name: paymentName,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status,
      method: payment.method,
      kind
    };
    const nextPayments = [vendorPayment, ...payments];
    setPayments(nextPayments);
    const paid = nextPayments
      .filter((item) => (item.kind ?? "contract") === "contract" && item.status === "pago")
      .reduce((sum, item) => sum + item.amount, 0);
    update("paidValue", String(paid));
    setSavedMessage(kind === "extra" ? "Despesa extra adicionada." : "Pagamento registrado.");
  }

  function markPaymentPaid(paymentId: string) {
    const nextPayments = payments.map((payment) => (payment.id === paymentId ? { ...payment, status: "pago" as const } : payment));
    setPayments(nextPayments);
    updateVendorFinancePaymentStatus(paymentId, "pago");
    update("paidValue", String(nextPayments.filter((payment) => (payment.kind ?? "contract") === "contract" && payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0)));
    setSavedMessage("Pagamento marcado como pago.");
  }

  function deletePayment(paymentId: string) {
    const next = payments.filter((p) => p.id !== paymentId);
    setPayments(next);
    update("paidValue", String(next.filter((p) => (p.kind ?? "contract") === "contract" && p.status === "pago").reduce((sum, p) => sum + p.amount, 0)));
    setSavedMessage("Pagamento removido.");
  }

  function editPayment(paymentId: string, amount: number, dueDate: string) {
    const next = payments.map((p) => p.id === paymentId ? { ...p, amount, dueDate } : p);
    setPayments(next);
    update("paidValue", String(next.filter((p) => (p.kind ?? "contract") === "contract" && p.status === "pago").reduce((sum, p) => sum + p.amount, 0)));
    setSavedMessage("Pagamento atualizado.");
  }

  function addDelivery(title: string, dueDate?: string) {
    setDeliveries((current) => [
      {
        id: `${currentVendor.id}-delivery-${Date.now()}`,
        title: title.trim(),
        status: "pendente",
        dueDate: dueDate || "A definir",
        note: "Adicionada pela noiva.",
        responsible: draft.responsible || draft.name
      },
      ...current
    ]);
  }

  function finishDelivery(id: string) {
    setDeliveries((current) => current.map((delivery) => (delivery.id === id ? { ...delivery, status: "concluido" } : delivery)));
    persist();
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    setFiles((current) => [
      ...selected.map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        type: file.type || "arquivo",
        size: file.size,
        category: inferFileCategory(file.name)
      })),
      ...current
    ]);
    event.target.value = "";
  }

  if (view === "tarefas") {
    return <TasksView
      vendorName={draft.name}
      pendingDeliveries={pendingDeliveries}
      doneDeliveries={doneDeliveries}
      onBack={() => setView("main")}
      onFinish={finishDelivery}
      onAdd={addDelivery}
    />;
  }

  if (view === "financeiro") {
    return <FinanceView
      draft={draft}
      totalValue={totalValue}
      paidValue={paidValue}
      pendingValue={pendingValue}
      payments={payments}
      onBack={() => setView("main")}
      onUpdate={update}
      onMarkPaid={markPaymentPaid}
      onDelete={deletePayment}
      onEdit={editPayment}
      onAddPayment={(kind) => {
        setPaymentModalKind(kind);
        setShowPaymentModal(true);
      }}
      savedMessage={savedMessage}
      onSave={() => persist()}
      modal={
        <VendorPaymentModal
          open={showPaymentModal}
          supplier={draft.name}
          title={paymentModalKind === "extra" ? "Adicionar despesa extra" : "Registrar pagamento"}
          mode={paymentModalKind}
          onClose={() => setShowPaymentModal(false)}
          onSave={addPayment}
        />
      }
    />;
  }

  if (view === "contrato") {
    return <ContratoView
      draft={draft}
      vendorId={currentVendor.id}
      onBack={() => setView("main")}
      onUpdate={update}
      onSave={() => persist()}
      savedMessage={savedMessage}
    />;
  }

  if (view === "arquivos") {
    return <ArquivosView
      files={files}
      fileInputRef={fileInputRef}
      onBack={() => setView("main")}
      onUpload={handleFiles}
    />;
  }

  if (view === "pacote") {
    return <PacoteView
      includedText={includedText}
      onBack={() => setView("main")}
      onChange={setIncludedText}
      onSave={() => persist()}
      savedMessage={savedMessage}
    />;
  }

  if (view === "observacoes") {
    return <ObservacoesView
      draft={draft}
      onBack={() => setView("main")}
      onUpdate={update}
      onSave={() => persist()}
      savedMessage={savedMessage}
    />;
  }

  const nextDateLabel = nextOpenPayment
    ? formatShortDate(nextOpenPayment.dueDate)
    : null;

  return (
    <>
      <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
        <div className="px-4 pt-5 md:px-8 lg:px-11">
          <button type="button" onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8A716D]">
            <ArrowLeft className="h-4 w-4" />
            Fornecedores
          </button>

          <div className="flex items-start gap-4">
            <VendorAvatar category={draft.category} instagram={draft.instagram} />
            <div className="min-w-0 flex-1 pt-1">
              <input
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                className="w-full bg-transparent font-serif text-3xl leading-tight text-[#4B2E2B] outline-none"
                onBlur={() => persist()}
              />
              <p className="mt-1 text-sm text-[#8A716D]">{draft.category}</p>
              <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${currentVendor.contract.signed ? "bg-[#EEF3EA] text-[#5F7752]" : "bg-[#FBEEE8] text-[#B96F52]"}`}>
                {currentVendor.contract.signed ? <><CheckCircle2 className="h-3.5 w-3.5" />Contrato assinado</> : "Contrato pendente"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <a href={`https://wa.me/${draft.whatsapp}`} target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-sm" aria-label="WhatsApp">
              <MessageCircle className="h-5 w-5" />
            </a>
            {draft.instagram ? (
              <a href={`https://instagram.com/${draft.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A] shadow-sm" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A] shadow-sm">
                <Instagram className="h-5 w-5" />
              </span>
            )}
            {draft.phone ? (
              <a href={`tel:${draft.phone}`} className="grid h-12 w-12 place-items-center rounded-full bg-[#F8F4F1] text-[#8A716D] shadow-sm" aria-label="Telefone">
                <Phone className="h-5 w-5" />
              </a>
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F8F4F1] text-[#8A716D] shadow-sm">
                <Phone className="h-5 w-5" />
              </span>
            )}
          </div>

          {savedMessage ? (
            <p className="mt-3 rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p>
          ) : null}

          <div className="mt-5 rounded-2xl bg-[#FFFDFC] shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            <div className="px-5 pb-4 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Resumo financeiro</p>
            </div>
            <FinanceRow label="Valor total" value={money(totalValue)} />
            <FinanceRow label="Pago" value={money(paidValue)} valueClass="text-[#5F7752]" />
            <FinanceRow label="Pendente" value={money(pendingValue)} valueClass="text-[#D28B6E]" />
            {nextDateLabel && nextOpenPayment && (
              <div className="flex items-center justify-between border-t border-[#F2EDE9] px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm text-[#8A716D]">
                  <Calendar className="h-4 w-4" />
                  <span>Próximo pagamento</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#D28B6E]">{nextDateLabel}</p>
                  <p className="text-sm font-bold text-[#4B2E2B]">{money(nextOpenPayment.amount)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-[#FFFDFC] shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            <MenuRow
              icon={<Clock3 className="h-4 w-4 text-[#D96C8A]" />}
              label="Tarefas"
              badge={pendingDeliveries.length > 0 ? `${pendingDeliveries.length} pendente${pendingDeliveries.length === 1 ? "" : "s"}` : undefined}
              badgeClass="text-[#D96C8A]"
              onClick={() => setView("tarefas")}
            />
            <MenuRow
              icon={<Wallet className="h-4 w-4 text-[#D28B6E]" />}
              label="Financeiro"
              badge={payments.length > 0 ? `${payments.length} lançamento${payments.length === 1 ? "" : "s"}` : undefined}
              badgeClass="text-[#D28B6E]"
              onClick={() => setView("financeiro")}
            />
            <MenuRow
              icon={<FileText className="h-4 w-4 text-[#5F7752]" />}
              label="Contrato"
              badge={currentVendor.contract.signed ? "Assinado" : currentVendor.contract.sent ? "Enviado" : "Pendente"}
              badgeClass={currentVendor.contract.signed ? "text-[#5F7752]" : "text-[#B96F52]"}
              onClick={() => setView("contrato")}
            />
            <MenuRow
              icon={<FolderOpen className="h-4 w-4 text-[#6E7F91]" />}
              label="Arquivos"
              badge={files.length > 0 ? `${files.length} arquivo${files.length === 1 ? "" : "s"}` : undefined}
              onClick={() => setView("arquivos")}
            />
            <MenuRow
              icon={<Package className="h-4 w-4 text-[#9A6A2F]" />}
              label="Pacote contratado"
              badge={includedItems.length > 0 ? `${includedItems.length} item${includedItems.length === 1 ? "" : "s"}` : undefined}
              onClick={() => setView("pacote")}
            />
            <MenuRow
              icon={<StickyNote className="h-4 w-4 text-[#8A716D]" />}
              label="Observações"
              onClick={() => setView("observacoes")}
              last
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={() => { setPaymentModalKind("contract"); setShowPaymentModal(true); }} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">
          <Wallet className="h-4 w-4" />
          Registrar pagamento
        </Button>
      </div>

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />
      <VendorPaymentModal
        open={showPaymentModal}
        supplier={draft.name}
        title={paymentModalKind === "extra" ? "Adicionar despesa extra" : "Registrar pagamento"}
        mode={paymentModalKind}
        onClose={() => setShowPaymentModal(false)}
        onSave={addPayment}
      />
    </>
  );
}

function FinanceRow({ label, value, valueClass = "text-[#4B2E2B]" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between border-t border-[#F2EDE9] px-5 py-3.5">
      <p className="text-sm text-[#8A716D]">{label}</p>
      <p className={`text-sm font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  badge,
  badgeClass = "text-[#8A716D]",
  onClick,
  last = false
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeClass?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#F8F4F1] ${!last ? "border-b border-[#F2EDE9]" : ""}`}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F8F4F1]">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-[#4B2E2B]">{label}</span>
      {badge && <span className={`text-xs font-semibold ${badgeClass}`}>{badge}</span>}
      <ChevronRight className="h-4 w-4 shrink-0 text-[#C0B0AC]" />
    </button>
  );
}

function SubHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-4 pt-5 md:px-8 lg:px-11">
      <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-[#FFFDFC] ring-1 ring-[#EEE6E1]" aria-label="Voltar">
        <ArrowLeft className="h-4 w-4 text-[#4B2E2B]" />
      </button>
      <h1 className="min-w-0 flex-1 truncate font-serif text-2xl text-[#4B2E2B]">{title}</h1>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function TasksView({
  vendorName,
  pendingDeliveries,
  doneDeliveries,
  onBack,
  onFinish,
  onAdd
}: {
  vendorName: string;
  pendingDeliveries: VendorDelivery[];
  doneDeliveries: VendorDelivery[];
  onBack: () => void;
  onFinish: (id: string) => void;
  onAdd: (title: string, dueDate?: string) => void;
}) {
  const [tab, setTab] = useState<"pendentes" | "concluidas">("pendentes");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  function submitTask() {
    if (!newTaskTitle.trim()) return;
    onAdd(newTaskTitle, newTaskDate);
    setNewTaskTitle("");
    setNewTaskDate("");
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-6 md:-mx-8 lg:-mx-11">
      <SubHeader
        title="Tarefas"
        onBack={onBack}
        action={
          <Button type="button" onClick={submitTask} disabled={!newTaskTitle.trim()} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm font-semibold hover:bg-[#C85D7B] disabled:opacity-40">
            Salvar
          </Button>
        }
      />
      <div className="px-4 pt-4 md:px-8 lg:px-11">

        <div className="mb-4 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <MetricTile label="Pendentes" value={String(pendingDeliveries.length)} warn />
            <MetricTile label="Concluídas" value={String(doneDeliveries.length)} green />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Nova tarefa</p>
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitTask(); }}
            placeholder="O que precisa ser feito?"
            className="w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none placeholder:text-[#C0B0AC]"
          />
          <div className="mt-3 flex items-center gap-2">
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="h-9 flex-1 rounded-xl border border-[#EEE6E1] bg-[#F8F4F1] px-3 text-xs text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
            />
            <Button type="button" onClick={submitTask} disabled={!newTaskTitle.trim()} className="h-9 rounded-xl bg-[#D96C8A] px-4 text-sm hover:bg-[#C85D7B] disabled:opacity-40">
              <Plus className="h-4 w-4" />Adicionar
            </Button>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("pendentes")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "pendentes" ? "bg-[#4B2E2B] text-white" : "bg-[#FFFDFC] text-[#8A716D] ring-1 ring-[#EEE6E1]"}`}
          >
            Pendentes ({pendingDeliveries.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("concluidas")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "concluidas" ? "bg-[#4B2E2B] text-white" : "bg-[#FFFDFC] text-[#8A716D] ring-1 ring-[#EEE6E1]"}`}
          >
            Concluídas ({doneDeliveries.length})
          </button>
        </div>

        {tab === "pendentes" && (
          <div className="space-y-2">
            <p className="mb-2 text-sm font-bold text-[#4B2E2B]">Pendentes</p>
            {pendingDeliveries.length ? pendingDeliveries.map((delivery) => (
              <article key={delivery.id} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
                <button type="button" onClick={() => onFinish(delivery.id)} className="grid h-6 w-6 shrink-0 place-items-center rounded-full ring-2 ring-[#D96C8A]" aria-label="Concluir">
                  <Circle className="h-3 w-3 text-[#D96C8A]" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#4B2E2B]">{delivery.title}</p>
                  <p className="mt-0.5 text-xs text-[#8A716D]">{vendorName}</p>
                  {delivery.dueDate !== "A definir" && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#D28B6E]">
                      <Calendar className="h-3 w-3" />Até {delivery.dueDate}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#C0B0AC]" />
              </article>
            )) : (
              <p className="rounded-2xl bg-[#FFFDFC] p-5 text-sm text-[#8A716D]">Nenhuma tarefa pendente.</p>
            )}
          </div>
        )}

        {tab === "concluidas" && (
          <div className="space-y-2">
            <p className="mb-2 text-sm font-bold text-[#4B2E2B]">Concluídas</p>
            {doneDeliveries.length ? doneDeliveries.map((delivery) => (
              <article key={delivery.id} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1] opacity-70">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-[#9CAF88]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#4B2E2B] line-through">{delivery.title}</p>
                  <p className="mt-0.5 text-xs text-[#8A716D]">{vendorName}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#9CAF88]">
                    <Calendar className="h-3 w-3" />Concluída em {delivery.dueDate}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#C0B0AC]" />
              </article>
            )) : (
              <p className="rounded-2xl bg-[#FFFDFC] p-5 text-sm text-[#8A716D]">Nenhuma tarefa concluída ainda.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function FinanceView({
  draft,
  totalValue,
  paidValue,
  pendingValue,
  payments,
  onBack,
  onUpdate,
  onMarkPaid,
  onDelete,
  onEdit,
  onAddPayment,
  savedMessage,
  onSave,
  modal
}: {
  draft: ReturnType<typeof draftFromVendor>;
  totalValue: number;
  paidValue: number;
  pendingValue: number;
  payments: VendorPayment[];
  onBack: () => void;
  onUpdate: <K extends keyof ReturnType<typeof draftFromVendor>>(field: K, value: ReturnType<typeof draftFromVendor>[K]) => void;
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, amount: number, dueDate: string) => void;
  onAddPayment: (kind: "contract" | "extra") => void;
  savedMessage: string;
  onSave: () => void;
  modal: React.ReactNode;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");

  const contractPayments = payments.filter((p) => (p.kind ?? "contract") === "contract");
  const extraPayments = payments.filter((p) => p.kind === "extra");
  const paymentMethod = contractPayments[0]?.method ?? "";
  const isInstallments = contractPayments.length > 1;
  const extraTotal = extraPayments.reduce((sum, p) => sum + p.amount, 0);

  function startEdit(payment: VendorPayment) {
    setEditingId(payment.id);
    setEditAmount(new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(payment.amount));
    setEditDate(payment.dueDate);
  }

  function saveEdit(id: string) {
    const amount = Number(editAmount.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
    onEdit(id, amount, editDate);
    setEditingId(null);
  }

  function PaymentEditForm({ payment, label }: { payment: VendorPayment; label: string }) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-medium text-[#4B2E2B]">
            Valor
            <input
              type="text"
              inputMode="numeric"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[#EEE6E1] bg-[#F8F4F1] px-3 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
            />
          </label>
          <label className="text-xs font-medium text-[#4B2E2B]">
            Vencimento
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[#EEE6E1] bg-[#F8F4F1] px-3 text-sm text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={() => saveEdit(payment.id)} className="h-9 rounded-xl bg-[#D96C8A] px-4 text-sm hover:bg-[#C85D7B]">Salvar</Button>
          <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="h-9 rounded-xl px-4 text-sm">Cancelar</Button>
        </div>
      </div>
    );
  }

  function PaymentRow({ payment, label }: { payment: VendorPayment; label: string }) {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#4B2E2B]">{label}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8A716D]">
            <Calendar className="h-3 w-3" />
            {payment.dueDate ? new Date(`${payment.dueDate}T12:00:00`).toLocaleDateString("pt-BR") : "Data não definida"}
          </p>
          {payment.status !== "pago" && (
            <button type="button" onClick={() => onMarkPaid(payment.id)} className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#EEF3EA] px-2.5 py-1 text-[11px] font-bold text-[#5F7752]">
              <CheckCircle2 className="h-3 w-3" />Marcar como pago
            </button>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-serif text-base font-semibold text-[#4B2E2B]">{money(payment.amount)}</p>
          <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${payment.status === "pago" ? "bg-[#EAF3DE] text-[#27500A]" : "bg-[#FBEEE8] text-[#B96F52]"}`}>
            {payment.status === "pago" ? "Pago" : "Pendente"}
          </span>
        </div>
        <div className="flex shrink-0 flex-col gap-1 pl-1">
          <button type="button" onClick={() => startEdit(payment)} className="grid h-8 w-8 place-items-center rounded-full text-[#8A716D] hover:bg-[#F8F4F1]" aria-label="Editar">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onDelete(payment.id)} className="grid h-8 w-8 place-items-center rounded-full text-[#D28B6E] hover:bg-[#FBEEE8]" aria-label="Excluir">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader title="Financeiro" onBack={onBack} />
      <div className="space-y-4 px-4 pt-4 md:px-8 lg:px-11">

        {/* Resumo */}
        <div className="rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <div className="grid grid-cols-3 gap-3">
            <MetricTile label="Contratado" value={money(totalValue)} />
            <MetricTile label="Pago" value={money(paidValue)} green />
            <MetricTile label="Pendente" value={money(pendingValue)} warn />
          </div>
          {savedMessage ? <p className="mt-3 rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p> : null}
          <label className="mt-3 block text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">
            Valor total contratado
            <input
              value={draft.totalValue}
              onChange={(e) => onUpdate("totalValue", e.target.value)}
              onBlur={onSave}
              placeholder="0,00"
              inputMode="decimal"
              className="mt-1 h-11 w-full rounded-xl border border-[#EEE6E1] bg-[#F8F4F1] px-4 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
            />
          </label>
        </div>

        {/* Plano de pagamento */}
        <div className="overflow-hidden rounded-2xl bg-[#FFFDFC] shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <div className="px-4 pt-4 pb-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Plano de pagamento</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {paymentMethod ? (
                <span className="rounded-full bg-[#F8F4F1] px-3 py-1 text-xs font-bold text-[#4B2E2B]">
                  {paymentMethod}
                </span>
              ) : null}
              {contractPayments.length > 0 ? (
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${isInstallments ? "bg-[#F8E7EC] text-[#D96C8A]" : "bg-[#EEF3EA] text-[#5F7752]"}`}>
                  {isInstallments ? `Parcelado em ${contractPayments.length}x` : "À vista"}
                </span>
              ) : null}
            </div>
          </div>
          {contractPayments.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-[#8A716D]">Nenhum pagamento definido ainda. Use o botão abaixo para adicionar.</p>
          ) : (
            <div className="divide-y divide-[#F2EDE9] border-t border-[#F2EDE9]">
              {contractPayments.map((payment, i) => {
                const label = contractPayments.length === 1
                  ? "Pagamento à vista"
                  : `Parcela ${i + 1} de ${contractPayments.length}`;
                return (
                  <div key={payment.id}>
                    {editingId === payment.id
                      ? <PaymentEditForm payment={payment} label={label} />
                      : <PaymentRow payment={payment} label={label} />
                    }
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Despesas extras */}
        {extraPayments.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-[#FFFDFC] shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Despesas extras</p>
              <span className="rounded-full bg-[#F7EEDC] px-3 py-1 text-xs font-bold text-[#9A6A2F]">{money(extraTotal)}</span>
            </div>
            <div className="divide-y divide-[#F2EDE9] border-t border-[#F2EDE9]">
              {extraPayments.map((payment) => (
                <div key={payment.id}>
                  {editingId === payment.id
                    ? <PaymentEditForm payment={payment} label={payment.name} />
                    : <PaymentRow payment={payment} label={payment.name || "Despesa extra"} />
                  }
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" onClick={() => onAddPayment("contract")} className="h-13 rounded-xl bg-[#D96C8A] py-3.5 text-sm font-semibold hover:bg-[#C85D7B]">
            <Plus className="h-4 w-4" />Pagamento
          </Button>
          <Button type="button" onClick={() => onAddPayment("extra")} variant="outline" className="h-13 rounded-xl border-[#D96C8A] bg-white py-3.5 text-sm font-semibold text-[#D96C8A] hover:bg-[#FFF4F7]">
            <Plus className="h-4 w-4" />Despesa extra
          </Button>
        </div>
      </div>
      {modal}
    </div>
  );
}

function ContratoView({
  draft,
  vendorId,
  onBack,
  onUpdate,
  onSave,
  savedMessage
}: {
  draft: ReturnType<typeof draftFromVendor>;
  vendorId: string;
  onBack: () => void;
  onUpdate: <K extends keyof ReturnType<typeof draftFromVendor>>(field: K, value: ReturnType<typeof draftFromVendor>[K]) => void;
  onSave: () => void;
  savedMessage: string;
}) {
  const contractFileRef = useRef<HTMLInputElement>(null);
  const [contractFileName, setContractFileName] = useState<string>(
    () => (typeof window !== "undefined" ? localStorage.getItem(`casarei_contract_name_${vendorId}`) ?? "" : "")
  );

  function handleContractFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      localStorage.setItem(`casarei_contract_${vendorId}`, base64);
      localStorage.setItem(`casarei_contract_name_${vendorId}`, file.name);
      setContractFileName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function downloadContract() {
    const base64 = localStorage.getItem(`casarei_contract_${vendorId}`);
    if (!base64) return;
    const a = document.createElement("a");
    a.href = base64;
    a.download = contractFileName || "contrato";
    a.click();
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-6 md:-mx-8 lg:-mx-11">
      <SubHeader
        title="Contrato"
        onBack={onBack}
        action={
          <Button type="button" onClick={onSave} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm font-semibold hover:bg-[#C85D7B]">
            Salvar
          </Button>
        }
      />
      <div className="space-y-4 px-4 pt-4 md:px-8 lg:px-11">
        {savedMessage ? <p className="rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p> : null}
        <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Status</span>
          <select
            value={draft.contractStatus}
            onChange={(e) => onUpdate("contractStatus", e.target.value as typeof draft.contractStatus)}
            className="mt-2 h-11 w-full rounded-xl border border-[#EEE6E1] bg-[#F8F4F1] px-3 text-sm font-semibold text-[#4B2E2B] outline-none"
          >
            <option value="pendente">Não enviado</option>
            <option value="enviado">Enviado, aguardando assinatura</option>
            <option value="assinado">Assinado</option>
          </select>
        </label>
        <ContractField label="Data de assinatura" value={draft.signedAt} onChange={(v) => onUpdate("signedAt", v)} type="date" />
        <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Observações do contrato</span>
          <textarea
            value={draft.contractNotes}
            onChange={(e) => onUpdate("contractNotes", e.target.value)}
            className="mt-2 min-h-[120px] w-full resize-none bg-transparent text-sm text-[#4B2E2B] outline-none"
          />
        </label>
        <div className="rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Arquivo do contrato</span>
          {contractFileName ? (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#F8F4F1] p-3">
              <FileText className="h-5 w-5 shrink-0 text-[#5F7752]" />
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#4B2E2B]">{contractFileName}</p>
              <button type="button" onClick={downloadContract} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EEF3EA] text-[#5F7752]" aria-label="Baixar">
                <Download className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#8A716D]">Nenhum arquivo enviado.</p>
          )}
          <button
            type="button"
            onClick={() => contractFileRef.current?.click()}
            className="mt-3 flex items-center gap-2 rounded-xl bg-[#F8F4F1] px-4 py-2.5 text-sm font-semibold text-[#4B2E2B] hover:bg-[#EEE6E1]"
          >
            <Upload className="h-4 w-4 text-[#8A716D]" />
            {contractFileName ? "Trocar arquivo" : "Enviar arquivo"}
          </button>
          <input ref={contractFileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleContractFile} />
        </div>
      </div>
    </div>
  );
}

function ContractField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none"
      />
    </label>
  );
}

function ArquivosView({
  files,
  fileInputRef,
  onBack,
  onUpload
}: {
  files: FileItem[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onBack: () => void;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader
        title="Arquivos"
        onBack={onBack}
        action={
          <Button type="button" onClick={() => fileInputRef.current?.click()} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm font-semibold hover:bg-[#C85D7B]">
            Upload
          </Button>
        }
      />
      <div className="space-y-3 px-4 pt-4 md:px-8 lg:px-11">
        {files.length ? files.map((file) => (
          <article key={file.id} className="flex items-center gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F8F4F1] text-[#8A716D]">
              <FolderOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#4B2E2B]">{file.name}</p>
              <p className="text-xs text-[#8A716D]">{file.category} · {formatBytes(file.size)}</p>
            </div>
          </article>
        )) : (
          <div className="rounded-2xl bg-[#FFFDFC] p-5 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
            <p className="text-sm text-[#8A716D]">Nenhum arquivo ainda. Inclua orçamento, contrato, comprovante ou referência.</p>
            <Button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 h-11 w-full rounded-xl bg-[#D96C8A] text-sm font-semibold hover:bg-[#C85D7B]">
              <Upload className="h-4 w-4" />Fazer upload
            </Button>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={() => fileInputRef.current?.click()} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">
          <Upload className="h-4 w-4" />Incluir arquivo
        </Button>
      </div>
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onUpload} />
    </div>
  );
}

function PacoteView({
  includedText,
  onBack,
  onChange,
  onSave,
  savedMessage
}: {
  includedText: string;
  onBack: () => void;
  onChange: (v: string) => void;
  onSave: () => void;
  savedMessage: string;
}) {
  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-6 md:-mx-8 lg:-mx-11">
      <SubHeader
        title="Pacote contratado"
        onBack={onBack}
        action={
          <Button type="button" onClick={onSave} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm font-semibold hover:bg-[#C85D7B]">
            Salvar
          </Button>
        }
      />
      <div className="space-y-4 px-4 pt-4 md:px-8 lg:px-11">
        {savedMessage ? <p className="rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p> : null}
        <div className="rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">O que está incluso</p>
          <p className="mt-1 text-xs text-[#8A716D]">Uma entrega por linha</p>
          <textarea
            value={includedText}
            onChange={(e) => onChange(e.target.value)}
            className="mt-3 min-h-[200px] w-full resize-none bg-transparent text-sm leading-7 text-[#4B2E2B] outline-none"
            placeholder="Ex: Álbum 30x30&#10;2 fotógrafos&#10;Edição em até 60 dias"
          />
        </div>
      </div>
    </div>
  );
}

function ObservacoesView({
  draft,
  onBack,
  onUpdate,
  onSave,
  savedMessage
}: {
  draft: ReturnType<typeof draftFromVendor>;
  onBack: () => void;
  onUpdate: <K extends keyof ReturnType<typeof draftFromVendor>>(field: K, value: ReturnType<typeof draftFromVendor>[K]) => void;
  onSave: () => void;
  savedMessage: string;
}) {
  const [igImgError, setIgImgError] = useState(false);
  const igHandle = draft.instagram.replace("@", "").trim();

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-6 md:-mx-8 lg:-mx-11">
      <SubHeader
        title="Observações"
        onBack={onBack}
        action={
          <Button type="button" onClick={onSave} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm font-semibold hover:bg-[#C85D7B]">
            Salvar
          </Button>
        }
      />
      <div className="space-y-4 px-4 pt-4 md:px-8 lg:px-11">
        {savedMessage ? <p className="rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p> : null}
        {igHandle && !igImgError && (
          <div className="flex items-center gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
            <img
              src={`https://unavatar.io/instagram/${igHandle}`}
              alt={igHandle}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-[#EEE6E1]"
              onError={() => setIgImgError(true)}
            />
            <div>
              <p className="text-sm font-bold text-[#4B2E2B]">@{igHandle}</p>
              <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noreferrer" className="mt-0.5 text-xs font-semibold text-[#D96C8A]">Ver perfil →</a>
            </div>
          </div>
        )}
        <div className="grid gap-3">
          <EditableField label="Responsável" value={draft.responsible} onChange={(v) => onUpdate("responsible", v)} />
          <EditableField label="WhatsApp" value={draft.whatsapp} onChange={(v) => onUpdate("whatsapp", v)} />
          <InstagramEditableField value={draft.instagram} onChange={(v) => { onUpdate("instagram", v); setIgImgError(false); }} />
          <EditableField label="Email" value={draft.email} onChange={(v) => onUpdate("email", v)} />
        </div>
        <div className="rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Notas importantes</p>
          <textarea
            value={draft.notes}
            onChange={(e) => onUpdate("notes", e.target.value)}
            className="mt-3 min-h-[140px] w-full resize-none bg-transparent text-sm leading-7 text-[#4B2E2B] outline-none"
            placeholder="Observações importantes sobre este fornecedor"
          />
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-9 w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none"
      />
    </label>
  );
}

function InstagramEditableField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handle = value.replace("@", "").trim();

  return (
    <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">
        <Instagram className="h-4 w-4 text-[#D96C8A]" />
        Instagram
      </span>
      <div className="mt-2 flex h-11 items-center gap-2 rounded-xl bg-[#F8F4F1] px-3">
        <Instagram className="h-4 w-4 shrink-0 text-[#D96C8A]" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="@perfil ou perfil"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none"
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-[#8A716D]">Pode colocar com @ ou sem @. O app abre o perfil pelo ícone do Instagram.</p>
      {handle ? (
        <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F8E7EC] px-3 py-2 text-xs font-bold text-[#D96C8A]">
          <Instagram className="h-3.5 w-3.5" />
          Abrir @{handle}
        </a>
      ) : null}
    </label>
  );
}

function MetricTile({ label, value, green, warn }: { label: string; value: string; green?: boolean; warn?: boolean }) {
  const text = green ? "text-[#5F7752]" : warn ? "text-[#B96F52]" : "text-[#4B2E2B]";
  return (
    <div className="rounded-xl bg-[#F8F4F1] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p>
      <p className={`mt-1 text-sm font-bold ${text}`}>{value}</p>
    </div>
  );
}

function draftFromVendor(vendor: Vendor) {
  return {
    name: vendor.name,
    category: vendor.category,
    responsible: vendor.responsible,
    phone: vendor.phone,
    whatsapp: vendor.whatsapp,
    email: vendor.email,
    instagram: vendor.instagram,
    status: vendor.status,
    signedAt: vendor.contract.signedAt ?? "",
    totalValue: String(vendor.totalValue),
    paidValue: String(vendor.paidValue),
    contractStatus: vendor.contract.signed ? "assinado" : vendor.contract.sent ? "enviado" : "pendente" as "assinado" | "enviado" | "pendente",
    contractLink: vendor.contract.externalLink ?? "",
    contractNotes: vendor.contract.notes,
    notes: vendor.notes
  };
}

function mergeVendorPayments(vendorPayments: VendorPayment[], financePayments: Array<{ id: string; amount: number; dueDate: string; status: VendorPayment["status"]; method?: string; vendorPaymentKind?: VendorPayment["kind"]; vendorPaymentName?: string }>) {
  const existingIds = new Set(vendorPayments.map((payment) => payment.id));
  const fromFinance: VendorPayment[] = financePayments
    .filter((payment) => !existingIds.has(payment.id))
    .map((payment) => ({
      id: payment.id,
      name: payment.vendorPaymentName ?? `${payment.method ?? "Pagamento"} - ${formatDisplayDate(payment.dueDate)}`,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status,
      method: payment.method,
      kind: payment.vendorPaymentKind ?? "contract"
    }));
  return [...fromFinance, ...vendorPayments];
}

function initialFiles(vendor: Vendor): FileItem[] {
  return vendor.contract.fileName ? [{ id: "contract-file", name: vendor.contract.fileName, type: "Contrato", size: 0, category: "Contrato" }] : [];
}

function createEmptyVendor(id: string): Vendor {
  return {
    id,
    name: "Fornecedor nao encontrado",
    category: "Outros",
    status: "Cotando",
    responsible: "",
    whatsapp: "",
    phone: "",
    email: "",
    instagram: "",
    site: "",
    city: "",
    address: "",
    serviceHours: "",
    totalValue: 0,
    paidValue: 0,
    nextPayment: "A definir",
    contract: { sent: false, signed: false, notes: "Sem contrato cadastrado.", clauses: [] },
    included: [],
    nextMilestone: "Adicionar dados do fornecedor",
    importantNote: "",
    payments: [],
    deliveries: [],
    notes: "Preencha os dados e salve para criar este fornecedor.",
    ceremonialNote: "",
    history: [],
    budgetCategory: "Outros"
  };
}

function inferFileCategory(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("contrato")) return "Contrato";
  if (lower.includes("comprovante") || lower.includes("pagamento")) return "Comprovante";
  if (lower.includes("orcamento") || lower.includes("proposta")) return "Orcamento";
  return "Referencia";
}

function formatBytes(size: number) {
  if (!size) return "arquivo salvo";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatShortDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(parsed).toUpperCase();
}

function formatDisplayDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
}
