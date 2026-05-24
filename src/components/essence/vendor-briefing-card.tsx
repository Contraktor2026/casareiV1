import { Copy, Edit3, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type VendorBriefingCardProps = {
  briefing: string;
  onUpdate: (briefing: string) => void;
};

export function VendorBriefingCard({ briefing, onUpdate }: VendorBriefingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(briefing);
  const [message, setMessage] = useState("");

  async function copyBriefing() {
    await navigator.clipboard?.writeText(briefing);
    setMessage("Briefing copiado para enviar aos fornecedores.");
  }

  function saveBriefing() {
    onUpdate(draft);
    setIsEditing(false);
    setMessage("Briefing atualizado.");
  }

  return (
    <Card className="border-white/80 bg-[linear-gradient(135deg,#fffdf9,#fbeaf0)] p-5 shadow-[0_16px_44px_rgba(114,36,62,0.09)]">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Briefing automatico</p>
          <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Briefing para fornecedores</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-muted">
            Um resumo simples para decoradora, fotografo, cerimonial e outros fornecedores entenderem a direcao do
            casamento.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={copyBriefing}>
            <Copy className="h-4 w-4" aria-hidden />
            Copiar briefing
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsEditing((value) => !value)}>
            <Edit3 className="h-4 w-4" aria-hidden />
            Editar briefing
          </Button>
          <Button type="button">
            <Send className="h-4 w-4" aria-hidden />
            Enviar para fornecedor
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-5 space-y-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-36 w-full rounded-2xl border border-casarei-primary-light/40 bg-white/86 p-4 text-sm leading-6 text-casarei-text outline-none transition focus:border-casarei-primary"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveBriefing}>
              Salvar briefing
            </Button>
          </div>
        </div>
      ) : (
        <blockquote className="mt-5 rounded-3xl border border-white/80 bg-white/78 p-5 font-serif text-xl leading-8 text-casarei-primary-deep">
          {briefing}
        </blockquote>
      )}

      {message ? <p className="mt-3 text-sm font-semibold text-casarei-primary">{message}</p> : null}
    </Card>
  );
}
