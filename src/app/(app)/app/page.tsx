"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Camera,
  CheckCircle2,
  CheckSquare,
  FileText,
  Heart,
  MapPin,
  Plus,
  Sparkles,
  Store,
  Table2,
  Users,
  Wallet
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getOnboardingData, getSession } from "@/lib/client/supabase-auth";
import type { OnboardingData } from "@/types/onboarding";

const defaultBannerImage = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop";
const appBannerImageKey = "casarei:app-banner-image";

const quickActions = [
  { label: "Adicionar convidado", href: "/app/convidados", icon: Users },
  { label: "Adicionar orçamento", href: "/app/cotacoes", icon: FileText },
  { label: "Organizar mesas", href: "/app/presenca-mesas/mesas", icon: Table2 },
  { label: "Nova tarefa", href: "/app/cronograma", icon: CheckSquare }
];

const mobileModules = [
  { title: "Convidados", text: "Lista, grupos, contatos e cuidados", href: "/app/convidados", icon: Users, status: "87 cadastrados" },
  { title: "Confirmações", text: "Enviar RSVP e acompanhar respostas", href: "/app/presenca-mesas", icon: CalendarCheck2, status: "42 pendentes" },
  { title: "Mesas", text: "Mapa de mesas e convidados sem lugar", href: "/app/presenca-mesas/mesas", icon: Table2, status: "8 sem mesa" },
  { title: "Fornecedores", text: "Contratos, pagamentos e orçamentos", href: "/app/fornecedores", icon: Store, status: "6 fechados" },
  { title: "Financeiro", text: "Pagamentos, vencimentos e saldo", href: "/app/orcamento", icon: Wallet, status: "62% usado" },
  { title: "Tarefas", text: "Agenda mensal e próximos passos", href: "/app/cronograma", icon: CheckSquare, status: "8 esta semana" }
];

const todayFocus = [
  { title: "Revisar convidados sem WhatsApp", href: "/app/convidados", tone: "warn" },
  { title: "Confirmar próximo pagamento", href: "/app/orcamento/pagamentos", tone: "danger" },
  { title: "Comparar fotografia", href: "/app/cotacoes", tone: "ok" }
];

export default function DashboardPage() {
  const [bannerImage, setBannerImage] = useState(defaultBannerImage);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const storedImage = window.localStorage.getItem(appBannerImageKey);
    if (storedImage) setBannerImage(storedImage);
    setOnboarding(getOnboardingData());
  }, []);

  const session = typeof window !== "undefined" ? getSession() : null;
  const coupleName = onboarding?.brideName && onboarding?.partnerName ? `${onboarding.brideName} & ${onboarding.partnerName}` : "Seu casamento";
  const weddingDate = onboarding?.weddingDate ? formatWeddingDate(onboarding.weddingDate) : "Data a definir";
  const city = onboarding?.city || "Cidade";
  const state = onboarding?.state || "UF";
  const guestCount = onboarding?.guestCount || 0;
  const plannedBudget = onboarding?.plannedBudget || "orçamento a definir";
  const firstName = onboarding?.brideName || String(session?.user?.user_metadata?.full_name ?? "").split(" ")[0] || "olá";

  function uploadBannerImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      setBannerImage(result);
      window.localStorage.setItem(appBannerImageKey, result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto w-full max-w-[460px] space-y-5 lg:max-w-6xl">
      <section className="relative overflow-hidden rounded-[28px] bg-[#4B2E2B] p-5 text-white shadow-[0_18px_45px_rgba(75,46,43,0.18)] lg:grid lg:min-h-[360px] lg:grid-cols-[1fr_360px] lg:items-end lg:gap-8 lg:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `linear-gradient(180deg,rgba(75,46,43,0.2),rgba(75,46,43,0.92)),url('${bannerImage}')` }}
        />
        <div className="relative">
          <label className="mobile-tap-target mb-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#D96C8A] shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur">
            <Camera className="h-4 w-4" aria-hidden />
            Editar banner
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadBannerImage(event.target.files?.[0])} />
          </label>

          <p className="text-sm text-white/85">O grande dia de</p>
          <h1 className="mt-1 max-w-[280px] font-serif text-4xl leading-none text-white sm:max-w-none sm:text-5xl">
            {coupleName}
          </h1>

          <div className="mt-5 grid gap-2 text-sm text-white/88">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden />
              {weddingDate}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              {city} - {state}
            </p>
          </div>
        </div>

        <aside className="relative mt-5 rounded-[24px] bg-white/94 p-4 text-[#4B2E2B] shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur lg:mt-0">
          <div className="flex items-center gap-2 text-sm font-bold text-[#D96C8A]">
            <Sparkles className="h-4 w-4" aria-hidden />
            Sofia
          </div>
          <h2 className="mt-2 font-serif text-2xl leading-tight">Respira, {firstName}. O casamento já está tomando forma.</h2>
          <p className="mt-3 text-sm leading-6 text-[#7B625D]">
            Base criada para {guestCount} convidados, orçamento {plannedBudget} e fornecedores da região.
          </p>
          <Button asChild className="mt-4 h-12 w-full rounded-2xl bg-[#D96C8A] font-bold hover:bg-[#C85D7B]">
            <Link href="/app/cronograma">
              Ver próximos passos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </aside>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <SummaryPill value="142" label="dias" />
        <SummaryPill value="67%" label="organizado" />
        <SummaryPill value="R$ 8,4k" label="a pagar" />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#4B2E2B]">Ações rápidas</h2>
          <span className="rounded-full bg-[#F8E7EC] px-3 py-1 text-[11px] font-bold text-[#D96C8A]">mobile-first</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="mobile-tap-target rounded-[20px] bg-white p-4 text-[#4B2E2B] shadow-[0_12px_30px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F8E7EC] text-[#D96C8A]">
                <action.icon className="h-5 w-5" />
              </span>
              <span className="mt-3 block text-sm font-bold leading-5">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D96C8A]">Hoje</p>
            <h2 className="mt-1 font-serif text-2xl text-[#4B2E2B]">Prioridades para avançar</h2>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF3EA] text-[#5F7752]">
            <CheckCircle2 className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          {todayFocus.map((item) => (
            <Link key={item.title} href={item.href} className="flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#F8F4F1] px-4 py-3">
              <span className={`h-2.5 w-2.5 rounded-full ${focusTone(item.tone)}`} />
              <span className="flex-1 text-sm font-bold text-[#4B2E2B]">{item.title}</span>
              <ArrowRight className="h-4 w-4 text-[#8A716D]" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8A716D]">Casamento</p>
            <h2 className="font-serif text-2xl text-[#4B2E2B]">Módulos principais</h2>
          </div>
          <Plus className="h-5 w-5 text-[#D96C8A]" />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {mobileModules.map((module) => (
            <Link key={module.title} href={module.href} className="flex min-h-[86px] items-center gap-3 rounded-[22px] bg-white p-4 shadow-[0_12px_30px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F8E7EC] text-[#D96C8A]">
                <module.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm text-[#4B2E2B]">{module.title}</strong>
                <span className="mt-1 block text-xs leading-5 text-[#8A716D]">{module.text}</span>
              </span>
              <span className="rounded-full bg-[#F8F4F1] px-3 py-1 text-[11px] font-bold text-[#7B625D]">{module.status}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] bg-[linear-gradient(135deg,#FFF8F4,#F8E7EC)] p-5 text-[#4B2E2B] ring-1 ring-[#EEE6E1]">
        <Heart className="h-6 w-6 text-[#D96C8A]" aria-hidden />
        <h2 className="mt-3 font-serif text-2xl">Cada pequeno passo aproxima vocês do grande dia.</h2>
        <p className="mt-2 text-sm leading-6 text-[#7B625D]">O app agora prioriza o uso no celular: ações visíveis, módulos fáceis de tocar e conteúdo organizado em blocos curtos.</p>
      </section>
    </div>
  );
}

function SummaryPill({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-[20px] bg-white p-4 text-center shadow-[0_12px_30px_rgba(75,46,43,0.06)] ring-1 ring-[#EEE6E1]">
      <strong className="block font-serif text-2xl leading-none text-[#4B2E2B]">{value}</strong>
      <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#8A716D]">{label}</span>
    </article>
  );
}

function focusTone(tone: string) {
  if (tone === "danger") return "bg-[#D96C8A]";
  if (tone === "warn") return "bg-[#D28B6E]";
  return "bg-[#9CAF88]";
}

function formatWeddingDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(parsed);
}
