import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

type SofiaPlanningSuggestionProps = {
  text: string;
  suggestions: string[];
};

export function SofiaPlanningSuggestion({ text, suggestions }: SofiaPlanningSuggestionProps) {
  return (
    <Card className="border-casarei-primary-light/45 bg-[linear-gradient(135deg,#fff2f6,#fffdf9)] p-6 shadow-[0_20px_54px_rgba(114,36,62,0.10)] ring-1 ring-white/80">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-casarei-primary shadow-[0_10px_24px_rgba(114,36,62,0.10)]">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Sugestao da Sofia</p>
          <p className="mt-2 font-serif text-2xl leading-tight text-casarei-primary-deep">{text}</p>
          <div className="mt-5 grid gap-2">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm leading-6 text-casarei-text">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
