import type { SofiaQuickPrompt } from "@/types/sofia";

type SofiaQuickPromptsProps = {
  prompts: SofiaQuickPrompt[];
  onSelect: (prompt: SofiaQuickPrompt) => void;
};

export function SofiaQuickPrompts({ prompts, onSelect }: SofiaQuickPromptsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          onClick={() => onSelect(prompt)}
          className="shrink-0 rounded-full border border-casarei-primary-light/30 bg-white/82 px-4 py-2 text-sm font-semibold text-casarei-primary-deep shadow-sm transition hover:border-casarei-primary"
        >
          {prompt.label}
        </button>
      ))}
    </div>
  );
}
