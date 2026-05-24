import type { ReactNode } from "react";

export function MobileOnboardingLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-md md:max-w-none">{children}</div>;
}
