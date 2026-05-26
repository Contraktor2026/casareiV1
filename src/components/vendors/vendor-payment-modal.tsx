"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaymentRow = { value: string; date: string };

type VendorPaymentModalProps = {
  open: boolean;
  supplier: string;
  title?: string;
  mode?: "contract" | "extra";
  onClose: () => void;
  onSave: (payment: { amount: number; dueDate: string; method: string; status: "pago" | "pendente" | "proximo"; description?: string; kind?: "contract" | "extra" }) => void;
};

const paymentMethods = ["Pix", "Cartão de crédito", "Cartão de débito", "Boleto", "Transferência", "Dinheiro"];
const installmentOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12];

function formatCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = parseInt(digits, 10);
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
}

function parseCurrencyInput(raw: string): number {
  return Number(raw.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;
}

export function VendorPaymentModal({ open, supplier, title = "Registrar pagamento", mode = "contract", onClose, onSave }: VendorPaymentModalProps) {
  const [method, setMethod] = useState("Pix");
  const [status, setStatus] = useState<"pago" | "pendente" | "proximo">("pendente");
  const [description, setDescription] = useState("");
  const [installmentCount, setInstallmentCount] = useState(1);
  const [rows, setRows] = useState<PaymentRow[]>([{ value: "", date: "" }]);
  const [error, setError] = useState("");

  if (!open) return null;

  function changeInstallmentCount(n: number) {
    setInstallmentCount(n);
    setRows((prev) =>
      Array.from({ length: n }, (_, i) => prev[i] ?? { value: prev[0]?.value ?? "", date: "" })
    );
  }

  function updateRow(index: number, field: keyof PaymentRow, raw: string) {
    const val = field === "value" ? formatCurrencyInput(raw) : raw;
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: val } : row)));
  }

  function save() {
    const validRows = rows.filter((r) => parseCurrencyInput(r.value) > 0 && r.date);
    if (!validRows.length) {
      setError("Preencha valor e data de ao menos uma parcela.");
      return;
    }

    validRows.forEach((r) => {
      onSave({ amount: parseCurrencyInput(r.value), dueDate: r.date, method, status, description: description.trim(), kind: mode });
    });

    setRows([{ value: "", date: "" }]);
    setInstallmentCount(1);
    setMethod("Pix");
    setStatus("pendente");
    setDescription("");
    setError("");
    onClose();
  }

  const total = rows.reduce((sum, r) => sum + parseCurrencyInput(r.value), 0);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 md:place-items-center md:p-6">
      <section className="flex max-h-[92vh] w-full flex-col rounded-t-[32px] bg-[#FFFDFC] shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-lg md:rounded-[32px]">

        <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#EEE6E1] px-5 pb-4 pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A716D]">{title}</p>
            <h2 className="mt-1 font-serif text-2xl text-[#4B2E2B]">{supplier}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" onClick={save} className="h-9 rounded-full bg-[#D96C8A] px-4 text-sm text-white hover:bg-[#C85D7B]">
              Salvar
            </Button>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[#F8F4F1]" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {mode === "extra" ? (
              <label className="block text-sm font-medium text-[#4B2E2B]">
                Descrição da despesa
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Taxa de deslocamento, hora extra, degustação"
                  className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
                />
              </label>
            ) : null}

            <label className="block text-sm font-medium text-[#4B2E2B]">
              Forma de pagamento
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
              >
                {paymentMethods.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-[#4B2E2B]">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="mt-2 h-12 w-full rounded-2xl border border-[#EEE6E1] bg-white px-4 outline-none focus:border-[#D96C8A]"
              >
                <option value="pendente">Pendente</option>
                <option value="proximo">Próximo</option>
                <option value="pago">Pago</option>
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
              {rows.map((row, i) => (
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
                        onChange={(e) => updateRow(i, "value", e.target.value)}
                        placeholder="0,00"
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
                      />
                    </label>
                    <label className="text-xs font-medium text-[#4B2E2B]">
                      Vencimento
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateRow(i, "date", e.target.value)}
                        className="mt-1.5 h-11 w-full rounded-xl border border-[#EEE6E1] bg-white px-3 text-sm font-semibold text-[#4B2E2B] outline-none focus:border-[#D96C8A]"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {total > 0 && (
              <div className="rounded-2xl bg-[#F7EEDC] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8A716D]">Total</p>
                  <p className="text-base font-bold text-[#7B5C2E]">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-2xl bg-[#FBEEE8] px-4 py-3 text-sm text-[#B96F52]">{error}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
