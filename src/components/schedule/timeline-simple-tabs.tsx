type SimpleTab = "Esta semana" | "Próximos passos" | "Concluídas";

type TimelineSimpleTabsProps = {
  active: SimpleTab;
  counts: Record<SimpleTab, number>;
  onChange: (tab: SimpleTab) => void;
};

export type { SimpleTab };

export function TimelineSimpleTabs({ active, counts, onChange }: TimelineSimpleTabsProps) {
  const tabs: SimpleTab[] = ["Esta semana", "Próximos passos", "Concluídas"];

  return (
    <div className="flex rounded-2xl border border-white/80 bg-white/72 p-1 shadow-[0_12px_30px_rgba(114,36,62,0.06)]">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={
            active === tab
              ? "flex-1 rounded-xl bg-casarei-primary px-3 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(212,83,126,0.20)]"
              : "flex-1 rounded-xl px-3 py-3 text-sm font-semibold text-casarei-muted transition hover:text-casarei-primary"
          }
        >
          <span>{tab}</span>
          <span className="ml-2 text-xs opacity-80">{counts[tab]}</span>
        </button>
      ))}
    </div>
  );
}
