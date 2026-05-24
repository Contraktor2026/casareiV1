"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import type { SofiaAlert, SofiaDecision, SofiaPreparedMessage, SofiaWeddingContext } from "@/types/sofia";

import { SofiaActionButton } from "./sofia-action-button";
import { SofiaContextCard } from "./sofia-context-card";

type SofiaMoreGuidanceProps = {
  alerts: SofiaAlert[];
  decisions: SofiaDecision[];
  context: SofiaWeddingContext;
  messages: SofiaPreparedMessage[];
  onPreparedMessage: (message: SofiaPreparedMessage) => void;
};

export function SofiaMoreGuidance({ alerts, decisions, context, messages, onPreparedMessage }: SofiaMoreGuidanceProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-[2rem] border border-white/90 bg-white/76 p-5 shadow-[0_14px_38px_rgba(114,36,62,0.06)] md:p-6">
      <button type="button" className="flex w-full items-center justify-between gap-4 text-left" onClick={() => setOpen((value) => !value)}>
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Ver mais orientacoes</p>
          <h2 className="font-serif text-3xl text-casarei-primary-deep">Quando você quiser olhar com mais calma</h2>
        </div>
        <ChevronDown className={`h-5 w-5 text-casarei-primary transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open ? (
        <div className="mt-6 space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {decisions.map((decision) => (
              <Card key={decision.id} className="border-white/90 bg-white/88 p-5">
                <p className="font-serif text-2xl text-casarei-primary-deep">{humanizeDecision(decision.title)}</p>
                <p className="mt-2 text-sm leading-6 text-casarei-muted">{decision.impact}</p>
                <div className="mt-4">
                  <SofiaActionButton action={decision.action} />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {alerts.slice(1).map((alert) => (
              <Card key={alert.id} className="border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff7f3)] p-5">
                <p className="font-serif text-2xl text-casarei-primary-deep">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 text-casarei-text">{alert.text}</p>
                <div className="mt-4">
                  <SofiaActionButton action={alert.action} />
                </div>
              </Card>
            ))}
          </div>

          <Card className="border-white/90 bg-[linear-gradient(135deg,#fff2f6,#fffdf9)] p-5">
            <p className="text-sm font-semibold text-casarei-primary">Mensagens prontas</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {messages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => onPreparedMessage(message)}
                  className="rounded-2xl border border-white/90 bg-white/82 p-4 text-left transition hover:border-casarei-primary-light"
                >
                  <p className="font-serif text-xl text-casarei-primary-deep">{message.title}</p>
                  <p className="mt-1 text-xs leading-5 text-casarei-muted">{message.description}</p>
                </button>
              ))}
            </div>
          </Card>

          <SofiaContextCard context={context} />
        </div>
      ) : null}
    </section>
  );
}

function humanizeDecision(title: string) {
  if (title.toLowerCase().includes("decor")) return "A decoração merece atenção agora";
  if (title.toLowerCase().includes("briefing")) return "O briefing visual já pode guiar fornecedores";
  if (title.toLowerCase().includes("musica")) return "A musica ainda precisa de um caminho";
  return title;
}
