"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Download,
  HeartHandshake,
  MessageCircle,
  MoreVertical,
  Send,
  Utensils,
  UsersRound,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildWhatsappLink, getGuestName, rsvpStatusLabel } from "@/components/guests/guest-helpers";
import { getGuestGroupBySlug, getGuestsForGroup } from "@/lib/guests/groups";
import { mockGuestsRich } from "@/lib/mock/guests";
import type { Guest, GuestRsvpStatus } from "@/types/guests";

type GuestGroupFilter = "Todos" | "Confirmados" | "Pendentes" | "Sem confirmação";

const filters: GuestGroupFilter[] = ["Todos", "Confirmados", "Pendentes", "Sem confirmação"];

export function GuestGroupPage({ slug }: { slug: string }) {
  const group = getGuestGroupBySlug(slug);
  const guests = useMemo(() => getGuestsForGroup(mockGuestsRich, slug), [slug]);
  const [filter, setFilter] = useState<GuestGroupFilter>("Todos");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [notice, setNotice] = useState("");

  const visibleGuests = useMemo(() => {
    return guests.filter((guest) => {
      if (filter === "Confirmados") return guest.rsvp.status === "confirmed";
      if (filter === "Pendentes") return ["pending", "viewed"].includes(guest.rsvp.status);
      if (filter === "Sem confirmação") return !guest.rsvp.invitationSent;
      return true;
    });
  }, [filter, guests]);

  if (!group) {
    return (
      <main className="-mx-4 -mt-2 min-h-screen bg-casarei-app px-4 pb-36 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11">
        <section className="mx-auto max-w-[430px] rounded-[28px] bg-casarei-surface p-6 text-center shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-casarei-border-soft">
          <h1 className="font-serif text-3xl text-casarei-text-primary">Grupo não encontrado</h1>
          <p className="mt-3 text-sm leading-7 text-casarei-text-secondary">Volte para convidados e escolha um grupo da lista.</p>
          <Button asChild className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
            <Link href="/app/convidados">Voltar para convidados</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="-mx-4 -mt-2 min-h-screen bg-casarei-app px-4 pb-36 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:pb-12">
      <div className="mx-auto max-w-[430px] lg:max-w-[760px]">
        <GuestGroupHeader groupName={group.name} guests={guests} />

        {notice ? <p className="mt-4 rounded-2xl bg-casarei-green-soft px-4 py-3 text-sm font-semibold text-[#5F7752] ring-1 ring-[#DCE8D4]">{notice}</p> : null}

        <GuestGroupSummary guests={guests} />

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <GuestGroupCard icon={<Send />} label="Enviar lembrete grupo" onClick={() => setNotice("Sofia preparou um lembrete carinhoso para este grupo.")} />
          <GuestGroupCard icon={<Download />} label="Exportar lista" onClick={() => setNotice("Lista preparada para exportação.")} />
          <GuestGroupCard icon={<UsersRound />} label="Presença & Mesas" href="/app/presenca-mesas" />
          <GuestGroupCard icon={<HeartHandshake />} label="Ver acompanhantes" onClick={() => setNotice("Acompanhantes destacados na lista abaixo.")} />
        </section>

        <GuestGroupFilters value={filter} onChange={setFilter} />
        <GuestGroupList guests={visibleGuests} onOpen={setSelectedGuest} />
      </div>

      {selectedGuest ? <GuestDetailPanel guest={selectedGuest} onClose={() => setSelectedGuest(null)} /> : null}
    </main>
  );
}

function GuestGroupHeader({ groupName, guests }: { groupName: string; guests: Guest[] }) {
  const confirmed = guests.filter((guest) => guest.rsvp.status === "confirmed").length;
  const confirmedPercent = guests.length ? Math.round((confirmed / guests.length) * 100) : 0;

  return (
    <header>
      <div className="flex h-14 items-center justify-between">
        <Link href="/app/convidados" className="grid h-11 w-11 place-items-center rounded-full bg-casarei-surface text-casarei-text-primary shadow-[0_12px_30px_rgba(75,46,43,0.08)]" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Grupo</p>
        <span className="h-11 w-11" />
      </div>
      <section className="mt-5">
        <h1 className="font-serif text-5xl leading-[0.95] text-casarei-text-primary lg:text-6xl">{groupName}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-casarei-text-primary">
          <span className="rounded-full bg-casarei-surface px-4 py-2 ring-1 ring-casarei-border-soft">{guests.length} convidados</span>
          <span className="rounded-full bg-casarei-pink-soft px-4 py-2 text-casarei-pink">{confirmedPercent}% confirmados</span>
        </div>
        <p className="mt-4 text-base leading-7 text-casarei-text-secondary">Organize confirmações, acompanhantes e detalhes deste grupo.</p>
      </section>
    </header>
  );
}

function GuestGroupSummary({ guests }: { guests: Guest[] }) {
  const confirmed = guests.filter((guest) => guest.rsvp.status === "confirmed").length;
  const waiting = guests.filter((guest) => ["pending", "viewed"].includes(guest.rsvp.status)).length;
  const companions = guests.reduce((sum, guest) => sum + guest.companions.confirmedCount + guest.children.count, 0);
  const restrictions = guests.filter((guest) => guest.food.buffetNotes).length;

  return (
    <section className="mt-6 grid grid-cols-2 gap-3">
      <SummaryPill icon={<CheckCircle2 />} value={confirmed} label="confirmados" tone="green" />
      <SummaryPill icon={<MessageCircle />} value={waiting} label="aguardando" tone="pink" />
      <SummaryPill icon={<UsersRound />} value={companions} label="acompanhantes" tone="blue" />
      <SummaryPill icon={<Utensils />} value={restrictions} label="restrições" tone="terracotta" />
    </section>
  );
}

function SummaryPill({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: "green" | "pink" | "blue" | "terracotta" }) {
  const toneClass = {
    green: "bg-casarei-green-soft text-[#5F7752]",
    pink: "bg-casarei-pink-soft text-casarei-pink",
    blue: "bg-[#EEF1F4] text-[#6E7F91]",
    terracotta: "bg-[#FBEEE8] text-[#B96F52]"
  }[tone];

  return (
    <article className="rounded-[22px] bg-casarei-surface p-4 shadow-[0_12px_32px_rgba(75,46,43,0.05)] ring-1 ring-casarei-border-soft">
      <span className={`grid h-10 w-10 place-items-center rounded-full ${toneClass} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</span>
      <p className="mt-3 font-serif text-3xl text-casarei-text-primary">{value}</p>
      <p className="text-xs font-semibold text-casarei-text-secondary">{label}</p>
    </article>
  );
}

function GuestGroupCard({ icon, label, onClick, href }: { icon: React.ReactNode; label: string; onClick?: () => void; href?: string }) {
  const content = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-casarei-pink-soft text-casarei-pink [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <span className="mt-3 block text-sm font-bold leading-5 text-casarei-text-primary">{label}</span>
    </>
  );

  if (href) {
    return <Link href={href} className="min-h-[112px] rounded-[22px] bg-casarei-surface p-4 shadow-[0_12px_32px_rgba(75,46,43,0.05)] ring-1 ring-casarei-border-soft transition hover:-translate-y-0.5">{content}</Link>;
  }

  return <button type="button" onClick={onClick} className="min-h-[112px] rounded-[22px] bg-casarei-surface p-4 text-left shadow-[0_12px_32px_rgba(75,46,43,0.05)] ring-1 ring-casarei-border-soft transition hover:-translate-y-0.5">{content}</button>;
}

function GuestGroupFilters({ value, onChange }: { value: GuestGroupFilter; onChange: (value: GuestGroupFilter) => void }) {
  return (
    <nav className="mt-6 flex gap-2 overflow-x-auto rounded-full bg-casarei-surface p-1 shadow-[0_12px_35px_rgba(75,46,43,0.06)]">
      {filters.map((filter) => (
        <button key={filter} type="button" onClick={() => onChange(filter)} className={value === filter ? "shrink-0 rounded-full bg-casarei-pink px-4 py-3 text-xs font-bold text-white" : "shrink-0 rounded-full px-4 py-3 text-xs font-bold text-casarei-text-secondary"}>
          {filter}
        </button>
      ))}
    </nav>
  );
}

function GuestGroupList({ guests, onOpen }: { guests: Guest[]; onOpen: (guest: Guest) => void }) {
  return (
    <section className="mt-5 space-y-3">
      {guests.length ? guests.map((guest) => <GuestListItem key={guest.id} guest={guest} onOpen={() => onOpen(guest)} />) : <p className="rounded-[22px] bg-casarei-surface p-5 text-sm leading-7 text-casarei-text-secondary ring-1 ring-casarei-border-soft">Nenhum convidado neste filtro por enquanto.</p>}
    </section>
  );
}

function GuestListItem({ guest, onOpen }: { guest: Guest; onOpen: () => void }) {
  return (
    <article className="rounded-[24px] bg-casarei-surface p-4 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
      <div className="flex items-start gap-3">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-bold text-casarei-text-primary">{getGuestName(guest)}</h2>
            <ChevronRight className="h-4 w-4 shrink-0 text-casarei-text-secondary" />
          </div>
          <p className="mt-2 text-sm font-semibold text-casarei-text-primary">{statusLabel(guest.rsvp.status)}</p>
          <p className="mt-1 text-sm text-casarei-text-secondary">{guest.companions.confirmedCount} acompanhante{guest.companions.confirmedCount === 1 ? "" : "s"}</p>
          <p className="mt-1 text-sm text-casarei-text-secondary">{guest.phone || "Telefone não informado"}</p>
          {guest.food.buffetNotes ? <p className="mt-2 text-sm font-semibold text-[#B96F52]">{guest.food.buffetNotes}</p> : null}
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {guest.phone ? (
            <a href={buildWhatsappLink(guest)} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-[#E9F8EF] text-[#25D366]" aria-label={`Enviar WhatsApp para ${getGuestName(guest)}`}>
              <MessageCircle className="h-5 w-5" />
            </a>
          ) : null}
          <GuestActionsMenu guest={guest} />
        </div>
      </div>
    </article>
  );
}

function GuestActionsMenu({ guest }: { guest: Guest }) {
  return (
    <details className="relative">
      <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full bg-casarei-app text-casarei-text-secondary" aria-label={`Ações de ${getGuestName(guest)}`}>
        <MoreVertical className="h-5 w-5" />
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl bg-casarei-surface p-2 text-sm font-semibold text-casarei-text-primary shadow-[0_18px_55px_rgba(75,46,43,0.16)] ring-1 ring-casarei-border-soft">
        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-casarei-app">Editar convidado</button>
        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-casarei-app">Enviar lembrete</button>
        <button type="button" className="block w-full rounded-xl px-3 py-2 text-left hover:bg-casarei-app">Ver acompanhantes</button>
      </div>
    </details>
  );
}

function GuestDetailPanel({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 lg:place-items-center lg:p-6">
      <section className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Convidado</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-text-primary">{getGuestName(guest)}</h2>
            <p className="mt-2 text-sm text-casarei-text-secondary">{guest.group} · {guest.relation}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-app" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <DetailLine label="Status" value={statusLabel(guest.rsvp.status)} />
          <DetailLine label="Acompanhantes" value={`${guest.companions.confirmedCount} de ${guest.companions.allowedCount}`} />
          <DetailLine label="Telefone" value={guest.phone || "Não informado"} />
          <DetailLine label="Restrição alimentar" value={guest.food.buffetNotes || "Nenhuma informada"} />
          <DetailLine label="Mesa" value={guest.table.name || "Ainda precisa de lugar"} />
          <DetailLine label="Última interação" value={guest.rsvp.lastInteraction} />
        </div>

        {guest.phone ? (
          <Button asChild className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
            <a href={buildWhatsappLink(guest)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Enviar WhatsApp
            </a>
          </Button>
        ) : null}
      </section>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-casarei-app p-4">
      <p className="text-xs font-bold text-casarei-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-casarei-text-primary">{value}</p>
    </div>
  );
}

function statusLabel(status: GuestRsvpStatus) {
  return rsvpStatusLabel[status];
}
