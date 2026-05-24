import type { ReactNode } from "react";
import { Heart } from "lucide-react";

import { OnboardingProgress } from "./onboarding-progress";

type OnboardingLayoutProps = {
  children: ReactNode;
  step: number;
  total: number;
};

export function OnboardingLayout({ children, step, total }: OnboardingLayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fffaf7,#fbeaf0)] px-4 py-5 text-casarei-primary-deep md:px-8 md:py-8">
      <section className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-casarei-primary" aria-hidden />
            <span className="font-serif text-3xl text-casarei-primary-deep">Casarei</span>
          </div>
          <span className="text-sm font-semibold text-casarei-muted">{step + 1} de {total}</span>
        </header>
        <div className="mt-5">
          <OnboardingProgress current={step} total={total} />
        </div>
        <div className="flex flex-1 items-center py-8 md:py-10">
          <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">{children}</div>
        </div>
      </section>
    </main>
  );
}
