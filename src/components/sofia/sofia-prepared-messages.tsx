"use client";

import { Copy, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SofiaPreparedMessage } from "@/types/sofia";

type SofiaPreparedMessagesProps = {
  messages: SofiaPreparedMessage[];
  onCopy: (text: string) => void;
};

export function SofiaPreparedMessages({ messages, onCopy }: SofiaPreparedMessagesProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Mensagens prontas</p>
        <h2 className="font-serif text-3xl text-casarei-primary-deep">Mensagens que a Sofia pode preparar</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {messages.map((message) => (
          <Card key={message.id} className="border-white/90 bg-white/88 p-5 shadow-[0_18px_48px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/15">
            <MessageCircle className="h-5 w-5 text-casarei-primary" aria-hidden />
            <h3 className="mt-3 font-serif text-2xl text-casarei-primary-deep">{message.title}</h3>
            <p className="mt-1 text-sm leading-5 text-casarei-muted">{message.description}</p>
            <p className="mt-4 rounded-2xl bg-casarei-primary-bg/50 p-3 text-sm leading-6 text-casarei-text">
              {message.text}
            </p>
            <div className="mt-4 grid gap-2">
              <Button type="button" variant="outline" className="bg-white" onClick={() => onCopy(message.text)}>
                <Copy className="h-4 w-4" aria-hidden />
                Copiar
              </Button>
              <Button type="button" variant="outline" className="bg-white">
                Personalizar
              </Button>
              <Button type="button" variant="whatsapp">
                Usar no WhatsApp
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
