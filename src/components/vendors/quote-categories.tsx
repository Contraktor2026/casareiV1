"use client";

import { BarChart3, FileText, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuoteProposal } from "@/types/quotes";

type QuoteCategoriesProps = {
  proposals: QuoteProposal[];
  onCompare: (category: string) => void;
  onOpenCategory: (category: string) => void;
  onAddQuote: () => void;
};

export function QuoteCategories({ proposals, onCompare, onOpenCategory, onAddQuote }: QuoteCategoriesProps) {
  const categories = Array.from(new Set(proposals.map((proposal) => proposal.category)));

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#4B2E2B]">Categorias em orçamento</h2>
          <p className="mt-1 text-sm leading-6 text-[#8A716D]">
            Primeiro escolha o assunto. A Sofia compara as propostas sem transformar isso em planilha.
          </p>
        </div>
        <Button type="button" onClick={onAddQuote} className="bg-[#D96C8A] hover:bg-[#C85D7B]">
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar orcamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const count = proposals.filter((proposal) => proposal.category === category).length;
          return (
            <article key={category} className="rounded-[26px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.08)] ring-1 ring-[#EEE6E1]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A716D]">Orçando</p>
                  <h3 className="mt-2 font-serif text-3xl text-[#4B2E2B]">{category}</h3>
                  <p className="mt-1 text-sm text-[#8A716D]">
                    {count} proposta{count === 1 ? "" : "s"} recebida{count === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button type="button" onClick={() => onCompare(category)} className="bg-[#D96C8A] hover:bg-[#C85D7B]">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Comparar com Sofia
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenCategory(category)} className="border-[#EEE6E1] bg-[#FFFDFC]">
                  <FileText className="h-4 w-4" aria-hidden />
                  Ver propostas
                </Button>
              </div>

              <button type="button" onClick={() => onOpenCategory(category)} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#8A716D]">
                <BarChart3 className="h-3.5 w-3.5" aria-hidden />
                Ver comparacao detalhada
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
