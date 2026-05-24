import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EditableChipSectionProps = {
  title: string;
  subtitle: string;
  sofiaText?: string;
  items: string[];
  tone: "love" | "avoid";
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
};

export function EditableChipSection({ title, subtitle, sofiaText, items, tone, onAdd, onRemove }: EditableChipSectionProps) {
  const [value, setValue] = useState("");

  function submit() {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    onAdd(cleanValue);
    setValue("");
  }

  return (
    <Card
      className={
        tone === "love"
          ? "border-white/80 bg-[linear-gradient(135deg,#fffdf9,#fff1f5)] p-5 shadow-[0_14px_38px_rgba(114,36,62,0.07)]"
          : "border-white/80 bg-[linear-gradient(135deg,#fffdf9,#f7f1eb)] p-5 shadow-[0_14px_38px_rgba(114,36,62,0.07)]"
      }
    >
      <div>
        <h3 className="font-serif text-2xl text-casarei-primary-deep">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-casarei-muted">{subtitle}</p>
        {sofiaText ? <p className="mt-3 rounded-2xl bg-white/72 p-3 text-sm leading-6 text-casarei-text">{sofiaText}</p> : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-casarei-primary-light/35 bg-white/82 px-3 py-2 text-sm text-casarei-primary-deep shadow-sm"
          >
            {item}
            <button type="button" onClick={() => onRemove(item)} className="text-casarei-muted transition hover:text-casarei-primary">
              <X className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">Remover {item}</span>
            </button>
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder={tone === "love" ? "Adicionar algo que vocês amam" : "Adicionar algo para evitar"}
          className="h-11 rounded-2xl border border-casarei-border-soft bg-white/90 px-4 text-sm outline-none transition focus:border-casarei-primary"
        />
        <Button type="button" variant="outline" onClick={submit}>
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar
        </Button>
      </div>
    </Card>
  );
}
