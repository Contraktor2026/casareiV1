"use client";

import type { RsvpTemplateSettings } from "@/types/guests";

type RSVPSettingsPanelProps = {
  settings: RsvpTemplateSettings;
  onChange: (settings: RsvpTemplateSettings) => void;
};

const toggles: Array<[keyof RsvpTemplateSettings, string]> = [
  ["countdown", "Mostrar countdown"],
  ["music", "Musica futura"],
  ["map", "Mostrar mapa"],
  ["dressCode", "Dress code"],
  ["extraMessage", "Mensagem adicional"],
  ["limitCompanions", "Limitar acompanhantes"],
  ["allowChildren", "Permitir criancas"],
  ["requirePhone", "Exigir telefone"],
  ["requireCompanionName", "Exigir nome do acompanhante"],
  ["requireFoodRestriction", "Perguntar restricao alimentar"],
  ["ceremonyConfirmation", "Confirmar cerimônia"],
  ["partyConfirmation", "Confirmar festa"],
  ["dinnerConfirmation", "Confirmar jantar"],
  ["customFinalMessage", "Mensagem final personalizada"]
];

export function RSVPSettingsPanel({ settings, onChange }: RSVPSettingsPanelProps) {
  function update<K extends keyof RsvpTemplateSettings>(key: K, value: RsvpTemplateSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Cor principal" value={settings.primaryColor} onChange={(value) => update("primaryColor", value)} />
        <Field label="Cor de fundo" value={settings.backgroundColor} onChange={(value) => update("backgroundColor", value)} />
        <Field label="Fonte" value={settings.fontStyle} onChange={(value) => update("fontStyle", value)} />
        <Field label="Texto do botao" value={settings.buttonText} onChange={(value) => update("buttonText", value)} />
      </div>
      <label className="block text-sm font-medium text-casarei-text">
        Frase do hero
        <textarea value={settings.heroPhrase} onChange={(event) => update("heroPhrase", event.target.value)} rows={2} className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
      </label>
      <label className="block text-sm font-medium text-casarei-text">
        Mensagem para convidados
        <textarea value={settings.message} onChange={(event) => update("message", event.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
      </label>
      <div className="grid gap-2 md:grid-cols-2">
        {toggles.map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm text-casarei-text">
            <input type="checkbox" checked={Boolean(settings[key])} onChange={(event) => update(key, event.target.checked as never)} className="accent-casarei-primary" />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-medium text-casarei-text">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
    </label>
  );
}
