"use client";

import Link from "next/link";
import { Camera, CalendarDays, CheckSquare, FileText, Heart, MapPin, Sparkles, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getOnboardingData } from "@/lib/client/fake-auth";
import { mockCouple } from "@/lib/mock/casarei";
import type { OnboardingData } from "@/types/onboarding";

const countdown = [
  { value: "142", label: "dias" },
  { value: "18", label: "horas" },
  { value: "43", label: "min" },
  { value: "21", label: "seg" }
];

const journey = [
  { icon: Heart, value: "100%", label: "Sonho desenhado" },
  { icon: Users, value: "72%", label: "Decisões tomadas" },
  { icon: CheckSquare, value: "64%", label: "Fornecedores certos" },
  { icon: Heart, value: "58%", label: "Tranquilidade da semana" }
];

const moduleCards = [
  {
    title: "Convidados",
    icon: Users,
    value: "87/140",
    text: "confirmados",
    detail: "42 pendentes",
    href: "/app/convidados",
    cta: "Ver convidados"
  },
  {
    title: "Tarefas",
    icon: CheckSquare,
    value: "23/48",
    text: "concluídas",
    detail: "8 para esta semana",
    href: "/app/cronograma",
    cta: "Ver tarefas"
  },
  {
    title: "Cotações",
    icon: FileText,
    value: "3",
    text: "em comparação",
    detail: "4 recebidas",
    href: "/app/cotacoes",
    cta: "Ver cotações"
  },
  {
    title: "Financeiro",
    icon: Wallet,
    value: "62%",
    text: "do total usado",
    detail: "R$ 8.420 de R$ 13.500",
    href: "/app/orcamento",
    cta: "Ver financeiro"
  }
];

const defaultBannerImage = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop";
const appBannerImageKey = "casarei:app-banner-image";

export default function DashboardPage() {
  const [bannerImage, setBannerImage] = useState(defaultBannerImage);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const storedImage = window.localStorage.getItem(appBannerImageKey);
    if (storedImage) setBannerImage(storedImage);
    setOnboarding(getOnboardingData());
  }, []);

  const coupleName = onboarding?.brideName && onboarding?.partnerName ? `${onboarding.brideName} & ${onboarding.partnerName}` : mockCouple.coupleName;
  const weddingDate = onboarding?.weddingDate ? formatWeddingDate(onboarding.weddingDate) : mockCouple.weddingDate;
  const city = onboarding?.city || mockCouple.city;
  const state = onboarding?.state || mockCouple.state;
  const guestCount = onboarding?.guestCount || 140;
  const plannedBudget = onboarding?.plannedBudget || "R$ 70-100 mil";
  const firstName = onboarding?.brideName || "Mari";
  const personalizedBase = buildPersonalizedBase(onboarding);

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
    <div className="space-y-[22px]">
      <section className="relative grid min-h-[320px] overflow-hidden rounded-[28px] bg-[#f7e4d8] p-6 shadow-[0_20px_50px_rgba(153,53,86,0.12)] md:p-14 lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255,253,249,0.96), rgba(255,253,249,0.75), rgba(255,253,249,0.15)), url('${bannerImage}')`
          }}
        />
        <div className="relative">
          <label className="mb-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-bold text-[#d4537e] shadow-[0_8px_20px_rgba(153,53,86,0.10)] backdrop-blur">
            <Camera className="h-4 w-4" aria-hidden />
            Editar foto do banner
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadBannerImage(event.target.files?.[0])} />
          </label>
          <p className="mb-2 text-sm text-[#2a1a1f]">O grande dia de</p>
          <h1 className="mb-[22px] font-serif text-[40px] font-medium leading-none text-[#2a1a1f] md:text-[58px]">
            {coupleName} <span className="text-[#d4537e]">♡</span>
          </h1>

          <div className="mb-[26px] grid gap-2 text-sm text-[#4e3d42]">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {weddingDate}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              {mockCouple.venueName}, {city} - {state}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 md:flex">
            {countdown.map((item) => (
              <div
                key={item.label}
                className="grid h-[68px] place-items-center rounded-[14px] border border-white/70 bg-white/70 text-center backdrop-blur md:h-[72px] md:w-[72px]"
              >
                <div>
                  <strong className="block font-serif text-[28px] leading-none text-[#2a1a1f]">{item.value}</strong>
                  <span className="text-[11px] text-[#7b6a70]">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="relative mt-5 rounded-[22px] border border-white/80 bg-[rgba(255,253,249,0.90)] p-5 shadow-[0_20px_50px_rgba(153,53,86,0.12)] backdrop-blur md:p-[26px] lg:mt-0">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#d4537e]">
            <Sparkles className="h-4 w-4" aria-hidden />
            Sofia
          </div>
          <h2 className="mb-4 font-serif text-[25px] font-medium leading-[1.2] text-[#2a1a1f]">
            Respira, {firstName}. Você está no caminho certo.
          </h2>
          <p className="mb-5 text-sm leading-[1.6] text-[#4d3f44]">
            Montei uma base inicial para {guestCount} convidados, orçamento {plannedBudget} e fornecedores da região de {city}.
          </p>
          <Button asChild className="rounded-xl bg-[#d4537e] px-5 py-[13px] font-bold text-white hover:bg-[#993556]">
            <Link href="/app/tarefas">Ver próximos passos</Link>
          </Button>
        </aside>
      </section>

      <section className="rounded-[24px] border border-[#e8dcd7] bg-[rgba(255,253,249,0.86)] p-[26px] shadow-[0_10px_30px_rgba(153,53,86,0.06)]">
        <div className="mb-[22px] grid gap-[18px] md:grid-cols-[1fr_1fr_auto] md:items-center">
          <div>
            <h2 className="m-0 font-serif text-2xl font-medium text-[#2a1a1f]">Sua jornada ♡</h2>
            <p className="mt-1 text-sm text-[#7b6a70]">Seu planejamento está ganhando forma</p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#f3e8e5]">
            <div className="h-full w-[67%] rounded-full bg-[#d4537e]" />
          </div>
          <strong className="text-[#d4537e]">
            67%
            <br />
            <span className="text-xs">concluído</span>
          </strong>
        </div>

        <div className="grid gap-[22px] border-t border-[#e8dcd7] pt-[22px] sm:grid-cols-2 xl:grid-cols-4">
          {journey.map((item) => (
            <div key={item.label} className="flex items-center gap-[14px]">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#fbeaf0] text-[#d4537e]">
                <item.icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </div>
              <div>
                <strong className="block font-serif text-[28px] font-medium leading-none text-[#2a1a1f]">
                  {item.value}
                </strong>
                <span className="text-xs text-[#7b6a70]">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e8dcd7] bg-white/90 p-[26px] shadow-[0_10px_30px_rgba(153,53,86,0.06)]">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4537e]">Base inicial do casamento</p>
          <h2 className="mt-1 font-serif text-2xl font-medium text-[#2a1a1f]">O Casarei já começou a organizar por você</h2>
          <p className="mt-1 text-sm leading-6 text-[#7b6a70]">
            Criamos uma primeira estrutura com tarefas, categorias financeiras, fornecedores sugeridos e cronograma para o perfil informado no onboarding.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {personalizedBase.map((item) => (
            <Link key={item.title} href={item.href} className="rounded-[20px] border border-[#e8dcd7] bg-[#fff8f4] p-4 transition hover:border-[#f0c5d2] hover:bg-[#fff2f6]">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a716d]">{item.label}</p>
              <h3 className="mt-2 font-serif text-xl text-[#4b1528]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6f5b57]">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-[18px] md:grid-cols-2 xl:grid-cols-4">
        {moduleCards.map((card) => (
          <article
            key={card.title}
            className="relative min-h-[210px] rounded-[22px] border border-[#e8dcd7] bg-[rgba(255,253,249,0.94)] p-6 shadow-[0_12px_30px_rgba(153,53,86,0.06)]"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fbeaf0] text-[#d4537e]">
                <card.icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              </span>
              <h3 className="m-0 font-serif text-[22px] font-medium text-[#2a1a1f]">{card.title}</h3>
            </div>
            <div className="mt-[18px] font-serif text-[38px] leading-none text-[#2a1a1f]">{card.value}</div>
            <p className="mt-2 text-sm leading-[1.4] text-[#7b6a70]">
              {card.text}
              <br />
              {card.detail}
            </p>
            <Button asChild variant="outline" className="mt-4 rounded-xl border-[#f0c5d2] bg-[#fff7f9] font-bold text-[#d4537e] hover:bg-[#fbeaf0]">
              <Link href={card.href}>{card.cta}</Link>
            </Button>
          </article>
        ))}
      </section>

      <section className="flex items-center gap-[22px] rounded-[22px] border border-[#e8dcd7] bg-[linear-gradient(90deg,#fff2f5,#fffaf7)] px-8 py-6">
        <Heart className="h-7 w-7 shrink-0 text-[#d4537e]" strokeWidth={1.6} aria-hidden />
        <div>
          <h3 className="m-0 font-serif text-[22px] font-medium text-[#2a1a1f]">
            Cada pequeno passo aproxima vocês do grande dia.
          </h3>
          <p className="m-0 mt-1 text-sm text-[#7b6a70]">Você não está sozinha. Eu estou aqui por você! ♡</p>
        </div>
      </section>
    </div>
  );
}

function formatWeddingDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(parsed);
}

function buildPersonalizedBase(data: OnboardingData | null) {
  const city = data?.city || "sua cidade";
  const guests = data?.guestCount || 140;
  const budget = data?.plannedBudget || "orçamento inicial";
  const priorities = data?.priorities?.length ? data.priorities.slice(0, 2).join(" e ") : "fotografia e gastronomia";
  const vendors = data?.vendorTypes?.length ? data.vendorTypes.slice(0, 4).join(", ") : "Buffet, fotografia, espaço e decoração";
  const format = data?.weddingFormat || "casamento";

  return [
    { label: "Tarefas", title: "Primeiros passos sugeridos", text: `Cronograma inicial para ${format}: confirmar local, revisar lista e priorizar fornecedores.`, href: "/app/cronograma" },
    { label: "Financeiro", title: `Categorias para ${budget}`, text: `${vendors} já aparecem como categorias editáveis.`, href: "/app/orcamento" },
    { label: "Fornecedores", title: `Sugestões em ${city}`, text: `A busca deve priorizar região, disponibilidade, categoria e faixa de orçamento. Prioridade: ${priorities}.`, href: "/app/fornecedores" },
    { label: "Convidados", title: `${guests} convidados estimados`, text: "A estrutura inicial separa grupos, contatos pendentes e cuidados para buffet.", href: "/app/convidados" }
  ];
}
