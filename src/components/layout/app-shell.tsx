"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { getSession } from "@/lib/client/supabase-auth";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
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
      <div className="grid min-h-screen place-items-center bg-[#FFF8F4] px-6 text-center text-sm font-semibold text-[#8A716D]">
        Preparando seu app...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#fffdfb_0,#fff7f4_38%,#f4ece8_100%)] text-[#4B2E2B]">
      <div className="mobile-device-stage">
        <div className="mobile-app-viewport">
          <header className="mobile-shell-topbar">
            <Link href="/app" className="flex items-center gap-2" aria-label="Casarei">
              <Heart className="h-5 w-5 text-[#D96C8A]" strokeWidth={1.8} aria-hidden />
              <span className="font-serif text-[28px] leading-none text-[#4B2E2B]">casarei</span>
            </Link>
            <Link
              href="/app/sofia"
              className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[#4B2E2B] shadow-[0_10px_24px_rgba(75,46,43,0.08)] ring-1 ring-[#EEE6E1]"
              aria-label="Avisos da Sofia"
            >
              <Bell className="h-5 w-5" strokeWidth={1.7} aria-hidden />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#D96C8A]" />
            </Link>
          </header>

          <main className="mobile-safe-shell min-h-screen px-4 pb-28 pt-3">{children}</main>
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
