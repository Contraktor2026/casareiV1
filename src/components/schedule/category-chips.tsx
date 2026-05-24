import { BriefcaseBusiness, CheckSquare, FileText, Music, Shirt, Sparkles, Users, WalletCards } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ScheduleCategory } from "@/types/schedule";

const categoryIcons = {
  Todas: CheckSquare,
  Cerimônia: Sparkles,
  Recepção: Users,
  Convidados: Users,
  Beleza: Shirt,
  Fornecedores: BriefcaseBusiness,
  Documentos: FileText,
  Orçamento: WalletCards,
  Cotações: FileText,
  Outros: CheckSquare
};

type CategoryChipsProps = {
  categories: Array<"Todas" | ScheduleCategory>;
  activeCategory: "Todas" | ScheduleCategory;
  onChange: (category: "Todas" | ScheduleCategory) => void;
};

export function CategoryChips({ categories, activeCategory, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {categories.map((category) => {
        const Icon = categoryIcons[category];
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "flex min-w-[78px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-[#f2d6d9] bg-[#fffdf9] px-4 py-3 text-xs text-[#2a1a1f] lg:min-w-[94px] lg:flex-row lg:text-sm",
              activeCategory === category && "border-[#d4537e] bg-[#fff1f4] font-semibold text-[#d4537e]"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            {category}
          </button>
        );
      })}
    </div>
  );
}
