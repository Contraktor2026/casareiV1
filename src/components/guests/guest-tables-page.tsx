"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Grid2X2,
  GripVertical,
  Home,
  MoreHorizontal,
  MoreVertical,
  Package,
  PlusCircle,
  UserRound,
  UserRoundX,
  UsersRound,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { guestTables } from "@/lib/mock/guest-tables";

type SeatingGuest = {
  id: string;
  name: string;
  group: string;
  people: number;
  status: "Confirmado" | "Pendente";
};

type SeatingTable = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  notes: string;
  guests: SeatingGuest[];
};

const initialUnassigned: SeatingGuest[] = [
  { id: "u-1", name: "Juliana Mendes", group: "Familia da noiva", people: 1, status: "Confirmado" },
  { id: "u-2", name: "Carlos Eduardo", group: "Amigos do noivo", people: 1, status: "Pendente" },
  { id: "u-3", name: "Paulo e Ana Souza", group: "Amigos do casal", people: 2, status: "Confirmado" },
  { id: "u-4", name: "Maria Aparecida", group: "Familia da noiva", people: 3, status: "Confirmado" },
  { id: "u-5", name: "Renato e Bianca Alves", group: "Familia do noivo", people: 2, status: "Pendente" },
  { id: "u-6", name: "Fernanda Costa", group: "Trabalho", people: 1, status: "Confirmado" }
];

const initialTables: SeatingTable[] = guestTables.slice(0, 6).map((table, tableIndex) => ({
  id: table.id,
  name: table.name,
  capacity: table.capacity,
  location: tableIndex < 2 ? "Perto da pista" : tableIndex < 5 ? "Area central" : "Lateral do salao",
  notes: table.suggestion,
  guests: table.guests.slice(0, tableIndex === 0 ? 8 : tableIndex === 1 ? 6 : table.guests.length).map((guest) => ({
    id: guest.id,
    name: guest.name,
    group: guest.relation,
    people: 1,
    status: guest.id.length % 2 === 0 ? "Pendente" : "Confirmado"
  }))
}));

export function GuestTablesPage() {
  const [tab, setTab] = useState<"overview" | "organize">("overview");
  const [tables, setTables] = useState(initialTables);
  const [unassigned, setUnassigned] = useState(initialUnassigned);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [organizingGuest, setOrganizingGuest] = useState<SeatingGuest | null>(null);
  const [movingGuest, setMovingGuest] = useState<{ guest: SeatingGuest; fromTableId: string } | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    const organized = tables.reduce((total, table) => total + table.guests.reduce((sum, guest) => sum + guest.people, 0), 0);
    const withoutTable = unassigned.reduce((total, guest) => total + guest.people, 0);
    const total = organized + withoutTable;
    return {
      total,
      organized,
      withoutTable,
      progress: total ? Math.round((organized / total) * 100) : 0
    };
  }, [tables, unassigned]);

  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;

  function tableOccupancy(table: SeatingTable) {
    return table.guests.reduce((sum, guest) => sum + guest.people, 0);
  }

  function removeGuestFromSource(guestId: string, source: string) {
    if (source === "unassigned") {
      setUnassigned((current) => current.filter((guest) => guest.id !== guestId));
      return;
    }
    setTables((current) =>
      current.map((table) => (table.id === source ? { ...table, guests: table.guests.filter((guest) => guest.id !== guestId) } : table))
    );
  }

  function findGuest(guestId: string, source: string) {
    if (source === "unassigned") return unassigned.find((guest) => guest.id === guestId) ?? null;
    return tables.find((table) => table.id === source)?.guests.find((guest) => guest.id === guestId) ?? null;
  }

  function moveGuestToTable(guest: SeatingGuest, source: string, tableId: string) {
    const target = tables.find((table) => table.id === tableId);
    if (!target) return;
    const freeSeats = target.capacity - tableOccupancy(target);
    if (freeSeats < guest.people) {
      setMessage(`${target.name} nao tem lugares suficientes para ${guest.name}.`);
      return;
    }
    removeGuestFromSource(guest.id, source);
    setTables((current) => current.map((table) => (table.id === tableId ? { ...table, guests: [...table.guests, guest] } : table)));
    setMessage(`${guest.name} foi para ${target.name}.`);
  }

  function handleDrop(tableId: string, payload: string) {
    const [guestId, source] = payload.split("|");
    const guest = findGuest(guestId, source);
    if (guest) moveGuestToTable(guest, source, tableId);
  }

  function removeFromTable(tableId: string, guest: SeatingGuest) {
    const table = tables.find((item) => item.id === tableId);
    if (!confirmPermanentDelete({ itemName: guest.name, context: table ? `Ele será removido da ${table.name}.` : "Ele será removido desta mesa." })) return;
    setTables((current) => current.map((table) => (table.id === tableId ? { ...table, guests: table.guests.filter((item) => item.id !== guest.id) } : table)));
    setUnassigned((current) => [guest, ...current]);
    setMessage(`${guest.name} ainda precisa de lugar.`);
  }

  function addTable(data: { name: string; capacity: number; location: string; notes: string }) {
    const id = `mesa-${Date.now()}`;
    setTables((current) => [...current, { id, guests: [], ...data }]);
    setShowAddTable(false);
    setMessage(`${data.name} adicionada. Agora voce pode colocar nela convidados que ja estao na lista.`);
  }

  function updateTable(tableId: string, data: { name: string; capacity: number; location: string; notes: string }) {
    setTables((current) => current.map((table) => (table.id === tableId ? { ...table, ...data } : table)));
    setMessage("Mesa atualizada.");
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-casarei-app px-4 pb-36 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:pb-12">
      <main className="mx-auto max-w-[430px] lg:max-w-[760px]">
        <SeatingHeader />
        <section className="mt-5">
          <h2 className="font-serif text-4xl leading-tight text-casarei-text-primary sm:text-5xl">Organize seus convidados com leveza</h2>
          <p className="mt-3 text-base leading-7 text-casarei-text-secondary sm:text-lg">Veja quem ja tem mesa, quem ainda falta organizar e mova convidados com poucos toques.</p>
        </section>

        <SeatingStatsCard stats={stats} />
        {message ? <p className="mt-4 rounded-2xl bg-casarei-green-soft px-4 py-3 text-sm font-semibold text-[#5F7752] ring-1 ring-[#DCE8D4]">{message}</p> : null}
        <SeatingTabs value={tab} onChange={setTab} />

        {tab === "overview" ? (
          <>
            <SeatingCarousel tables={tables} onOpen={setSelectedTableId} onDrop={handleDrop} />
            <UnassignedGuests
              guests={unassigned}
              onOrganize={setOrganizingGuest}
              onDrag={(event, guest) => event.dataTransfer.setData("text/plain", `${guest.id}|unassigned`)}
            />
          </>
        ) : (
          <section className="mt-6 space-y-4">
            <div className="rounded-2xl bg-casarei-pink-soft p-4 text-sm font-semibold leading-6 text-casarei-text-primary">
              Só é possível colocar na mesa convidados que já estão na lista. Para incluir alguém novo, adicione primeiro na lista de convidados.
            </div>
            <Button type="button" onClick={() => setShowAddTable(true)} className="h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
              <PlusCircle className="h-4 w-4" />
              ADICIONAR MESA
            </Button>
            <div className="grid gap-4 sm:grid-cols-2">
              {tables.map((table) => (
                <SeatingTableCard
                  key={table.id}
                  table={table}
                  onOpen={() => setSelectedTableId(table.id)}
                  onAdd={() => setSelectedTableId(table.id)}
                  onDrop={(payload) => handleDrop(table.id, payload)}
                />
              ))}
            </div>
            <UnassignedGuests
              guests={unassigned}
              onOrganize={setOrganizingGuest}
              onDrag={(event, guest) => event.dataTransfer.setData("text/plain", `${guest.id}|unassigned`)}
            />
          </section>
        )}
      </main>

      {selectedTable ? (
        <TableDetailsModal
          table={selectedTable}
          unassigned={unassigned}
          onClose={() => setSelectedTableId(null)}
          onRemove={(guest) => removeFromTable(selectedTable.id, guest)}
          onAdd={(guest) => moveGuestToTable(guest, "unassigned", selectedTable.id)}
          onMove={(guest) => setMovingGuest({ guest, fromTableId: selectedTable.id })}
          onUpdate={(data) => updateTable(selectedTable.id, data)}
        />
      ) : null}
      {movingGuest ? (
        <MoveGuestModal
          guest={movingGuest.guest}
          tables={tables}
          fromTableId={movingGuest.fromTableId}
          onClose={() => setMovingGuest(null)}
          onMove={(tableId) => {
            moveGuestToTable(movingGuest.guest, movingGuest.fromTableId, tableId);
            setMovingGuest(null);
          }}
        />
      ) : null}
      {organizingGuest ? (
        <ChooseTableModal
          guest={organizingGuest}
          tables={tables}
          onClose={() => setOrganizingGuest(null)}
          onConfirm={(tableId) => {
            moveGuestToTable(organizingGuest, "unassigned", tableId);
            setOrganizingGuest(null);
          }}
        />
      ) : null}
      {showAddTable ? (
        <AddTableModal
          onClose={() => setShowAddTable(false)}
          onSave={addTable}
        />
      ) : null}
    </div>
  );
}

function SeatingHeader() {
  return (
    <header className="flex h-16 items-center justify-between">
      <Link href="/app/presenca-mesas" className="grid h-14 w-14 place-items-center rounded-full bg-casarei-surface text-casarei-text-primary shadow-[0_12px_30px_rgba(75,46,43,0.08)]" aria-label="Voltar">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h1 className="font-serif text-3xl text-casarei-text-primary">Mesas</h1>
      <button type="button" className="grid h-14 w-14 place-items-center rounded-full bg-casarei-surface text-casarei-text-primary shadow-[0_12px_30px_rgba(75,46,43,0.08)]" aria-label="Opcoes">
        <MoreHorizontal className="h-6 w-6" />
      </button>
    </header>
  );
}

function SeatingStatsCard({ stats }: { stats: { total: number; organized: number; withoutTable: number; progress: number } }) {
  return (
    <section className="mt-7 rounded-[28px] bg-casarei-surface p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-casarei-border-soft">
      <div className="grid grid-cols-4 divide-x divide-casarei-border-soft text-center">
        <StatIcon icon={<UsersRound />} value={stats.total} label="convidados" tone="green" />
        <StatIcon icon={<CheckCircle2 />} value={stats.organized} label="organizados" tone="green" />
        <StatIcon icon={<UserRoundX />} value={stats.withoutTable} label="a acomodar" tone="attention" />
        <StatIcon icon={<PieIcon />} value={`${stats.progress}%`} label="concluido" tone="gold" />
      </div>
      <div className="mt-6 border-t border-casarei-border-soft pt-5">
        <div className="flex items-center justify-between text-sm text-casarei-text-primary">
          <span>{stats.organized} de {stats.total} convidados organizados</span>
          <strong>{stats.progress}%</strong>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-casarei-app">
          <div className="h-full rounded-full bg-casarei-pink" style={{ width: `${stats.progress}%` }} />
        </div>
      </div>
    </section>
  );
}

function StatIcon({ icon, value, label, tone }: { icon: React.ReactNode; value: string | number; label: string; tone: "green" | "attention" | "gold" }) {
  const toneClass = tone === "green" ? "bg-casarei-green-soft text-[#5F7752]" : tone === "attention" ? "bg-[#FBEEE8] text-[#B96F52]" : "bg-[#F6EEE2] text-[#9D7B4D]";
  return (
    <article className="px-2">
      <span className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${toneClass} [&>svg]:h-5 [&>svg]:w-5`}>{icon}</span>
      <p className="mt-3 font-serif text-3xl text-casarei-text-primary">{value}</p>
      <p className="text-xs leading-4 text-casarei-text-secondary">{label}</p>
    </article>
  );
}

function PieIcon() {
  return <span className="block h-5 w-5 rounded-full border-2 border-current border-r-transparent" />;
}

function SeatingTabs({ value, onChange }: { value: "overview" | "organize"; onChange: (value: "overview" | "organize") => void }) {
  return (
    <nav className="mt-5 flex rounded-full bg-casarei-surface p-1 text-sm font-bold text-casarei-text-primary shadow-[0_12px_35px_rgba(75,46,43,0.06)]">
      <button type="button" onClick={() => onChange("overview")} className={value === "overview" ? "flex-1 rounded-full bg-casarei-pink px-4 py-4 text-white" : "flex-1 rounded-full px-4 py-4"}>
        <Grid2X2 className="mr-2 inline h-4 w-4" />
        Visao geral
      </button>
      <button type="button" onClick={() => onChange("organize")} className={value === "organize" ? "flex-1 rounded-full bg-casarei-pink px-4 py-4 text-white" : "flex-1 rounded-full px-4 py-4"}>
        <Grid2X2 className="mr-2 inline h-4 w-4" />
        Organizar mesas
      </button>
    </nav>
  );
}

function SeatingCarousel({ tables, onOpen, onDrop }: { tables: SeatingTable[]; onOpen: (id: string) => void; onDrop: (tableId: string, payload: string) => void }) {
  return (
    <section className="mt-7">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-casarei-text-primary">Mesas organizadas</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tables.slice(0, 6).map((table) => (
          <SeatingTableCard key={table.id} table={table} carousel onOpen={() => onOpen(table.id)} onDrop={(payload) => onDrop(table.id, payload)} />
        ))}
      </div>
    </section>
  );
}

function SeatingTableCard({
  table,
  carousel,
  onOpen,
  onAdd,
  onDrop
}: {
  table: SeatingTable;
  carousel?: boolean;
  onOpen: () => void;
  onAdd?: () => void;
  onDrop: (payload: string) => void;
}) {
  const occupied = table.guests.reduce((sum, guest) => sum + guest.people, 0);
  const status = occupied >= table.capacity ? "Completa" : occupied > 0 ? "Parcial" : "Disponivel";
  const statusClass = status === "Completa" ? "bg-casarei-green-soft text-[#5F7752]" : status === "Parcial" ? "bg-[#FBEEE8] text-[#B96F52]" : "bg-casarei-app text-casarei-text-secondary";

  return (
    <article
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event.dataTransfer.getData("text/plain"))}
      className={`${carousel ? "w-full" : "w-full"} rounded-[24px] bg-casarei-surface p-4 shadow-[0_14px_36px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft`}
    >
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-casarei-text-primary">{table.name}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{status}</span>
        </div>
        {!carousel ? <p className="mt-1 text-xs text-casarei-text-secondary">{table.location}</p> : null}
        <p className="mt-4 text-center text-sm font-bold text-casarei-text-primary">{occupied}/{table.capacity} lugares</p>
        <div className="mt-5 flex justify-center">
          <TableOccupancy occupied={occupied} capacity={table.capacity} statusClass={statusClass} />
        </div>
        <p className="mt-4 text-center text-sm text-casarei-text-secondary">{Math.max(0, table.capacity - occupied)} livres</p>
      </button>
      {!carousel ? (
        <Button
          type="button"
          onClick={onAdd}
          disabled={occupied >= table.capacity}
          variant="outline"
          className="mt-4 h-11 w-full border-[#F3C7D2] bg-casarei-surface text-casarei-pink disabled:opacity-50"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar convidado
        </Button>
      ) : null}
    </article>
  );
}

function TableOccupancy({ occupied, capacity, statusClass }: { occupied: number; capacity: number; statusClass: string }) {
  return (
    <div className="relative h-28 w-28">
      {Array.from({ length: capacity }).map((_, index) => {
        const angle = (index / capacity) * Math.PI * 2;
        const x = Math.round(44 + Math.cos(angle) * 42);
        const y = Math.round(44 + Math.sin(angle) * 42);
        return <span key={index} className={`absolute h-6 w-6 rounded-full ${index < occupied ? statusClass : "bg-casarei-surface ring-1 ring-casarei-border-soft"}`} style={{ left: x, top: y }} />;
      })}
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-casarei-surface text-base font-bold text-[#B96F52] ring-1 ring-casarei-border-soft">
        {occupied}/{capacity}
      </span>
    </div>
  );
}

function UnassignedGuests({
  guests,
  onOrganize,
  onDrag
}: {
  guests: SeatingGuest[];
  onOrganize: (guest: SeatingGuest) => void;
  onDrag: (event: React.DragEvent, guest: SeatingGuest) => void;
}) {
  return (
    <section id="unassigned-guests" className="mt-7 rounded-t-[28px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-casarei-text-primary">Ainda precisam de lugar ({guests.reduce((sum, guest) => sum + guest.people, 0)})</h2>
        <button type="button" className="flex items-center gap-1 text-sm font-bold text-casarei-pink">Ver lista <ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="mt-4 divide-y divide-casarei-border-soft">
        {guests.map((guest) => (
          <UnassignedGuestCard key={guest.id} guest={guest} onOrganize={() => onOrganize(guest)} onDrag={(event) => onDrag(event, guest)} />
        ))}
      </div>
    </section>
  );
}

function UnassignedGuestCard({ guest, onOrganize, onDrag }: { guest: SeatingGuest; onOrganize: () => void; onDrag: (event: React.DragEvent) => void }) {
  return (
    <article draggable onDragStart={onDrag} className="flex items-center gap-3 py-4">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-casarei-pink-soft text-casarei-pink">
        <UserRound className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-casarei-text-primary">{guest.name}</p>
        <p className="mt-1 text-sm text-casarei-text-secondary">{guest.group}</p>
        <p className="mt-1 text-sm font-semibold text-casarei-text-primary">{guest.people} convidado{guest.people > 1 ? "s" : ""}</p>
      </div>
      <button type="button" onClick={onOrganize} className="rounded-2xl border border-[#F3C7D2] px-6 py-3 text-sm font-bold text-casarei-pink">Organizar</button>
      <button type="button" aria-label={`Opcoes de ${guest.name}`} className="text-casarei-text-secondary">
        <MoreVertical className="h-5 w-5" />
      </button>
      <span className="sr-only">Arraste para uma mesa ou toque em Organizar para escolher uma mesa.</span>
    </article>
  );
}

function TableDetailsModal({
  table,
  unassigned,
  onClose,
  onRemove,
  onAdd,
  onMove,
  onUpdate
}: {
  table: SeatingTable;
  unassigned: SeatingGuest[];
  onClose: () => void;
  onRemove: (guest: SeatingGuest) => void;
  onAdd: (guest: SeatingGuest) => void;
  onMove: (guest: SeatingGuest) => void;
  onUpdate: (data: { name: string; capacity: number; location: string; notes: string }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(table.name);
  const [capacity, setCapacity] = useState(String(table.capacity));
  const [location, setLocation] = useState(table.location);
  const [notes, setNotes] = useState(table.notes);
  const occupied = table.guests.reduce((sum, guest) => sum + guest.people, 0);

  return (
    <Sheet title={table.name} eyebrow={`${occupied}/${table.capacity} lugares`} onClose={onClose}>
      {editing ? (
        <div className="space-y-3">
          <SheetField label="Nome da mesa" value={name} onChange={setName} />
          <SheetField label="Quantidade de lugares" value={capacity} onChange={setCapacity} />
          <SheetField label="Localizacao" value={location} onChange={setLocation} />
          <SheetField label="Observacoes" value={notes} onChange={setNotes} textarea />
          <Button type="button" onClick={() => { onUpdate({ name, capacity: Math.max(1, Number.parseInt(capacity, 10) || table.capacity), location, notes }); setEditing(false); }} className="h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Salvar mesa</Button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-casarei-app p-4">
            <p className="text-sm font-bold text-casarei-text-primary">Convidados</p>
            <div className="mt-3 space-y-2">
              {table.guests.map((guest) => (
                <div key={guest.id} className="rounded-2xl bg-casarei-surface p-3 ring-1 ring-casarei-border-soft">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-casarei-text-primary">{guest.name}</p>
                      <p className="text-xs text-casarei-text-secondary">{guest.group} - {guest.people} pessoa(s)</p>
                    </div>
                    <button type="button" onClick={() => onRemove(guest)} className="grid h-9 w-9 place-items-center rounded-full bg-casarei-app text-casarei-text-secondary">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button type="button" onClick={() => onMove(guest)} className="mt-3 rounded-full bg-casarei-pink-soft px-3 py-2 text-xs font-bold text-casarei-pink">Trocar de mesa</button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-casarei-app p-4">
            <p className="text-sm font-bold text-casarei-text-primary">Acolher quem ainda precisa de lugar</p>
            <p className="mt-1 text-xs leading-5 text-casarei-text-secondary">Aparecem aqui apenas convidados que já estão na lista e ainda não têm mesa.</p>
            <div className="mt-3 space-y-2">
              {unassigned.slice(0, 4).map((guest) => (
                <button key={guest.id} type="button" onClick={() => onAdd(guest)} className="flex w-full items-center justify-between rounded-2xl bg-casarei-surface px-3 py-3 text-left text-sm font-bold text-casarei-text-primary ring-1 ring-casarei-border-soft">
                  {guest.name}
                  <PlusCircle className="h-4 w-4 text-casarei-pink" />
                </button>
              ))}
            </div>
          </div>
          <Button type="button" onClick={() => setEditing(true)} variant="outline" className="mt-4 h-12 w-full border-[#F3C7D2] text-casarei-pink">Editar mesa</Button>
        </>
      )}
    </Sheet>
  );
}

function ChooseTableModal({ guest, tables, onClose, onConfirm }: { guest: SeatingGuest; tables: SeatingTable[]; onClose: () => void; onConfirm: (tableId: string) => void }) {
  const [selectedTableId, setSelectedTableId] = useState("");
  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;

  return (
    <Sheet title={`Escolher mesa para ${guest.name}`} eyebrow="Ainda precisa de lugar" onClose={onClose}>
      <div className="rounded-2xl bg-casarei-app p-4">
        <p className="text-sm font-bold text-casarei-text-primary">{guest.name}</p>
        <p className="mt-1 text-sm text-casarei-text-secondary">{guest.group}</p>
        <p className="mt-1 text-sm font-semibold text-casarei-text-primary">{guest.people} convidado{guest.people > 1 ? "s" : ""}</p>
      </div>

      <div className="mt-4 space-y-2">
        {tables.map((table) => {
          const occupied = table.guests.reduce((sum, item) => sum + item.people, 0);
          const freeSeats = Math.max(0, table.capacity - occupied);
          const disabled = freeSeats < guest.people;
          const isSelected = selectedTableId === table.id;

          return (
            <button
              key={table.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedTableId(table.id)}
              className={
                isSelected
                  ? "flex w-full items-center justify-between rounded-2xl bg-casarei-pink-soft px-4 py-4 text-left ring-1 ring-casarei-pink"
                  : disabled
                    ? "flex w-full items-center justify-between rounded-2xl bg-casarei-app px-4 py-4 text-left opacity-45"
                    : "flex w-full items-center justify-between rounded-2xl bg-casarei-surface px-4 py-4 text-left ring-1 ring-casarei-border-soft transition hover:-translate-y-0.5"
              }
            >
              <span>
                <span className="block text-sm font-bold text-casarei-text-primary">{table.name}</span>
                <span className="mt-1 block text-xs text-casarei-text-secondary">{occupied}/{table.capacity} lugares</span>
              </span>
              <span className={disabled ? "text-xs font-bold text-casarei-text-secondary" : "text-xs font-bold text-casarei-pink"}>
                {freeSeats === 0 ? "Completa" : `${freeSeats} lugar${freeSeats > 1 ? "es" : ""} livres`}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        disabled={!selectedTable}
        onClick={() => selectedTable && onConfirm(selectedTable.id)}
        className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover disabled:opacity-50"
      >
        Confirmar mesa
      </Button>
    </Sheet>
  );
}

function MoveGuestModal({ guest, tables, fromTableId, onClose, onMove }: { guest: SeatingGuest; tables: SeatingTable[]; fromTableId: string; onClose: () => void; onMove: (tableId: string) => void }) {
  return (
    <Sheet title="Trocar de mesa" eyebrow={guest.name} onClose={onClose}>
      <div className="space-y-2">
        {tables.filter((table) => table.id !== fromTableId).map((table) => {
          const occupied = table.guests.reduce((sum, item) => sum + item.people, 0);
          return (
            <button key={table.id} type="button" onClick={() => onMove(table.id)} className="flex w-full items-center justify-between rounded-2xl bg-casarei-app px-4 py-3 text-left text-sm font-bold text-casarei-text-primary">
              <span>{table.name}</span>
              <span className="text-xs text-casarei-text-secondary">{occupied}/{table.capacity}</span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

function AddTableModal({ onClose, onSave }: { onClose: () => void; onSave: (data: { name: string; capacity: number; location: string; notes: string }) => void }) {
  const [name, setName] = useState("Nova mesa");
  const [capacity, setCapacity] = useState("10");
  const [location, setLocation] = useState("Area central");
  const [notes, setNotes] = useState("");

  return (
    <Sheet title="Adicionar mesa" eyebrow="Organizar mesas" onClose={onClose}>
      <div className="rounded-2xl bg-casarei-pink-soft p-4 text-sm leading-6 text-casarei-text-primary">
        Depois de criar a mesa, adicione somente convidados que já estão na lista.
      </div>
      <div className="mt-4 space-y-3">
        <SheetField label="Nome da mesa" value={name} onChange={setName} />
        <SheetField label="Quantidade de lugares" value={capacity} onChange={setCapacity} />
        <SheetField label="Localizacao" value={location} onChange={setLocation} />
        <SheetField label="Observacoes" value={notes} onChange={setNotes} textarea />
      </div>
      <Button
        type="button"
        onClick={() => onSave({ name: name.trim() || "Nova mesa", capacity: Math.max(1, Number.parseInt(capacity, 10) || 10), location, notes })}
        className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover"
      >
        Salvar mesa
      </Button>
    </Sheet>
  );
}

function Sheet({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">{eyebrow}</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-text-primary">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-app" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function SheetField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className="block rounded-2xl bg-casarei-app p-4">
      <span className="text-xs font-bold text-casarei-text-secondary">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-2 w-full resize-none bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
      )}
    </label>
  );
}

function MobileGuestNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-end border-t border-casarei-border-soft bg-casarei-surface px-5 pb-3 pt-2 text-[10px] font-semibold text-casarei-text-secondary shadow-[0_-12px_40px_rgba(75,46,43,0.08)] lg:hidden">
      <BottomNavItem href="/app" icon={<Home />} label="Inicio" />
      <BottomNavItem href="/app/tarefas" icon={<CheckSquare />} label="Tarefas" />
      <BottomNavItem href="/app/fornecedores" icon={<Package />} label="Fornecedores" />
      <BottomNavItem href="/app/presenca-mesas" icon={<UsersRound />} label="Presença" active />
      <BottomNavItem href="/app" icon={<GripVertical />} label="Mais" />
    </nav>
  );
}

function BottomNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={active ? "grid justify-items-center gap-1 text-casarei-pink [&>svg]:h-5 [&>svg]:w-5" : "grid justify-items-center gap-1 [&>svg]:h-5 [&>svg]:w-5"}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
