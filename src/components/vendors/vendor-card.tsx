"use client";

import Link from "next/link";
import { CheckCircle2, FileText, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Vendor } from "@/types/vendors";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const contractStatus = vendor.contract.signed ? "Contrato assinado" : vendor.contract.sent ? "Contrato enviado" : "Contrato pendente";

  return (
    <article className="rounded-[26px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.08)] ring-1 ring-[#EEE6E1] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(75,46,43,0.11)]">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1.4fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A716D]">{vendor.category}</p>
          <Link href={`/app/fornecedores/${vendor.id}`} className="mt-2 block font-serif text-3xl leading-tight text-[#4B2E2B]">
            {vendor.name}
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Info label="Contrato" value={contractStatus} tone={vendor.contract.signed ? "success" : "neutral"} />
          <Info label="Valor total" value={money(vendor.totalValue)} />
          <Info label="Proxima parcela" value={vendor.nextPayment} tone="warning" />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F8F4F1] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A716D]">Proxima tarefa</p>
            <p className="mt-1 text-sm leading-6 text-[#4B2E2B]">{vendor.nextMilestone}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button asChild variant="whatsapp" className="bg-[#D96C8A] hover:bg-[#C85D7B]">
              <a href={`https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(`Ola, ${vendor.name}!`)}`} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="border-[#EEE6E1] bg-[#FFFDFC] text-[#4B2E2B] hover:bg-[#F8F4F1]">
              <Link href={`/app/fornecedores/${vendor.id}`}>
                <FileText className="h-4 w-4" aria-hidden />
                Ver detalhes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "warning" }) {
  const iconColor = tone === "success" ? "text-[#9CAF88]" : tone === "warning" ? "text-[#D28B6E]" : "text-[#C6A77D]";

  return (
    <div className="rounded-2xl bg-[#FFFDFC] p-3 ring-1 ring-[#EEE6E1]">
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className={`h-3.5 w-3.5 ${iconColor}`} aria-hidden />
        <p className="text-xs text-[#8A716D]">{label}</p>
      </div>
      <p className="mt-1 text-sm font-semibold leading-5 text-[#4B2E2B]">{value}</p>
    </div>
  );
}
