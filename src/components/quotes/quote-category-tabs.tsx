"use client";

import type { QuoteCategory } from "@/types/quotes";
import { cn } from "@/lib/utils";

type QuoteCategoryTabsProps = {
  categories: QuoteCategory[];
  active: QuoteCategory;
  onChange: (category: QuoteCategory) => void;
  onAddCategory: () => void;
};

export function QuoteCategoryTabs({ categories, active, onChange, onAddCategory }: QuoteCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
            active === category
              ? "border-casarei-primary bg-casarei-primary text-white shadow-[0_12px_24px_rgba(212,83,126,0.22)]"
              : "border-casarei-border-soft bg-white/80 text-casarei-text hover:border-casarei-primary-light"
          )}
        >
          {category}
        </button>
      ))}
      <button
        type="button"
        onClick={onAddCategory}
        className="shrink-0 rounded-full border border-dashed border-casarei-primary-light bg-white/80 px-4 py-2 text-sm font-semibold text-casarei-primary transition hover:bg-casarei-primary-bg"
      >
        + Adicionar categoria
      </button>
    </div>
  );
}
