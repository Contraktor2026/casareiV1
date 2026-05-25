"use client";

import { useState } from "react";
import { CheckCircle2, Heart, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockRsvpGuest } from "@/lib/mock/casarei";
import { cn } from "@/lib/utils";

export function RsvpConfirmationFlow() {
  const [attendance, setAttendance] = useState<"yes" | "no" | null>("yes");
  const [companion, setCompanion] = useState<"alone" | "plus-one">("alone");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="surface-lift soft-appear border-0 bg-white p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success-bg)] text-[var(--success)]">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="mt-5 font-serif text-4xl text-casarei-primary-deep">Presença recebida</h2>
        <p className="mt-3 text-sm leading-6 text-casarei-text">
          Obrigada por responder, {mockRsvpGuest.name || "convidado"}. O casal vai ficar feliz em saber que você passou por aqui com carinho.
        </p>
      </Card>
    );
  }

  return (
    <Card className="surface-lift border-0 bg-white p-5">
      <p className="font-serif text-3xl text-casarei-primary-deep">Olá, {mockRsvpGuest.name}!</p>
      <p className="mt-2 text-sm leading-6 text-casarei-text">
        Sua presença é parte da memória desse dia. Responda rapidinho para ajudarmos os noivos a cuidarem de cada detalhe.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-casarei-text">Você confirma sua presença?</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ChoiceButton active={attendance === "yes"} onClick={() => setAttendance("yes")}>
              <Heart className="h-4 w-4" aria-hidden />
              Sim, eu vou
            </ChoiceButton>
            <ChoiceButton active={attendance === "no"} onClick={() => setAttendance("no")}>
              Não poderei ir
            </ChoiceButton>
          </div>
        </div>

        {attendance === "yes" ? (
          <>
            {mockRsvpGuest.plusOnesAllowed > 0 ? (
            <div>
              <p className="text-sm font-medium text-casarei-text">Vai levar acompanhante?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ChoiceButton active={companion === "alone"} onClick={() => setCompanion("alone")}>
                  Só eu
                </ChoiceButton>
                <ChoiceButton active={companion === "plus-one"} onClick={() => setCompanion("plus-one")}>
                  Eu + 1
                </ChoiceButton>
              </div>
            </div>
            ) : null}
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-medium text-casarei-text">
                <Utensils className="h-4 w-4 text-casarei-primary" aria-hidden />
                Alguma restrição alimentar?
              </span>
              <input
                className="mt-2 h-12 w-full rounded-xl border border-casarei-border-soft px-3 text-sm outline-none transition focus:ring-2 focus:ring-casarei-primary"
                placeholder="Ex.: vegetariana, sem lactose"
              />
            </label>
          </>
        ) : null}

        <Button variant="whatsapp" size="lg" className="w-full" onClick={() => setSubmitted(true)}>
          Confirmar presença
        </Button>
      </div>
    </Card>
  );
}

function ChoiceButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition",
        active
          ? "border-casarei-primary bg-casarei-primary-bg text-casarei-primary-deep"
          : "border-casarei-border-soft bg-white text-casarei-text"
      )}
    >
      {children}
    </button>
  );
}
