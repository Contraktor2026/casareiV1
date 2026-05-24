"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Guest } from "@/types/guests";

export function BuffetSummaryModal({ guests, open, onClose }: { guests: Guest[]; open: boolean; onClose: () => void }) {
  if (!open) return null;

  const confirmed = guests.filter((guest) => guest.rsvp.status === "confirmed");
  const companions = confirmed.reduce((total, guest) => total + guest.companions.confirmedCount, 0);
  const children = confirmed.reduce((total, guest) => total + guest.children.count, 0);
  const food = confirmed.filter((guest) => guest.food.buffetNotes);
  const adults = confirmed.length + companions;

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar resumo" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 rounded-t-[2rem] bg-[#fffdf9] p-5 shadow-2xl md:top-1/2 md:-translate-y-1/2 md:rounded-[2rem] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-casarei-primary">Resumo para buffet e cerimonial</p>
            <h2 className="mt-1 font-serif text-3xl font-medium text-casarei-primary-deep">Numeros para conversar com calma</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Summary label="Adultos" value={adults} />
          <Summary label="Criancas" value={children} />
          <Summary label="Acompanhantes" value={companions} />
          <Summary label="Total confirmado" value={adults + children} />
        </div>

        <div className="mt-5 rounded-3xl border border-casarei-border-soft bg-white/80 p-4">
          <h3 className="font-serif text-xl text-casarei-primary-deep">Cuidados alimentares</h3>
          <ul className="mt-3 space-y-2 text-sm text-casarei-text">
            {food.length ? (
              food.map((guest) => (
                <li key={guest.id} className="rounded-2xl bg-casarei-primary-bg/35 px-4 py-3">
                  <strong>{guest.firstName} {guest.lastName}:</strong> {guest.food.buffetNotes}
                </li>
              ))
            ) : (
              <li className="text-casarei-muted">Nenhuma restricao informada ate agora.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-casarei-primary-bg/45 p-4">
      <strong className="block font-serif text-3xl text-casarei-primary-deep">{value}</strong>
      <span className="text-xs text-casarei-muted">{label}</span>
    </div>
  );
}
