"use client";

import { Heart, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getStoredRsvpSettings, saveRsvpResponse, type StoredRsvpSettings } from "@/lib/client/guests-rsvp-store";
import type { Guest } from "@/types/guests";
import { RSVPFinalMessage } from "./rsvp-final-message";
import { RSVPGuestForm } from "./rsvp-guest-form";

export function RSVPConfirmationCard({ guest, settings: providedSettings }: { guest: Guest; settings?: StoredRsvpSettings }) {
  const settings = providedSettings ?? getStoredRsvpSettings();
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hasCompanion, setHasCompanion] = useState(false);
  const [companionName, setCompanionName] = useState("");
  const [childrenInfo, setChildrenInfo] = useState("");
  const [food, setFood] = useState("");
  const [message, setMessage] = useState("");

  if (submitted) {
    return <RSVPFinalMessage accepted={answer === "yes"} />;
  }

  function submit() {
    if (!answer) return;
    saveRsvpResponse({
      token: guest.rsvp.token,
      status: answer === "yes" ? "confirmed" : "declined",
      adults: 1 + (hasCompanion && companionName.trim() ? 1 : 0),
      children: childrenInfo.trim() ? childrenInfo.split(",").filter(Boolean).length || 1 : 0,
      companionNames: hasCompanion && companionName.trim() ? [companionName.trim()] : [],
      food,
      note: message,
      respondedAt: new Date().toISOString()
    });
    setSubmitted(true);
  }

  return (
    <section className="rounded-[2rem] border border-casarei-border-soft bg-white/94 p-5 text-center shadow-[0_22px_60px_rgba(114,36,62,0.12)] md:p-8">
      <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-casarei-primary-bg font-serif text-2xl text-casarei-primary">
        {settings.initials}
      </div>
      <p className="text-sm font-semibold text-casarei-primary">{settings.greeting.replace("Mari", guest.firstName)}</p>
      <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-casarei-primary-deep">
        Você confirma sua presença?
      </h2>
      <p className="mt-2 text-sm leading-6 text-casarei-text">
        {settings.message}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button type="button" onClick={() => setAnswer("yes")} variant={answer === "yes" ? "default" : "outline"} className={answer === "yes" ? "" : "bg-white"}>
          <Heart className="h-4 w-4" aria-hidden />
          Sim, eu vou
        </Button>
        <Button type="button" onClick={() => setAnswer("no")} variant={answer === "no" ? "default" : "outline"} className={answer === "no" ? "" : "bg-white"}>
          <XCircle className="h-4 w-4" aria-hidden />
          Não poderei ir
        </Button>
      </div>

      {answer === "yes" ? (
        <RSVPGuestForm
          hasCompanion={hasCompanion}
          onHasCompanionChange={setHasCompanion}
          companionName={companionName}
          onCompanionNameChange={setCompanionName}
          childrenInfo={childrenInfo}
          onChildrenInfoChange={setChildrenInfo}
          food={food}
          onFoodChange={setFood}
          message={message}
          onMessageChange={setMessage}
          allowCompanions={settings.allowCompanions}
          allowChildren={settings.allowChildren}
          askFood={settings.askFood}
        />
      ) : null}

      {answer === "no" ? (
        <label className="mt-5 block text-left text-sm font-medium text-casarei-text soft-appear">
          Quer deixar uma mensagem para os noivos?
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
        </label>
      ) : null}

      {answer ? (
        <Button type="button" className="mt-5 w-full" onClick={submit}>
          {answer === "yes" ? settings.buttonText : "Enviar resposta"}
        </Button>
      ) : null}
    </section>
  );
}
