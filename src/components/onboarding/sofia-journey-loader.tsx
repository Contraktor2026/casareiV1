import { Sparkles } from "lucide-react";
import { useEffect } from "react";

const items = ["cronograma sendo montado", "prioridades organizadas", "convidados considerados", "planejamento financeiro alinhado"];

type SofiaJourneyLoaderProps = {
  onFinish: () => void;
};

export function SofiaJourneyLoader({ onFinish }: SofiaJourneyLoaderProps) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 2600);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/90 bg-white/86 p-8 text-center shadow-[0_28px_80px_rgba(114,36,62,0.12)]">
      <div className="mx-auto grid h-16 w-16 animate-pulse place-items-center rounded-full bg-casarei-primary-bg text-casarei-primary">
        <Sparkles className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="mt-6 font-serif text-4xl text-casarei-primary-deep">
        Estou organizando o cronograma, prioridades e próximos passos do casamento de vocês.
      </h1>
      <div className="mt-8 grid gap-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl bg-casarei-primary-bg/55 px-4 py-3 text-sm font-semibold text-casarei-primary-deep"
            style={{ animationDelay: `${index * 180}ms` }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
