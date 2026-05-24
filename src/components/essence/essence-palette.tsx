import type { EssencePaletteColor } from "@/types/essence";

type EssencePaletteProps = {
  palette: EssencePaletteColor[];
  compact?: boolean;
};

export function EssencePalette({ palette, compact = false }: EssencePaletteProps) {
  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"}>
      {palette.map((color) => (
        <div
          key={color.name}
          className={
            compact
              ? "flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs text-casarei-text shadow-sm"
              : "rounded-2xl border border-white/80 bg-white/72 p-3 shadow-[0_12px_28px_rgba(114,36,62,0.06)]"
          }
        >
          <span
            className="block h-7 w-7 shrink-0 rounded-full border border-casarei-border-soft shadow-inner"
            style={{ backgroundColor: color.hex }}
          />
          <div>
            <p className="font-semibold text-casarei-primary-deep">{color.name}</p>
            {!compact ? <p className="mt-1 text-xs text-casarei-muted">{color.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
