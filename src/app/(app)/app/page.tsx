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

import { getOnboardingData, getSession, saveOnboardingData } from "@/lib/client/supabase-auth";
import { getStoredGuests } from "@/lib/client/guests-store";
import { getStoredPlanTasks, type PlanTask } from "@/lib/client/planning-store";
import { getStoredVendors } from "@/lib/client/vendors-store";
import type { OnboardingData } from "@/types/onboarding";

const DAILY_TIPS = [
  "Dica: Feche os principais fornecedores com pelo menos 8 meses de antecedência — espaços e fotógrafos esgotam rápido.",
  "Dica: Antes de pedir cotações, defina um valor máximo por categoria. Facilita muito a comparação.",
  "Dica: Confirme os convidados em dois momentos: save the date e convite formal. Reduza as surpresas no buffet.",
  "Dica: Guarde os contratos digitalizados no Google Drive ou similar. Você vai precisar deles na revisão final.",
  "Dica: Visite o espaço no mesmo horário do seu casamento para ver a iluminação real.",
  "Dica: Peça ao fotógrafo referências de trabalhos em locais parecidos com o seu. Iluminação muda tudo.",
  "Dica: Reserve uma linha extra no orçamento (10–15%) para imprevistos. Eles aparecem.",
  "Dica: O cronograma do dia deve ser testado com o cerimonialista pelo menos duas vezes antes do casamento.",
  "Dica: Confirme a capacidade do espaço incluindo equipe, fotógrafo e DJ — não só convidados.",
  "Dica: Comunique restrições alimentares ao buffet com no mínimo 2 semanas de antecedência.",
  "Dica: Faça uma lista separada dos convidados que precisam de transporte — facilita o planejamento.",
  "Dica: Crie um grupo de WhatsApp com os fornecedores principais para facilitar a comunicação no dia.",
  "Dica: Revise cada contrato antes de assinar: o que está e o que não está incluído no valor.",
  "Dica: Agende a prova do vestido com pelo menos 3 meses de antecedência para ter tempo de ajustes.",
  "Dica: Anote os momentos obrigatórios para o fotógrafo: entrada, troca de alianças, primeiro beijo, bolo.",
  "Dica: Considere um dia de folga logo depois do casamento antes de viajar — você vai precisar descansar.",
  "Dica: Negocie o que está incluído no buffet: mesa dos noivos, cortador de bolo, guardanapos personalizados.",
  "Dica: Tenha um kit emergência no dia: alfinetes, fita dupla face, analgésico, carregador portátil.",
  "Dica: Decida quem será o ponto de contato com os fornecedores no dia — não precisa ser você.",
  "Dica: Revise a lista de convidados junto com seu parceiro — memórias e obrigações de cada lado do casal importam.",
  "Dica: Faça ao menos três cotações por categoria antes de fechar. Diferenças de preço e serviço surpreendem.",
  "Dica: Convites digitais podem economizar e chegam mais rápido — considere para quem mora longe.",
  "Dica: Coloque uma caixa de sugestões de músicas no convite — os convidados adoram participar.",
  "Dica: Planeje a chegada ao espaço com 1h de antecedência para resolver qualquer imprevisto com calma.",
  "Dica: Defina claramente o estilo visual do casamento antes de contratar o decorador — referências visuais evitam retrabalho.",
  "Dica: Se contratar DJ, peça setlist com os 5 momentos-chave: entrada, jantar, festa, último dance, saída.",
  "Dica: Tenha um plano B para chuva se for cerimônia ao ar livre — e comunique aos fornecedores antecipadamente.",
];

function getDailyTip(): string {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000);
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

const QUICK_ACTIONS = [
  { label: "Convidados", href: "/app/convidados", icon: Users, color: "#EEF1F4", iconColor: "#6E7F91" },
  { label: "Fornecedores", href: "/app/fornecedores", icon: Store, color: "#EEF3EA", iconColor: "#5F7752" },
  { label: "Financeiro", href: "/app/orcamento", icon: Wallet, color: "#F8E7EC", iconColor: "#D96C8A" },
  { label: "Agenda", href: "/app/cronograma", icon: CheckSquare, color: "#FBEEE8", iconColor: "#B96F52" },
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
  const [tasksDone, setTasksDone] = useState(0);
  const [nextTask, setNextTask] = useState<PlanTask | null>(null);
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const dailyTip = useMemo(() => getDailyTip(), []);

  useEffect(() => {
    setOnboarding(getOnboardingData());
    setGuestCount(getStoredGuests().length);
    setVendorCount(getStoredVendors().length);
    const planTasks = getStoredPlanTasks();
    setTasksDone(planTasks.filter((t) => t.status === "Concluída").length);
    const pending = planTasks.filter((t) => t.status === "Pendente" || t.status === "Atrasada");
    pending.sort((a, b) => {
      if (a.status === "Atrasada" && b.status !== "Atrasada") return -1;
      if (b.status === "Atrasada" && a.status !== "Atrasada") return 1;
      return a.dueDateIso.localeCompare(b.dueDateIso);
    });
    setNextTask(pending[0] ?? null);
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
  function saveDate() {
    if (!dateInput) return;
    const base: OnboardingData = onboarding ?? {
      fullName: "", phone: "", email: "", city: "", state: "",
      styles: [], brideName: "", partnerName: "", weddingDate: "",
      weddingDateMode: "exact", guestRange: "", guestCount: 0,
      weddingFormat: "", ceremonyType: "", partySize: "",
      vendorTypes: [], priorities: [], plannedBudget: "",
    };
    const updated = { ...base, weddingDate: dateInput };
    saveOnboardingData(updated);
    setOnboarding(updated);
    setEditingDate(false);
  }

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
          </div>
        )}

        {editingDate ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white outline-none"
            />
            <button type="button" onClick={saveDate} className="rounded-xl bg-white/25 px-3 py-2 text-xs font-bold text-white">Salvar</button>
            <button type="button" onClick={() => setEditingDate(false)} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/60">✕</button>
          </div>
        ) : (
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
            <button
              type="button"
              onClick={() => { setDateInput(onboarding?.weddingDate ?? ""); setEditingDate(true); }}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70 transition hover:bg-white/20"
            >
              <CalendarDays className="h-3 w-3" />
              {daysLeft !== null ? "Editar data" : "Definir data"}
            </button>
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
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wide">Dica do dia</p>
              <p className="mt-0.5 text-sm leading-[1.55] text-white/85">
                {dailyTip}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats rápidas ── */}
      <div className="grid grid-cols-3 gap-2">
        <StatPill value={String(guestCount)} label="convidados" />
        <StatPill value={String(tasksDone)} label="tarefas feitas" />
        <StatPill value={String(vendorCount)} label="fornecedores" />
      </div>

      {/* ── Próxima tarefa do planejamento ── */}
      {nextTask && (
        <Link
          href="/app/cronograma"
          className="flex items-start gap-3 rounded-[20px] bg-white px-4 py-4 ring-1 ring-[#EEE6E1] active:scale-[0.98] transition"
          style={{ boxShadow: "0 4px 18px rgba(75,46,43,0.06)" }}
        >
          <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[10px] font-bold ${nextTask.status === "Atrasada" ? "bg-[#F8E7EC] text-[#D96C8A]" : "bg-[#F0EAE4] text-[#8A716D]"}`}>
            {nextTask.status === "Atrasada" ? "!" : "→"}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${nextTask.status === "Atrasada" ? "text-[#D96C8A]" : "text-[#8A716D]"}`}>
              {nextTask.status === "Atrasada" ? "Atrasada" : "Próxima tarefa"} · {nextTask.category}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#4B2E2B]">{nextTask.title}</p>
            <p className="mt-0.5 text-xs text-[#8A716D]">{nextTask.dueDate}</p>
          </div>
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#C4B0AA]" />
        </Link>
      )}

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
