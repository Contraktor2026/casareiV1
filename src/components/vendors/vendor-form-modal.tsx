"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { vendorCategories } from "@/lib/mock/vendors";
import type { Vendor, VendorCategory, VendorPayment, VendorStatus } from "@/types/vendors";

type VendorFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (vendor: Vendor, addAnother?: boolean) => void;
  initialStatus?: VendorStatus;
  initialCategory?: VendorCategory;
  title?: string;
  eyebrow?: string;
};

const paymentMethods = ["Pix", "Cartão de crédito", "Cartão de débito", "Boleto", "Transferência", "Dinheiro"];
const installmentOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12];

type Installment = { value: string; date: string };

function parseCurrencyInput(raw: string): number {
  return Number(raw.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}

function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
}

function formatDateDisplay(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(d).replace(".", "").toUpperCase();
}

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
  const [included, setIncluded] = useState("");
  const [note, setNote] = useState("");
  const [contractStatus, setContractStatus] = useState<"nao-enviado" | "enviado" | "assinado">("nao-enviado");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [installmentCount, setInstallmentCount] = useState(1);
  const [installments, setInstallments] = useState<Installment[]>([{ value: "", date: "" }]);

  useEffect(() => {
    if (open) setCategory(initialCategory);
  }, [initialCategory, open]);

  function changeInstallmentCount(n: number) {
    setInstallmentCount(n);
    setInstallments((prev) =>
      Array.from({ length: n }, (_, i) => prev[i] ?? { value: prev[0]?.value ?? "", date: "" })
    );
  }

  function updateInstallment(index: number, field: keyof Installment, raw: string) {
    const val = field === "value" ? formatCurrencyInput(raw) : raw;
    setInstallments((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: val } : row)));
  }

  if (!open) return null;

  function save(addAnother = false) {
    if (!name.trim()) return;

    const id = `${name}-${Date.now()}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const parsedInstallments = installments.map((item, i) => ({
      id: `${id}-payment-${i + 1}`,
      name: installmentCount === 1 ? `${paymentMethod}` : `${paymentMethod} - Parcela ${i + 1}/${installmentCount}`,
      amount: parseCurrencyInput(item.value),
      dueDate: item.date,
      status: "pendente" as const,
      method: paymentMethod
    }));

    const totalValue = parsedInstallments.reduce((sum, p) => sum + p.amount, 0);
    const firstPayment = parsedInstallments[0];
    const nextPayment = firstPayment?.dueDate
      ? `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(firstPayment.amount)} em ${formatDateDisplay(firstPayment.dueDate)}`
      : "A definir";

    const payments: VendorPayment[] = parsedInstallments.filter((p) => p.amount > 0 && p.dueDate);

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
      totalValue,
      paidValue: 0,
      nextPayment,
      contract: {
        sent: contractStatus === "enviado" || contractStatus === "assinado",
        signed: contractStatus === "assinado",
        signedAt: contractStatus === "assinado" ? new Date().toISOString().slice(0, 10) : undefined,
        notes:
          contractStatus === "assinado"
            ? "Contrato assinado."
            : contractStatus === "enviado"
              ? "Contrato enviado, aguardando assinatura."
              : "Contrato ainda nao assinado.",
        clauses: []
      },
      included: included
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      nextMilestone:
        initialStatus === "Fechado" && contractStatus !== "assinado"
          ? "Assinar contrato"
          : initialStatus === "Fechado"
            ? "Revisar proximo pagamento"
            : "Definir proximos combinados",
      importantNote: note,
      payments,
      deliveries: [],
      notes: note,
      ceremonialNote: "",
      history: [
        {
          label: initialStatus === "Fechado" ? "fornecedor fechado adicionado" : "fornecedor adicionado",
          date: "hoje"
        }
      ],
      budgetCategory: category
    };

    onSave(vendor, addAnother);
    if (!addAnother) onClose();
    resetForm();
  }

  function resetForm() {
    setName("");
    setResponsible("");
    setWhatsapp("");
    setEmail("");
    setIncluded("");
    setNote("");
    setContractStatus("nao-enviado");
    setPaymentMethod("Pix");
    setInstallmentCount(1);
    setInstallments([{ value: "", date: "" }]);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#4B2E2B]/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 flex max-h-[92vh] w-full max-w-3xl -translate-x-1/2 flex-col rounded-t-[2rem] bg-[#FFFDFC] shadow-2xl md:top-1/2 md:max-h-[88vh] md:-translate-y-1/2 md:rounded-[2rem]">

        <div className="shrink-0 border-b border-[#EEE6E1] px-5 pb-4 pt-5 md:px-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#D96C8A]">{eyebrow}</p>
              <h2 className="mt-0.5 font-serif text-2xl text-[#4B2E2B]">{title}</h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" onClick={() => save(true)} variant="outline" className="h-9 rounded-full bg-white px-3 text-xs">+1</Button>
              <Button type="button" onClick={() => save(false)} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm text-white hover:bg-[#C85D7B]">Salvar</Button>
              <Button type="button" variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" aria-hidden /></Button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome do fornecedor" value={name} onChange={setName} />
            <label className="text-sm font-medium text-[#4B2E2B]">
              Categoria
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
              >
                {vendorCategories.filter((item) => item !== "Todos").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Field label="Responsável" value={responsible} onChange={setResponsible} />
            <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} />
            <Field label="Email" value={email} onChange={setEmail} />
            <label className="text-sm font-medium text-[#4B2E2B]">
              Status do contrato
              <select
                value={contractStatus}
                onChange={(e) => setContractStatus(e.target.value as typeof contractStatus)}
                className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
              >
                <option value="nao-enviado">Contrato ainda não assinado</option>
                <option value="enviado">Contrato enviado, aguardando assinatura</option>
                <option value="assinado">Contrato assinado</option>
              </select>
            </label>
            <Field label="O que está incluso" value={included} onChange={setIncluded} placeholder="Separe por vírgulas" />
            <Field label="Observações" value={note} onChange={setNote} />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-[#EEE6E1]" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A716D]">Pagamento</p>
              <div className="h-px flex-1 bg-[#EEE6E1]" />
            </div>

            <label className="block text-sm font-medium text-[#4B2E2B]">
              Forma de pagamento
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
              >
                {paymentMethods.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>

            <div>
              <p className="text-sm font-medium text-[#4B2E2B]">Número de parcelas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {installmentOptions.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => changeInstallmentCount(n)}
                    className={`h-10 min-w-[3rem] rounded-xl px-3 text-sm font-bold transition ${
                      installmentCount === n
                        ? "bg-[#D96C8A] text-white shadow-sm"
                        : "bg-[#F8F4F1] text-[#4B2E2B] hover:bg-[#F3C7D2]"
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {installments.map((row, i) => (
                <div key={i} className="rounded-2xl border border-[#EEE6E1] bg-[#F8F4F1] p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">
                    {installmentCount === 1 ? "Valor e vencimento" : `Parcela ${i + 1} de ${installmentCount}`}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-medium text-[#4B2E2B]">
                      Valor
                      <input
                        type="text"
                        inputMode="numeric"
                        value={row.value}
                        onChange={(e) => updateInstallment(i, "value", e.target.value)}
                        placeholder="0,00"
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
                      />
                    </label>
                    <label className="text-xs font-medium text-[#4B2E2B]">
                      Vencimento
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateInstallment(i, "date", e.target.value)}
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {installments.some((r) => r.value) && (
              <div className="rounded-2xl bg-[#F7EEDC] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Total contratado</p>
                  <p className="text-base font-bold text-[#7B5C2E]">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      installments.reduce((sum, r) => sum + parseCurrencyInput(r.value), 0)
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="text-sm font-medium text-[#4B2E2B]">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
      />
    </label>
  );
}
