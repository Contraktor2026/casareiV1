import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyTimelineStateProps = {
  type: "empty" | "no-results" | "all-done";
  onCreate: () => void;
  onClear?: () => void;
};

const copy = {
  empty: {
    title: "Vamos montar seu cronograma?",
    text: "A Sofia pode sugerir um planejamento inicial com base na data, estilo e tamanho do seu casamento.",
    action: "Criar meu cronograma"
  },
  "no-results": {
    title: "Nenhuma tarefa encontrada",
    text: "Tente buscar por outro termo ou limpar os filtros.",
    action: "Limpar filtros"
  },
  "all-done": {
    title: "Tudo calmo por aqui",
    text: "Você concluiu as tarefas desse período. Aproveite essa sensação.",
    action: "Adicionar outra tarefa"
  }
};

export function EmptyTimelineState({ type, onCreate, onClear }: EmptyTimelineStateProps) {
  const content = copy[type];

  return (
    <div className="rounded-[18px] border border-[#f2d6d9] bg-[#fffdf9] p-8 text-center shadow-[0_10px_30px_rgba(153,53,86,0.06)]">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fbeaf0] text-[#d4537e]">
        <Sparkles className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="mt-4 font-serif text-2xl text-[#3b1717]">{content.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b6a70]">{content.text}</p>
      <Button className="mt-5 bg-[#d4537e] text-white hover:bg-[#993556]" onClick={type === "no-results" ? onClear : onCreate}>
        {content.action}
      </Button>
    </div>
  );
}
