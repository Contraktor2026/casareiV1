import { CheckCircle2 } from "lucide-react";

import type { Guest } from "@/types/guests";

export function GuestTimeline({ guest }: { guest: Guest }) {
  return (
    <div className="space-y-3">
      {guest.history.map((event) => (
        <div key={`${event.label}-${event.date}`} className="flex gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-casarei-text">{event.label}</p>
            <p className="text-xs text-casarei-muted">{event.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
