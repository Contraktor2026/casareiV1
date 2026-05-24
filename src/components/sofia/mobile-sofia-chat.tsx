import type { ReactNode } from "react";

export function MobileSofiaChat({ children }: { children: ReactNode }) {
  return <div className="rounded-t-[2rem] bg-[#fffdf9] p-5 shadow-[0_-16px_44px_rgba(114,36,62,0.12)]">{children}</div>;
}
