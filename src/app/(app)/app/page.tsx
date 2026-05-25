"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  MapPin,
  Scale,
  Sparkles,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getOnboardingData, getSession } from "@/lib/client/supabase-auth";
import { getStoredGuests } from "@/lib/client/guests-store";
import { getStoredVendors } from "@/lib/client/vendors-store";
import type { OnboardingData } from "@/types/onboarding";

const SOFIA_MESSAGES = [
  "Cada decisão tomada hoje é um passo a menos pra se preocupar depois. Você está indo bem.",
  "Casar não é só organizar uma festa — é construir uma memória que vai durar para sempre.",
  "Respira fundo. O casamento dos seus sonhos está tomando forma, um detalhe de cada vez.",
  "Você não precisa resolver tudo hoje. O que importa é continuar avançando.",
  "Lembra do porquê você está fazendo isso. O resto é detalhe.",
];

const QUICK_ACTIONS = [
  { label: "Convidados", href: "/app/convidados", icon: Users, color: "#EEF1F4", iconColor: "#6E7F91" },
  { label: "Fornecedores", href: "/app/fornecedores", icon: Store, color: "#EEF3EA", iconColor: "#5F7752" },
  { label: "Financeiro", href: "/app/orcamento", icon: Wallet, color: "#F8E7EC", iconColor: "#D96C8A" },
  { label: "Agenda", href: "/app/cronograma", icon: CheckSquare, color: "#FBEEE8", iconColor: "#B96F52" },
];

const STARTER_STEPS = [
  { label: "Preencher dados do casamento", href: "/onboarding", done: false },
  { label: "Adicionar primeiros convidados", href: "/app/convidados", done: false },
  { label: "Cadastrar fornecedores", href: "/app/fornecedores", done: false },
  { label: "Definir orçamento", href: "/app/orcamento", done: false },
];

function getDaysLeft(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const wedding = new Date(`${dateStr}T12:00:00`);
  const today = new Date();
  const diff = Math.ceil((wedding.getTime() - today.getTime()) / 86_400_000);
  return Math.max(0, diff);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(`${dateStr}T12:00:00`)
  );
}

export default function DashboardPage() {
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    setOnboarding(getOnboardingData());
    setGuestCount(getStoredGuests().length);
    setVendorCount(getStoredVendors().length);
  }, []);

  const session = typeof window !== "undefined" ? getSession() : null;
  const firstName =
    onboarding?.brideName ||
    String(session?.user?.user_metadata?.full_name ?? "").split(" ")[0] ||
    "você";

  const daysLeft = getDaysLeft(onboarding?.weddingDate);
  const weddingDate = onboarding?.weddingDate ? formatDate(onboarding.weddingDate) : null;
  const city = onboarding?.city || null;
  const state = onboarding?.state || null;
  const brideName = onboarding?.brideName || null;
  const partnerName = onboarding?.partnerName || null;
  const coupleNames = [brideName, partnerName].filter(Boolean).join(" & ") || null;
  const hasBasics = Boolean(onboarding?.weddingDate || onboarding?.brideName);

  const sofiaMessage = useMemo(() => {
    const idx = new Date().getDay() % SOFIA_MESSAGES.length;
    return SOFIA_MESSAGES[idx];
  }, []);

  const stepsCompleted = [
    hasBasics,
    guestCount > 0,
    vendorCount > 0,
    Boolean(onboarding?.plannedBudget),
  ].filter(Boolean).length;

  const progressPct = Math.round((stepsCompleted / STARTER_STEPS.length) * 100);

  return (
    <div className="space-y-4">

      {/* ── Hero: countdown ── */}
      <section
        className="relative overflow-hidden rounded-[24px] p-6 text-white"
        style={{ background: "linear-gradient(145deg, #4B2E2B 0%, #2E1A18 100%)" }}
      >
        {/* Glow decorativo */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #D96C8A, transparent)" }}
        />

        {daysLeft !== null ? (
          <div className="text-center">
            {coupleNames && (
              <p className="font-serif text-xl leading-snug text-white/90">{coupleNames}</p>
            )}
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 ${coupleNames ? "mt-2" : ""}`}>falta</p>
            <div className="mt-0.5 font-serif text-[80px] font-light leading-none tracking-tight">
              {daysLeft}
            </div>
            <p className="text-sm font-medium text-white/65">
              {daysLeft === 1 ? "dia" : "dias"}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10">
              <CalendarDays className="h-7 w-7 text-white/70" />
            </div>
            <p className="mt-3 text-sm font-semibold text-white/80">Data do casamento não definida</p>
            <Link
              href="/onboarding"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Definir data <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {(weddingDate || city) && (
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-white/60">
            {weddingDate && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {weddingDate}
              </span>
            )}
            {city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {city}{state ? `, ${state}` : ""}
              </span>
            )}
          </div>
        )}

        {/* Sofia card dentro do hero */}
        <div className="mt-5 rounded-[18px] bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
              style={{ background: "linear-gradient(135deg, #D96C8A, #B85070)" }}
            >
              <Sparkles className="h-4 w-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wide">Sofia</p>
              <p className="mt-0.5 text-sm leading-[1.55] text-white/85">
                Oi, {firstName}. {sofiaMessage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats rápidas ── */}
      <div className="grid grid-cols-3 gap-2">
        <StatPill value={String(guestCount)} label="convidados" />
        <StatPill value={`${stepsCompleted}/${STARTER_STEPS.length}`} label="primeiros passos" />
        <StatPill value={String(vendorCount)} label="fornecedores" />
      </div>

      {/* ── Destaque: Cotações com IA ── */}
      <Link
        href="/app/cotacoes"
        className="flex items-center gap-4 rounded-[22px] p-5 ring-1 ring-transparent active:scale-[0.98] transition"
        style={{
          background: "linear-gradient(135deg, #2A1A1F 0%, #72243E 60%, #D4537E 100%)",
          boxShadow: "0 10px 32px rgba(212,83,126,0.28)",
        }}
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-white/15">
          <Sparkles className="h-6 w-6 text-white" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">Inteligência artificial</p>
          <p className="mt-0.5 font-serif text-[19px] leading-snug text-white">Compare orçamentos com Sofia</p>
          <p className="mt-1 text-xs text-white/65">Importe propostas e a IA analisa o melhor para você</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-white/60" />
      </Link>

      {/* ── Acesso rápido ── */}
      <section>
        <h2 className="mb-3 text-[13px] font-bold text-[#4B2E2B]">Acesso rápido</h2>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-[18px] bg-white p-3 ring-1 ring-[#EEE6E1] transition active:scale-[0.97]"
              style={{ boxShadow: "0 4px 16px rgba(75,46,43,0.05)" }}
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-[14px]"
                style={{ background: action.color }}
              >
                <action.icon className="h-5 w-5" style={{ color: action.iconColor }} strokeWidth={1.8} />
              </span>
              <span className="text-[10px] font-bold leading-tight text-[#4B2E2B] text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Primeiros passos ── */}
      {progressPct < 100 && (
        <section
          className="rounded-[20px] bg-white p-5 ring-1 ring-[#EEE6E1]"
          style={{ boxShadow: "0 4px 20px rgba(75,46,43,0.06)" }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D96C8A]">Primeiros passos</p>
              <h2 className="mt-0.5 font-serif text-xl text-[#4B2E2B]">
                {stepsCompleted} de {STARTER_STEPS.length} feitos
              </h2>
            </div>
            <div className="relative h-11 w-11">
              <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#F0E8E4" strokeWidth="4" />
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="#D96C8A"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - progressPct / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#D96C8A]">
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F0E8E4]">
            <div
              className="h-full rounded-full bg-[#D96C8A] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {STARTER_STEPS.map((step, i) => {
              const stepsDone = [hasBasics, guestCount > 0, vendorCount > 0, Boolean(onboarding?.plannedBudget)];
              const done = stepsDone[i];
              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className="flex items-center gap-3 rounded-[14px] px-3 py-3 transition active:bg-[#F8F4F1]"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${done ? "bg-[#D96C8A] text-white" : "bg-[#F0E8E4] text-[#8A716D]"}`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className={`flex-1 text-sm font-semibold ${done ? "text-[#9E8880] line-through" : "text-[#4B2E2B]"}`}>
                    {step.label}
                  </span>
                  {!done && <ChevronRight className="h-4 w-4 text-[#C4B0AA]" />}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Módulos ── */}
      <section>
        <h2 className="mb-3 text-[13px] font-bold text-[#4B2E2B]">Módulos</h2>
        <div className="space-y-2">
          {[
            { title: "Convidados", sub: "Lista, grupos, RSVP e confirmações", href: "/app/convidados", icon: Users },
            { title: "Presença e Mesas", sub: "Check-in, mesas e acomodações", href: "/app/presenca-mesas", icon: ClipboardList },
            { title: "Fornecedores", sub: "Contratos, pagamentos e cotações", href: "/app/fornecedores", icon: Store },
            { title: "Financeiro", sub: "Orçamento, categorias e projeções", href: "/app/orcamento", icon: Wallet },
            { title: "Agenda", sub: "Cronograma mensal e tarefas", href: "/app/cronograma", icon: CheckSquare },
            { title: "Cotações", sub: "Compare propostas com IA e feche fornecedores", href: "/app/cotacoes", icon: Scale },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-4 ring-1 ring-[#EEE6E1] transition active:scale-[0.99]"
              style={{ boxShadow: "0 2px 12px rgba(75,46,43,0.04)" }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#F8E7EC]">
                <mod.icon className="h-5 w-5 text-[#D96C8A]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm text-[#4B2E2B]">{mod.title}</strong>
                <span className="mt-0.5 block text-xs text-[#8A716D]">{mod.sub}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#C4B0AA]" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <article
      className="rounded-[16px] bg-white px-3 py-3 text-center ring-1 ring-[#EEE6E1]"
      style={{ boxShadow: "0 2px 10px rgba(75,46,43,0.05)" }}
    >
      <strong className="block font-serif text-[22px] leading-none text-[#4B2E2B]">{value}</strong>
      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A716D]">{label}</span>
    </article>
  );
}
