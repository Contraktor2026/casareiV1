"use client";

import { useState } from "react";

import { sofiaMockData } from "@/lib/mock/sofia";
import type { SofiaPreparedMessage } from "@/types/sofia";

import { SofiaFocusHero } from "./sofia-focus-hero";
import { SofiaGuidanceModal } from "./sofia-guidance-modal";
import { SofiaMinimalChat } from "./sofia-minimal-chat";
import { SofiaMoreGuidance } from "./sofia-more-guidance";
import { SofiaNowFocus } from "./sofia-now-focus";
import { SofiaQuickHelp } from "./sofia-quick-help";
import { SofiaReminderModal } from "./sofia-reminder-modal";

export function SofiaPage() {
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SofiaPreparedMessage | null>(null);
  const [toast, setToast] = useState("");

  async function copy(text: string) {
    await navigator.clipboard?.writeText(text);
    setToast("Mensagem copiada com carinho.");
  }

  function scrollToChat() {
    document.getElementById("sofia-chat")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const rsvpMessage = sofiaMockData.preparedMessages.find((message) => message.id === "msg-rsvp") ?? sofiaMockData.preparedMessages[0];

  return (
    <div className="space-y-8 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(251,234,240,0.42),transparent_34%),linear-gradient(180deg,#fffaf7,#fffdf9_46%,#fbf4ef)] p-0 md:p-1">
      <SofiaFocusHero onGuide={() => setIsGuidanceOpen(true)} onChat={scrollToChat} />

      {toast ? (
        <p className="rounded-2xl border border-casarei-primary-light/50 bg-white/85 px-4 py-3 text-sm font-semibold text-casarei-primary-deep">
          {toast}
        </p>
      ) : null}

      <SofiaNowFocus
        priorities={sofiaMockData.priorities}
        alert={sofiaMockData.alerts[0]}
        onMoreDetails={() => document.getElementById("sofia-more-guidance")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        onReminder={() => setSelectedMessage(rsvpMessage)}
      />

      <SofiaMinimalChat initialMessages={sofiaMockData.initialMessages} prompts={sofiaMockData.quickPrompts} />

      <SofiaQuickHelp />

      <div id="sofia-more-guidance">
        <SofiaMoreGuidance
          alerts={sofiaMockData.alerts}
          decisions={sofiaMockData.decisions}
          context={sofiaMockData.context}
          messages={sofiaMockData.preparedMessages}
          onPreparedMessage={setSelectedMessage}
        />
      </div>

      <SofiaGuidanceModal
        open={isGuidanceOpen}
        title={sofiaMockData.guidance.title}
        text={sofiaMockData.guidance.text}
        steps={sofiaMockData.guidance.steps}
        onClose={() => setIsGuidanceOpen(false)}
      />

      <SofiaReminderModal
        open={Boolean(selectedMessage)}
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onCopy={copy}
      />
    </div>
  );
}
