import { Copy, MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SofiaPreparedMessage } from "@/types/sofia";

type SofiaReminderModalProps = {
  open: boolean;
  message: SofiaPreparedMessage | null;
  onClose: () => void;
  onCopy: (text: string) => void;
};

export function SofiaReminderModal({ open, message, onClose, onCopy }: SofiaReminderModalProps) {
  if (!open || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-casarei-ink/35 p-3 backdrop-blur-sm md:items-center md:justify-center">
      <div className="w-full rounded-[1.75rem] border border-white/80 bg-[#fffdf9] p-5 shadow-[0_24px_80px_rgba(42,26,31,0.22)] md:max-w-xl md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Mensagem preparada pela Sofia</p>
            <h2 className="font-serif text-3xl text-casarei-primary-deep">{message.title}</h2>
            <p className="mt-1 text-sm leading-6 text-casarei-muted">{message.description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-casarei-border-soft bg-white p-2">
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <textarea
          defaultValue={message.text}
          rows={7}
          className="mt-5 w-full rounded-2xl border border-casarei-primary-light/30 bg-white/88 p-4 text-sm leading-6 text-casarei-text outline-none focus:border-casarei-primary"
        />

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Button type="button" variant="outline" className="bg-white" onClick={() => onCopy(message.text)}>
            <Copy className="h-4 w-4" aria-hidden />
            Copiar
          </Button>
          <Button type="button" variant="outline" className="bg-white">
            Personalizar
          </Button>
          <Button type="button" variant="whatsapp">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
