"use client";

import Link from "next/link";
import { CheckCircle2, Copy, MessageCircle, Send, Smartphone, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { mockGuestsRich } from "@/lib/mock/guests";
import type { Guest } from "@/types/guests";
import { buildWhatsappLink, getGuestInitials, getGuestName, rsvpStatusLabel } from "./guest-helpers";

type Segment = "pending" | "sent" | "viewed" | "withoutPhone";

const segments: Array<{ id: Segment; label: string }> = [
  { id: "pending", label: "Pendentes" },
  { id: "sent", label: "Já enviados" },
  { id: "viewed", label: "Visualizados" },
  { id: "withoutPhone", label: "Sem WhatsApp" }
];

export function RSVPSendPage() {
  const [active, setActive] = useState<Segment>("pending");
  const [selected, setSelected] = useState<string[]>(["2", "9", "13"]);
  const [message, setMessage] = useState("");

  const guests = useMemo(() => {
    return mockGuestsRich.filter((guest) => {
      if (active === "pending") return guest.rsvp.status === "pending" || guest.rsvp.status === "viewed";
      if (active === "sent") return guest.rsvp.invitationSent;
      if (active === "viewed") return guest.rsvp.viewed && !guest.rsvp.responded;
      return !guest.phone;
    });
  }, [active]);

  const selectedGuests = mockGuestsRich.filter((guest) => selected.includes(guest.id));
  const previewGuest = selectedGuests[0] ?? guests[0] ?? mockGuestsRich[0];
  const preview = `Oi, ${previewGuest.firstName}\n\nMariana & Rafael querem celebrar esse dia especial com você.\nConfirme sua presença aqui:\nhttp://localhost:3000/rsvp/${previewGuest.rsvp.token}`;

  function toggleGuest(guest: Guest) {
    setSelected((current) => (current.includes(guest.id) ? current.filter((id) => id !== guest.id) : [...current, guest.id]));
  }

  async function copyMessage() {
    await navigator.clipboard?.writeText(preview);
    setMessage("Mensagem copiada com carinho.");
  }

  function sendMock() {
    setMessage(`${selectedGuests.length} confirmações preparadas para envio via WhatsApp deeplink.`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(114,36,62,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Confirmação de presença</p>
            <h1 className="mt-2 font-serif text-4xl font-medium text-casarei-primary-deep">Enviar confirmações</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-text">
              Selecione convidados e veja a mensagem antes de enviar. Por enquanto usamos apenas deeplink de WhatsApp.
            </p>
          </div>
          <Button asChild variant="outline" className="bg-white">
            <Link href="/app/convidados/templates">Personalizar página de confirmação</Link>
          </Button>
        </div>
      </section>

      {message && <div className="rounded-2xl bg-white/85 px-4 py-3 text-sm text-casarei-primary-deep">{message}</div>}

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {segments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                onClick={() => setActive(segment.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active === segment.id
                    ? "border-casarei-primary bg-casarei-primary text-white"
                    : "border-casarei-border-soft bg-white text-casarei-text"
                }`}
              >
                {segment.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {guests.map((guest) => (
              <label key={guest.id} className="flex cursor-pointer items-center gap-4 rounded-3xl border border-casarei-border-soft bg-white/90 p-4 shadow-[0_12px_32px_rgba(114,36,62,0.05)]">
                <input type="checkbox" checked={selected.includes(guest.id)} onChange={() => toggleGuest(guest)} className="h-5 w-5 accent-casarei-primary" disabled={!guest.phone} />
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-casarei-primary-bg font-serif text-casarei-primary-deep">
                  {getGuestInitials(guest)}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-casarei-text">{getGuestName(guest)}</strong>
                  <span className="block text-xs text-casarei-muted">
                    {guest.group} · {rsvpStatusLabel[guest.rsvp.status]} · {guest.phone || "sem WhatsApp"}
                  </span>
                </span>
                {guest.phone ? <Smartphone className="h-4 w-4 text-casarei-primary" aria-hidden /> : <XCircle className="h-4 w-4 text-rose-500" aria-hidden />}
              </label>
            ))}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5 shadow-[0_20px_55px_rgba(114,36,62,0.08)] lg:sticky lg:top-6 lg:self-start">
          <p className="text-sm font-semibold text-casarei-primary">Preview da mensagem</p>
          <div className="mt-4 rounded-3xl bg-casarei-primary-bg/55 p-5 text-sm leading-6 text-casarei-text whitespace-pre-line">
            {preview}
          </div>
          <p className="mt-4 text-xs text-casarei-muted">{selectedGuests.length} convidados selecionados</p>
          <div className="mt-4 grid gap-2">
            <Button type="button" onClick={sendMock}>
              <Send className="h-4 w-4" aria-hidden />
              Enviar
            </Button>
            <Button type="button" variant="outline" className="bg-white" onClick={copyMessage}>
              <Copy className="h-4 w-4" aria-hidden />
              Copiar mensagem
            </Button>
            {previewGuest.phone && (
              <Button asChild variant="whatsapp">
                <a href={buildWhatsappLink(previewGuest, preview)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Abrir WhatsApp
                </a>
              </Button>
            )}
            <Button asChild variant="ghost">
              <Link href="/app/convidados">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Voltar para convidados
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
