"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Heart, Sparkles, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { getSession } from "@/lib/client/supabase-auth";

const ROOT_ROUTES = new Set([
  "/app",
  "/app/convidados",
  "/app/fornecedores",
  "/app/orcamento",
  "/app/cronograma",
  "/app/tarefas",
  "/app/sofia",
  "/app/inspiracoes",
  "/app/presenca-mesas",
  "/app/cotacoes",
  "/app/perfil",
]);

const PAGE_TITLES: Record<string, string> = {
  "/app/convidados": "Convidados",
  "/app/convidados/enviar": "Enviar convites",
  "/app/convidados/templates": "Templates RSVP",
  "/app/convidados/mesas": "Mesas",
  "/app/fornecedores": "Fornecedores",
  "/app/orcamento": "Financeiro",
  "/app/orcamento/categorias": "Categorias",
  "/app/orcamento/pagamentos": "Pagamentos",
  "/app/orcamento/projecoes": "Projeções",
  "/app/cronograma": "Agenda",
  "/app/tarefas": "Tarefas",
  "/app/sofia": "Sofia",
  "/app/inspiracoes": "Inspirações",
  "/app/presenca-mesas": "Presença",
  "/app/presenca-mesas/mesas": "Mesas",
  "/app/cotacoes": "Cotações",
  "/app/perfil": "Perfil",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/app/fornecedores/")) return "Fornecedor";
  if (pathname.startsWith("/app/convidados/grupos/")) return "Grupo";
  if (pathname.startsWith("/app/convidados/mesas/")) return "Mesa";
  if (pathname.startsWith("/app/presenca-mesas/mesas/")) return "Mesa";
  return "casarei";
}

function getParentRoute(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 2) return "/app";
  return "/" + parts.slice(0, -1).join("/");
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FFF8F4]">
        <Heart className="h-7 w-7 animate-pulse text-[#D96C8A]" strokeWidth={1.8} />
      </div>
    );
  }

  const isRoot = ROOT_ROUTES.has(pathname);
  const title = getPageTitle(pathname);
  const parentRoute = getParentRoute(pathname);

  return (
    <div className="min-h-screen bg-[#F5EFEb]">
      <div className="mobile-device-stage">
        <div className="mobile-app-viewport">

          {/* ── Topbar ── */}
          <header className="app-topbar">
            {isRoot ? (
              <>
                <Link href="/app" className="flex items-center gap-1.5" aria-label="Casarei">
                  <Heart className="h-[18px] w-[18px] text-[#D96C8A]" strokeWidth={2.2} fill="currentColor" />
                  <span className="font-serif text-[22px] leading-none text-[#4B2E2B]">casarei</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href="/app/sofia"
                    className="relative grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-[#EDE5E0]"
                    style={{ boxShadow: "0 2px 10px rgba(75,46,43,0.10)" }}
                    aria-label="Sofia"
                  >
                    <Sparkles className="h-[17px] w-[17px] text-[#D96C8A]" strokeWidth={1.8} />
                    <span className="absolute right-[9px] top-[9px] h-[7px] w-[7px] rounded-full bg-[#D96C8A] ring-[1.5px] ring-white" />
                  </Link>
                  <Link
                    href="/app/perfil"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-[#EDE5E0]"
                    style={{ boxShadow: "0 2px 10px rgba(75,46,43,0.10)" }}
                    aria-label="Perfil"
                  >
                    <UserCircle className="h-[18px] w-[18px] text-[#8A716D]" strokeWidth={1.8} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.push(parentRoute)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-[#EDE5E0]"
                  style={{ boxShadow: "0 2px 10px rgba(75,46,43,0.10)" }}
                  aria-label="Voltar"
                >
                  <ChevronLeft className="h-5 w-5 text-[#4B2E2B]" strokeWidth={2} />
                </button>
                <span className="text-[15px] font-semibold text-[#4B2E2B]">{title}</span>
                <div className="w-9" />
              </>
            )}
          </header>

          {/* ── Conteúdo ── */}
          <main
            className="px-4 pt-4"
            style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
          >
            {children}
          </main>

          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
