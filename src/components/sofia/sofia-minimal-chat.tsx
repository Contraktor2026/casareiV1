"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { SofiaMessage, SofiaQuickPrompt } from "@/types/sofia";

import { SofiaMessageBubble } from "./sofia-message-bubble";

type SofiaMinimalChatProps = {
  initialMessages: SofiaMessage[];
  prompts: SofiaQuickPrompt[];
};

export function SofiaMinimalChat({ initialMessages, prompts }: SofiaMinimalChatProps) {
  const [messages, setMessages] = useState<SofiaMessage[]>(initialMessages.slice(0, 1));
  const [input, setInput] = useState("");
  const [showMorePrompts, setShowMorePrompts] = useState(false);

  const visiblePrompts = showMorePrompts ? prompts : prompts.slice(0, 3);

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
          "Mari, vamos transformar isso em um passo pequeno. Primeiro entendemos o impacto, depois decidimos se faz sentido para vocês."
      }
    ]);
    setInput("");
  }

  return (
    <section id="sofia-chat" className="rounded-[2rem] border border-white/90 bg-white/82 p-5 shadow-[0_18px_50px_rgba(114,36,62,0.08)] ring-1 ring-casarei-primary-light/12 md:p-7">
      <div>
        <p className="text-sm font-semibold text-casarei-primary">Conversa com a Sofia</p>
        <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">Pergunte sem carregar tudo sozinha</h2>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {visiblePrompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => ask(prompt.label, prompt.response)}
            className="rounded-full border border-casarei-primary-light/30 bg-white px-4 py-2 text-sm font-semibold text-casarei-primary-deep shadow-sm transition hover:border-casarei-primary"
          >
            {prompt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowMorePrompts((value) => !value)}
          className="rounded-full border border-casarei-border-soft bg-white/70 px-4 py-2 text-sm font-semibold text-casarei-muted transition hover:text-casarei-primary"
        >
          {showMorePrompts ? "Ver menos" : "Ver mais perguntas"}
        </button>
      </div>

      <div className="mt-5 space-y-3 rounded-[1.5rem] bg-[#fffaf7] p-4">
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
          className="h-12 rounded-2xl border border-casarei-border-soft bg-white px-4 text-sm text-casarei-text outline-none transition placeholder:text-casarei-muted/70 focus:border-casarei-primary"
        />
        <Button type="submit">
          <Send className="h-4 w-4" aria-hidden />
          Enviar
        </Button>
      </form>
    </section>
  );
}
