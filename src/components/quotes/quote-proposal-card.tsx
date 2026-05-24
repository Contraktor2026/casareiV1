"use client";

import { AlertCircle, CheckCircle2, Heart, Star, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { QuoteProposal } from "@/types/quotes";
import { cn } from "@/lib/utils";

type QuoteProposalCardProps = {
  proposal: QuoteProposal;
  onToggleFavorite: (id: string) => void;
};

export function QuoteProposalCard({ proposal, onToggleFavorite }: QuoteProposalCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const photographyHighlights =
    proposal.category === "Fotografia"
      ? [
          {
            label: "Cobertura completa",
            value: proposal.details["Cobertura completa"] ? "Sim, do making of até a festa" : "Parcial"
          },
          {
            label: "Ensaio pré-wedding",
            value: proposal.details["Ensaio pré-wedding"] ? "Incluso" : "Não incluso"
          }
        ]
      : [];

  return (
    <article className="flex min-h-[560px] flex-col rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 shadow-[0_18px_52px_rgba(114,36,62,0.10)] ring-1 ring-casarei-primary-light/20 transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(114,36,62,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{proposal.category}</p>
          <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-casarei-primary-deep">{proposal.vendor}</h2>
          <p className="mt-2 text-sm leading-6 text-casarei-text">{proposal.shortSummary}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(proposal.id)}
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition",
            proposal.isFavorite
              ? "border-casarei-primary bg-casarei-primary text-white"
              : "border-casarei-border-soft bg-white text-casarei-primary"
          )}
          aria-label="Favoritar proposta"
        >
          <Heart className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4 rounded-3xl border border-casarei-primary-light/40 bg-white/76 p-4 shadow-[0_10px_28px_rgba(114,36,62,0.06)]">
        <div>
          <p className="text-xs text-casarei-muted">Valor apresentado</p>
          <strong className="mt-1 block font-serif text-3xl font-medium text-casarei-primary-deep">{proposal.priceLabel}</strong>
        </div>
        <div className="text-right">
          <strong className="block font-serif text-3xl font-medium text-casarei-primary">{proposal.compatibility}%</strong>
          <span className="text-xs text-casarei-muted">compatível</span>
        </div>
      </div>

      {photographyHighlights.length > 0 && (
        <div className="mt-5 grid gap-3 rounded-3xl border border-casarei-primary-light/40 bg-[#fff8fb] p-4 sm:grid-cols-2">
          {photographyHighlights.map((highlight) => (
            <div key={highlight.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-casarei-muted">{highlight.label}</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-casarei-primary-deep">{highlight.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-3xl border border-casarei-primary-light/50 bg-white/82 p-4 shadow-[0_10px_28px_rgba(114,36,62,0.06)]">
        <div className="flex items-center gap-2 text-casarei-primary">
          <Star className="h-4 w-4" aria-hidden />
          <span className="text-sm font-semibold">Sofia traduz</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-casarei-text">{proposal.sofiaNote}</p>
      </div>

      <div className="mt-5 grid gap-4">
        <Section title="Inclui" items={proposal.includes} icon="check" />
        <Section title="Não inclui" items={proposal.notIncluded} icon="alert" />
      </div>

      <div className="mt-5 rounded-3xl border border-casarei-primary-light/40 bg-white/78 p-4 shadow-[0_10px_28px_rgba(114,36,62,0.05)]">
        <p className="text-sm font-semibold text-casarei-primary-deep">O que muda na experiência</p>
        <p className="mt-2 text-sm leading-6 text-casarei-text">{proposal.experienceDifference}</p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-casarei-primary-deep">Por que vocês gostaram</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {proposal.emotionalReasons.map((reason) => (
            <span key={reason} className="rounded-full bg-casarei-primary-bg px-3 py-1 text-xs font-medium text-casarei-primary-deep">
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-5">
        <Button type="button" variant="outline" onClick={() => setShowSummary(true)} className="w-full bg-white/80">
          Ver resumo da proposta
        </Button>
      </div>

      {showSummary ? <ProposalSummaryModal proposal={proposal} onClose={() => setShowSummary(false)} /> : null}
    </article>
  );
}

function ProposalSummaryModal({ proposal, onClose }: { proposal: QuoteProposal; onClose: () => void }) {
  const details = Object.entries(proposal.details);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 md:place-items-center md:p-6">
      <section className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] md:max-w-2xl md:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-primary">{proposal.category}</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">{proposal.vendor}</h2>
            <p className="mt-2 text-sm font-semibold text-casarei-primary">{proposal.priceLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-primary-bg" aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-casarei-primary-bg/60 p-4">
          <p className="text-sm font-bold text-casarei-primary-deep">Resumo</p>
          <p className="mt-2 text-sm leading-6 text-casarei-text">{proposal.shortSummary}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SummaryBlock title="Inclui" items={proposal.includes} />
          <SummaryBlock title="Pontos de atenção" items={proposal.attentionPoints} />
          <SummaryBlock title="Pontos fortes" items={proposal.strengths} />
          <SummaryBlock title="Não inclui" items={proposal.notIncluded} />
        </div>

        <div className="mt-4 rounded-2xl border border-casarei-border-soft p-4">
          <p className="text-sm font-bold text-casarei-primary-deep">Detalhes da proposta</p>
          <div className="mt-3 divide-y divide-casarei-border-soft">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-casarei-muted">{label}</span>
                <strong className="text-right text-casarei-primary-deep">{formatDetailValue(value)}</strong>
              </div>
            ))}
          </div>
        </div>

        <Button type="button" onClick={onClose} className="mt-5 h-12 w-full">
          Fechar resumo
        </Button>
      </section>
    </div>
  );
}

function SummaryBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-casarei-primary-bg/45 p-4">
      <p className="text-sm font-bold text-casarei-primary-deep">{title}</p>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-casarei-text">
        {items.length ? items.map((item) => <li key={item}>• {item}</li>) : <li>Nenhum item informado.</li>}
      </ul>
    </div>
  );
}

function formatDetailValue(value: QuoteProposal["details"][string]) {
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  return String(value);
}

function Section({ title, items, icon }: { title: string; items: string[]; icon: "check" | "alert" }) {
  return (
    <div>
      <p className="text-sm font-semibold text-casarei-primary-deep">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-5 text-casarei-text">
            {icon === "check" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
