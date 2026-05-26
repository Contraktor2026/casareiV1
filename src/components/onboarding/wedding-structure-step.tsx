import { CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { OnboardingActions } from "./onboarding-actions";
import { OnboardingStepShell } from "./onboarding-step-shell";

const weddingFormats = ["Mini wedding", "Tradicional", "Destination wedding", "Elopement", "Casamento intimista", "Festa grande"];
const ceremonyTypes = ["Religiosa", "Civil", "Ao ar livre", "Na praia", "No campo", "No mesmo local da festa"];
const partySizes = ["Intimista", "Média", "Grande", "Fim de semana completo"];
const vendorTypes = ["Espaço", "Buffet", "Fotografia", "Filmagem", "Decoração", "Cerimonial", "Música/DJ", "Beleza", "Vestido", "Convites", "Doces e bolo", "Bar e drinks", "Celebrante", "Transporte"];

type WeddingStructureStepProps = {
  weddingFormat: string;
  ceremonyType: string;
  partySize: string;
  vendorTypesSelected: string[];
  onChange: (field: "weddingFormat" | "ceremonyType" | "partySize", value: string) => void;
  onToggleVendor: (vendor: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function WeddingStructureStep({
  weddingFormat,
  ceremonyType,
  partySize,
  vendorTypesSelected,
  onChange,
  onToggleVendor,
  onNext,
  onBack
}: WeddingStructureStepProps) {
  const [customInput, setCustomInput] = useState("");

  function addCustomVendor() {
    const name = customInput.trim();
    if (!name) return;
    if (!vendorTypesSelected.includes(name)) onToggleVendor(name);
    setCustomInput("");
  }

  return (
    <OnboardingStepShell
      eyebrow="Estrutura do casamento"
      title="Que tipo de casamento o Casarei deve montar para vocês?"
      subtitle="Essas escolhas criam tarefas, categorias financeiras e fornecedores sugeridos logo no primeiro acesso."
    >
      <div className="rounded-[2rem] border border-white/90 bg-white/86 p-6 shadow-[0_24px_70px_rgba(114,36,62,0.10)]">
        <div className="grid gap-5">
          <OptionGroup title="Formato" options={weddingFormats} selected={weddingFormat} onPick={(value) => onChange("weddingFormat", value)} />
          <OptionGroup title="Cerimônia" options={ceremonyTypes} selected={ceremonyType} onPick={(value) => onChange("ceremonyType", value)} />
          <OptionGroup title="Tamanho da festa" options={partySizes} selected={partySize} onPick={(value) => onChange("partySize", value)} />

          <div>
            <p className="mb-3 text-sm font-bold text-casarei-primary-deep">Fornecedores que pretende contratar</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[...vendorTypes, ...vendorTypesSelected.filter((v) => !vendorTypes.includes(v))].map((vendor) => {
                const active = vendorTypesSelected.includes(vendor);
                return (
                  <button
                    key={vendor}
                    type="button"
                    onClick={() => onToggleVendor(vendor)}
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-left text-sm font-semibold transition",
                      active ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-border-soft bg-white text-casarei-text"
                    )}
                  >
                    <CheckCircle2 className={active ? "h-4 w-4 text-white" : "h-4 w-4 text-casarei-muted"} aria-hidden />
                    {vendor}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Outro fornecedor (ex: Sonorização)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomVendor(); } }}
                className="flex-1 rounded-2xl border border-casarei-border-soft bg-white px-4 py-2.5 text-sm text-casarei-text outline-none focus:border-casarei-primary"
              />
              <button
                type="button"
                onClick={addCustomVendor}
                disabled={!customInput.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-casarei-primary text-white disabled:opacity-40"
              >
                <Plus className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
        <OnboardingActions onBack={onBack} onNext={onNext} />
      </div>
    </OnboardingStepShell>
  );
}

function OptionGroup({ title, options, selected, onPick }: { title: string; options: string[]; selected: string; onPick: (value: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-casarei-primary-deep">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              selected === option ? "border-casarei-primary bg-casarei-primary text-white" : "border-casarei-border-soft bg-white text-casarei-text"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
