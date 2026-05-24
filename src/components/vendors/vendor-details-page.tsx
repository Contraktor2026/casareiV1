"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  MessageCircle,
  PackageCheck,
  Plus,
  Save,
  Upload,
  Wallet,
  XCircle
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

type VendorTab = "resumo" | "financeiro" | "contrato" | "entregas" | "arquivos";

type FileItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
};

const tabs: Array<{ id: VendorTab; label: string; icon: React.ElementType }> = [
  { id: "resumo", label: "Resumo", icon: PackageCheck },
  { id: "financeiro", label: "Financeiro", icon: Wallet },
  { id: "contrato", label: "Contrato", icon: FileText },
  { id: "entregas", label: "Entregas", icon: CheckCircle2 },
  { id: "arquivos", label: "Arquivos", icon: FolderOpen }
];

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function VendorDetailsPage({ vendor, vendorId }: { vendor: Vendor | null; vendorId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<VendorTab>("resumo");
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
  const paidPercent = totalValue ? Math.min(100, Math.round((paidValue / totalValue) * 100)) : 0;

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
    setSavedMessage("Fornecedor salvo.");
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
    setSavedMessage("Pagamento entrou no fornecedor e no Financeiro.");
  }

  function markPaymentPaid(paymentId: string) {
    const nextPayments = payments.map((payment) => (payment.id === paymentId ? { ...payment, status: "pago" as const } : payment));
    setPayments(nextPayments);
    updateVendorFinancePaymentStatus(paymentId, "pago");
    update("paidValue", String(nextPayments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0)));
    setSavedMessage("Pagamento marcado como pago aqui e no Financeiro.");
  }

  function addDelivery() {
    const title = window.prompt("Qual entrega ou tarefa precisa entrar?");
    if (!title?.trim()) return;
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

  return (
    <>
      <div className="-mx-4 -mt-6 min-h-screen bg-[#F8F4F1] px-4 pb-28 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:py-8">
        <main className="mx-auto max-w-7xl space-y-5">
          <section className="rounded-[30px] bg-white p-5 shadow-[0_18px_55px_rgba(75,46,43,0.08)] ring-1 ring-[#EEE6E1] md:p-7">
            <button type="button" onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8A716D]">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            <div className="grid gap-5 lg:grid-cols-[1fr_420px] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4537E]">{draft.category}</p>
                <input
                  value={draft.name}
                  onChange={(event) => update("name", event.target.value)}
                  className="mt-2 w-full bg-transparent font-serif text-4xl leading-tight text-[#4B2E2B] outline-none md:text-6xl"
                />
                <textarea
                  value={draft.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  className="mt-3 min-h-[76px] w-full resize-none rounded-2xl bg-[#F8F4F1] p-4 text-sm leading-6 text-[#6F5B57] outline-none focus:ring-2 focus:ring-[#F4C0D1]"
                  placeholder="Observações importantes sobre este fornecedor"
                />
                {savedMessage ? <p className="mt-3 rounded-2xl bg-[#EAF3DE] px-4 py-3 text-sm font-bold text-[#27500A]">{savedMessage}</p> : null}
              </div>

              <div className="rounded-[24px] bg-[#FFF8F4] p-4">
                <div className="grid grid-cols-3 gap-2">
                  <MoneyMetric label="Contratado" value={money(totalValue)} tone="neutral" />
                  <MoneyMetric label="Pago" value={money(paidValue)} tone="ok" />
                  <MoneyMetric label="Pendente" value={money(pendingValue)} tone="warn" />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-[#639922]" style={{ width: `${paidPercent}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2">
                  <Button asChild className="bg-[#25D366] hover:bg-[#1DB954]">
                    <a href={`https://wa.me/${draft.whatsapp}`} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button type="button" onClick={() => setShowPaymentModal(true)} className="bg-[#D4537E] hover:bg-[#993556]">
                    <Wallet className="h-4 w-4" />
                    Pagamento
                  </Button>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-white">
                    <Upload className="h-4 w-4" />
                    Arquivo
                  </Button>
                  <Button type="button" variant="outline" onClick={() => persist()} className="bg-white">
                    <Save className="h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <nav className="flex gap-2 overflow-x-auto rounded-[22px] bg-white p-2 shadow-[0_12px_35px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#4B2E2B] px-4 text-sm font-bold text-white" : "inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-bold text-[#8A716D] hover:bg-[#F8F4F1]"}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "resumo" ? (
            <Panel title="Resumo do fornecedor">
              <div className="grid gap-3 md:grid-cols-3">
                <Editable label="Responsável" value={draft.responsible} onChange={(value) => update("responsible", value)} />
                <Editable label="Telefone" value={draft.phone} onChange={(value) => update("phone", value)} />
                <Editable label="WhatsApp" value={draft.whatsapp} onChange={(value) => update("whatsapp", value)} />
                <Editable label="Email" value={draft.email} onChange={(value) => update("email", value)} />
                <Editable label="Instagram" value={draft.instagram} onChange={(value) => update("instagram", value)} />
                <Editable label="Status" value={draft.status} onChange={(value) => update("status", value as typeof draft.status)} />
              </div>
              <div className="mt-5 rounded-2xl bg-[#F8F4F1] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">O que está incluso</p>
                <textarea
                  value={includedText}
                  onChange={(event) => setIncludedText(event.target.value)}
                  className="mt-3 min-h-[140px] w-full resize-none bg-transparent text-sm leading-7 text-[#4B2E2B] outline-none"
                  placeholder="Uma entrega por linha"
                />
              </div>
            </Panel>
          ) : null}

          {activeTab === "financeiro" ? (
            <Panel title="Financeiro" action={<Button type="button" onClick={() => setShowPaymentModal(true)} className="bg-[#D4537E] hover:bg-[#993556]"><Plus className="h-4 w-4" />Adicionar pagamento</Button>}>
              <div className="grid gap-3 md:grid-cols-3">
                <Editable label="Valor contratado" value={draft.totalValue} onChange={(value) => update("totalValue", value)} />
                <ReadOnly label="Valor pago" value={money(paidValue)} tone="ok" />
                <ReadOnly label="Valor pendente" value={money(pendingValue)} tone="warn" />
              </div>
              <div className="mt-5 space-y-3">
                {payments.length ? payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} onPaid={() => markPaymentPaid(payment.id)} />
                )) : <Empty text="Nenhuma parcela cadastrada ainda." />}
              </div>
            </Panel>
          ) : null}

          {activeTab === "contrato" ? (
            <Panel title="Contrato">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="block rounded-2xl bg-[#F8F4F1] p-4">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Status</span>
                  <select
                    value={draft.contractStatus}
                    onChange={(event) => update("contractStatus", event.target.value as typeof draft.contractStatus)}
                    className="mt-2 h-10 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none"
                  >
                    <option value="pendente">Não enviado</option>
                    <option value="enviado">Enviado</option>
                    <option value="assinado">Assinado</option>
                  </select>
                </label>
                <Editable label="Data assinatura" value={draft.signedAt} onChange={(value) => update("signedAt", value)} placeholder="AAAA-MM-DD" />
                <Editable label="Link ou PDF" value={draft.contractLink} onChange={(value) => update("contractLink", value)} placeholder="https://..." />
              </div>
              <textarea
                value={draft.contractNotes}
                onChange={(event) => update("contractNotes", event.target.value)}
                className="mt-4 min-h-[140px] w-full resize-none rounded-2xl bg-[#F8F4F1] p-4 text-sm leading-7 text-[#4B2E2B] outline-none"
              />
            </Panel>
          ) : null}

          {activeTab === "entregas" ? (
            <Panel title="Entregas e checklist" action={<Button type="button" onClick={addDelivery} className="bg-[#D4537E] hover:bg-[#993556]"><Plus className="h-4 w-4" />Adicionar</Button>}>
              <div className="grid gap-3 md:grid-cols-2">
                {deliveries.length ? deliveries.map((delivery) => (
                  <DeliveryCard key={delivery.id} delivery={delivery} onFinish={() => finishDelivery(delivery.id)} />
                )) : <Empty text="Nenhuma entrega cadastrada ainda." />}
              </div>
            </Panel>
          ) : null}

          {activeTab === "arquivos" ? (
            <Panel title="Arquivos" action={<Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#D4537E] hover:bg-[#993556]"><Upload className="h-4 w-4" />Incluir arquivo</Button>}>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {files.length ? files.map((file) => (
                  <div key={file.id} className="rounded-2xl bg-[#F8F4F1] p-4">
                    <p className="font-bold text-[#4B2E2B]">{file.name}</p>
                    <p className="mt-1 text-xs text-[#8A716D]">{file.category} · {formatBytes(file.size)}</p>
                  </div>
                )) : <Empty text="Nenhum arquivo ainda. Inclua orçamento, contrato, comprovante ou referência." />}
              </div>
            </Panel>
          ) : null}
        </main>
      </div>

      <VendorPaymentModal open={showPaymentModal} supplier={draft.name} onClose={() => setShowPaymentModal(false)} onSave={addPayment} />
    </>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1] md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-3xl text-[#4B2E2B]">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Editable({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block rounded-2xl bg-[#F8F4F1] p-4">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-9 w-full bg-transparent text-sm font-semibold text-[#4B2E2B] outline-none"
      />
    </label>
  );
}

function ReadOnly({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" }) {
  return (
    <div className="rounded-2xl bg-[#F8F4F1] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">{label}</p>
      <p className={tone === "ok" ? "mt-2 text-lg font-bold text-[#5F7752]" : "mt-2 text-lg font-bold text-[#B96F52]"}>{value}</p>
    </div>
  );
}

function MoneyMetric({ label, value, tone }: { label: string; value: string; tone: "neutral" | "ok" | "warn" }) {
  const text = tone === "ok" ? "text-[#5F7752]" : tone === "warn" ? "text-[#B96F52]" : "text-[#4B2E2B]";
  return (
    <div className="rounded-2xl bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A716D]">{label}</p>
      <p className={`mt-1 text-sm font-bold ${text}`}>{value}</p>
    </div>
  );
}

function PaymentCard({ payment, onPaid }: { payment: VendorPayment; onPaid: () => void }) {
  const paid = payment.status === "pago";
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8F4F1] p-4">
      <div>
        <p className="font-bold text-[#4B2E2B]">{payment.name}</p>
        <p className="mt-1 text-xs text-[#8A716D]">{payment.method ?? "Pagamento"} · {payment.dueDate}</p>
      </div>
      <div className="text-right">
        <p className="font-serif text-xl text-[#4B2E2B]">{money(payment.amount)}</p>
        <span className={paid ? "mt-1 inline-flex rounded-full bg-[#EAF3DE] px-2 py-1 text-xs font-bold text-[#27500A]" : "mt-1 inline-flex rounded-full bg-[#FAEEDA] px-2 py-1 text-xs font-bold text-[#633806]"}>
          {paid ? "Pago" : "Pendente"}
        </span>
        {!paid ? (
          <button type="button" onClick={onPaid} className="mt-2 block text-xs font-bold text-[#5F7752]">
            Marcar como pago
          </button>
        ) : null}
      </div>
    </article>
  );
}

function DeliveryCard({ delivery, onFinish }: { delivery: VendorDelivery; onFinish: () => void }) {
  const done = delivery.status === "concluido";
  return (
    <article className="rounded-2xl bg-[#F8F4F1] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-[#4B2E2B]">{delivery.title}</p>
          <p className="mt-1 text-xs text-[#8A716D]">{delivery.dueDate} · {delivery.responsible}</p>
        </div>
        {done ? <CheckCircle2 className="h-5 w-5 text-[#5F7752]" /> : <Clock3 className="h-5 w-5 text-[#B96F52]" />}
      </div>
      <p className="mt-3 text-sm leading-6 text-[#6F5B57]">{delivery.note}</p>
      {!done ? (
        <button type="button" onClick={onFinish} className="mt-3 text-xs font-bold text-[#5F7752]">
          Concluir entrega
        </button>
      ) : null}
    </article>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F4F1] p-5 text-sm text-[#8A716D]">
      <XCircle className="mb-2 h-5 w-5" />
      {text}
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

function formatDisplayDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
}
