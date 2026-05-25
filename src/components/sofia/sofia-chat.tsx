"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { SofiaMessage, SofiaQuickPrompt } from "@/types/sofia";

import { SofiaMessageBubble } from "./sofia-message-bubble";
import { SofiaQuickPrompts } from "./sofia-quick-prompts";

type SofiaChatProps = {
  initialMessages: SofiaMessage[];
  prompts: SofiaQuickPrompt[];
};

export function SofiaChat({ initialMessages, prompts }: SofiaChatProps) {
  const [messages, setMessages] = useState<SofiaMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  function ask(text: string, response?: string) {
    const question = text.trim();
    if (!question) return;
    setMessages((current) => [
      ...current,
      { id: `bride-${Date.now()}`, role: "bride", text: question },
      {
        id: `sofia-${Date.now()}`,
        role: "sofia",
        text:
          response ??
          "Mari, eu olharia para isso com calma e dividiria em um próximo passo pequeno. Vamos por partes: primeiro entender o impacto, depois decidir se faz sentido para vocês."
      }
    ]);
    setInput("");
  }

  return (
    <section className="rounded-[2rem] border border-white/90 bg-[linear-gradient(135deg,#fffdf9,#fff2f6)] p-5 shadow-[0_22px_60px_rgba(114,36,62,0.10)] ring-1 ring-casarei-primary-light/15">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Conversa com a Sofia</p>
        <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Um espaco seguro para planejar</h2>
        <p className="mt-1 text-sm leading-6 text-casarei-muted">
          Pergunte como falaria com uma assessora.
        </p>
      </div>

      <div className="mt-5">
        <SofiaQuickPrompts prompts={prompts} onSelect={(prompt) => ask(prompt.label, prompt.response)} />
      </div>

      <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto rounded-[1.5rem] border border-white/80 bg-white/54 p-4">
        {messages.map((message) => (
          <SofiaMessageBubble key={message.id} message={message} />
        ))}
      </div>

      <form
        className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pergunte para a Sofia..."
          className="h-12 rounded-2xl border border-casarei-border-soft bg-white/90 px-4 text-sm text-casarei-text outline-none transition placeholder:text-casarei-muted/70 focus:border-casarei-primary"
        />
        <Button type="submit">
          <Send className="h-4 w-4" aria-hidden />
          Enviar
        </Button>
      </form>
    </section>
  );
}
