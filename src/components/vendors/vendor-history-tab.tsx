import { CheckCircle2 } from "lucide-react";
import type { Vendor } from "@/types/vendors";

export function VendorHistoryTab({ vendor }: { vendor: Vendor }) {
  return (
    <section className="rounded-[2rem] border border-casarei-border-soft bg-white/90 p-5">
      <div className="space-y-4">
        {vendor.history.map((event) => (
          <div key={`${event.label}-${event.date}`} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-casarei-text">{event.label}</p>
              <p className="text-xs text-casarei-muted">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
