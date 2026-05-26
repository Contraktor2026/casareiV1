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
  FileText,
  FolderOpen,
  Heart,
  Instagram,
  MessageCircle,
  Music,
  Package,
  Palette,
  Phone,
  Plus,
  Scissors,
  StickyNote,
  Store,
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

export function VendorDetailsPage({ vendor, vendorId }: { vendor: Vendor | null; vendorId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<ViewMode>("main");
  const [currentVendor, setCurrentVendor] = useState<Vendor>(() => vendor ?? createEmptyVendor(vendorId));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [draft, setDraft] = useState(() => draftFromVendor(vendor ?? createEmptyVendor(vendorId)));
  const [includedText, setIncludedText] = useState((vendor ?? createEmptyVendor(vendorId)).included.join("\n"));
  const [payments, setPayments] = useState<VendorPayment[]>((vendor ?? createEmptyVendor(vendorId)).payments);
  const [deliveries, setDeliveries] = useState<VendorDelivery[]>((vendor ?? createEmptyVendor(vendorId)).deliveries);
  const [files, setFiles] = useState<FileItem[]>(initialFiles(vendor ?? createEmptyVendor(vendorId)));

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
  const paidValue = payments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0);
  const totalValue = Number(draft.totalValue) || currentVendor.totalValue || 0;
  const pendingValue = Math.max(totalValue - paidValue, 0);
  const nextOpenPayment = payments.find((payment) => payment.status !== "pago");
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

  function addPayment(payment: { amount: number; dueDate: string; method: string; status: "pago" | "pendente" | "proximo" }) {
    const financePayment = saveVendorFinancePayment({
      vendorId: currentVendor.id,
      supplier: draft.name,
      category: draft.category,
      amount: payment.amount,
      dueDate: payment.dueDate,
      method: payment.method,
      status: payment.status
    });
    const vendorPayment: VendorPayment = {
      id: financePayment.id,
      name: `${payment.method} - ${formatDisplayDate(payment.dueDate)}`,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status,
      method: payment.method
    };
    const nextPayments = [vendorPayment, ...payments];
    setPayments(nextPayments);
    const paid = nextPayments.filter((item) => item.status === "pago").reduce((sum, item) => sum + item.amount, 0);
    update("paidValue", String(paid));
    setSavedMessage("Pagamento registrado.");
  }

  function markPaymentPaid(paymentId: string) {
    const nextPayments = payments.map((payment) => (payment.id === paymentId ? { ...payment, status: "pago" as const } : payment));
    setPayments(nextPayments);
    updateVendorFinancePaymentStatus(paymentId, "pago");
    update("paidValue", String(nextPayments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0)));
    setSavedMessage("Pagamento marcado como pago.");
  }

  function addDelivery(title: string) {
    setDeliveries((current) => [
      {
        id: `${currentVendor.id}-delivery-${Date.now()}`,
        title: title.trim(),
        status: "pendente",
        dueDate: "A definir",
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
      onAddPayment={() => setShowPaymentModal(true)}
      savedMessage={savedMessage}
      onSave={() => persist()}
      modal={<VendorPaymentModal open={showPaymentModal} supplier={draft.name} onClose={() => setShowPaymentModal(false)} onSave={addPayment} />}
    />;
  }

  if (view === "contrato") {
    return <ContratoView
      draft={draft}
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
            <CategoryMark category={draft.category} />
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
        <Button type="button" onClick={() => setShowPaymentModal(true)} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">
          <Wallet className="h-4 w-4" />
          Registrar pagamento
        </Button>
      </div>

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />
      <VendorPaymentModal open={showPaymentModal} supplier={draft.name} onClose={() => setShowPaymentModal(false)} onSave={addPayment} />
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

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-4 pt-5 md:px-8 lg:px-11">
      <button type="button" onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full bg-[#FFFDFC] ring-1 ring-[#EEE6E1]" aria-label="Voltar">
        <ArrowLeft className="h-4 w-4 text-[#4B2E2B]" />
      </button>
      <h1 className="font-serif text-2xl text-[#4B2E2B]">{title}</h1>
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
  onAdd: (title: string) => void;
}) {
  const [tab, setTab] = useState<"pendentes" | "concluidas">("pendentes");
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  function submitTask() {
    if (!newTaskTitle.trim()) return;
    onAdd(newTaskTitle);
    setNewTaskTitle("");
    setShowNewTask(false);
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader title="Tarefas" onBack={onBack} />
      <div className="px-4 pt-4 md:px-8 lg:px-11">
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

        {showNewTask && (
          <div className="mt-4 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
            <input
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitTask(); }}
              placeholder="Qual tarefa precisa ser feita?"
              className="w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none placeholder:text-[#C0B0AC]"
            />
            <div className="mt-3 flex gap-2">
              <Button type="button" onClick={submitTask} className="h-9 rounded-xl bg-[#D96C8A] px-4 text-sm hover:bg-[#C85D7B]">Adicionar</Button>
              <Button type="button" variant="outline" onClick={() => setShowNewTask(false)} className="h-9 rounded-xl px-4 text-sm">Cancelar</Button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={() => setShowNewTask(true)} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">
          <Plus className="h-4 w-4" />
          Nova tarefa
        </Button>
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
  onAddPayment: () => void;
  savedMessage: string;
  onSave: () => void;
  modal: React.ReactNode;
}) {
  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader title="Financeiro" onBack={onBack} />
      <div className="space-y-4 px-4 pt-4 md:px-8 lg:px-11">
        <div className="rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <div className="grid grid-cols-3 gap-3">
            <MetricTile label="Contratado" value={money(totalValue)} />
            <MetricTile label="Pago" value={money(paidValue)} green />
            <MetricTile label="Pendente" value={money(pendingValue)} warn />
          </div>
          <label className="mt-3 block text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">
            Valor total
            <input
              value={draft.totalValue}
              onChange={(e) => onUpdate("totalValue", e.target.value)}
              onBlur={onSave}
              className="mt-1 h-11 w-full rounded-xl border border-[#EEE6E1] bg-[#F8F4F1] px-4 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
            />
          </label>
        </div>
        {savedMessage ? <p className="rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p> : null}
        <div className="space-y-2">
          {payments.map((payment) => (
            <article key={payment.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#4B2E2B]">{payment.name}</p>
                <p className="mt-0.5 text-xs text-[#8A716D]">{payment.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-lg text-[#4B2E2B]">{money(payment.amount)}</p>
                {payment.status === "pago" ? (
                  <span className="mt-1 inline-flex rounded-full bg-[#EAF3DE] px-2 py-0.5 text-xs font-bold text-[#27500A]">Pago</span>
                ) : (
                  <button type="button" onClick={() => onMarkPaid(payment.id)} className="mt-1 text-xs font-bold text-[#5F7752]">Marcar como pago</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={onAddPayment} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">
          <Plus className="h-4 w-4" />Adicionar pagamento
        </Button>
      </div>
      {modal}
    </div>
  );
}

function ContratoView({
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
  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader title="Contrato" onBack={onBack} />
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
        <ContractField label="Data de assinatura" value={draft.signedAt} onChange={(v) => onUpdate("signedAt", v)} placeholder="AAAA-MM-DD" />
        <ContractField label="Link ou PDF" value={draft.contractLink} onChange={(v) => onUpdate("contractLink", v)} placeholder="https://..." />
        <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Observações do contrato</span>
          <textarea
            value={draft.contractNotes}
            onChange={(e) => onUpdate("contractNotes", e.target.value)}
            className="mt-2 min-h-[120px] w-full resize-none bg-transparent text-sm text-[#4B2E2B] outline-none"
          />
        </label>
      </div>
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={onSave} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">Salvar contrato</Button>
      </div>
    </div>
  );
}

function ContractField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block rounded-2xl bg-[#FFFDFC] p-4 shadow-[0_8px_28px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">{label}</span>
      <input
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
      <SubHeader title="Arquivos" onBack={onBack} />
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
          <p className="rounded-2xl bg-[#FFFDFC] p-5 text-sm text-[#8A716D]">Nenhum arquivo ainda. Inclua orçamento, contrato, comprovante ou referência.</p>
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
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader title="Pacote contratado" onBack={onBack} />
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
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={onSave} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">Salvar pacote</Button>
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
  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-[#F8F4F1] pb-28 md:-mx-8 lg:-mx-11">
      <SubHeader title="Observações" onBack={onBack} />
      <div className="space-y-4 px-4 pt-4 md:px-8 lg:px-11">
        {savedMessage ? <p className="rounded-xl bg-[#EAF3DE] px-4 py-2 text-sm font-semibold text-[#27500A]">{savedMessage}</p> : null}
        <div className="grid gap-3">
          <EditableField label="Responsável" value={draft.responsible} onChange={(v) => onUpdate("responsible", v)} />
          <EditableField label="WhatsApp" value={draft.whatsapp} onChange={(v) => onUpdate("whatsapp", v)} />
          <EditableField label="Instagram" value={draft.instagram} onChange={(v) => onUpdate("instagram", v)} />
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
      <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[#EEE6E1] bg-[#F8F4F1] px-4 pb-6 pt-3 md:px-8 lg:px-11">
        <Button type="button" onClick={onSave} className="h-13 w-full rounded-xl bg-[#D96C8A] py-3.5 text-base font-semibold hover:bg-[#C85D7B]">Salvar observações</Button>
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

function mergeVendorPayments(vendorPayments: VendorPayment[], financePayments: Array<{ id: string; amount: number; dueDate: string; status: VendorPayment["status"]; method?: string }>) {
  const existingIds = new Set(vendorPayments.map((payment) => payment.id));
  const fromFinance: VendorPayment[] = financePayments
    .filter((payment) => !existingIds.has(payment.id))
    .map((payment) => ({
      id: payment.id,
      name: `${payment.method ?? "Pagamento"} - ${formatDisplayDate(payment.dueDate)}`,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status,
      method: payment.method
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
