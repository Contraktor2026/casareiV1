"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Heart, MessageCircle, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuoteProposal } from "@/types/quotes";

type SofiaQuotePanelProps = {
  open: boolean;
  category: string;
  proposals: QuoteProposal[];
  onClose: () => void;
  onFavorite: (id: string) => void;
  onShowDetails: () => void;
  onCloseVendor: (proposal: QuoteProposal) => void;
};

const quickPrompts = [
  "Comparar custo-beneficio",
  "Ver o que cada um entrega",
  "Qual combina mais com nosso estilo?",
  "Qual esta mais completo?",
  "Quais pontos preciso perguntar?"
];

export function SofiaQuotePanel({ open, category, proposals, onClose, onFavorite, onShowDetails, onCloseVendor }: SofiaQuotePanelProps) {
  const [activePrompt, setActivePrompt] = useState(quickPrompts[0]);
  const activeAnswer = useMemo(() => buildPromptAnswer(activePrompt, proposals), [activePrompt, proposals]);
  if (!open) return null;

  const sorted = [...proposals].sort((a, b) => b.compatibility - a.compatibility);
  const best = sorted[0];
  const economical = [...proposals].sort((a, b) => a.price - b.price)[0];
  const questions = [
    `O valor de ${category} inclui deslocamento, taxas e hora extra?`,
    "O que acontece se precisarmos alterar horario ou escopo?",
    "Quais entregas ficam descritas no contrato?",
    "Qual e o prazo real de entrega depois do casamento?"
  ];
  const questionText = questions.join("\n");

  return (
    <div className="fixed inset-0 z-50 bg-black/24">
      <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[32px] bg-[#F8F4F1] p-4 shadow-[0_-24px_80px_rgba(75,46,43,0.22)] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[460px] md:max-h-none md:rounded-l-[32px] md:rounded-tr-none md:p-5">
        <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-center justify-between bg-[#F8F4F1]/95 px-4 py-4 backdrop-blur md:-mx-5 md:-mt-5 md:px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F8E7EC] text-[#D96C8A]">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A716D]">Sofia compara</p>
              <h2 className="font-serif text-2xl text-[#4B2E2B]">{category}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#FFFDFC] text-[#4B2E2B]" aria-label="Fechar Sofia">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 pb-4">
          <div className="rounded-[24px] bg-[#FFFDFC] p-5 shadow-[0_16px_45px_rgba(75,46,43,0.08)]">
            <p className="text-sm leading-7 text-[#4B2E2B]">
              Mari, analisei as propostas de {category.toLowerCase()} que voces receberam. Posso comparar pelo que mais importa para voces: preco, entrega ou estilo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setActivePrompt(prompt)}
                className={activePrompt === prompt ? "rounded-full bg-[#4B2E2B] px-3 py-2 text-xs font-semibold text-white shadow-sm" : "rounded-full bg-[#FFFDFC] px-3 py-2 text-xs font-semibold text-[#4B2E2B] shadow-sm ring-1 ring-[#EEE6E1]"}
              >
                {prompt}
              </button>
            ))}
          </div>

          {activeAnswer ? (
            <div className="rounded-[24px] bg-[#FFFDFC] p-5 shadow-[0_16px_45px_rgba(75,46,43,0.08)]">
              <p className="text-sm leading-7 text-[#4B2E2B]">{activeAnswer}</p>
            </div>
          ) : best ? (
            <div className="rounded-[24px] bg-[#FFFDFC] p-5 shadow-[0_16px_45px_rgba(75,46,43,0.08)]">
              <p className="text-sm leading-7 text-[#4B2E2B]">
                {best.vendor} parece a proposta mais completa agora. Custa {best.priceLabel}, entrega {best.includes.slice(0, 3).join(", ")}
                {economical && economical.id !== best.id ? `, enquanto ${economical.vendor} e mais economica, mas pede atencao em ${economical.notIncluded.slice(0, 2).join(" e ")}.` : "."}
              </p>
            </div>
          ) : null}

          <PanelBlock title="Resumo simples das propostas">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="rounded-2xl bg-[#F8F4F1] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#4B2E2B]">{proposal.vendor}</p>
                    <p className="mt-1 text-xs leading-5 text-[#8A716D]">{proposal.shortSummary}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#D96C8A]">{proposal.priceLabel}</span>
                </div>
              </div>
            ))}
          </PanelBlock>

          <PanelBlock title="Pontos fortes">
            {sorted.slice(0, 2).map((proposal) => (
              <p key={proposal.id} className="flex gap-2 text-sm leading-6 text-[#4B2E2B]">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#9CAF88]" aria-hidden />
                {proposal.vendor}: {proposal.strengths.slice(0, 2).join(", ")}.
              </p>
            ))}
          </PanelBlock>

          <PanelBlock title="Pontos de atencao">
            {proposals.flatMap((proposal) => proposal.attentionPoints.slice(0, 1).map((point) => `${proposal.vendor}: ${point}`)).map((point) => (
              <p key={point} className="rounded-2xl bg-[#FBEEE8] px-3 py-2 text-sm leading-6 text-[#4B2E2B]">{point}</p>
            ))}
          </PanelBlock>

          <PanelBlock title="Perguntas para enviar">
            {questions.map((question) => (
              <p key={question} className="text-sm leading-6 text-[#4B2E2B]">{question}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="border-[#EEE6E1] bg-[#FFFDFC]" onClick={() => navigator.clipboard?.writeText(questionText)}>
                <Copy className="h-4 w-4" aria-hidden />
                Copiar perguntas
              </Button>
              <Button asChild variant="outline" className="border-[#EEE6E1] bg-[#FFFDFC]">
                <a href={`https://wa.me/5511999999999?text=${encodeURIComponent(questionText)}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Abrir WhatsApp
                </a>
              </Button>
            </div>
          </PanelBlock>

          {best ? (
            <div className="grid gap-2">
              <Button type="button" onClick={() => onFavorite(best.id)} className="bg-[#D96C8A] hover:bg-[#C85D7B]">
                <Heart className="h-4 w-4" aria-hidden />
                Marcar {best.vendor} como favorito
              </Button>
              <Button type="button" variant="outline" onClick={() => onCloseVendor(best)} className="border-[#EEE6E1] bg-[#FFFDFC]">
                Fechar fornecedor
              </Button>
              <button type="button" onClick={onShowDetails} className="py-2 text-xs font-semibold text-[#8A716D]">Ver comparacao detalhada</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function buildPromptAnswer(prompt: string, proposals: QuoteProposal[]) {
  const sorted = [...proposals].sort((a, b) => b.compatibility - a.compatibility);
  const best = sorted[0];
  const cheapest = [...proposals].sort((a, b) => a.price - b.price)[0];
  if (!best) return "";

  if (prompt === "Comparar custo-beneficio") {
    return `${best.vendor} tem o melhor equilibrio agora: entrega ${best.includes.slice(0, 3).join(", ")} por ${best.priceLabel}. ${cheapest && cheapest.id !== best.id ? `${cheapest.vendor} custa menos, mas deixa de fora ${cheapest.notIncluded.slice(0, 2).join(" e ")}.` : ""}`;
  }
  if (prompt === "Ver o que cada um entrega") {
    return proposals.map((proposal) => `${proposal.vendor}: ${proposal.includes.slice(0, 4).join(", ")}.`).join(" ");
  }
  if (prompt === "Qual combina mais com nosso estilo?") {
    return `${best.vendor} parece mais alinhado ao estilo de voces porque ${best.compatibilityReasons.slice(0, 3).join(", ")}. Eu olharia essa proposta com mais carinho antes de negociar.`;
  }
  if (prompt === "Qual esta mais completo?") {
    return `${best.vendor} esta mais completo: inclui ${best.includes.slice(0, 5).join(", ")}. Os pontos de atencao sao ${best.attentionPoints.join(", ")}.`;
  }
  return `Eu perguntaria sobre: ${proposals.flatMap((proposal) => proposal.attentionPoints).slice(0, 4).join("; ")}. Tambem confirmaria prazo, deslocamento, taxas e o que entra exatamente no contrato.`;
}

function PanelBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[24px] bg-[#FFFDFC] p-5 shadow-[0_16px_45px_rgba(75,46,43,0.07)]">
      <h3 className="font-serif text-2xl text-[#4B2E2B]">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}
