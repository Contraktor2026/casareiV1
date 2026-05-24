"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { defaultRsvpSettings, mockRsvpTemplates } from "@/lib/mock/rsvp-templates";
import type { RsvpTemplate, RsvpTemplateSettings } from "@/types/guests";
import { RSVPTemplateEditor } from "./rsvp-template-editor";
import { RSVPTemplatePreview } from "./rsvp-template-preview";

export function RSVPTemplateGallery() {
  const [selected, setSelected] = useState<RsvpTemplate | null>(null);
  const [settings, setSettings] = useState<RsvpTemplateSettings>(defaultRsvpSettings);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(114,36,62,0.08)] md:p-8">
        <p className="text-sm font-semibold text-casarei-primary">Confirmação de presença personalizada</p>
        <h1 className="mt-2 font-serif text-4xl font-medium text-casarei-primary-deep">Templates do convite</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-casarei-text">
          Escolha uma direção visual e ajuste cores, mensagem, foto e configurações da experiência do convidado.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockRsvpTemplates.map((template) => (
          <article key={template.id} className="space-y-4 rounded-[2rem] border border-casarei-border-soft bg-white/80 p-4 shadow-[0_16px_45px_rgba(114,36,62,0.06)]">
            <RSVPTemplatePreview template={template} />
            <div>
              <h2 className="font-serif text-2xl text-casarei-primary-deep">{template.name}</h2>
              <p className="mt-1 text-sm leading-6 text-casarei-muted">{template.description}</p>
            </div>
            <Button type="button" className="w-full" onClick={() => setSelected(template)}>
              Personalizar template
            </Button>
          </article>
        ))}
      </section>

      <RSVPTemplateEditor template={selected} settings={settings} onSettingsChange={setSettings} onClose={() => setSelected(null)} />
    </div>
  );
}
