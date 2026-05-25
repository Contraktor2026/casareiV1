"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Home, Menu, Store, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Inicio", icon: Home, match: ["/app"] },
  { href: "/app/cronograma", label: "Tarefas", icon: CheckSquare, match: ["/app/cronograma", "/app/tarefas"] },
  {
    href: "/app/convidados",
    label: "Convidados",
    icon: Users,
    match: ["/app/convidados", "/app/presenca-mesas"]
  },
  { href: "/app/fornecedores", label: "Fornecedores", icon: Store, match: ["/app/fornecedores", "/app/cotacoes"] },
  { href: "/app/sofia", label: "Mais", icon: Menu, match: ["/app/sofia", "/app/orcamento", "/app/inspiracoes"] }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegacao principal">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.match.some((href) => pathname === href || (href !== "/app" && pathname.startsWith(href)));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "mobile-bottom-item",
              isActive && "text-[#D96C8A] [&_span:first-child]:bg-[#F8E7EC] [&_span:first-child]:text-[#D96C8A]"
            )}
          >
            <span>
              <Icon className="h-[19px] w-[19px]" strokeWidth={1.7} aria-hidden />
            </span>
            <strong>{item.label}</strong>
          </Link>
        );
      })}
    </nav>
  );
}
