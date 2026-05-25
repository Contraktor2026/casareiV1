"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockCouple, mockGuests } from "@/lib/mock/casarei";

export function RsvpSendFlow() {
  const pendingGuests = mockGuests.filter((guest) => guest.status === "pending");
  const [selected, setSelected] = useState(pendingGuests.map((guest) => guest.name));
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  function toggleGuest(name: string) {
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }

  return (
    <div className="space-y-5">
      <Card className="surface-lift border-0 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-casarei-primary-dark">Mensagem</p>
        <p className="mt-3 rounded-2xl bg-casarei-primary-bg p-4 text-sm leading-6 text-casarei-text">
          Oi, {"{nome}"}! Queremos muito ter você por perto nesse momento.
          Confirme sua presença aqui: casarei.app/rsvp/{"{token}"}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            void navigator.clipboard?.writeText(
              "Oi, {nome}! Queremos muito ter você por perto nesse momento. Confirme sua presença aqui: casarei.app/rsvp/{token}"
            );
            setCopied(true);
          }}
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copied ? "Modelo copiado" : "Copiar modelo"}
        </Button>
      </Card>

      <Card className="border-0 bg-white p-4">
        <p className="text-sm font-medium text-casarei-text">Canal escolhido</p>
        <div className="mt-3">
          <Button asChild variant="whatsapp" className="w-full">
            <a href="https://wa.me/?text=Oi!%20Confirme%20sua%20presenca%20no%20casamento">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp deeplink
            </a>
          </Button>
        </div>
      </Card>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-casarei-muted">
          Pendentes de confirmação
        </p>
        {pendingGuests.map((guest) => {
          const isSelected = selected.includes(guest.name);

          return (
            <button key={guest.name} onClick={() => toggleGuest(guest.name)} className="block w-full text-left">
              <Card className="border-0 bg-white p-4 transition hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-casarei-border-soft bg-white text-casarei-primary">
                    {isSelected ? <Check className="h-4 w-4" aria-hidden /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-casarei-text">{guest.name}</span>
                    <span className="text-sm text-casarei-muted">{guest.group}</span>
                  </span>
                </div>
              </Card>
            </button>
          );
        })}
      </section>

      <Card className="surface-lift sticky bottom-24 border-0 bg-white p-4 md:static">
        <p className="text-sm text-casarei-muted">
          {selected.length} convite{selected.length === 1 ? "" : "s"} pronto{selected.length === 1 ? "" : "s"} para sair em nome de {mockCouple.brideName}.
        </p>
        {sent ? (
          <p className="mt-3 rounded-2xl bg-[var(--success-bg)] p-3 text-sm text-[var(--success-text)]">
            Confirmação de presença preparada para {selected.length} convidado{selected.length === 1 ? "" : "s"}. No backend real, este fluxo enviara os links individuais.
          </p>
        ) : null}
        <Button className="mt-3 w-full" size="lg" onClick={() => setSent(true)} disabled={selected.length === 0}>
          <Send className="h-4 w-4" aria-hidden />
          {sent ? "Envio preparado" : "Preparar envio"}
        </Button>
      </Card>
    </div>
  );
}
