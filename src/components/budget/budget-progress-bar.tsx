export function BudgetProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-[#f3e8e5]">
      <div className="h-full rounded-full bg-casarei-primary transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
