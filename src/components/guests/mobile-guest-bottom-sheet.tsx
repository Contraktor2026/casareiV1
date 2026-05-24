"use client";

import type { ReactNode } from "react";

export function MobileGuestBottomSheet({ children }: { children: ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}
