"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Sparkles, Trash2, UserRound, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { getGuestTable, guestTables, unseatedGuests, type GuestTableSeat } from "@/lib/mock/guest-tables";

export function GuestTableDetailPage({ tableId }: { tableId: string }) {
  const table = getGuestTable(tableId);
  const [guests, setGuests] = useState(table.guests);
  const [mode, setMode] = useState<"guests" | "suggestions">("guests");
  const [message, setMessage] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<GuestTableSeat | null>(null);
  const [movingGuest, setMovingGuest] = useState<GuestTableSeat | null>(null);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showEditTable, setShowEditTable] = useState(false);
  const percent = Math.round((guests.length / table.capacity) * 100);
  const suggestions = ["Bruno Santos", "Julia Rocha", "Diego Almeida", "Fernanda Costa"];

  return (
    <div className="-mx-4 -mt-6 min-h-screen bg-casarei-app px-4 pb-24 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:pb-12">
      <div className="mx-auto max-w-[430px] lg:max-w-[760px]">
        <header className="mb-4 flex h-12 items-center justify-between">
          <Link href="/app/presenca-mesas/mesas" className="grid h-10 w-10 place-items-center rounded-full text-casarei-text-primary" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-sm font-bold text-casarei-text-primary">{table.name}</h1>
          <button type="button" onClick={() => setMessage("Opcoes da mesa: editar nome, revisar lugares ou pedir sugestao da Sofia.")} className="grid h-10 w-10 place-items-center rounded-full text-casarei-text-primary" aria-label="Mais opções">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </header>

        <section className="rounded-[30px] bg-casarei-surface p-5 text-center shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-casarei-border-soft">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[#FBEEE8] text-casarei-text-primary ring-8 ring-casarei-app">
            <span>
              <span className="block font-serif text-3xl">{guests.length}/{table.capacity}</span>
              <span className="text-xs text-casarei-text-secondary">lugares</span>
            </span>
          </div>
          <h2 className="mt-5 font-serif text-4xl text-casarei-text-primary">{table.name}</h2>
          <p className="mt-2 text-sm text-casarei-text-secondary">{guests.length} de {table.capacity} lugares ocupados</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-casarei-app">
            <div className="h-full rounded-full bg-casarei-green" style={{ width: `${percent}%` }} />
          </div>
        </section>

        {message ? <p className="mt-4 rounded-2xl bg-casarei-green-soft px-4 py-3 text-sm font-semibold text-casarei-text-primary ring-1 ring-[#DCE8D4]">{message}</p> : null}

        <section className="mt-5 rounded-[26px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
          <div className="flex border-b border-casarei-border-soft text-sm font-bold">
            <button type="button" onClick={() => setMode("guests")} className={mode === "guests" ? "border-b-2 border-casarei-pink px-3 py-3 text-casarei-pink" : "px-3 py-3 text-casarei-text-secondary"}>Convidados ({guests.length})</button>
            <button type="button" onClick={() => setMode("suggestions")} className={mode === "suggestions" ? "border-b-2 border-casarei-pink px-3 py-3 text-casarei-pink" : "px-3 py-3 text-casarei-text-secondary"}>Sugestoes ({suggestions.length})</button>
          </div>
          <div className="mt-4 space-y-2">
            {mode === "guests" ? guests.map((guest) => (
              <article key={guest.id} className="rounded-2xl bg-casarei-app p-3">
                <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-casarei-pink-soft text-casarei-pink">
                  <UserRound className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-casarei-text-primary">{guest.name}</p>
                  <p className="text-xs text-casarei-text-secondary">{guest.relation}</p>
                </div>
                <button type="button" onClick={() => { if (!confirmPermanentDelete({ itemName: guest.name, context: "Ele será removido desta mesa." })) return; setGuests((current) => current.filter((item) => item.id !== guest.id)); setMessage(`${guest.name} removido desta mesa.`); }} className="grid h-9 w-9 place-items-center rounded-full bg-casarei-surface text-casarei-text-secondary" aria-label="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setSelectedGuest(guest)} className="rounded-full bg-casarei-surface px-3 py-2 text-xs font-bold text-casarei-text-primary ring-1 ring-casarei-border-soft">Detalhes</button>
                  <button type="button" onClick={() => setMovingGuest(guest)} className="rounded-full bg-casarei-pink-soft px-3 py-2 text-xs font-bold text-casarei-pink">Trocar de mesa</button>
                </div>
              </article>
            )) : suggestions.map((name) => (
              <button key={name} type="button" onClick={() => { setGuests((current) => [...current, { id: `suggestion-${Date.now()}`, name, relation: "Sugestao da Sofia" }]); setMessage(`${name} adicionado a ${table.name}.`); }} className="flex w-full items-center gap-3 rounded-2xl bg-casarei-app p-3 text-left">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-casarei-green-soft text-[#5F7752]">
                  <UserRound className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-casarei-text-primary">{name}</p>
                  <p className="text-xs text-casarei-text-secondary">Boa afinidade com esta mesa</p>
                </div>
                <Plus className="h-4 w-4 text-casarei-pink" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[26px] bg-casarei-pink-soft p-5">
          <div className="flex gap-3">
            <Sparkles className="mt-1 h-5 w-5 shrink-0 text-casarei-pink" />
            <div>
              <p className="text-sm font-bold text-casarei-text-primary">Sugestão da Sofia</p>
              <p className="mt-1 text-sm leading-7 text-casarei-text-primary">{table.suggestion}</p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button type="button" onClick={() => setMode("suggestions")} variant="outline" className="h-12 border-[#F3C7D2] text-casarei-pink">
            <Plus className="h-4 w-4" />
            Sugestoes
          </Button>
          <Button type="button" onClick={() => setShowEditTable(true)} className="h-12 bg-casarei-pink hover:bg-casarei-pink-hover">
            <Pencil className="h-4 w-4" />
            Editar mesa
          </Button>
        </div>
        <Button type="button" onClick={() => setShowAddGuest(true)} className="mt-3 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
          <Plus className="h-4 w-4" />
          Adicionar convidado
        </Button>
      </div>
      {selectedGuest ? <GuestSeatDetails guest={selectedGuest} onClose={() => setSelectedGuest(null)} /> : null}
      {movingGuest ? <MoveGuestSheet guest={movingGuest} currentTable={table.name} onClose={() => setMovingGuest(null)} onMove={(tableName) => { setMessage(`${movingGuest.name} movido para ${tableName}.`); setGuests((current) => current.filter((item) => item.id !== movingGuest.id)); setMovingGuest(null); }} /> : null}
      {showAddGuest ? <AddSeatGuestSheet onClose={() => setShowAddGuest(false)} onAdd={(name) => { setGuests((current) => [...current, { id: `added-${Date.now()}`, name, relation: "Adicionado manualmente" }]); setShowAddGuest(false); setMessage(`${name} adicionado a ${table.name}.`); }} /> : null}
      {showEditTable ? <EditTableSheet tableName={table.name} capacity={table.capacity} onClose={() => setShowEditTable(false)} onSave={(name, capacity) => { setShowEditTable(false); setMessage(`${name} atualizado com ${capacity} cadeiras. Use adicionar convidado para completar a mesa.`); }} /> : null}
    </div>
  );
}

function GuestSeatDetails({ guest, onClose }: { guest: GuestTableSeat; onClose: () => void }) {
  return (
    <SheetFrame title={guest.name} eyebrow="Detalhes do convidado" onClose={onClose}>
      <div className="space-y-3 rounded-2xl bg-casarei-app p-4 text-sm">
        <InfoLine label="Nome" value={guest.name} />
        <InfoLine label="Relacao" value={guest.relation} />
        <InfoLine label="Status" value="Alocado nesta mesa" />
      </div>
      <Button type="button" onClick={onClose} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Entendi</Button>
    </SheetFrame>
  );
}

function MoveGuestSheet({ guest, currentTable, onClose, onMove }: { guest: GuestTableSeat; currentTable: string; onClose: () => void; onMove: (table: string) => void }) {
  return (
    <SheetFrame title="Trocar de mesa" eyebrow={guest.name} onClose={onClose}>
      <p className="text-sm leading-6 text-casarei-text-secondary">Mesa atual: {currentTable}. Escolha para onde mover.</p>
      <div className="mt-4 space-y-2">
        {guestTables.filter((item) => item.name !== currentTable).slice(0, 5).map((item) => (
          <button key={item.id} type="button" onClick={() => onMove(item.name)} className="flex w-full items-center justify-between rounded-2xl bg-casarei-app px-4 py-3 text-left text-sm font-bold text-casarei-text-primary">
            {item.name}
            <span className="text-xs text-casarei-text-secondary">{item.guests.length}/{item.capacity}</span>
          </button>
        ))}
      </div>
    </SheetFrame>
  );
}

function AddSeatGuestSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState(unseatedGuests[0] ?? "");
  return (
    <SheetFrame title="Adicionar convidado" eyebrow="Mesa" onClose={onClose}>
      <p className="text-sm leading-6 text-casarei-text-secondary">Só é possível colocar na mesa convidados que já estão na lista. Escolha alguém abaixo.</p>
      <div className="mt-4 space-y-2">
        {unseatedGuests.map((guest) => (
          <button key={guest} type="button" onClick={() => setName(guest)} className="flex w-full items-center justify-between rounded-2xl bg-casarei-app px-4 py-3 text-left text-sm font-bold text-casarei-text-primary">
            {guest}
            <ChevronRight className="h-4 w-4 text-casarei-text-secondary" />
          </button>
        ))}
      </div>
      <p className="mt-4 rounded-2xl bg-casarei-pink-soft p-4 text-sm font-semibold text-casarei-text-primary">Selecionado: {name}</p>
      <Button type="button" onClick={() => name.trim() && onAdd(name.trim())} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Adicionar na mesa</Button>
    </SheetFrame>
  );
}

function EditTableSheet({ tableName, capacity, onClose, onSave }: { tableName: string; capacity: number; onClose: () => void; onSave: (name: string, capacity: number) => void }) {
  const [name, setName] = useState(tableName);
  const [chairs, setChairs] = useState(String(capacity));
  return (
    <SheetFrame title="Editar mesa" eyebrow="Organizacao" onClose={onClose}>
      <label className="block rounded-2xl bg-casarei-app p-4">
        <span className="text-xs font-bold text-casarei-text-secondary">Identificacao da mesa</span>
        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
      </label>
      <label className="mt-3 block rounded-2xl bg-casarei-app p-4">
        <span className="text-xs font-bold text-casarei-text-secondary">Numero de cadeiras</span>
        <input value={chairs} onChange={(event) => setChairs(event.target.value)} inputMode="numeric" className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
      </label>
      <Button type="button" onClick={() => onSave(name, Math.max(1, Number.parseInt(chairs, 10) || capacity))} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Salvar mesa</Button>
    </SheetFrame>
  );
}

function SheetFrame({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">{eyebrow}</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-text-primary">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><span className="text-casarei-text-secondary">{label}</span><strong className="text-right text-casarei-text-primary">{value}</strong></div>;
}
