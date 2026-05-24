"use client";

type RSVPGuestFormProps = {
  hasCompanion: boolean;
  onHasCompanionChange: (value: boolean) => void;
  companionName: string;
  onCompanionNameChange: (value: string) => void;
  childrenInfo: string;
  onChildrenInfoChange: (value: string) => void;
  food: string;
  onFoodChange: (value: string) => void;
  message: string;
  onMessageChange: (value: string) => void;
  allowCompanions?: boolean;
  allowChildren?: boolean;
  askFood?: boolean;
};

export function RSVPGuestForm(props: RSVPGuestFormProps) {
  return (
    <div className="mt-5 space-y-4 soft-appear">
      {props.allowCompanions !== false ? (
        <label className="flex items-center gap-3 rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 text-sm text-casarei-text">
          <input type="checkbox" checked={props.hasCompanion} onChange={(event) => props.onHasCompanionChange(event.target.checked)} className="accent-casarei-primary" />
          Vou levar acompanhante
        </label>
      ) : null}
      {props.hasCompanion && props.allowCompanions !== false ? (
        <Field label="Nome do acompanhante" value={props.companionName} onChange={props.onCompanionNameChange} placeholder="Ex: João Oliveira" />
      ) : null}
      {props.allowChildren !== false ? <Field label="Crianças" value={props.childrenInfo} onChange={props.onChildrenInfoChange} placeholder="Nome e idade, se houver" /> : null}
      {props.askFood !== false ? <Field label="Restrição alimentar" value={props.food} onChange={props.onFoodChange} placeholder="Ex: vegetariano, sem lactose, alergia" /> : null}
      <label className="block text-sm font-medium text-casarei-text">
        Mensagem para os noivos
        <textarea value={props.message} onChange={(event) => props.onMessageChange(event.target.value)} rows={3} placeholder="Deixe uma mensagem carinhosa, se quiser" className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
      </label>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-casarei-text">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-casarei-border-soft bg-white px-4 py-3 outline-none focus:border-casarei-primary" />
    </label>
  );
}
