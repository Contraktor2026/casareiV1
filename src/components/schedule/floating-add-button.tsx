import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type FloatingAddButtonProps = {
  onClick: () => void;
};

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <Button
      className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-[#d4537e] p-0 text-white shadow-[0_12px_30px_rgba(212,83,126,0.35)] hover:bg-[#993556] lg:hidden"
      onClick={onClick}
      aria-label="Adicionar tarefa"
    >
      <Plus className="h-7 w-7" aria-hidden />
    </Button>
  );
}
