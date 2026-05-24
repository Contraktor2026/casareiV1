import type { ReactNode } from "react";

type OnboardingStepShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function OnboardingStepShell({ eyebrow, title, subtitle, children }: OnboardingStepShellProps) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        {eyebrow ? <p className="text-sm font-semibold text-casarei-primary">{eyebrow}</p> : null}
        <h1 className="mt-2 font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-xl text-base leading-7 text-casarei-text">{subtitle}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
