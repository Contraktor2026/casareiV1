"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { vendorCategories } from "@/lib/mock/vendors";
import type { Vendor, VendorCategory, VendorStatus } from "@/types/vendors";

type VendorFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (vendor: Vendor, addAnother?: boolean) => void;
  initialStatus?: VendorStatus;
  initialCategory?: VendorCategory;
  title?: string;
  eyebrow?: string;
};

export function VendorFormModal({
  open,
  onClose,
  onSave,
  initialStatus = "Cotando",
  initialCategory = "Fotografia",
  title = "Adicionar fornecedor",
  eyebrow = "Novo fornecedor"
}: VendorFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>(initialCategory);
  const [responsible, setResponsible] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [paidValue, setPaidValue] = useState("");
  const [nextPaymentAmount, setNextPaymentAmount] = useState("");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [included, setIncluded] = useState("");
  const [note, setNote] = useState("");
  const [contractStatus, setContractStatus] = useState<"nao-enviado" | "enviado" | "assinado">("nao-enviado");

  useEffect(() => {
    if (open) setCategory(initialCategory);
  }, [initialCategory, open]);

  if (!open) return null;

  function save(addAnother = false) {
    if (!name.trim()) return;

    const id = `${name}-${Date.now()}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const vendor: Vendor = {
      id,
      name,
      category,
      status: initialStatus,
      responsible: responsible || name.split(" ")[0],
      whatsapp: whatsapp || "5511999999999",
      phone: whatsapp || "(11) 99999-9999",
      email: email || `${id}@email.com`,
      instagram: "",
      site: "",
      city: "",
      address: "",
      serviceHours: "",
      totalValue: Number(totalValue) || 0,
      paidValue: Number(paidValue) || 0,
      nextPayment: formatNextPayment(nextPaymentAmount, nextPaymentDate),
      contract: {
        sent: contractStatus === "enviado" || contractStatus === "assinado",
        signed: contractStatus === "assinado",
        signedAt: contractStatus === "assinado" ? new Date().toISOString().slice(0, 10) : undefined,
        notes: contractStatus === "assinado" ? "Contrato assinado." : contractStatus === "enviado" ? "Contrato enviado, aguardando assinatura." : "Fornecedor pode estar fechado, mas o contrato ainda nao foi assinado.",
        clauses: []
      },
      included: included.split(",").map((item) => item.trim()).filter(Boolean),
      nextMilestone: initialStatus === "Fechado" && contractStatus !== "assinado" ? "Assinar contrato" : initialStatus === "Fechado" ? "Revisar proximo pagamento" : "Definir proximos combinados",
      importantNote: note,
      payments: [],
      deliveries: [],
      notes: note,
      ceremonialNote: "",
      history: [{ label: initialStatus === "Fechado" ? "fornecedor fechado adicionado" : "fornecedor adicionado", date: "hoje" }],
      budgetCategory: category
    };

    onSave(vendor, addAnother);
    if (!addAnother) onClose();
    setName("");
    setResponsible("");
    setWhatsapp("");
    setEmail("");
    setTotalValue("");
    setPaidValue("");
    setNextPaymentAmount("");
    setNextPaymentDate("");
    setIncluded("");
    setNote("");
    setContractStatus("nao-enviado");
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#4B2E2B]/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 max-h-[92vh] w-full max-w-3xl -translate-x-1/2 overflow-y-auto rounded-t-[2rem] bg-[#FFFDFC] p-5 shadow-2xl md:top-1/2 md:max-h-[88vh] md:-translate-y-1/2 md:rounded-[2rem] md:p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-[#D96C8A]">{eyebrow}</p>
            <h2 className="mt-1 font-serif text-3xl text-[#4B2E2B]">{title}</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Nome do fornecedor" value={name} onChange={setName} />
          <label className="text-sm font-medium text-[#4B2E2B]">
            Categoria
            <select value={category} onChange={(event) => setCategory(event.target.value as VendorCategory)} className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]">
              {vendorCategories.filter((item) => item !== "Todos").map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <Field label="Responsavel" value={responsible} onChange={setResponsible} />
          <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Valor total" value={totalValue} onChange={setTotalValue} />
          <Field label="Valor ja pago" value={paidValue} onChange={setPaidValue} />
          <Field label="Valor do proximo pagamento" value={nextPaymentAmount} onChange={setNextPaymentAmount} placeholder="Ex: 1500,00" />
          <label className="text-sm font-medium text-[#4B2E2B]">
            Data do proximo pagamento
            <input
              type="date"
              value={nextPaymentDate}
              onChange={(event) => setNextPaymentDate(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
            />
          </label>
          <label className="text-sm font-medium text-[#4B2E2B]">
            Status do contrato
            <select
              value={contractStatus}
              onChange={(event) => setContractStatus(event.target.value as "nao-enviado" | "enviado" | "assinado")}
              className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
            >
              <option value="nao-enviado">Fechado, mas contrato ainda nao assinado</option>
              <option value="enviado">Contrato enviado, aguardando assinatura</option>
              <option value="assinado">Contrato assinado</option>
            </select>
          </label>
          <Field label="O que esta incluso" value={included} onChange={setIncluded} placeholder="Separe por virgulas" />
          <Field label="Observacoes" value={note} onChange={setNote} />
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="bg-white" onClick={onClose}>Cancelar</Button>
          <Button type="button" variant="outline" className="bg-white" onClick={() => save(true)}>Salvar e adicionar outro</Button>
          <Button type="button" onClick={() => save(false)} className="bg-[#D96C8A] hover:bg-[#C85D7B]">Salvar fornecedor</Button>
        </div>
      </div>
    </div>
  );
}

function formatNextPayment(amount: string, date: string) {
  const cleanAmount = amount.trim();
  const cleanDate = date.trim();

  if (!cleanAmount && !cleanDate) return "A definir";
  if (cleanAmount && !cleanDate) return `${formatCurrencyText(cleanAmount)} - data a definir`;
  if (!cleanAmount && cleanDate) return `Valor a definir em ${formatDateText(cleanDate)}`;
  return `${formatCurrencyText(cleanAmount)} em ${formatDateText(cleanDate)}`;
}

function formatCurrencyText(value: string) {
  const parsed = Number(value.replace(/\./g, "").replace(",", "."));
  if (!parsed) return value;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parsed);
}

function formatDateText(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(parsed);
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="text-sm font-medium text-[#4B2E2B]">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]" />
    </label>
  );
}
