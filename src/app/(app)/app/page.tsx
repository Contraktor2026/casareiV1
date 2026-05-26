"use client";

import Link from "next/link";
import {
  AlertCircle,
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
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getOnboardingData, getSession, getUserId, saveOnboardingData } from "@/lib/client/supabase-auth";
import { getStoredGuests } from "@/lib/client/guests-store";
import { getBudgetAllocation, getStoredPlanTasks } from "@/lib/client/planning-store";
import { getStoredProposals } from "@/lib/client/quotes-store";
import { getStoredVendors } from "@/lib/client/vendors-store";
import type { OnboardingData } from "@/types/onboarding";

// ── helpers ──────────────────────────────────────────────────────────────────

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

function parseBudgetRange(range: string): number {
  const nums = (range.match(/\d+/g) ?? []).map(Number);
  if (nums.length === 0) return 0;
  const thousands = range.toLowerCase().includes("mil") ? 1000 : 1;
  if (nums.length === 1) return nums[0] * thousands;
  return Math.round((nums[0] + nums[1]) / 2) * thousands;
}

function formatBRL(n: number): string {
  if (n >= 1000) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);
  }
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

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

// ── types ─────────────────────────────────────────────────────────────────────

type DashStats = {
  guestsTotal: number;
  guestsConfirmed: number;
  vendorsTotal: number;
  vendorsClosed: number;
  vendorsPendingContract: number;
  tasksPending: number;
  tasksOverdue: number;
  nextTask: { title: string; dueDate: string } | null;
  budgetTotal: number;
  budgetCommitted: number;
  proposalsCount: number;
  paymentsOverdue: { vendorName: string; amount: number }[];
  paymentsSoon: { vendorName: string; amount: number; daysLeft: number }[];
};

type Alert = { label: string; sub: string; href: string; severity: "critical" | "warning" };

function computeAlert(s: DashStats): Alert | null {
  if (s.paymentsOverdue.length > 0) {
    const count = s.paymentsOverdue.length;
    return {
      label: `${count} pagamento${count > 1 ? "s" : ""} atrasado${count > 1 ? "s" : ""}`,
      sub: s.paymentsOverdue[0].vendorName,
      href: "/app/orcamento",
      severity: "critical",
    };
  }
  if (s.tasksOverdue > 0) {
    return {
      label: `${s.tasksOverdue} tarefa${s.tasksOverdue > 1 ? "s" : ""} atrasada${s.tasksOverdue > 1 ? "s" : ""}`,
      sub: "Ver no cronograma",
      href: "/app/cronograma",
      severity: "critical",
    };
  }
  if (s.paymentsSoon.length > 0) {
    const p = s.paymentsSoon[0];
    return {
      label: `Pagamento em ${p.daysLeft} dia${p.daysLeft > 1 ? "s" : ""}`,
      sub: `${p.vendorName} · ${formatBRL(p.amount)}`,
      href: "/app/orcamento",
      severity: "warning",
    };
  }
  if (s.vendorsPendingContract > 0) {
    return {
      label: `${s.vendorsPendingContract} contrato${s.vendorsPendingContract > 1 ? "s" : ""} não assinado${s.vendorsPendingContract > 1 ? "s" : ""}`,
      sub: "Fornecedor fechado sem contrato",
      href: "/app/fornecedores",
      severity: "warning",
    };
  }
  return null;
}

// ── component ─────────────────────────────────────────────────────────────────

const CLOSED_STATUSES = ["Fechado", "Contrato pendente", "Contrato assinado", "Pagamento pendente", "Pago", "Finalizado"];

export default function DashboardPage() {
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [stats, setStats] = useState<DashStats>({
    guestsTotal: 0, guestsConfirmed: 0,
    vendorsTotal: 0, vendorsClosed: 0, vendorsPendingContract: 0,
    tasksPending: 0, tasksOverdue: 0, nextTask: null,
    budgetTotal: 0, budgetCommitted: 0, proposalsCount: 0,
    paymentsOverdue: [], paymentsSoon: [],
  });
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [firstSteps, setFirstSteps] = useState({ budgetSet: false, guestsSet: false, quotesSet: false, dismissed: false });
  const [alertDismissed, setAlertDismissed] = useState(false);
  const dailyTip = useMemo(() => getDailyTip(), []);

  useEffect(() => {
    const ob = getOnboardingData();
    setOnboarding(ob);

    // Guests
    const guests = getStoredGuests();
    const guestsConfirmed = guests.filter((g) => g.rsvp.status === "confirmed").length;

    // Vendors
    const vendors = getStoredVendors();
    const vendorsClosed = vendors.filter((v) => CLOSED_STATUSES.includes(v.status)).length;
    const vendorsPendingContract = vendors.filter(
      (v) => CLOSED_STATUSES.includes(v.status) && !v.contract.signed
    ).length;

    // Payments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString().slice(0, 10);
    const in7daysIso = new Date(today.getTime() + 7 * 86_400_000).toISOString().slice(0, 10);
    const paymentsOverdue: DashStats["paymentsOverdue"] = [];
    const paymentsSoon: DashStats["paymentsSoon"] = [];
    vendors.forEach((v) => {
      v.payments.forEach((p) => {
        if (p.status === "pago" || !p.dueDate) return;
        if (p.dueDate < todayIso) {
          paymentsOverdue.push({ vendorName: v.name, amount: p.amount });
        } else if (p.dueDate <= in7daysIso) {
          const daysLeft = Math.ceil(
            (new Date(`${p.dueDate}T12:00:00`).getTime() - today.getTime()) / 86_400_000
          );
          paymentsSoon.push({ vendorName: v.name, amount: p.amount, daysLeft });
        }
      });
    });
    paymentsSoon.sort((a, b) => a.daysLeft - b.daysLeft);

    // Budget
    const budgetTotal = parseBudgetRange(ob?.plannedBudget ?? "");
    const budgetCommitted = vendors.reduce((sum, v) => sum + v.totalValue, 0);

    // Tasks
    const planTasks = getStoredPlanTasks();
    const pending = planTasks.filter((t) => t.status === "Pendente" || t.status === "Atrasada");
    const overdue = planTasks.filter((t) => t.status === "Atrasada");
    pending.sort((a, b) => {
      if (a.status === "Atrasada" && b.status !== "Atrasada") return -1;
      if (b.status === "Atrasada" && a.status !== "Atrasada") return 1;
      return a.dueDateIso.localeCompare(b.dueDateIso);
    });
    const nextTask = pending[0] ? { title: pending[0].title, dueDate: pending[0].dueDate } : null;

    // Proposals
    const proposals = getStoredProposals();

    // First steps
    const uid = getUserId();
    const dismissKey = uid ? `casarei:${uid}:first-steps-dismissed` : "casarei:first-steps-dismissed";
    const dismissed = typeof window !== "undefined" && window.localStorage.getItem(dismissKey) === "1";
    const allocation = getBudgetAllocation();

    setStats({
      guestsTotal: guests.length,
      guestsConfirmed,
      vendorsTotal: vendors.length,
      vendorsClosed,
      vendorsPendingContract,
      tasksPending: pending.length,
      tasksOverdue: overdue.length,
      nextTask,
      budgetTotal,
      budgetCommitted,
      proposalsCount: proposals.length,
      paymentsOverdue,
      paymentsSoon,
    });

    setFirstSteps({
      budgetSet: Object.keys(allocation).length > 0,
      guestsSet: guests.length > 0,
      quotesSet: proposals.length > 0 || vendors.length > 0,
      dismissed,
    });
  }, []);

  function dismissFirstSteps() {
    const uid = getUserId();
    const dismissKey = uid ? `casarei:${uid}:first-steps-dismissed` : "casarei:first-steps-dismissed";
    if (typeof window !== "undefined") window.localStorage.setItem(dismissKey, "1");
    setFirstSteps((prev) => ({ ...prev, dismissed: true }));
  }

  const session = typeof window !== "undefined" ? getSession() : null;
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

  const alert = useMemo(() => computeAlert(stats), [stats]);
  const budgetPct = stats.budgetTotal > 0 ? Math.min(100, Math.round((stats.budgetCommitted / stats.budgetTotal) * 100)) : 0;

  // Cards with live data
  const cards = [
    {
      title: "Orçamentos",
      href: "/app/cotacoes",
      icon: Scale,
      bg: "#2A1A1F",
      iconColor: "#F3A8C2",
      dark: true,
      stat: stats.proposalsCount > 0 ? String(stats.proposalsCount) : "—",
      statLabel: stats.proposalsCount > 0
        ? `proposta${stats.proposalsCount > 1 ? "s" : ""} para analisar`
        : "Adicione suas cotações",
      alert: false,
      bar: null,
    },
    {
      title: "Fornecedores",
      href: "/app/fornecedores",
      icon: Store,
      bg: "#EEF3EA",
      iconColor: "#5F7752",
      dark: false,
      stat: String(stats.vendorsClosed),
      statLabel: `fechado${stats.vendorsClosed !== 1 ? "s" : ""} de ${stats.vendorsTotal}`,
      alert: stats.vendorsPendingContract > 0,
      bar: stats.vendorsTotal > 0 ? Math.round((stats.vendorsClosed / stats.vendorsTotal) * 100) : null,
    },
    {
      title: "Convidados",
      href: "/app/convidados",
      icon: Users,
      bg: "#EEF1F4",
      iconColor: "#6E7F91",
      dark: false,
      stat: stats.guestsTotal > 0 ? String(stats.guestsConfirmed) : "—",
      statLabel: stats.guestsTotal > 0
        ? `confirmado${stats.guestsConfirmed !== 1 ? "s" : ""} de ${stats.guestsTotal}`
        : "Adicione convidados",
      alert: false,
      bar: stats.guestsTotal > 0 ? Math.round((stats.guestsConfirmed / stats.guestsTotal) * 100) : null,
    },
    {
      title: "Financeiro",
      href: "/app/orcamento",
      icon: Wallet,
      bg: "#F8E7EC",
      iconColor: "#D96C8A",
      dark: false,
      stat: stats.budgetCommitted > 0 ? formatBRL(stats.budgetCommitted) : "—",
      statLabel: stats.budgetTotal > 0 ? `de ${formatBRL(stats.budgetTotal)}` : "orçamento não definido",
      alert: stats.paymentsOverdue.length > 0,
      bar: budgetPct > 0 ? budgetPct : null,
    },
    {
      title: "Agenda",
      href: "/app/cronograma",
      icon: CheckSquare,
      bg: "#FBEEE8",
      iconColor: "#B96F52",
      dark: false,
      stat: String(stats.tasksPending),
      statLabel: stats.tasksOverdue > 0
        ? `pendentes · ${stats.tasksOverdue} atrasada${stats.tasksOverdue > 1 ? "s" : ""}`
        : `pendente${stats.tasksPending !== 1 ? "s" : ""}`,
      alert: stats.tasksOverdue > 0,
      bar: null,
    },
    {
      title: "Presença & Mesas",
      href: "/app/presenca-mesas",
      icon: ClipboardList,
      bg: "#EDEAF7",
      iconColor: "#7B68C8",
      dark: false,
      stat: stats.guestsTotal > 0 ? String(stats.guestsTotal) : "—",
      statLabel: "convidados na lista",
      alert: false,
      bar: null,
    },
  ];

  return (
    <div className="space-y-4">

      {/* ── Hero: countdown ── */}
      <section
        className="relative overflow-hidden rounded-[24px] p-6 text-white"
        style={{ background: "linear-gradient(145deg, #4B2E2B 0%, #2E1A18 100%)" }}
      >
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
            <p className="text-sm font-medium text-white/65">{daysLeft === 1 ? "dia" : "dias"}</p>
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

        {/* Dica do dia */}
        <div className="mt-5 rounded-[18px] bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
              style={{ background: "linear-gradient(135deg, #D96C8A, #B85070)" }}
            >
              <Sparkles className="h-4 w-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-white/50">Dica do dia</p>
              <p className="mt-0.5 text-sm leading-[1.55] text-white/85">{dailyTip}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alert inteligente ── */}
      {alert && !alertDismissed && (
        <Link
          href={alert.href}
          className="flex items-center gap-3 rounded-[18px] px-4 py-3.5"
          style={{
            background: alert.severity === "critical" ? "#FFF1F1" : "#FFF8EC",
            outline: `1px solid ${alert.severity === "critical" ? "#FBCACA" : "#F7E0B0"}`,
          }}
        >
          <AlertCircle
            className="h-5 w-5 shrink-0"
            style={{ color: alert.severity === "critical" ? "#D94A4A" : "#C97B1A" }}
            strokeWidth={2}
          />
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-bold leading-none"
              style={{ color: alert.severity === "critical" ? "#B83A3A" : "#A86010" }}
            >
              {alert.label}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: alert.severity === "critical" ? "#C55050" : "#B87820" }}>
              {alert.sub}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ChevronRight className="h-4 w-4" style={{ color: alert.severity === "critical" ? "#D94A4A" : "#C97B1A" }} />
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setAlertDismissed(true); }}
              className="ml-1 grid h-6 w-6 place-items-center rounded-full bg-black/5"
              aria-label="Fechar alerta"
            >
              <X className="h-3.5 w-3.5" style={{ color: alert.severity === "critical" ? "#B83A3A" : "#A86010" }} />
            </button>
          </div>
        </Link>
      )}

      {/* ── Stats rápidas ── */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          value={stats.guestsTotal > 0 ? String(stats.guestsConfirmed) : "—"}
          label="confirmados"
          sub={stats.guestsTotal > 0 ? `de ${stats.guestsTotal}` : "convidados"}
          valueColor="#5F7752"
        />
        <StatCard
          value={String(stats.tasksPending)}
          label="pendentes"
          sub={stats.tasksOverdue > 0 ? `${stats.tasksOverdue} atrasada${stats.tasksOverdue > 1 ? "s" : ""}` : "tarefas"}
          valueColor={stats.tasksOverdue > 0 ? "#D94A4A" : stats.tasksPending > 0 ? "#C97B1A" : "#5F7752"}
        />
        <StatCard
          value={String(stats.vendorsClosed)}
          label="fechados"
          sub={`de ${stats.vendorsTotal}`}
          valueColor="#7B68C8"
        />
      </div>

      {/* ── Primeiros passos ── */}
      {!firstSteps.dismissed && !(firstSteps.budgetSet && firstSteps.guestsSet && firstSteps.quotesSet) && (
        <section
          className="rounded-[20px] bg-white p-5 ring-1 ring-[#EEE6E1]"
          style={{ boxShadow: "0 4px 20px rgba(75,46,43,0.06)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D96C8A]">Por onde começar</p>
              <h2 className="mt-0.5 font-serif text-xl text-[#4B2E2B]">3 primeiros passos do planejamento</h2>
            </div>
            <button type="button" onClick={dismissFirstSteps} className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F5EFEb] text-[#8A716D]" aria-label="Fechar">
              ×
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { done: firstSteps.budgetSet, href: "/app/orcamento", icon: "💰", title: "Distribuir o orçamento", sub: "Defina quanto reservar para cada fornecedor" },
              { done: firstSteps.guestsSet, href: "/app/convidados", icon: "👥", title: "Montar a lista de convidados", sub: "A quantidade de pessoas define quase tudo" },
              { done: firstSteps.quotesSet, href: "/app/cotacoes", icon: "📋", title: "Solicitar as primeiras cotações", sub: "Compare propostas com a IA e feche fornecedores" },
            ].map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className={`flex items-center gap-3 rounded-[14px] px-3 py-3 transition active:bg-[#F8F4F1] ${step.done ? "opacity-60" : ""}`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-base ${step.done ? "bg-[#EAF3DE]" : "bg-[#F8E7EC]"}`}>
                  {step.done ? "✓" : step.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold ${step.done ? "text-[#9E8880] line-through" : "text-[#4B2E2B]"}`}>{step.title}</span>
                  {!step.done && <span className="mt-0.5 block text-xs text-[#8A716D]">{step.sub}</span>}
                </span>
                {!step.done && <ChevronRight className="h-4 w-4 shrink-0 text-[#C4B0AA]" />}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Módulos ── */}
      <section>
        <h2 className="mb-3 text-[13px] font-bold text-[#4B2E2B]">Módulos</h2>
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="relative flex flex-col rounded-[22px] p-4 transition active:scale-[0.97]"
                style={{
                  background: card.dark ? card.bg : "#fff",
                  boxShadow: card.dark
                    ? "0 8px 28px rgba(42,26,31,0.30)"
                    : "0 4px 18px rgba(75,46,43,0.07)",
                  outline: card.dark ? "none" : "1px solid #EEE6E1",
                }}
              >
                {/* Alert dot */}
                {card.alert && (
                  <span className="absolute right-3.5 top-3.5 h-2.5 w-2.5 rounded-full bg-[#D94A4A] ring-2 ring-white" />
                )}

                {/* Icon */}
                <span
                  className="grid h-11 w-11 place-items-center rounded-[14px]"
                  style={{ background: card.dark ? "rgba(255,255,255,0.12)" : card.bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: card.iconColor }} strokeWidth={1.8} />
                </span>

                {/* Title */}
                <p className={`mt-3 font-serif text-base leading-snug ${card.dark ? "text-white" : "text-[#4B2E2B]"}`}>
                  {card.title}
                </p>

                {/* Live stat */}
                <p className={`mt-1.5 font-serif text-2xl font-semibold leading-none ${card.dark ? "text-white" : "text-[#4B2E2B]"}`}>
                  {card.stat}
                </p>
                <p className={`mt-1 text-[11px] leading-snug ${card.dark ? "text-white/55" : "text-[#8A716D]"}`}>
                  {card.statLabel}
                </p>

                {/* Progress bar */}
                {card.bar !== null && (
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${card.bar}%`,
                        background: card.dark ? "rgba(243,168,194,0.8)" : card.iconColor,
                      }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}

// ── sub-components ─────────────────────────────────────────────────────────────

function StatCard({ value, label, sub, valueColor }: { value: string; label: string; sub: string; valueColor: string }) {
  return (
    <article
      className="rounded-[18px] bg-white px-3 py-3.5 text-center ring-1 ring-[#EEE6E1]"
      style={{ boxShadow: "0 2px 10px rgba(75,46,43,0.05)" }}
    >
      <strong className="block font-serif text-[26px] leading-none" style={{ color: valueColor }}>{value}</strong>
      <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.06em] text-[#4B2E2B]">{label}</span>
      <span className="mt-0.5 block text-[10px] text-[#A8918C]">{sub}</span>
    </article>
  );
}
