"use client";

import type { Vendor } from "@/types/vendors";
import { VendorCard } from "./vendor-card";

type VendorListProps = {
  vendors: Vendor[];
  emptyTitle: string;
  emptyDescription: string;
};

export function VendorList({ vendors, emptyTitle, emptyDescription }: VendorListProps) {
  if (!vendors.length) {
    return (
      <section className="rounded-[28px] bg-[#FFFDFC] p-8 text-center shadow-[0_22px_70px_rgba(75,46,43,0.08)]">
        <p className="font-serif text-3xl text-[#4B2E2B]">{emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8A716D]">{emptyDescription}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </section>
  );
}
