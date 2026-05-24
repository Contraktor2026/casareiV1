"use client";

import { Search } from "lucide-react";

import { guestGroups } from "@/lib/mock/guests";
import type { GuestRsvpStatus } from "@/types/guests";
import { cn } from "@/lib/utils";

const statuses: Array<"all" | GuestRsvpStatus> = ["all", "confirmed", "pending", "viewed", "declined"];
const statusLabels: Record<(typeof statuses)[number], string> = {
  all: "Todos",
  confirmed: "Confirmados",
  pending: "Pendentes",
  viewed: "Visualizaram",
  declined: "Recusados"
};

type GuestsFiltersProps = {
  query: string;
  status: "all" | GuestRsvpStatus;
  group: string;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: "all" | GuestRsvpStatus) => void;
  onGroupChange: (group: string) => void;
};

export function GuestsFilters({ query, status, group, onQueryChange, onStatusChange, onGroupChange }: GuestsFiltersProps) {
  return (
    <section className="space-y-3 rounded-3xl border border-casarei-border-soft bg-white/85 p-4 shadow-[0_18px_50px_rgba(114,36,62,0.06)]">
      <label className="flex items-center gap-2 rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm text-casarei-muted">
        <Search className="h-4 w-4" aria-hidden />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nome, grupo ou detalhe"
          className="w-full bg-transparent outline-none placeholder:text-casarei-muted"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onStatusChange(item)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
              status === item
                ? "border-casarei-primary bg-casarei-primary text-white"
                : "border-casarei-border-soft bg-white text-casarei-text hover:border-casarei-primary-light"
            )}
          >
            {statusLabels[item]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Todos os grupos", ...guestGroups].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onGroupChange(item === "Todos os grupos" ? "all" : item)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition",
              (group === "all" && item === "Todos os grupos") || group === item
                ? "border-casarei-primary-light bg-casarei-primary-bg text-casarei-primary-deep"
                : "border-casarei-border-soft bg-white/70 text-casarei-muted"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
