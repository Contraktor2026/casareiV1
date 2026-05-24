import Link from "next/link";
import { CalendarCheck, Users, Wallet, Store } from "lucide-react";

const items = [
  { label: "Convidados", href: "/app/convidados", icon: Users },
  { label: "Orçamento", href: "/app/orcamento", icon: Wallet },
  { label: "Fornecedores", href: "/app/fornecedores", icon: Store },
  { label: "Cronograma", href: "/app/cronograma", icon: CalendarCheck }
];

export function SofiaQuickHelp() {
  return (
    <section className="rounded-[2rem] border border-white/90 bg-white/78 p-5 shadow-[0_14px_38px_rgba(114,36,62,0.06)]">
      <p className="text-sm font-semibold text-casarei-primary">Ajuda rapida</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl border border-casarei-border-soft bg-white/82 px-4 py-4 text-sm font-semibold text-casarei-primary-deep transition hover:border-casarei-primary-light"
          >
            <item.icon className="h-4 w-4 text-casarei-primary" aria-hidden />
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
