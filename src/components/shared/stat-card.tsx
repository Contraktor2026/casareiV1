import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  className?: string;
};

export function StatCard({ label, value, detail, className }: StatCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-casarei-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl font-medium text-casarei-primary-deep">{value}</p>
      {detail ? <p className="mt-1 text-sm text-casarei-text">{detail}</p> : null}
    </Card>
  );
}
