"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RsvpTemplate, RsvpTemplateSettings } from "@/types/guests";
import { RSVPTemplatePreview } from "./rsvp-template-preview";
import { RSVPSettingsPanel } from "./rsvp-settings-panel";

type RSVPTemplateEditorProps = {
  template: RsvpTemplate | null;
  settings: RsvpTemplateSettings;
  onSettingsChange: (settings: RsvpTemplateSettings) => void;
  onClose: () => void;
};

export function RSVPTemplateEditor({ template, settings, onSettingsChange, onClose }: RSVPTemplateEditorProps) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 bg-casarei-primary-deep/30 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar editor" onClick={onClose} />
      <div className="absolute bottom-0 left-1/2 flex max-h-[92vh] w-full max-w-5xl -translate-x-1/2 flex-col rounded-t-[2rem] bg-[#fffdf9] shadow-2xl md:top-1/2 md:max-h-[88vh] md:-translate-y-1/2 md:rounded-[2rem]">
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-casarei-primary">Personalizar template</p>
              <h2 className="mt-1 font-serif text-3xl text-casarei-primary-deep">{template.name}</h2>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-5 w-5" aria-hidden />
            </Button>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[330px_1fr]">
            <RSVPTemplatePreview template={template} />
            <RSVPSettingsPanel settings={settings} onChange={onSettingsChange} />
          </div>
        </div>
        <div className="shrink-0 border-t border-casarei-border-soft bg-[#fffdf9] px-5 pb-6 pt-4 md:px-7">
          <div className="flex justify-end">
            <Button type="button" onClick={onClose}>Salvar personalizacao</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
