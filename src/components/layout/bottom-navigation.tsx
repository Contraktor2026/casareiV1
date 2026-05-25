"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Sparkles, Users, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

const LEFT_TABS = [
  { href: "/app", label: "Início", icon: Home, match: ["/app"] },
  {
    href: "/app/cronograma",
    label: "Agenda",
    icon: CalendarDays,
    match: ["/app/cronograma", "/app/tarefas", "/app/timeline", "/app/inspiracoes"],
  },
];

const RIGHT_TABS = [
  {
    href: "/app/convidados",
    label: "Convidados",
    icon: Users,
    match: ["/app/convidados", "/app/presenca-mesas"],
  },
  {
    href: "/app/orcamento",
    label: "Conta",
    icon: Wallet,
    match: ["/app/orcamento", "/app/fornecedores", "/app/cotacoes"],
  },
];

function isTabActive(pathname: string, match: string[]) {
  return match.some(
    (href) => pathname === href || (href !== "/app" && pathname.startsWith(href))
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  const sofiaActive = pathname.startsWith("/app/sofia");

  return (
    <nav className="app-bottom-nav" aria-label="Navegação principal">
      {/* Esquerda */}
      {LEFT_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isTabActive(pathname, tab.match);
        return (
          <Link key={tab.href} href={tab.href} className="nav-tab" aria-label={tab.label}>
            <Icon
              className={cn("h-[22px] w-[22px] transition-colors", active ? "text-[#D96C8A]" : "text-[#9E8880]")}
              strokeWidth={active ? 2.1 : 1.6}
            />
            <span className={cn("text-[10px] font-semibold leading-none tracking-tight", active ? "text-[#D96C8A]" : "text-[#9E8880]")}>
              {tab.label}
            </span>
          </Link>
        );
      })}

      {/* Sofia — centro elevado */}
      <Link href="/app/sofia" className="nav-sofia" aria-label="Sofia">
        <div className={cn("sofia-btn", sofiaActive && "scale-105")}>
          <Sparkles className="h-[22px] w-[22px]" strokeWidth={1.8} />
        </div>
        <span className={cn("text-[10px] font-semibold leading-none tracking-tight", sofiaActive ? "text-[#D96C8A]" : "text-[#9E8880]")}>
          Sofia
        </span>
      </Link>

      {/* Direita */}
      {RIGHT_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isTabActive(pathname, tab.match);
        return (
          <Link key={tab.href} href={tab.href} className="nav-tab" aria-label={tab.label}>
            <Icon
              className={cn("h-[22px] w-[22px] transition-colors", active ? "text-[#D96C8A]" : "text-[#9E8880]")}
              strokeWidth={active ? 2.1 : 1.6}
            />
            <span className={cn("text-[10px] font-semibold leading-none tracking-tight", active ? "text-[#D96C8A]" : "text-[#9E8880]")}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
