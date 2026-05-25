"use client";

import { Baby, Eye, MessageCircle, MoreHorizontal, Salad, Table2, UserRoundPlus } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import type { Guest } from "@/types/guests";
import { buildWhatsappLink, getGuestInitials, getGuestName, rsvpStatusClass, rsvpStatusLabel } from "./guest-helpers";
import { cn } from "@/lib/utils";

type GuestCardProps = {
  guest: Guest;
  onDetails: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onRemove: (guest: Guest) => void;
};

export function GuestCard({ guest, onDetails, onEdit, onRemove }: GuestCardProps) {
  const whatsappMessage = `Oi, ${guest.firstName}. Queremos celebrar esse dia especial com você. Confirme sua presença aqui: /rsvp/${guest.rsvp.token}`;

  return (
    <article className="group rounded-3xl border border-casarei-border-soft bg-white/90 p-4 shadow-[0_14px_40px_rgba(114,36,62,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(114,36,62,0.10)]">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-casarei-primary-bg to-white font-serif text-lg text-casarei-primary-deep ring-1 ring-casarei-primary-light/40">
          {getGuestInitials(guest)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl font-medium leading-tight text-casarei-primary-deep">{getGuestName(guest)}</h3>
              <p className="mt-1 text-xs text-casarei-muted">
                {guest.group} · {guest.relation}
              </p>
            </div>
            <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ring-1", rsvpStatusClass[guest.rsvp.status])}>
              {rsvpStatusLabel[guest.rsvp.status]}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-casarei-text md:grid-cols-4">
            <GuestMiniInfo icon={UserRoundPlus} label={`${guest.companions.confirmedCount}/${guest.companions.allowedCount} acompanhantes`} />
            <GuestMiniInfo icon={Baby} label={`${guest.children.count} criancas`} />
            <GuestMiniInfo icon={Salad} label={guest.food.buffetNotes || "Sem restricao"} />
            <GuestMiniInfo icon={Table2} label={guest.table.name || "Sem mesa"} />
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-casarei-border-soft pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-xs text-casarei-muted">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              {guest.rsvp.lastInteraction}
            </span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="bg-white">
                <a href={buildWhatsappLink(guest, whatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </a>
              </Button>
              <Button type="button" variant="outline" size="sm" className="bg-white" onClick={() => onDetails(guest)}>
                Ver detalhes
              </Button>
              <div className="relative">
                <details className="group/menu">
                  <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-casarei-border-soft bg-white text-casarei-text transition hover:bg-casarei-primary-bg">
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                  </summary>
                  <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-casarei-border-soft bg-white p-1 shadow-xl">
                    <button type="button" onClick={() => onEdit(guest)} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-casarei-primary-bg">
                      Editar
                    </button>
                    <button type="button" onClick={() => onRemove(guest)} className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50">
                      Remover
                    </button>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function GuestMiniInfo({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2 rounded-2xl bg-casarei-primary-bg/45 px-3 py-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-casarei-primary" aria-hidden />
      <span className="truncate">{label}</span>
    </span>
  );
}
