"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck2, CheckSquare, Home, Sparkles, Store, Table2, Users, Wallet } from "lucide-react";

import { appNavigation } from "@/lib/constants/design";
import { cn } from "@/lib/utils";

const icons = {
  Home,
  CheckSquare,
  Users,
  Store,
  CalendarCheck2,
  Table2,
  Wallet,
  Sparkles
};

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 flex gap-1 overflow-x-auto rounded-[22px] border border-[#e8dcd7] bg-[rgba(255,253,249,0.96)] p-2 shadow-[0_20px_50px_rgba(153,53,86,0.12)] backdrop-blur lg:hidden">
      {appNavigation.map((item) => {
        const Icon = icons[item.icon];
        const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "min-w-[76px] rounded-[14px] px-2 py-2 text-center text-[10px] font-medium text-[#7b6a70]",
              isActive && "bg-[#fbeaf0] font-bold text-[#d4537e]"
            )}
          >
            <Icon className="mx-auto mb-1 h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
