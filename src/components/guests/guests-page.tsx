"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  UsersRound,
  Utensils,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import {
  defaultRsvpSettings,
  getStoredRsvpResponses,
  getStoredRsvpSettings,
  saveRsvpSettings,
  type StoredRsvpSettings
} from "@/lib/client/guests-rsvp-store";
import { slugifyGroup, type GuestGroupTone } from "@/lib/guests/groups";
import { mockGuestsRich } from "@/lib/mock/guests";
import type { Guest, GuestRsvpStatus } from "@/types/guests";
import { getGuestName } from "./guest-helpers";

type GuestTab = "Resumo" | "Lista" | "Grupos" | "Revisar dados";
type GuestListFilter = "Todos" | "Sem WhatsApp" | "Com cuidados" | "Sem grupo";

const tabs: GuestTab[] = ["Resumo", "Lista", "Grupos", "Revisar dados"];

type GuestFormData = {
  name: string;
  group: string;
  relation: string;
  phone: string;
  email: string;
  companions: number;
  food: string;
  notes: string;
};

const groupCards = [
  { name: "Família dos noivos", count: 68, confirmed: 54, pending: 31, tone: "green" },
  { name: "Família da noiva", count: 52, confirmed: 21, pending: 24, tone: "pink" },
  { name: "Família do noivo", count: 45, confirmed: 18, pending: 19, tone: "blue" },
  { name: "Amigos da noiva", count: 38, confirmed: 15, pending: 12, tone: "purple" },
  { name: "Amigos do noivo", count: 26, confirmed: 10, pending: 9, tone: "terracotta" },
  { name: "Trabalho", count: 19, confirmed: 8, pending: 7, tone: "blue" },
  { name: "Amigos do casal", count: 64, confirmed: 25, pending: 21, tone: "green" }
];

const defaultGuestGroups = [
  "Família dos noivos",
  "Família da noiva",
  "Família do noivo",
  "Amigos da noiva",
  "Amigos do noivo",
  "Amigos do casal",
  "Madrinhas",
  "Padrinhos",
  "Trabalho",
  "Vizinhos",
  "Convidados importados"
];

export function GuestsPage() {
  const [activeTab, setActiveTab] = useState<GuestTab>("Resumo");
  const [guests, setGuests] = useState(mockGuestsRich);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<GuestListFilter>("Todos");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showRsvpSettings, setShowRsvpSettings] = useState(false);
  const [rsvpSettings, setRsvpSettings] = useState<StoredRsvpSettings>(defaultRsvpSettings);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState("");

  function syncRsvpResponses(showMessage = true) {
    const responses = getStoredRsvpResponses();
    setGuests((current) =>
      current.map((guest) => {
        const response = responses.find((item) => item.token === guest.rsvp.token);
        if (!response) return guest;
        return {
          ...guest,
          rsvp: {
            ...guest.rsvp,
            status: response.status,
            viewed: true,
            responded: true,
            respondedAt: response.respondedAt,
            lastInteraction: response.status === "confirmed" ? "Confirmou presença" : "Respondeu que não poderá ir"
          },
          companions: {
            ...guest.companions,
            confirmedCount: response.companionNames.length,
            names: response.companionNames
          },
          children: {
            ...guest.children,
            count: response.children,
            names: Array.from({ length: response.children }, (_, index) => ({ name: `Criança ${index + 1}`, age: 0 }))
          },
          food: {
            ...guest.food,
            buffetNotes: response.food,
            vegetarian: response.food.toLowerCase().includes("vegetar"),
            intolerance: response.food
          },
          notes: response.note
        };
      })
    );
    if (showMessage) {
      setMessage(responses.length ? `${responses.length} resposta(s) sincronizada(s) com a lista.` : "Ainda nao ha novas respostas de confirmação de presença.");
    }
  }

  useEffect(() => {
    setRsvpSettings(getStoredRsvpSettings());
    syncRsvpResponses(false);
  }, []);

  const filteredGuests = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return guests.filter((guest) => {
      const statusMatch =
        status === "Todos" ||
        (status === "Sem WhatsApp" && !guest.phone) ||
        (status === "Com cuidados" && Boolean(guest.food.buffetNotes || guest.children.count || guest.companions.allowedCount)) ||
        (status === "Sem grupo" && !guest.group);
      const queryMatch = !normalized || `${getGuestName(guest)} ${guest.group} ${guest.relation}`.toLowerCase().includes(normalized);
      return statusMatch && queryMatch;
    });
  }, [guests, query, status]);

  function addGuest(data: GuestFormData) {
    const [firstName, ...rest] = data.name.trim().split(" ");
    const timestamp = Date.now();
    const guest: Guest = {
      ...mockGuestsRich[0],
      id: `guest-${timestamp}`,
      firstName,
      lastName: rest.join(" "),
      nickname: firstName,
      group: data.group,
      relation: data.relation,
      phone: data.phone,
      email: data.email,
      rsvp: { ...mockGuestsRich[0].rsvp, status: "pending", viewed: false, responded: false, token: `guest-${timestamp}` },
      companions: { allowed: data.companions > 0, allowedCount: data.companions, confirmedCount: 0, names: [] },
      children: { count: 0, names: [] },
      food: { vegetarian: data.food.toLowerCase().includes("vegetar"), vegan: data.food.toLowerCase().includes("vegano"), intolerance: data.food, allergies: "", buffetNotes: data.food },
      table: { name: "", group: "", affinities: [], avoidWith: [] },
      notes: data.notes,
      internalNote: data.notes,
      history: [{ label: "adicionado à lista", date: "hoje" }]
    };
    setGuests((current) => [guest, ...current]);
    setShowGuestForm(false);
    setRecentlyAddedId(guest.id);
    setActiveTab("Lista");
    setStatus("Todos");
    setQuery(getGuestName(guest));
    setMessage(`${getGuestName(guest)} foi adicionado e está destacado na lista.`);
    window.setTimeout(() => setRecentlyAddedId(""), 4500);
  }

  function buildGuestFromData(data: GuestFormData, idSuffix: string): Guest {
    const [firstName, ...rest] = data.name.trim().split(" ");
    return {
      ...mockGuestsRich[0],
      id: `guest-${idSuffix}`,
      firstName,
      lastName: rest.join(" "),
      nickname: firstName,
      group: data.group,
      relation: data.relation,
      phone: data.phone,
      email: data.email,
      rsvp: { ...mockGuestsRich[0].rsvp, status: "pending", viewed: false, responded: false, token: `guest-${idSuffix}` },
      companions: { allowed: data.companions > 0, allowedCount: data.companions, confirmedCount: 0, names: [] },
      children: { count: 0, names: [] },
      food: { vegetarian: data.food.toLowerCase().includes("vegetar"), vegan: data.food.toLowerCase().includes("vegano"), intolerance: data.food, allergies: "", buffetNotes: data.food },
      table: { name: "", group: "", affinities: [], avoidWith: [] },
      notes: data.notes,
      internalNote: data.notes,
      history: [{ label: "importado para a lista", date: "hoje" }]
    };
  }

  function importGuests(text: string) {
    const importedGuests = text
      .split(/\n/)
      .map((line, index) => {
        const [rawName, rawGroup, rawPhone, rawEmail] = line.split(",").map((item) => item?.trim() ?? "");
        if (!rawName) return null;
        return buildGuestFromData(
          {
            name: rawName,
            group: rawGroup || "Convidados importados",
            relation: "Convidado",
            phone: rawPhone || "",
            email: rawEmail || "",
            companions: 0,
            food: "",
            notes: "Importado da lista"
          },
          `import-${Date.now()}-${index}`
        );
      })
      .filter((guest): guest is Guest => Boolean(guest));

    if (!importedGuests.length) {
      setMessage("Cole pelo menos um convidado para importar.");
      return;
    }

    setGuests((current) => [...importedGuests, ...current]);
    setShowImportForm(false);
    setActiveTab("Lista");
    setStatus("Todos");
    setQuery("");
    setMessage(`${importedGuests.length} convidado${importedGuests.length === 1 ? "" : "s"} importado${importedGuests.length === 1 ? "" : "s"} para a lista.`);
  }

  function removeGuest(id: string) {
    const guest = guests.find((item) => item.id === id);
    if (!confirmPermanentDelete({ itemName: guest ? getGuestName(guest) : "este convidado", context: "Ele será removido da lista de convidados." })) return;
    setGuests((current) => current.filter((guest) => guest.id !== id));
    setSelectedGuest(null);
    setMessage("Convidado removido da lista.");
  }

  return (
    <div className="-mx-4 -mt-2 min-h-screen bg-casarei-app px-4 pb-36 pt-4 md:-mx-8 md:px-8 lg:-mx-11 lg:px-11 lg:pb-12">
      <div className="mx-auto max-w-[430px] lg:max-w-[760px]">
        <GuestTopBar
          onMenu={() => setNotice({ title: "Menu dos convidados", description: "Use as abas para navegar por resumo, lista e grupos. Confirmação e mesas ficam no módulo Presença & Mesas." })}
          onBell={() => setNotice({ title: "Avisos da Sofia", description: "Revise contatos sem WhatsApp, acompanhantes e restrições alimentares antes de enviar a confirmação." })}
        />
        <GuestHero />
        <GuestTabs active={activeTab} onChange={setActiveTab} />

        {message ? <p className="mb-4 rounded-2xl bg-casarei-green-soft px-4 py-3 text-sm font-semibold text-casarei-text-primary ring-1 ring-[#DCE8D4]">{message}</p> : null}

        {activeTab === "Resumo" ? (
          <GuestSummary
            onAdd={() => setShowGuestForm(true)}
            onImport={() => setShowImportForm(true)}
            guests={guests}
            onReview={() => setActiveTab("Revisar dados")}
            onMissingWhatsapp={() => {
              setStatus("Sem WhatsApp");
              setActiveTab("Lista");
            }}
            onCare={() => {
              setStatus("Com cuidados");
              setActiveTab("Lista");
            }}
            onCreateGroup={() => setShowGroupForm(true)}
            onList={() => {
              setStatus("Todos");
              setActiveTab("Lista");
            }}
          />
        ) : null}

        {activeTab === "Lista" ? (
          <GuestList
            guests={filteredGuests}
            query={query}
            status={status}
            onQuery={setQuery}
            onStatus={setStatus}
            onOpen={setSelectedGuest}
            onAdd={() => setShowGuestForm(true)}
            onImport={() => setShowImportForm(true)}
            recentlyAddedId={recentlyAddedId}
          />
        ) : null}

        {activeTab === "Grupos" ? (
          <GuestGroups
            onCreate={() => setShowGroupForm(true)}
          />
        ) : null}

        {activeTab === "Revisar dados" ? (
          <GuestDataReview guests={guests} onOpen={setSelectedGuest} onList={() => setActiveTab("Lista")} />
        ) : null}

      </div>

      {selectedGuest ? (
        <GuestDetails
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
          onRemove={removeGuest}
          onEdit={() => {
            setEditingGuest(selectedGuest);
            setSelectedGuest(null);
          }}
          onMessage={setMessage}
        />
      ) : null}
      {editingGuest ? (
        <EditGuestSheet
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
          onSave={(guest) => {
            setGuests((current) => current.map((item) => (item.id === guest.id ? guest : item)));
            setEditingGuest(null);
            setMessage("Dados do convidado atualizados.");
          }}
        />
      ) : null}
      {showGuestForm ? <AddGuestSheet onClose={() => setShowGuestForm(false)} onSave={addGuest} /> : null}
      {showImportForm ? <ImportGuestSheet onClose={() => setShowImportForm(false)} onImport={importGuests} /> : null}
      {showGroupForm ? <CreateGroupSheet onClose={() => setShowGroupForm(false)} onSave={(name) => { setShowGroupForm(false); setMessage(`Grupo "${name}" criado para organizar seus convidados.`); }} /> : null}
      {notice ? <NoticeSheet title={notice.title} description={notice.description} onClose={() => setNotice(null)} /> : null}
      {showRsvpSettings ? (
        <RsvpSettingsSheet
          settings={rsvpSettings}
          onClose={() => setShowRsvpSettings(false)}
          onSave={(settings) => {
            setRsvpSettings(settings);
            saveRsvpSettings(settings);
            setShowRsvpSettings(false);
            setMessage("Confirmação de presença personalizada com carinho.");
          }}
        />
      ) : null}
    </div>
  );
}

function GuestTopBar({ onMenu, onBell }: { onMenu: () => void; onBell: () => void }) {
  return (
    <header className="mb-4 flex h-12 items-center justify-between">
      <button type="button" onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-full text-casarei-text-primary" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-sm font-bold text-casarei-text-primary">Convidados</h1>
      <button type="button" onClick={onBell} className="relative grid h-10 w-10 place-items-center rounded-full text-casarei-text-primary" aria-label="Notificações">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-casarei-pink" />
      </button>
    </header>
  );
}

function GuestHero() {
  return (
    <section className="mb-5 rounded-[30px] bg-casarei-surface p-5 shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-casarei-border-soft lg:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Módulo</p>
      <div className="mt-1 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl leading-none text-casarei-text-primary lg:text-6xl">Convidados</h1>
          <p className="mt-4 text-sm leading-7 text-casarei-text-secondary lg:text-base">
            Cadastre convidados, organize grupos, contatos, acompanhantes e detalhes importantes sem depender de planilhas.
          </p>
        </div>
        <Heart className="h-7 w-7 shrink-0 text-casarei-pink" />
      </div>
      <div className="mt-5 flex gap-3 rounded-3xl bg-casarei-pink-soft p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-casarei-surface text-casarei-pink">
          <Sparkles className="h-5 w-5" />
        </span>
        <p className="text-sm leading-6 text-casarei-text-primary">
          Oi, Mari! Estou aqui para te ajudar a cuidar de cada detalhe dos seus convidados.
        </p>
      </div>
    </section>
  );
}

function GuestTabs({ active, onChange }: { active: GuestTab; onChange: (tab: GuestTab) => void }) {
  return (
    <nav className="mb-5 flex gap-1 overflow-x-auto rounded-full bg-casarei-surface p-1 shadow-[0_12px_35px_rgba(75,46,43,0.06)]">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={active === tab ? "shrink-0 rounded-full bg-casarei-pink px-4 py-3 text-xs font-bold text-white" : "shrink-0 rounded-full px-4 py-3 text-xs font-bold text-casarei-text-secondary"}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

function GuestSummary({
  guests,
  onAdd,
  onImport,
  onReview,
  onMissingWhatsapp,
  onCare,
  onCreateGroup,
  onList
}: {
  guests: Guest[];
  onAdd: () => void;
  onImport: () => void;
  onReview: () => void;
  onMissingWhatsapp: () => void;
  onCare: () => void;
  onCreateGroup: () => void;
  onList: () => void;
}) {
  const withWhatsapp = guests.filter((guest) => Boolean(guest.phone)).length;
  const withCare = guests.filter((guest) => guest.food.buffetNotes || guest.children.count || guest.companions.allowedCount).length;
  const groupsCount = new Set(guests.map((guest) => guest.group).filter(Boolean)).size;
  const incomplete = guests.filter((guest) => !guest.phone || !guest.group || !guest.lastName || (guest.companions.allowedCount > 0 && !guest.companions.names.length)).length;

  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryCard icon={<UsersRound />} title="Convidados cadastrados" value={String(guests.length)} sub="base principal da lista" note="Usada por Presença & Mesas" tone="blue" />
        <SummaryCard icon={<MessageCircle />} title="Com WhatsApp" value={String(withWhatsapp)} sub={`${guests.length - withWhatsapp} sem WhatsApp`} note="Importante para envio de links" tone="green" />
        <SummaryCard icon={<Utensils />} title="Com cuidados" value={String(withCare)} sub="acompanhantes, crianças ou buffet" note="Revise antes de compartilhar" tone="terracotta" />
        <SummaryCard icon={<Clock3 />} title="Precisa revisar" value={String(incomplete)} sub={`${groupsCount} grupos cadastrados`} note="Dados incompletos na base" tone="pink" />
      </div>

      <Button type="button" onClick={onAdd} className="h-14 w-full rounded-2xl bg-casarei-pink text-white hover:bg-casarei-pink-hover">
        <Plus className="h-4 w-4" />
        Adicionar convidado
      </Button>

      <section className="rounded-[26px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <h2 className="text-sm font-bold text-casarei-text-primary">Ações rápidas</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          <QuickAction icon={<Plus />} label="Importar lista" onClick={onImport} />
          <QuickAction icon={<Clock3 />} label="Revisar dados" onClick={onReview} />
          <QuickAction icon={<Mail />} label="Sem WhatsApp" onClick={onMissingWhatsapp} />
          <QuickAction icon={<Utensils />} label="Com cuidados" onClick={onCare} />
          <QuickAction icon={<UsersRound />} label="Criar grupo" onClick={onCreateGroup} />
          <QuickAction icon={<Search />} label="Ir para lista" onClick={onList} />
        </div>
      </section>
    </section>
  );
}

function SummaryCard({ icon, title, value, sub, note, tone }: { icon: React.ReactNode; title: string; value: string; sub: string; note: string; tone: "green" | "pink" | "terracotta" | "blue" }) {
  const toneClass = {
    green: "bg-casarei-green-soft text-[#5F7752]",
    pink: "bg-casarei-pink-soft text-casarei-pink",
    terracotta: "bg-[#FBEEE8] text-[#B96F52]",
    blue: "bg-[#EEF1F4] text-[#6E7F91]"
  }[tone];

  return (
    <article className="rounded-[24px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-casarei-text-secondary">{title}</p>
          <p className="mt-3 font-serif text-4xl text-casarei-text-primary">{value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${toneClass}`}>
          <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-casarei-text-primary">{sub}</p>
      <p className="mt-1 text-xs leading-5 text-casarei-text-secondary">{note}</p>
    </article>
  );
}

function QuickAction({ icon, label, onClick, href }: { icon: React.ReactNode; label: string; onClick: () => void; href?: string }) {
  const content = (
    <>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-casarei-pink-soft text-casarei-pink">
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </span>
      <span className="mt-2 text-xs font-bold text-casarei-text-primary">{label}</span>
    </>
  );

  if (href) {
    return <Link href={href} className="rounded-2xl bg-casarei-app p-4 text-center">{content}</Link>;
  }

  return <button type="button" onClick={onClick} className="rounded-2xl bg-casarei-app p-4 text-center">{content}</button>;
}

function GuestList({ guests, query, status, recentlyAddedId, onQuery, onStatus, onOpen, onAdd, onImport }: { guests: Guest[]; query: string; status: GuestListFilter; recentlyAddedId: string; onQuery: (value: string) => void; onStatus: (value: GuestListFilter) => void; onOpen: (guest: Guest) => void; onAdd: () => void; onImport: () => void }) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button type="button" onClick={onAdd} className="h-12 bg-casarei-pink hover:bg-casarei-pink-hover">
          <Plus className="h-4 w-4" />
          Adicionar convidado
        </Button>
        <Button type="button" onClick={onImport} variant="outline" className="h-12 border-[#F3C7D2] text-casarei-pink">
          Importar lista
        </Button>
      </div>
      <div className="rounded-[26px] bg-casarei-surface p-4 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <label className="flex h-12 items-center gap-3 rounded-2xl bg-casarei-app px-4">
          <Search className="h-4 w-4 text-casarei-text-secondary" />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar convidado" className="w-full bg-transparent text-sm text-casarei-text-primary outline-none" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {(["Todos", "Sem WhatsApp", "Com cuidados", "Sem grupo"] as const).map((item) => (
            <button key={item} type="button" onClick={() => onStatus(item)} className={status === item ? "rounded-full bg-casarei-pink px-4 py-2 text-xs font-bold text-white" : "rounded-full bg-casarei-surface px-4 py-2 text-xs font-bold text-casarei-text-secondary ring-1 ring-casarei-border-soft"}>{item}</button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-[26px] bg-casarei-surface shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        {guests.length ? guests.map((guest) => <GuestRow key={guest.id} guest={guest} highlighted={guest.id === recentlyAddedId} onOpen={onOpen} />) : <p className="p-5 text-sm text-casarei-text-secondary">Nenhum convidado encontrado com esse filtro.</p>}
      </div>
    </section>
  );
}

function GuestRow({ guest, highlighted, onOpen }: { guest: Guest; highlighted?: boolean; onOpen: (guest: Guest) => void }) {
  return (
    <button type="button" onClick={() => onOpen(guest)} className={highlighted ? "flex w-full items-center gap-3 border-b border-casarei-border-soft bg-casarei-green-soft p-4 text-left last:border-b-0" : "flex w-full items-center gap-3 border-b border-casarei-border-soft p-4 text-left last:border-b-0"}>
      <Avatar name={guest.firstName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-casarei-text-primary">{getGuestName(guest)}</p>
        <p className="mt-1 text-xs text-casarei-text-secondary">{guest.group} • {guest.companions.confirmedCount + 1} adulto{guest.children.count ? ` • ${guest.children.count} criança` : ""}</p>
        {guest.food.buffetNotes ? <p className="mt-1 text-xs font-semibold text-[#B96F52]">{guest.food.buffetNotes}</p> : null}
      </div>
      <span className={guest.phone ? "rounded-full bg-casarei-green-soft px-2 py-1 text-[10px] font-bold text-[#5F7752]" : "rounded-full bg-[#FBEEE8] px-2 py-1 text-[10px] font-bold text-[#B96F52]"}>
        {guest.phone ? "WhatsApp" : "Sem WhatsApp"}
      </span>
    </button>
  );
}

function GuestGroups({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="space-y-3">
      {groupCards.map((group) => <GroupCard key={group.name} group={group} />)}
      <Button type="button" onClick={onCreate} variant="outline" className="h-12 w-full border-[#F3C7D2] text-casarei-pink">
        <Plus className="h-4 w-4" />
        Criar novo grupo
      </Button>
    </section>
  );
}

function GroupCard({ group }: { group: (typeof groupCards)[number] }) {
  return (
    <Link href={`/app/convidados/grupos/${slugifyGroup(group.name)}`} className="group block w-full rounded-[24px] bg-casarei-surface p-4 text-left shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(75,46,43,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casarei-pink">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${groupTone(group.tone)}`}>
          <UsersRound className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-casarei-text-primary">{group.name}</p>
          <p className="mt-1 text-xs text-casarei-text-secondary">{group.count} convidados • {group.pending} pendentes</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-casarei-app">
            <div className="h-full rounded-full bg-casarei-green" style={{ width: `${group.confirmed}%` }} />
          </div>
        </div>
        <p className="text-xs font-bold text-[#5F7752]">{group.confirmed}%</p>
        <ChevronRight className="h-4 w-4 text-casarei-text-secondary transition group-hover:translate-x-0.5 group-hover:text-casarei-pink" />
      </div>
    </Link>
  );
}

function GuestDataReview({ guests, onOpen, onList }: { guests: Guest[]; onOpen: (guest: Guest) => void; onList: () => void }) {
  const withoutWhatsapp = guests.filter((guest) => !guest.phone);
  const withoutGroup = guests.filter((guest) => !guest.group);
  const withoutFullName = guests.filter((guest) => !guest.lastName);
  const companionsWithoutNames = guests.filter((guest) => guest.companions.allowedCount > 0 && !guest.companions.names.length);
  const foodNeedsDetail = guests.filter((guest) => (guest.food.vegetarian || guest.food.vegan || guest.food.intolerance || guest.food.allergies) && !guest.food.buffetNotes);

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Revisar dados</p>
        <h2 className="mt-1 font-serif text-3xl text-casarei-text-primary">Deixe a base pronta</h2>
        <p className="mt-2 text-sm leading-6 text-casarei-text-secondary">
          Antes de usar Presença & Mesas, revise contatos, grupos, acompanhantes e cuidados do buffet.
        </p>
        <Button type="button" onClick={onList} className="mt-4 h-11 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
          Ver lista completa
        </Button>
      </div>

      <ReviewBlock title="Sem WhatsApp" guests={withoutWhatsapp} onOpen={onOpen} empty="Todos têm WhatsApp cadastrado." />
      <ReviewBlock title="Sem grupo" guests={withoutGroup} onOpen={onOpen} empty="Todos estão em um grupo." />
      <ReviewBlock title="Sem sobrenome" guests={withoutFullName} onOpen={onOpen} empty="Todos parecem ter nome completo." />
      <ReviewBlock title="Acompanhantes sem nome" guests={companionsWithoutNames} onOpen={onOpen} empty="Acompanhantes preenchidos." />
      <ReviewBlock title="Cuidados do buffet sem detalhe" guests={foodNeedsDetail} onOpen={onOpen} empty="Cuidados alimentares estão claros." />
    </section>
  );
}

function ReviewBlock({ title, guests, empty, onOpen }: { title: string; guests: Guest[]; empty: string; onOpen: (guest: Guest) => void }) {
  return (
    <section className="rounded-[24px] bg-casarei-surface p-4 shadow-[0_12px_34px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-casarei-text-primary">{title}</h3>
        <span className={guests.length ? "rounded-full bg-[#FBEEE8] px-3 py-1 text-xs font-bold text-[#B96F52]" : "rounded-full bg-casarei-green-soft px-3 py-1 text-xs font-bold text-[#5F7752]"}>
          {guests.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {guests.length ? guests.slice(0, 4).map((guest) => (
          <button key={guest.id} type="button" onClick={() => onOpen(guest)} className="flex w-full items-center justify-between gap-3 rounded-2xl bg-casarei-app p-3 text-left">
            <span>
              <span className="block text-sm font-bold text-casarei-text-primary">{getGuestName(guest)}</span>
              <span className="mt-1 block text-xs text-casarei-text-secondary">{guest.group || "Sem grupo"} · {guest.relation}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-casarei-text-secondary" />
          </button>
        )) : <p className="rounded-2xl bg-casarei-app p-3 text-sm text-casarei-text-secondary">{empty}</p>}
      </div>
    </section>
  );
}

function TablesIntro() {
  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-casarei-surface p-5 text-center shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-casarei-pink-soft text-casarei-pink">
          <UsersRound className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-serif text-3xl text-casarei-text-primary">Organização das mesas</h2>
        <p className="mt-3 text-sm leading-7 text-casarei-text-secondary">
          A visualização completa das mesas fica em uma página própria para manter esta tela leve.
        </p>
        <Button asChild className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
          <Link href="/app/presenca-mesas">Abrir Presença & Mesas</Link>
        </Button>
      </div>
    </section>
  );
}

function RsvpPreview({
  guests,
  settings,
  onCustomize,
  onOpenGuest,
  onSynced
}: {
  guests: Guest[];
  settings: StoredRsvpSettings;
  onCustomize: () => void;
  onOpenGuest: (guest: Guest) => void;
  onSynced: () => void;
}) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [restriction, setRestriction] = useState("Vegetariana");
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const visibleGuests = guests.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="rounded-[30px] bg-casarei-surface p-5 text-center shadow-[0_18px_55px_rgba(75,46,43,0.07)] ring-1 ring-casarei-border-soft">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-casarei-pink-soft font-serif text-2xl text-casarei-pink">{settings.initials}</div>
        <h2 className="mt-5 font-serif text-3xl text-casarei-text-primary">{settings.greeting}</h2>
        <p className="mt-2 text-sm leading-7 text-casarei-text-secondary">{settings.message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button type="button" onClick={() => setAnswer("yes")} className={answer === "yes" ? "h-16 bg-casarei-pink hover:bg-casarei-pink-hover" : "h-16 bg-casarei-pink/80 hover:bg-casarei-pink-hover"}>Sim, vou!</Button>
          <Button type="button" onClick={() => setAnswer("no")} variant="outline" className={answer === "no" ? "h-16 border-casarei-pink bg-casarei-pink-soft text-casarei-pink" : "h-16 border-[#F3C7D2] text-casarei-pink"}>Nao poderei ir</Button>
        </div>
        {settings.allowCompanions ? <Counter label="Adultos" value={adults} onMinus={() => setAdults(Math.max(1, adults - 1))} onPlus={() => setAdults(adults + 1)} /> : null}
        {settings.allowChildren ? <Counter label="Crianças" value={children} onMinus={() => setChildren(Math.max(0, children - 1))} onPlus={() => setChildren(children + 1)} /> : null}
        {settings.askFood ? (
          <label className="mt-4 block rounded-2xl bg-casarei-app p-4 text-left">
            <span className="text-xs font-bold text-casarei-text-primary">Restrição alimentar</span>
            <select value={restriction} onChange={(event) => setRestriction(event.target.value)} className="mt-2 h-10 w-full bg-transparent text-sm text-casarei-text-primary outline-none">
              <option>Vegetariana</option>
              <option>Lactose</option>
              <option>Frutos do mar</option>
              <option>Nenhuma</option>
            </select>
          </label>
        ) : null}
        <textarea placeholder="Conte pra gente algo importante..." className="mt-4 min-h-[92px] w-full resize-none rounded-2xl bg-casarei-app p-4 text-sm text-casarei-text-primary outline-none" />
        <Button type="button" onClick={() => answer && setSubmitted(true)} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">{settings.buttonText}</Button>
        {submitted ? <p className="mt-3 rounded-2xl bg-casarei-green-soft px-4 py-3 text-xs font-bold text-[#5F7752]">Previa enviada. A confirmação de presença real fica salva quando o convidado usa o link individual.</p> : null}
      </div>

      <section className="rounded-[26px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-casarei-text-primary">Personalização da confirmação de presença</h2>
            <p className="mt-1 text-xs leading-5 text-casarei-text-secondary">Ajuste texto, campos e convite antes de enviar.</p>
          </div>
          <Button type="button" onClick={onCustomize} variant="outline" className="border-[#F3C7D2] text-casarei-pink">Personalizar</Button>
        </div>
      </section>

      <section className="rounded-[26px] bg-casarei-surface p-5 shadow-[0_14px_40px_rgba(75,46,43,0.06)] ring-1 ring-casarei-border-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-casarei-text-primary">Links dos convidados</h2>
          <button
            type="button"
            onClick={() => {
              onSynced();
              window.location.reload();
            }}
            className="text-xs font-bold text-casarei-pink"
          >
            Sincronizar
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {visibleGuests.map((guest) => (
            <button key={guest.id} type="button" onClick={() => onOpenGuest(guest)} className="flex w-full items-center justify-between gap-3 rounded-2xl bg-casarei-app px-4 py-3 text-left">
              <span>
                <span className="block text-sm font-bold text-casarei-text-primary">{getGuestName(guest)}</span>
                <span className="mt-1 block text-xs text-casarei-text-secondary">/rsvp/{guest.rsvp.token}</span>
              </span>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${rsvpTone(guest.rsvp.status)}`}>{rsvpLabel(guest.rsvp.status)}</span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function Counter({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl bg-casarei-app p-4">
      <button type="button" onClick={onMinus} className="grid h-8 w-8 place-items-center rounded-full bg-casarei-surface text-casarei-pink">-</button>
      <p className="text-sm font-bold text-casarei-text-primary">{value} {label}</p>
      <button type="button" onClick={onPlus} className="grid h-8 w-8 place-items-center rounded-full bg-casarei-surface text-casarei-pink">+</button>
    </div>
  );
}

function RsvpSettingsSheet({
  settings,
  onClose,
  onSave
}: {
  settings: StoredRsvpSettings;
  onClose: () => void;
  onSave: (settings: StoredRsvpSettings) => void;
}) {
  const [form, setForm] = useState(settings);

  function update<K extends keyof StoredRsvpSettings>(key: K, value: StoredRsvpSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function uploadConfirmationImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("coverImageUrl", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-casarei-pink">Confirmação de presença</p>
            <h2 className="font-serif text-3xl text-casarei-text-primary">Editar página da confirmação</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <RsvpTextField label="Iniciais do casal" value={form.initials} onChange={(value) => update("initials", value)} />
          <RsvpTextField label="Saudacao" value={form.greeting} onChange={(value) => update("greeting", value)} />
          <div className="rounded-2xl bg-casarei-app p-4">
            <span className="text-xs font-bold text-casarei-text-secondary">Foto da página de confirmação</span>
            <div className="mt-3 h-36 rounded-2xl bg-cover bg-center ring-1 ring-casarei-border-soft" style={{ backgroundImage: `url(${form.coverImageUrl})` }} />
            <label className="mt-3 flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-[#F3C7D2] bg-casarei-surface text-sm font-bold text-casarei-pink">
              Enviar foto
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadConfirmationImage(event.target.files?.[0])} />
            </label>
            <RsvpTextField label="Ou cole um link de imagem" value={form.coverImageUrl} onChange={(value) => update("coverImageUrl", value)} />
          </div>
          <label className="block rounded-2xl bg-casarei-app p-4">
            <span className="text-xs font-bold text-casarei-text-secondary">Mensagem do convite</span>
            <textarea
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none bg-transparent text-sm font-semibold text-casarei-text-primary outline-none"
            />
          </label>
          <RsvpTextField label="Texto do botao" value={form.buttonText} onChange={(value) => update("buttonText", value)} />
        </div>

        <div className="mt-5 rounded-2xl bg-casarei-app p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-text-secondary">Campos que o convidado responde</p>
          <RsvpToggle label="Permitir acompanhantes" checked={form.allowCompanions} onChange={(value) => update("allowCompanions", value)} />
          <RsvpToggle label="Perguntar criancas" checked={form.allowChildren} onChange={(value) => update("allowChildren", value)} />
          <RsvpToggle label="Perguntar restricao alimentar" checked={form.askFood} onChange={(value) => update("askFood", value)} />
        </div>

        <div className="mt-5 rounded-2xl bg-casarei-pink-soft p-4 text-sm leading-6 text-casarei-text-primary">
          Cada convidado recebe um link unico. Quando ele responde, o status, acompanhantes, criancas e restricoes aparecem na lista ao sincronizar.
        </div>

        <Button type="button" onClick={() => onSave(form)} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">
          Salvar personalizacao
        </Button>
      </section>
    </div>
  );
}

function RsvpTextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-2xl bg-casarei-app p-4">
      <span className="text-xs font-bold text-casarei-text-secondary">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
    </label>
  );
}

function RsvpToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-casarei-text-primary">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-casarei-pink" />
    </label>
  );
}

function GuestDetails({
  guest,
  onClose,
  onRemove,
  onEdit,
  onMessage
}: {
  guest: Guest;
  onClose: () => void;
  onRemove: (id: string) => void;
  onEdit: () => void;
  onMessage: (message: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => onRemove(guest.id)} className="text-xs font-bold text-casarei-pink">Remover</button>
        </div>
        <div className="mt-2 text-center">
          <Avatar name={guest.firstName} large />
          <h2 className="mt-3 font-serif text-3xl text-casarei-text-primary">{getGuestName(guest)}</h2>
          <span className="mt-2 inline-flex rounded-full bg-casarei-pink-soft px-3 py-1 text-xs font-bold text-casarei-pink">{guest.group || "Sem grupo"}</span>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3 text-center text-xs text-casarei-text-secondary">
          <DetailAction icon={<MessageCircle />} label="WhatsApp" tone="whatsapp" onClick={() => guest.phone ? window.open(`https://wa.me/55${guest.phone.replace(/\D/g, "")}`, "_blank") : onMessage("Este convidado ainda nao tem WhatsApp cadastrado.")} />
          <DetailAction icon={<Mail />} label="Email" onClick={() => guest.email ? window.open(`mailto:${guest.email}`, "_blank") : onMessage("Este convidado ainda nao tem email cadastrado.")} />
          <DetailAction icon={<Send />} label="Lembrete" onClick={() => onMessage(`Lembrete preparado para ${getGuestName(guest)}.`)} />
          <DetailAction icon={<Plus />} label="Editar" onClick={onEdit} />
        </div>
        <div className="mt-6 space-y-3 rounded-2xl bg-casarei-app p-4 text-sm">
          <InfoLine label="Grupo" value={guest.group} />
          <InfoLine label="Parentesco" value={guest.relation} />
          <InfoLine label="Acompanhantes" value={`${guest.companions.confirmedCount} confirmado(s)`} />
          <InfoLine label="Restrição alimentar" value={guest.food.buffetNotes || "Nenhuma"} />
          <InfoLine label="Mesa" value={guest.table.name || "Sem mesa"} />
        </div>
      </section>
    </div>
  );
}

function AddGuestSheet({ onClose, onSave }: { onClose: () => void; onSave: (data: GuestFormData) => void }) {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState(defaultGuestGroups);
  const [group, setGroup] = useState(defaultGuestGroups[1] ?? "Família da noiva");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [relation, setRelation] = useState("Convidado");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companions, setCompanions] = useState("0");
  const [food, setFood] = useState("");
  const [notes, setNotes] = useState("");

  function addGroup() {
    const cleanName = newGroup.trim();
    if (!cleanName) return;
    setGroups((current) => (current.some((item) => item.toLowerCase() === cleanName.toLowerCase()) ? current : [...current, cleanName]));
    setGroup(cleanName);
    setNewGroup("");
    setShowNewGroup(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-casarei-text-primary">Adicionar convidado</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 space-y-3">
          <SheetInput label="Nome do convidado" value={name} onChange={setName} />
          <label className="block rounded-2xl bg-casarei-app p-4">
            <span className="text-xs font-bold text-casarei-text-secondary">Grupo</span>
            <div className="mt-2 flex gap-2">
              <select value={group} onChange={(event) => setGroup(event.target.value)} className="h-11 min-w-0 flex-1 rounded-xl border border-casarei-border-soft bg-casarei-surface px-3 text-sm font-semibold text-casarei-text-primary outline-none">
                {groups.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button type="button" onClick={() => setShowNewGroup((value) => !value)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-casarei-pink text-white" aria-label="Adicionar grupo">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {showNewGroup ? (
              <div className="mt-3 grid gap-2 rounded-2xl bg-casarei-surface p-3">
                <input value={newGroup} onChange={(event) => setNewGroup(event.target.value)} placeholder="Nome do novo grupo" className="h-10 rounded-xl border border-casarei-border-soft bg-white px-3 text-sm font-semibold text-casarei-text-primary outline-none" />
                <Button type="button" onClick={addGroup} className="h-10 bg-casarei-pink hover:bg-casarei-pink-hover">Adicionar grupo</Button>
              </div>
            ) : null}
          </label>
          <SheetInput label="Parentesco / relacao" value={relation} onChange={setRelation} />
          <SheetInput label="WhatsApp" value={phone} onChange={setPhone} />
          <SheetInput label="Email" value={email} onChange={setEmail} />
          <SheetInput label="Numero de acompanhantes" value={companions} onChange={setCompanions} />
          <SheetInput label="Restricao alimentar" value={food} onChange={setFood} />
          <label className="block rounded-2xl bg-casarei-app p-4">
            <span className="text-xs font-bold text-casarei-text-secondary">Outras informacoes importantes</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-2 w-full resize-none bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
          </label>
        </div>
        <Button type="button" onClick={() => name.trim() && onSave({ name, group, relation, phone, email, companions: Math.max(0, Number.parseInt(companions, 10) || 0), food, notes })} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Salvar convidado</Button>
      </section>
    </div>
  );
}

function EditGuestSheet({ guest, onClose, onSave }: { guest: Guest; onClose: () => void; onSave: (guest: Guest) => void }) {
  const [firstName, setFirstName] = useState(guest.firstName);
  const [lastName, setLastName] = useState(guest.lastName);
  const [phone, setPhone] = useState(guest.phone);
  const [group, setGroup] = useState(guest.group);
  const [food, setFood] = useState(guest.food.buffetNotes);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-casarei-text-primary">Editar convidado</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 space-y-3">
          <SheetInput label="Nome" value={firstName} onChange={setFirstName} />
          <SheetInput label="Sobrenome" value={lastName} onChange={setLastName} />
          <SheetInput label="WhatsApp" value={phone} onChange={setPhone} />
          <SheetInput label="Grupo" value={group} onChange={setGroup} />
          <SheetInput label="Restricao alimentar" value={food} onChange={setFood} />
        </div>
        <Button
          type="button"
          onClick={() => onSave({ ...guest, firstName, lastName, phone, group, food: { ...guest.food, buffetNotes: food } })}
          className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover"
        >
          Salvar alteracoes
        </Button>
      </section>
    </div>
  );
}

function ImportGuestSheet({ onClose, onImport }: { onClose: () => void; onImport: (text: string) => void }) {
  const [text, setText] = useState("Maria Souza, Familia da noiva, 11999990000\nCarlos Lima, Amigos, 11988880000");
  const count = text.split(/\n/).filter((line) => line.trim()).length;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Lista</p>
            <h2 className="font-serif text-3xl text-casarei-text-primary">Importar convidados</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-3 text-sm leading-6 text-casarei-text-secondary">Cole uma lista simples, uma pessoa por linha. Use: nome, grupo, WhatsApp, email.</p>
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={8} className="mt-4 w-full resize-none rounded-2xl bg-casarei-app p-4 text-sm font-semibold text-casarei-text-primary outline-none" />
        <Button type="button" onClick={() => onImport(text)} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Importar {count} convidados</Button>
      </section>
    </div>
  );
}

function GroupDetailsSheet({ group, onClose, onAdd }: { group: (typeof groupCards)[number]; onClose: () => void; onAdd: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-casarei-text-primary">{group.name}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <TableMetricMini value={String(group.count)} label="convidados" />
          <TableMetricMini value={`${group.confirmed}%`} label="confirmados" />
          <TableMetricMini value={String(group.pending)} label="pendentes" tone="attention" />
        </div>
        <p className="mt-5 rounded-2xl bg-casarei-pink-soft p-4 text-sm leading-6 text-casarei-text-primary">
          Sofia sugere enviar um lembrete carinhoso para quem ainda nao respondeu antes de fechar buffet e mesas.
        </p>
        <Button type="button" onClick={onAdd} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Adicionar convidado ao grupo</Button>
      </section>
    </div>
  );
}

function CreateGroupSheet({ onClose, onSave }: { onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-casarei-text-primary">Criar grupo</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <SheetInput label="Nome do grupo" value={name} onChange={setName} />
        <Button type="button" onClick={() => name.trim() && onSave(name.trim())} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Salvar grupo</Button>
      </section>
    </div>
  );
}

function NoticeSheet({ title, description, onClose }: { title: string; description: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/25 p-0 lg:place-items-center lg:p-6">
      <section className="w-full max-w-[430px] rounded-t-[32px] bg-casarei-surface p-5 shadow-[0_24px_90px_rgba(75,46,43,0.24)] ring-1 ring-casarei-border-soft lg:rounded-[32px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-casarei-pink">Sofia</p>
            <h2 className="mt-1 font-serif text-3xl text-casarei-text-primary">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-casarei-app" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-4 text-sm leading-7 text-casarei-text-secondary">{description}</p>
        <Button type="button" onClick={onClose} className="mt-5 h-12 w-full bg-casarei-pink hover:bg-casarei-pink-hover">Entendi</Button>
      </section>
    </div>
  );
}

function SheetInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block rounded-2xl bg-casarei-app p-4">
      <span className="text-xs font-bold text-casarei-text-secondary">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-casarei-text-primary outline-none" />
    </label>
  );
}

function TableMetricMini({ value, label, tone }: { value: string; label: string; tone?: "attention" }) {
  return (
    <article className={tone === "attention" ? "rounded-2xl bg-[#FBEEE8] p-3 text-center" : "rounded-2xl bg-casarei-app p-3 text-center"}>
      <p className="font-serif text-2xl text-casarei-text-primary">{value}</p>
      <p className="mt-1 text-[11px] leading-4 text-casarei-text-secondary">{label}</p>
    </article>
  );
}

function MobileGuestNav({ active, onChange, onAdd }: { active: GuestTab; onChange: (tab: GuestTab) => void; onAdd: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-end border-t border-casarei-border-soft bg-casarei-surface px-5 pb-3 pt-2 text-[10px] font-semibold text-casarei-text-secondary shadow-[0_-12px_40px_rgba(75,46,43,0.08)] lg:hidden">
      <BottomItem icon={<Home />} label="Início" active={active === "Resumo"} onClick={() => onChange("Resumo")} />
      <BottomItem icon={<CalendarIcon />} label="Lista" active={active === "Lista"} onClick={() => onChange("Lista")} />
      <button type="button" onClick={onAdd} className="mx-auto grid h-12 w-12 -translate-y-3 place-items-center rounded-full bg-casarei-pink text-white shadow-[0_10px_30px_rgba(217,108,138,0.35)]" aria-label="Adicionar convidado"><Plus className="h-6 w-6" /></button>
      <BottomItem icon={<UsersRound />} label="Grupos" active={active === "Grupos"} onClick={() => onChange("Grupos")} />
      <BottomItem icon={<Clock3 />} label="Revisar" active={active === "Revisar dados"} onClick={() => onChange("Revisar dados")} />
    </nav>
  );
}

function BottomItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={active ? "grid justify-items-center gap-1 text-casarei-pink [&>svg]:h-4 [&>svg]:w-4" : "grid justify-items-center gap-1 [&>svg]:h-4 [&>svg]:w-4"}>{icon}<span>{label}</span></button>;
}

function CalendarIcon() {
  return <UsersRound className="h-4 w-4" />;
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return <span className={`${large ? "mx-auto h-20 w-20 text-2xl" : "h-11 w-11 text-sm"} grid shrink-0 place-items-center rounded-full bg-casarei-pink-soft font-serif font-bold text-casarei-pink`}>{name.slice(0, 1)}</span>;
}

function DetailAction({ icon, label, tone, onClick }: { icon: React.ReactNode; label: string; tone?: "whatsapp"; onClick: () => void }) {
  return <button type="button" onClick={onClick}><span className={`${tone === "whatsapp" ? "text-[#25D366]" : "text-casarei-text-secondary"} mx-auto grid h-11 w-11 place-items-center rounded-full bg-casarei-app [&>svg]:h-4 [&>svg]:w-4`}>{icon}</span><p className="mt-1">{label}</p></button>;
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><span className="text-casarei-text-secondary">{label}</span><strong className="text-right text-casarei-text-primary">{value}</strong></div>;
}

function rsvpLabel(status: GuestRsvpStatus) {
  if (status === "confirmed") return "Confirmado";
  if (status === "declined") return "Não vai";
  if (status === "viewed") return "Aguardando confirmação";
  return "Pendente";
}

function rsvpTone(status: GuestRsvpStatus) {
  if (status === "confirmed") return "bg-casarei-green-soft text-[#5F7752]";
  if (status === "declined") return "bg-casarei-pink-soft text-casarei-pink";
  if (status === "viewed") return "bg-[#EEF1F4] text-[#6E7F91]";
  return "bg-[#FBEEE8] text-[#B96F52]";
}

function groupTone(tone: GuestGroupTone | string) {
  if (tone === "green") return "bg-casarei-green-soft text-[#5F7752]";
  if (tone === "pink") return "bg-casarei-pink-soft text-casarei-pink";
  if (tone === "blue") return "bg-[#EEF1F4] text-[#6E7F91]";
  if (tone === "terracotta") return "bg-[#FBEEE8] text-[#B96F52]";
  if (tone === "purple") return "bg-[#F1EAF7] text-[#7C5F91]";
  return "bg-casarei-app text-casarei-text-secondary";
}
