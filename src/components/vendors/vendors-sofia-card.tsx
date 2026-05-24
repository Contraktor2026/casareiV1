import { ArrowRight, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

export function VendorsSofiaCard({ onReview }: { onReview: () => void }) {
  return (
    <Card className="border-casarei-primary-light/40 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 shadow-[0_18px_50px_rgba(114,36,62,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <div className="text-sm font-semibold text-casarei-primary">Sofia</div>
            <p className="mt-1 font-serif text-2xl leading-tight text-casarei-primary-deep">
              9 fornecedores fechados. Agora o foco é revisar contratos e próximos pagamentos.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-text">
              Eu separei os pontos que merecem atenção para vocês não perderem nada no WhatsApp ou nos PDFs.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReview}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-casarei-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(212,83,126,0.24)] transition hover:bg-casarei-primary-dark"
        >
          Revisar detalhes
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </Card>
  );
}
