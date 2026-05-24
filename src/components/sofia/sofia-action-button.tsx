import Link from "next/link";
import type { SofiaAction } from "@/types/sofia";

type SofiaActionButtonProps = {
  action: SofiaAction;
  onCopy?: (text: string) => void;
};

export function SofiaActionButton({ action, onCopy }: SofiaActionButtonProps) {
  const className =
    action.kind === "primary"
      ? "inline-flex h-10 items-center justify-center rounded-xl bg-casarei-primary px-4 text-sm font-semibold text-white transition hover:bg-casarei-primary-dark"
      : action.kind === "whatsapp"
        ? "inline-flex h-10 items-center justify-center rounded-xl bg-casarei-whatsapp px-4 text-sm font-semibold text-white transition hover:brightness-95"
        : "inline-flex h-10 items-center justify-center rounded-xl border border-casarei-border-soft bg-white/82 px-4 text-sm font-semibold text-casarei-primary-deep transition hover:border-casarei-primary-light";

  if (action.copyText) {
    return (
      <button type="button" className={className} onClick={() => onCopy?.(action.copyText ?? "")}>
        {action.label}
      </button>
    );
  }

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {action.label}
    </button>
  );
}
