"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Guest } from "@/types/guests";
import { cn } from "@/lib/utils";
import { getGuestName, rsvpStatusLabel } from "./guest-helpers";
import { GuestTimeline } from "./guest-timeline";

const tabs = ["Resumo", "Confirmação", "Acompanhantes", "Alimentacao", "Mesa", "Observacoes", "Historico"] as const;

type GuestDetailsDrawerProps = {
  guest: Guest | null;
  onClose: () => void;
};

export function GuestDetailsDrawer({ guest, onClose }: GuestDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Resumo");

  if (!guest) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar detalhes" onClick={onClose} />
      <aside className="absolute bottom-0 right-0 top-auto max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#fffdf9] p-5 shadow-2xl md:bottom-0 md:top-0 md:max-h-none md:max-w-xl md:rounded-l-[2rem] md:rounded-tr-none md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Detalhes do convidado</p>
            <h2 className="mt-1 font-serif text-3xl font-medium text-casarei-primary-deep">{getGuestName(guest)}</h2>
            <p className="mt-1 text-sm text-casarei-muted">
              {guest.group} · {guest.relation}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
                activeTab === tab
                  ? "border-casarei-primary bg-casarei-primary text-white"
                  : "border-casarei-border-soft bg-white text-casarei-muted"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-casarei-border-soft bg-white/80 p-5">
          {activeTab === "Resumo" && (
            <InfoGrid
              items={[
                ["Status", rsvpStatusLabel[guest.rsvp.status]],
                ["Telefone", guest.phone || "Sem WhatsApp"],
                ["Email", guest.email],
                ["Convidado de", guest.side === "bride" ? "Noiva" : guest.side === "groom" ? "Noivo" : "Casal"],
                ["Ultima interacao", guest.rsvp.lastInteraction],
                ["Link de confirmação", `/rsvp/${guest.rsvp.token}`]
              ]}
            />
          )}

          {activeTab === "Confirmação" && (
            <InfoGrid
              items={[
                ["Convite enviado", guest.rsvp.invitationSent ? "Sim" : "Ainda não"],
                ["Data de envio", guest.rsvp.sentAt || "-"],
                ["Visualizou", guest.rsvp.viewed ? "Sim" : "Não"],
                ["Data visualizacao", guest.rsvp.viewedAt || "-"],
                ["Respondeu", guest.rsvp.responded ? "Sim" : "Não"],
                ["Lembretes enviados", String(guest.rsvp.remindersSent)]
              ]}
            />
          )}

          {activeTab === "Acompanhantes" && (
            <InfoGrid
              items={[
                ["Permite acompanhante", guest.companions.allowed ? "Sim" : "Não"],
                ["Quantidade permitida", String(guest.companions.allowedCount)],
                ["Confirmados", String(guest.companions.confirmedCount)],
                ["Nomes", guest.companions.names.join(", ") || "Nenhum acompanhante confirmado"],
                ["Criancas", guest.children.count ? guest.children.names.map((child) => `${child.name}, ${child.age} anos`).join(", ") : "Nenhuma crianca"]
              ]}
            />
          )}

          {activeTab === "Alimentacao" && (
            <InfoGrid
              items={[
                ["Vegetariano", guest.food.vegetarian ? "Sim" : "Não"],
                ["Vegano", guest.food.vegan ? "Sim" : "Não"],
                ["Intolerancia", guest.food.intolerance || "-"],
                ["Alergias", guest.food.allergies || "-"],
                ["Observacao buffet", guest.food.buffetNotes || "Sem observacoes"]
              ]}
            />
          )}

          {activeTab === "Mesa" && (
            <InfoGrid
              items={[
                ["Mesa", guest.table.name || "Ainda não definida"],
                ["Grupo da mesa", guest.table.group || "-"],
                ["Afinidades", guest.table.affinities.join(", ") || "-"],
                ["Evitar sentar com", guest.table.avoidWith.join(", ") || "-"]
              ]}
            />
          )}

          {activeTab === "Observacoes" && (
            <InfoGrid
              items={[
                ["Nota interna", guest.internalNote || "Sem nota interna"],
                ["Cerimonial", guest.ceremonialNote || "Sem observacao"],
                ["Buffet", guest.buffetNote || "Sem observacao"],
                ["Geral", guest.notes || "Sem observacao"]
              ]}
            />
          )}

          {activeTab === "Historico" && <GuestTimeline guest={guest} />}
        </div>
      </aside>
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-casarei-primary-bg/35 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-casarei-muted">{label}</dt>
          <dd className="mt-1 text-sm leading-6 text-casarei-text">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
