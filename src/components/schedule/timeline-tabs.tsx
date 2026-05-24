import { cn } from "@/lib/utils";

type TimelineTabsProps = {
  periods: readonly string[];
  activePeriod: string;
  counts: Record<string, number>;
  onChange: (period: string) => void;
};

export function TimelineTabs({ periods, activePeriod, counts, onChange }: TimelineTabsProps) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-[#f2d6d9] bg-[#fffdf9]">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            "flex min-h-11 items-center gap-2 border-r border-[#f2d6d9] px-4 text-sm last:border-r-0",
            activePeriod === period && "bg-[#fff1f4] font-bold text-[#d4537e]"
          )}
        >
          {period}
          <span className="rounded-full bg-[#f7d5dc] px-2 py-0.5 text-xs text-[#d4537e]">
            {counts[period] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
