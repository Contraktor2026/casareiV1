import { Heart, MessageSquareText } from "lucide-react";

import type { QuoteProposal } from "@/types/quotes";

export function QuoteDecisionPanel({ favorites }: { favorites: QuoteProposal[] }) {
  return (
    <section className="rounded-[2rem] border border-casarei-border-soft bg-[linear-gradient(135deg,#fffdf9,#fbeaf0)] p-5 shadow-[0_18px_50px_rgba(114,36,62,0.08)] md:p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-casarei-primary">
          <Heart className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-medium text-casarei-primary-deep">Favoritos para decidir com calma</h2>
          <p className="mt-1 text-sm leading-6 text-casarei-text">
            Além do preço, registre o que trouxe segurança: atendimento, estética, conexão e custo-benefício.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {favorites.length ? (
          favorites.map((favorite) => (
            <div key={favorite.id} className="rounded-3xl border border-white/80 bg-white/80 p-4">
              <p className="font-serif text-xl text-casarei-primary-deep">{favorite.vendor}</p>
              <p className="mt-1 text-sm text-casarei-muted">{favorite.category} • {favorite.priceLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {favorite.emotionalReasons.map((reason) => (
                  <span key={reason} className="rounded-full bg-casarei-primary-bg px-3 py-1 text-xs font-medium text-casarei-primary-deep">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4 text-sm leading-6 text-casarei-muted md:col-span-2">
            Nenhum favorito ainda. Marque as propostas que fizeram vocês se sentirem mais seguros.
          </div>
        )}
      </div>

      <label className="mt-5 block text-sm font-semibold text-casarei-primary-deep">
        Por que vocês gostaram desse fornecedor?
        <textarea
          rows={3}
          placeholder="Ex: atendimento acolhedor, estética delicada, passou confiança, parece ter bom custo-benefício..."
          className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm outline-none focus:border-casarei-primary"
        />
      </label>
      <p className="mt-3 flex items-center gap-2 text-xs text-casarei-muted">
        <MessageSquareText className="h-4 w-4" aria-hidden />
        Esse campo ainda é mockado, mas já valida a decisão emocional junto da comparação.
      </p>
    </section>
  );
}
