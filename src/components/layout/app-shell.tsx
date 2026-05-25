"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck2,
  CheckSquare,
  ChevronRight,
  FileText,
  Gift,
  Heart,
  Home,
  Sparkles,
  Store,
  Table2,
  Users,
  Wallet
} from "lucide-react";

import { BottomNavigation } from "@/components/layout/bottom-navigation";

type AppShellProps = {
  children: ReactNode;
};

const sidebarItems = [
  { href: "/app", label: "Início", icon: Home, badge: null },
  { href: "/app/cronograma", label: "Tarefas", icon: CheckSquare, badge: "8" },
  { href: "/app/convidados", label: "Convidados", icon: Users, badge: null },
  { href: "/app/presenca-mesas", label: "Confirmações", icon: CalendarCheck2, badge: "novo" },
  { href: "/app/presenca-mesas/mesas", label: "Mesas", icon: Table2, badge: null },
  { href: "/app/cotacoes", label: "Cotações", icon: FileText, badge: "3" },
  { href: "/app/orcamento", label: "Financeiro", icon: Wallet, badge: null },
  { href: "/app/fornecedores", label: "Fornecedores", icon: Store, badge: null },
  { href: "/app/inspiracoes", label: "Inspirações", icon: Heart, badge: null },
  { href: "/app/sofia", label: "Sofia", icon: Sparkles, badge: null }
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#fffaf7,#fbeaf0)] text-[#2a1a1f]">
      <aside className="fixed inset-y-0 left-0 hidden w-[250px] flex-col border-r border-[#e8dcd7] bg-[rgba(255,253,249,0.88)] px-[18px] py-7 lg:flex">
        <div className="text-center">
          <p className="font-serif text-4xl font-medium leading-none text-[#2a1a1f]">♡ Casarei</p>
          <p className="mt-1 text-[11px] text-[#7b6a70]">seu casamento, do seu jeito</p>
        </div>

        <nav className="mt-8 grid gap-2">
          {sidebarItems.map((item) => (
            <SidebarItem key={item.href} item={item} active={isActivePath(pathname, item.href)} />
          ))}
        </nav>

        <div className="mt-10 rounded-[18px] border border-[#e8dcd7] bg-[#fff8f8] p-[18px]">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#d4537e]" aria-hidden />
            <h4 className="font-serif text-xl font-medium text-[#2a1a1f]">Lista de casamento</h4>
          </div>
          <p className="mt-2 text-[13px] leading-5 text-[#7b6a70]">
            Crie sua lista e compartilhe com quem você ama.
          </p>
          <Link href="/app/convidados" className="mt-4 inline-flex rounded-xl bg-[#d4537e] px-5 py-3 text-sm font-bold text-white">
            Criar lista de convidados
          </Link>
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-[#e8dcd7] pt-5">
          <div className="h-10 w-10 rounded-full bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop')] bg-cover bg-center" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#2a1a1f]">Mariana Silva</p>
            <p className="text-xs text-[#7b6a70]">Minha conta</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#7b6a70]" aria-hidden />
        </div>
      </aside>

      <div className="lg:ml-[250px]">
        <main className="mobile-safe-shell min-h-screen px-4 pt-5 md:px-8 lg:px-11 lg:py-9">
          <div className="mb-4 flex items-center justify-between gap-4 lg:justify-end">
            <div className="flex items-center gap-2 lg:hidden">
              <Heart className="h-6 w-6 text-[#d4537e]" strokeWidth={1.7} aria-hidden />
              <span className="font-serif text-3xl text-[#2a1a1f]">Casarei</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/app/sofia"
                className="hidden rounded-full bg-[#fbeaf0] px-4 py-2 text-xs font-bold text-[#d4537e] sm:inline-flex"
              >
                Sofia
              </Link>
              <button
                className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#e8dcd7] bg-[#fffdf9] shadow-[0_8px_20px_rgba(0,0,0,0.04)]"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#d4537e]" />
              </button>
              <Link
                href="/app/sofia"
                className="h-[42px] w-[42px] rounded-full border border-[#e8dcd7] bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop')] bg-cover bg-center shadow-[0_8px_20px_rgba(0,0,0,0.04)]"
                aria-label="Perfil"
              />
            </div>
          </div>

          <MobileModuleRail pathname={pathname} />
          {children}
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}

function SidebarItem({ item, active }: { item: (typeof sidebarItems)[number]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={
        active
          ? "flex items-center gap-3 rounded-[14px] bg-[#fbeaf0] px-4 py-[14px] text-sm font-semibold text-[#d4537e]"
          : "flex items-center gap-3 rounded-[14px] px-4 py-[14px] text-sm text-[#2a1a1f] transition hover:bg-[#fbeaf0] hover:text-[#d4537e]"
      }
    >
      <item.icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
      <span>{item.label}</span>
      {item.badge ? <span className="ml-auto text-[#d4537e]">{item.badge}</span> : null}
    </Link>
  );
}

function MobileModuleRail({ pathname }: { pathname: string }) {
  return (
    <section className="mb-5 lg:hidden" aria-label="Módulos do Casarei">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A716D]">Todos os módulos</p>
        <Link href="/app" className="text-xs font-bold text-[#d4537e]">
          Painel
        </Link>
      </div>
      <div className="mobile-scroll-clean flex gap-2 overflow-x-auto pb-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActivePath(pathname, item.href)
                ? "flex min-w-[112px] items-center gap-2 rounded-2xl bg-[#4B2E2B] px-3 py-3 text-xs font-bold text-white shadow-[0_12px_28px_rgba(75,46,43,0.18)]"
                : "flex min-w-[112px] items-center gap-2 rounded-2xl bg-[#FFFDFC] px-3 py-3 text-xs font-bold text-[#4B2E2B] shadow-[0_10px_26px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]"
            }
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="leading-4">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/app" && pathname.startsWith(href));
}
