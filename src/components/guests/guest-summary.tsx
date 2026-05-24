import { Heart, Hourglass, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { mockGuests } from "@/lib/mock/casarei";

export function GuestSummary() {
  const confirmed = mockGuests.filter((guest) => guest.status === "confirmed").length;
  const pending = mockGuests.filter((guest) => guest.status === "pending").length;
  const declined = mockGuests.filter((guest) => guest.status === "declined").length;

  const items = [
    { label: "Confirmados", value: confirmed, icon: Heart, color: "text-[var(--success)]" },
    { label: "Pendentes", value: pending, icon: Hourglass, color: "text-[var(--warning)]" },
    { label: "Recusados", value: declined, icon: XCircle, color: "text-[var(--danger)]" }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="surface-lift border-0 bg-white p-3">
          <item.icon className={`h-4 w-4 ${item.color}`} aria-hidden />
          <p className="mt-2 font-serif text-3xl text-casarei-primary-deep">{item.value}</p>
          <p className="text-[11px] leading-4 text-casarei-muted">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
