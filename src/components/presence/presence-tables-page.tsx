"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarCheck2, ChevronRight, Heart, Image as ImageIcon, MessageCircle, PenLine, Table2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mockGuestsRich } from "@/lib/mock/guests";
import { guestTables } from "@/lib/mock/guest-tables";
import type { Guest, GuestRsvpStatus } from "@/types/guests";

type PresenceTab = "Confirmação" | "Confirmados" | "Mesas";

const tabs: PresenceTab[] = ["Confirmação", "Confirmados", "Mesas"];

export function PresenceTablesPage() {
  const [activeTab, setActiveTab] = useState<PresenceTab>("Confirmação");

  const stats = useMemo(() => {
    const confirmed = mockGuestsRich.filter((guest) => guest.rsvp.status === "confirmed");
    const pending = mockGuestsRich.filter((guest) => guest.rsvp.status === "pending" || guest.rsvp.status === "viewed");
    const declined = mockGuestsRich.filter((guest) => guest.rsvp.status === "declined");
    const seated = confirmed.filter((guest) => Boolean(guest.table.name));
    const totalSeats = guestTables.reduce((sum, table) => sum + table.capacity, 0);
    const occupiedSeats = guestTables.reduce((sum, table) => sum + table.guests.length, 0);

    return {
      confirmed,
      pending,
      declined,
      seated,
      totalSeats,
      occupiedSeats,
      waitingForTable: confirmed.filter((guest) => !guest.table.name)
    };
  }, []);

  return (
    <div className="-mx-4 -mt-6 min-h-screen bg-casarei-app px-4 pb-28 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:pb-12">
      <div className="mx-auto max-w-[980px]">
        <section className="rounded-[30px] bg-white p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-casarei-border-soft md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-casarei-pink">Presença & Mesas</p>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-casarei-text-primary md:text-5xl">Da confirmação ao lugar na festa</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-text-secondary">
                Acompanhe quem confirmou, quem ainda precisa responder e organize nas mesas apenas quem está na lista.
              </p>
            </div>
            <Button asChild className="h-12 bg-casarei-pink hover:bg-casarei-pink-dark">
              <Link href="/app/presenca-mesas/mesas">Abrir mapa de mesas</Link>
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <PresenceMetric label="Confirmados" value={stats.confirmed.length} tone="ok" />
            <PresenceMetric label="Pendentes" value={stats.pending.length} tone="warn" />
            <PresenceMetric label="Sem mesa" value={stats.waitingForTable.length} tone="danger" />
            <PresenceMetric label="Lugares" value={`${stats.occupiedSeats}/${stats.totalSeats}`} tone="neutral" />
          </div>
        </section>

        <nav className="mt-5 grid grid-cols-3 gap-2 rounded-[24px] bg-white p-2 shadow-[0_12px_32px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "rounded-2xl bg-casarei-pink px-3 py-3 text-xs font-bold text-white md:text-sm" : "rounded-2xl px-3 py-3 text-xs font-bold text-casarei-text-secondary md:text-sm"}
            >
              {tab}
            </button>
          ))}
        </nav>

        <main className="mt-5">
          {activeTab === "Confirmação" ? <ConfirmationPanel pendingCount={stats.pending.length} /> : null}
          {activeTab === "Confirmados" ? <ConfirmedPanel confirmed={stats.confirmed} pending={stats.pending} declined={stats.declined} /> : null}
          {activeTab === "Mesas" ? <TablesPanel waitingForTable={stats.waitingForTable} occupiedSeats={stats.occupiedSeats} totalSeats={stats.totalSeats} /> : null}
        </main>
      </div>
    </div>
  );
}

function PresenceMetric({ label, value, tone }: { label: string; value: string | number; tone: "ok" | "warn" | "danger" | "neutral" }) {
  const colors = {
    ok: "bg-[#EEF3EA] text-[#5F7752]",
    warn: "bg-[#FBEEE8] text-[#B96F52]",
    danger: "bg-[#FBEAF0] text-casarei-pink",
    neutral: "bg-casarei-app text-casarei-text-primary"
  };

  return (
    <article className={`rounded-2xl p-4 text-center ${colors[tone]}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-casarei-text-primary">{value}</p>
    </article>
  );
}

function ConfirmationPanel({ pendingCount }: { pendingCount: number }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-casarei-pink-soft text-casarei-pink">
            <CalendarCheck2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-serif text-3xl text-casarei-text-primary">Confirmação de presença</h2>
            <p className="mt-1 text-sm text-casarei-text-secondary">{pendingCount} convidado(s) ainda precisam responder.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <ActionRow icon={<ImageIcon />} title="Editar página da confirmação" text="Trocar foto, mensagem, cores e regras da página." href="/app/convidados/templates" />
          <ActionRow icon={<MessageCircle />} title="Enviar confirmação" text="Selecionar convidados e mandar o link pelo WhatsApp." href="/app/convidados/enviar" />
          <ActionRow icon={<PenLine />} title="Revisar lista base" text="Adicionar convidados antes de enviar ou organizar mesas." href="/app/convidados" />
        </div>
      </div>

      <div className="rounded-[28px] bg-[#FFF8F4] p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-[#F0E1DD] md:p-7">
        <div className="flex items-center gap-2 text-casarei-pink">
          <Heart className="h-5 w-5" />
          <p className="text-sm font-bold">Fluxo recomendado</p>
        </div>
        <div className="mt-5 space-y-3">
          {["Enviar confirmação", "Acompanhar pendentes", "Separar confirmados", "Organizar confirmados nas mesas"].map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl bg-white p-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-casarei-pink-soft text-sm font-bold text-casarei-pink">{index + 1}</span>
              <p className="text-sm font-semibold text-casarei-text-primary">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConfirmedPanel({ confirmed, pending, declined }: { confirmed: Guest[]; pending: Guest[]; declined: Guest[] }) {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StatusBucket title="Confirmados" guests={confirmed} status="confirmed" />
        <StatusBucket title="Pendentes" guests={pending} status="pending" />
        <StatusBucket title="Recusaram" guests={declined} status="declined" />
      </div>
      <div className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <h2 className="font-serif text-3xl text-casarei-text-primary">Atenções para buffet e mesas</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {confirmed.filter((guest) => guest.food.buffetNotes || guest.children.count > 0 || guest.companions.confirmedCount > 0).slice(0, 6).map((guest) => (
            <GuestAttention key={guest.id} guest={guest} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TablesPanel({ waitingForTable, occupiedSeats, totalSeats }: { waitingForTable: Guest[]; occupiedSeats: number; totalSeats: number }) {
  const nearlyFullTables = guestTables.filter((table) => table.capacity - table.guests.length <= 2 && table.guests.length < table.capacity);
  const fullTables = guestTables.filter((table) => table.guests.length >= table.capacity);
  const pendingSeated = mockGuestsRich.filter((guest) => guest.table.name && guest.rsvp.status !== "confirmed");

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Mesas</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-text-primary">Organizar confirmados por lugar</h2>
            <p className="mt-2 text-sm leading-6 text-casarei-text-secondary">
              Só coloque na mesa convidados que estão na lista. Se ainda não confirmou presença, o app deve mostrar atenção antes de sentar.
            </p>
          </div>
          <Button asChild className="h-12 bg-casarei-pink hover:bg-casarei-pink-dark">
            <Link href="/app/presenca-mesas/mesas">Organizar mesas</Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <PresenceMetric label="Ocupação" value={`${occupiedSeats}/${totalSeats}`} tone="neutral" />
          <PresenceMetric label="Sem mesa" value={waitingForTable.length} tone="danger" />
          <PresenceMetric label="Mesas" value={guestTables.length} tone="ok" />
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-casarei-pink-soft text-casarei-pink">
            <Table2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-serif text-3xl text-casarei-text-primary">Resumo antes de organizar</h3>
            <p className="mt-1 text-sm text-casarei-text-secondary">Aqui fica só o status. A edição completa acontece em Organizar mesas.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <TableAlert tone="danger" title={`${waitingForTable.length} confirmado(s) ainda sem mesa`} text="Antes de finalizar o mapa, coloque esses convidados em uma mesa." />
          <TableAlert tone="warn" title={`${nearlyFullTables.length} mesa(s) quase cheias`} text="Revise a capacidade antes de adicionar acompanhantes ou famílias grandes." />
          <TableAlert tone="warn" title={`${pendingSeated.length} convidado(s) pendente(s) já aparecem em mesas`} text="Confirme presença antes de considerar esses lugares como definitivos." />
          <TableAlert tone="ok" title={`${fullTables.length} mesa(s) completas`} text="Essas mesas parecem prontas, mas ainda vale revisar restrições alimentares." />
        </div>

        <Button asChild className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-dark">
          <Link href="/app/presenca-mesas/mesas">Organizar mesas</Link>
        </Button>
      </div>
    </section>
  );
}

function TableAlert({ title, text, tone }: { title: string; text: string; tone: "ok" | "warn" | "danger" }) {
  const colors = {
    ok: "bg-[#EEF3EA] text-[#5F7752] ring-[#DCE8D4]",
    warn: "bg-[#FBEEE8] text-[#B96F52] ring-[#F3D8CC]",
    danger: "bg-[#FBEAF0] text-casarei-pink ring-[#F0C5D2]"
  };

  return (
    <div className={`rounded-2xl p-4 ring-1 ${colors[tone]}`}>
      <p className="text-sm font-bold text-casarei-text-primary">{title}</p>
      <p className="mt-1 text-xs leading-5 text-casarei-text-secondary">{text}</p>
    </div>
  );
}

function ActionRow({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-casarei-app p-4 transition hover:bg-casarei-pink-soft">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-casarei-pink">{icon}</span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm text-casarei-text-primary">{title}</strong>
        <span className="mt-1 block text-xs leading-5 text-casarei-text-secondary">{text}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-casarei-text-secondary" />
    </Link>
  );
}

function StatusBucket({ title, guests, status }: { title: string; guests: Guest[]; status: GuestRsvpStatus }) {
  return (
    <article className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-casarei-text-primary">{title}</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone(status)}`}>{guests.length}</span>
      </div>
      <div className="mt-4 space-y-2">
        {guests.slice(0, 5).map((guest) => (
          <div key={guest.id} className="rounded-2xl bg-casarei-app p-3">
            <p className="text-sm font-bold text-casarei-text-primary">{guest.firstName} {guest.lastName}</p>
            <p className="mt-1 text-xs text-casarei-text-secondary">{guest.group} · {guest.table.name || "sem mesa"}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function GuestAttention({ guest }: { guest: Guest }) {
  const notes = [guest.food.buffetNotes, guest.children.count ? `${guest.children.count} criança(s)` : "", guest.companions.confirmedCount ? `${guest.companions.confirmedCount} acompanhante(s)` : ""].filter(Boolean);

  return (
    <div className="rounded-2xl bg-casarei-app p-4">
      <p className="text-sm font-bold text-casarei-text-primary">{guest.firstName} {guest.lastName}</p>
      <p className="mt-1 text-xs text-casarei-text-secondary">{guest.table.name || "Sem mesa definida"}</p>
      <p className="mt-2 text-xs font-semibold text-casarei-pink">{notes.join(" · ")}</p>
    </div>
  );
}

function statusTone(status: GuestRsvpStatus) {
  if (status === "confirmed") return "bg-[#EEF3EA] text-[#5F7752]";
  if (status === "declined") return "bg-[#FBEAF0] text-casarei-pink";
  return "bg-[#FBEEE8] text-[#B96F52]";
}
