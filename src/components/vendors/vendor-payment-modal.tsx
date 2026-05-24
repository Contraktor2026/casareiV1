"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type VendorPaymentModalProps = {
  open: boolean;
  supplier: string;
  onClose: () => void;
  onSave: (payment: { amount: number; dueDate: string; method: string; status: "pago" | "pendente" | "proximo" }) => void;
};

const paymentMethods = ["Pix", "Cartao de credito", "Cartao de debito", "Boleto", "Transferencia", "Dinheiro"];

export function VendorPaymentModal({ open, supplier, onClose, onSave }: VendorPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [method, setMethod] = useState("Pix");
  const [status, setStatus] = useState<"pago" | "pendente" | "proximo">("pendente");
  const [error, setError] = useState("");

  if (!open) return null;

  function save() {
    const numericAmount = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!numericAmount || numericAmount <= 0) {
      setError("Informe o valor do pagamento.");
      return;
    }
    if (!dueDate) {
      setError("Informe a data do pagamento.");
      return;
    }

    onSave({ amount: numericAmount, dueDate, method, status });
    setAmount("");
    setDueDate("");
    setMethod("Pix");
    setStatus("pendente");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 md:place-items-center md:p-6">
      <section className="w-full rounded-t-[32px] bg-[#FFFDFC] p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-lg md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A716D]">Registrar pagamento</p>
            <h2 className="mt-2 font-serif text-3xl text-[#4B2E2B]">{supplier}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F4F1] text-[#4B2E2B]" aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="text-sm font-medium text-[#4B2E2B]">
            Valor
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Ex: 1500,00"
              inputMode="decimal"
              className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
            />
          </label>
          <label className="text-sm font-medium text-[#4B2E2B]">
            Data
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
            />
          </label>
          <label className="text-sm font-medium text-[#4B2E2B]">
            Forma de pagamento
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
            >
              {paymentMethods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-[#4B2E2B]">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "pago" | "pendente" | "proximo")}
              className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
            >
              <option value="pendente">Pendente</option>
              <option value="proximo">Proximo</option>
              <option value="pago">Pago</option>
            </select>
          </label>
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-[#FBEEE8] px-4 py-3 text-sm text-[#4B2E2B]">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="bg-white" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={save} className="bg-[#D96C8A] hover:bg-[#C85D7B]">Registrar pagamento</Button>
        </div>
      </section>
    </div>
  );
}
