"use client";

import { ArrowLeft, Heart, MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuoteProposal } from "@/types/quotes";

type QuoteComparisonProps = {
  category: string;
  proposals: QuoteProposal[];
  onCompare: () => void;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
};

export function QuoteComparison({ category, proposals, onCompare, onToggleFavorite, onBack }: QuoteComparisonProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-[#FFFDFC] p-5 shadow-[0_18px_55px_rgba(75,46,43,0.08)] ring-1 ring-[#EEE6E1]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A716D]">Fornecedores &gt; Orçando</p>
            <h2 className="mt-2 font-serif text-4xl text-[#4B2E2B]">{category}</h2>
            <p className="mt-2 text-sm leading-6 text-[#8A716D]">
              Propostas recebidas em resumo. Para decidir, deixe a Sofia traduzir preco, entrega e pontos de atencao.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onBack} className="border-[#EEE6E1] bg-[#FFFDFC]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Voltar
            </Button>
            <Button type="button" onClick={onCompare} className="bg-[#D96C8A] hover:bg-[#C85D7B]">
              <Sparkles className="h-4 w-4" aria-hidden />
              Comparar com Sofia
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {proposals.map((proposal) => (
          <article key={proposal.id} className="rounded-[24px] bg-[#FFFDFC] p-5 shadow-[0_16px_45px_rgba(75,46,43,0.07)] ring-1 ring-[#EEE6E1]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-2xl text-[#4B2E2B]">{proposal.vendor}</h3>
                <p className="mt-1 text-sm font-semibold text-[#D96C8A]">{proposal.priceLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => onToggleFavorite(proposal.id)}
                className={proposal.isFavorite ? "text-[#D96C8A]" : "text-[#8A716D]"}
                aria-label="Marcar como favorito"
              >
                <Heart className="h-5 w-5" fill={proposal.isFavorite ? "currentColor" : "none"} aria-hidden />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#8A716D]">{proposal.shortSummary}</p>
            <div className="mt-4 space-y-2">
              {proposal.strengths.slice(0, 2).map((item) => (
                <p key={item} className="rounded-2xl bg-[#EEF3EA] px-3 py-2 text-xs font-medium text-[#4B2E2B]">{item}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" onClick={onCompare} className="bg-[#D96C8A] hover:bg-[#C85D7B]">
                <Sparkles className="h-4 w-4" aria-hidden />
                Sofia
              </Button>
              <Button asChild variant="outline" className="border-[#EEE6E1] bg-[#FFFDFC]">
                <a href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Ola, gostaria de tirar algumas duvidas sobre a proposta de ${category}.`)}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
