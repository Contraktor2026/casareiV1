"use client";

import { useMemo, useState } from "react";
import { Plus, Search, UserRoundPlus, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockGuests } from "@/lib/mock/casarei";
import { cn } from "@/lib/utils";

const filters = [
  { label: "Todos", value: "all" },
  { label: "Confirmados", value: "confirmed" },
  { label: "Pendentes", value: "pending" },
  { label: "Recusados", value: "declined" }
];

const statusLabel = {
  confirmed: "Confirmou",
  pending: "Pendente",
  declined: "Não vai"
};

const statusVariant = {
  confirmed: "success",
  pending: "warning",
  declined: "danger"
} as const;

export function GuestDirectory() {
  const [guestList, setGuestList] = useState(mockGuests);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("Amigos do casal");

  const guests = useMemo(() => {
    return guestList.filter((guest) => {
      const matchesFilter = filter === "all" || guest.status === filter;
      const normalized = `${guest.name} ${guest.group}`.toLowerCase();
      return matchesFilter && normalized.includes(query.toLowerCase());
    });
  }, [filter, guestList, query]);

  const groupedGuests = useMemo(() => {
    return guests.reduce<Record<string, typeof mockGuests>>((acc, guest) => {
      acc[guest.group] = acc[guest.group] ?? [];
      acc[guest.group].push(guest);
      return acc;
    }, {});
  }, [guests]);

  function addGuest() {
    if (!newName.trim()) {
      setShowForm(true);
      return;
    }

    setGuestList((current) => [
      {
        name: newName.trim(),
        group: newGroup,
        status: "pending",
        plusOnesAllowed: 1,
        plusOnesConfirmed: 0,
        dietaryRestriction: "",
        phone: "11999990000"
      },
      ...current
    ]);
    setNewName("");
    setNewGroup("Amigos do casal");
    setShowForm(false);
    setFilter("all");
    setQuery("");
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" className="w-full bg-white" onClick={() => setShowForm((value) => !value)}>
        <Plus className="h-4 w-4" aria-hidden />
        Adicionar convidado
      </Button>

      {showForm ? (
        <Card className="surface-lift border-0 bg-white p-4">
          <div className="space-y-3">
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="h-12 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-casarei-primary"
              placeholder="Nome do convidado"
            />
            <select
              value={newGroup}
              onChange={(event) => setNewGroup(event.target.value)}
              className="h-12 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-casarei-primary"
            >
              <option>Família da noiva</option>
              <option>Família do noivo</option>
              <option>Amigos do casal</option>
              <option>Madrinhas</option>
              <option>Trabalho</option>
            </select>
            <Button className="w-full" onClick={addGuest}>
              Salvar convidado
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-casarei-muted" aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 w-full rounded-2xl border border-casarei-border-soft bg-white pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-casarei-primary"
          placeholder="Buscar por nome"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              filter === item.value
                ? "bg-casarei-primary text-white"
                : "border border-casarei-border-soft bg-white text-casarei-text"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {guests.length === 0 ? (
        <Card className="surface-lift border-0 bg-white p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
            <UserRoundPlus className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="mt-4 font-serif text-2xl text-casarei-primary-deep">Nenhum convidado aqui ainda</h2>
          <p className="mt-2 text-sm leading-6 text-casarei-muted">
            Quando a lista crescer, este espaço vai ajudar a cuidar de cada confirmação com delicadeza.
          </p>
          <Button className="mt-5" onClick={() => setShowForm(true)}>
            <UserRoundPlus className="h-4 w-4" aria-hidden />
            Adicionar convidado
          </Button>
        </Card>
      ) : (
        Object.entries(groupedGuests).map(([group, groupGuests]) => (
          <section key={group} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-casarei-muted">{group}</p>
            {groupGuests.map((guest) => (
              <Card key={guest.name} className="soft-appear border-0 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-casarei-primary-bg font-serif text-xl text-casarei-primary-deep">
                    {guest.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-casarei-text">{guest.name}</p>
                        <p className="mt-1 text-sm text-casarei-muted">
                          {guest.plusOnesAllowed > 0
                            ? `${guest.plusOnesConfirmed}/${guest.plusOnesAllowed} acompanhante confirmado`
                            : "Sem acompanhante"}
                        </p>
                      </div>
                      <Badge variant={statusVariant[guest.status as keyof typeof statusVariant]}>
                        {statusLabel[guest.status as keyof typeof statusLabel]}
                      </Badge>
                    </div>
                    {guest.dietaryRestriction ? (
                      <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-casarei-primary-bg px-3 py-1 text-xs text-casarei-primary-deep">
                        <Utensils className="h-3.5 w-3.5" aria-hidden />
                        {guest.dietaryRestriction}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
