import type { ReactNode } from "react";

export function MobileBudgetSheet({ children }: { children: ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}
