import type { ReactNode } from "react";

export function MobileVendorBottomSheet({ children }: { children: ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}
