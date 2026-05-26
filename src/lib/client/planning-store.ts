"use client";

import { getUserId } from "@/lib/client/supabase-auth";
import type { OnboardingData } from "@/types/onboarding";

export type PlanTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  dueDateIso: string;
  day: number;
  status: "Pendente" | "Concluída" | "Atrasada";
  priority: "Alta" | "Média" | "Baixa";
  kind: "manual" | "sofia" | "sistema";
};

type StoredPlan = {
  generatedAt: string;
  vendorCategories: string[];
  tasks: PlanTask[];
};

function planKey(): string {
  const uid = getUserId();
  return uid ? `casarei:${uid}:wedding-plan` : "casarei:wedding-plan";
}

export function isPlanGenerated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(planKey()));
}

export function getStoredPlan(): StoredPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(planKey());
    if (!raw) return null;
    return JSON.parse(raw) as StoredPlan;
  } catch { return null; }
}

export function getStoredPlanTasks(): PlanTask[] {
  return getStoredPlan()?.tasks ?? [];
}

export function getStoredVendorCategories(): string[] {
  return getStoredPlan()?.vendorCategories ?? [];
}

export function updatePlanTaskStatus(taskId: string, status: PlanTask["status"]): void {
  if (typeof window === "undefined") return;
  const plan = getStoredPlan();
  if (!plan) return;
  const updated: StoredPlan = { ...plan, tasks: plan.tasks.map((t) => t.id === taskId ? { ...t, status } : t) };
  window.localStorage.setItem(planKey(), JSON.stringify(updated));
}

export function addPlanTask(task: PlanTask): void {
  if (typeof window === "undefined") return;
  const plan = getStoredPlan();
  if (!plan) return;
  const updated: StoredPlan = { ...plan, tasks: [task, ...plan.tasks] };
  window.localStorage.setItem(planKey(), JSON.stringify(updated));
}

export function deletePlanTask(taskId: string): void {
  if (typeof window === "undefined") return;
  const plan = getStoredPlan();
  if (!plan) return;
  const updated: StoredPlan = { ...plan, tasks: plan.tasks.filter((t) => t.id !== taskId) };
  window.localStorage.setItem(planKey(), JSON.stringify(updated));
}

export function upsertPlanTask(task: PlanTask): void {
  if (typeof window === "undefined") return;
  const plan = getStoredPlan();
  if (!plan) return;
  const exists = plan.tasks.some((t) => t.id === task.id);
  const updated: StoredPlan = {
    ...plan,
    tasks: exists
      ? plan.tasks.map((t) => t.id === task.id ? task : t)
      : [task, ...plan.tasks],
  };
  window.localStorage.setItem(planKey(), JSON.stringify(updated));
}

// ─── Budget allocation ────────────────────────────────────────────────────────

function budgetKey(): string {
  const uid = getUserId();
  return uid ? `casarei:${uid}:budget-allocation` : "casarei:budget-allocation";
}

export type BudgetAllocation = { [category: string]: number };

export function getBudgetAllocation(): BudgetAllocation {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(budgetKey());
    return raw ? (JSON.parse(raw) as BudgetAllocation) : {};
  } catch { return {}; }
}

export function saveBudgetAllocation(allocation: BudgetAllocation): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(budgetKey(), JSON.stringify(allocation));
}

export function generateAndStorePlan(data: OnboardingData): void {
  if (typeof window === "undefined") return;
  const existing = getStoredPlan();
  const tasks = buildPlan(data, existing?.tasks ?? []);
  const plan: StoredPlan = {
    generatedAt: new Date().toISOString(),
    vendorCategories: data.vendorTypes,
    tasks,
  };
  window.localStorage.setItem(planKey(), JSON.stringify(plan));
}

// ─── Task generation ─────────────────────────────────────────────────────────

type VendorConfig = {
  monthsBefore: number;
  contractTitle: string;
  quoteTitle: string;
  description: string;
  quoteDescription: string;
};

const VENDOR_CONFIG: Record<string, VendorConfig> = {
  "Espaço": {
    monthsBefore: 12,
    contractTitle: "Fechar contrato do espaço",
    quoteTitle: "Solicitar cotações de espaços",
    description: "Espaços para datas populares esgotam com 1 ano de antecedência.",
    quoteDescription: "Compare ao menos 2 espaços na Sofia — pergunte disponibilidade, capacidade e o que está incluso.",
  },
  "Buffet": {
    monthsBefore: 9,
    contractTitle: "Contratar buffet",
    quoteTitle: "Solicitar cotações de buffet",
    description: "Compare cardápio, menu infantil, bebidas e equipe antes de decidir.",
    quoteDescription: "Importe propostas de buffet em Cotações e peça para a Sofia comparar o que cada um entrega.",
  },
  "Fotografia": {
    monthsBefore: 10,
    contractTitle: "Contratar fotógrafo",
    quoteTitle: "Solicitar cotações de fotografia",
    description: "Fotógrafos de qualidade esgotam agenda para datas especiais.",
    quoteDescription: "Importe propostas de fotografia e use a Sofia para comparar estilo, incluso e custo-benefício.",
  },
  "Filmagem": {
    monthsBefore: 10,
    contractTitle: "Contratar cinegrafista",
    quoteTitle: "Solicitar cotações de filmagem",
    description: "Combine com o fotógrafo para garantir harmonia e sem conflito no dia.",
    quoteDescription: "Compare propostas de filmagem em Cotações — verifique formato de entrega e o que inclui.",
  },
  "Decoração": {
    monthsBefore: 8,
    contractTitle: "Contratar decorador",
    quoteTitle: "Solicitar cotações de decoração",
    description: "Prepare referências de estilo antes de reunir com decoradores.",
    quoteDescription: "Compare propostas de decoração — estilo, incluso e prazos fazem muita diferença.",
  },
  "Cerimonial": {
    monthsBefore: 10,
    contractTitle: "Contratar cerimonialista",
    quoteTitle: "Solicitar cotações de cerimonial",
    description: "O cerimonialista vai orquestrar cada momento do dia.",
    quoteDescription: "Compare cerimonialistas — pergunte como conduzem o dia, o que inclui e experiência anterior.",
  },
  "Música/DJ": {
    monthsBefore: 8,
    contractTitle: "Contratar DJ ou banda",
    quoteTitle: "Solicitar cotações de DJ / banda",
    description: "O DJ define o ritmo da festa. Combine horários e playlist especial.",
    quoteDescription: "Compare DJ e banda em Cotações — horário disponível, repertório e equipamento incluso.",
  },
  "Beleza": {
    monthsBefore: 6,
    contractTitle: "Contratar equipe de beleza",
    quoteTitle: "Solicitar cotações de beleza",
    description: "Reserve data para prova de maquiagem e penteado com antecedência.",
    quoteDescription: "Compare maquiagem e cabelo — pergunte se inclui trial, desmontagem e quantas noivas atende.",
  },
  "Vestido": {
    monthsBefore: 9,
    contractTitle: "Escolher e encomendar vestido",
    quoteTitle: "Agendar provas de vestido",
    description: "Ajustes e confecção levam tempo — comece o quanto antes.",
    quoteDescription: "Agende provas e compare ateliers em Cotações antes de encomendar.",
  },
  "Convites": {
    monthsBefore: 5,
    contractTitle: "Encomendar convites",
    quoteTitle: "Solicitar orçamentos de convites",
    description: "Envie com pelo menos 2 meses de antecedência para os convidados.",
    quoteDescription: "Compare papelaria e impressão em Cotações — peça prazo de entrega de cada fornecedor.",
  },
  "Doces e bolo": {
    monthsBefore: 6,
    contractTitle: "Contratar confeitaria",
    quoteTitle: "Solicitar cotações de confeitaria",
    description: "Agende degustação antes de tomar a decisão final.",
    quoteDescription: "Compare doces e bolo em Cotações — pergunte prazo de confirmação do cardápio e degustação.",
  },
  "Bar e drinks": {
    monthsBefore: 6,
    contractTitle: "Contratar bar / drinks",
    quoteTitle: "Solicitar cotações de bar e bebidas",
    description: "Defina bebidas e barman junto ou separado do buffet.",
    quoteDescription: "Compare bar em Cotações — verifique o que está incluso e o estilo de serviço.",
  },
  "Celebrante": {
    monthsBefore: 9,
    contractTitle: "Contratar celebrante",
    quoteTitle: "Solicitar cotações de celebrante",
    description: "Personalize a cerimônia com alguém que conta a história de vocês.",
    quoteDescription: "Compare celebrantes em Cotações — estilo, experiência e como personaliza cada cerimônia.",
  },
  "Transporte": {
    monthsBefore: 4,
    contractTitle: "Contratar transporte",
    quoteTitle: "Solicitar cotações de transporte",
    description: "Organize o traslado de convidados entre cerimônia e festa.",
    quoteDescription: "Compare transporte em Cotações — capacidade, pontualidade e valor por trecho.",
  },
};

type GeneralTaskConfig = {
  id: string;
  monthsBefore: number;
  title: string;
  description: string;
  category: string;
  priority: "Alta" | "Média" | "Baixa";
  kind: "manual" | "sofia" | "sistema";
};

const GENERAL_TASKS: GeneralTaskConfig[] = [
  { id: "plano-orcamento", monthsBefore: 11, title: "Dividir orçamento por categoria", description: "Distribua o orçamento total entre os fornecedores antes de pedir cotações.", category: "Financeiro", priority: "Alta", kind: "sofia" },
  { id: "plano-convidados", monthsBefore: 10, title: "Montar lista inicial de convidados", description: "Liste todos os possíveis convidados antes de cortar ou ajustar.", category: "Convidados", priority: "Alta", kind: "sistema" },
  { id: "plano-save-date", monthsBefore: 6, title: "Enviar save the date", description: "Avise os convidados com antecedência da data e local.", category: "Convites", priority: "Média", kind: "sofia" },
  { id: "plano-confirmar-lista", monthsBefore: 3, title: "Confirmar lista de convidados", description: "Feche a lista antes do buffet definir o número de pessoas.", category: "Convidados", priority: "Alta", kind: "sistema" },
  { id: "plano-enviar-convites", monthsBefore: 3, title: "Enviar convites", description: "Envie convites formais com pelo menos 2 meses de antecedência.", category: "Convites", priority: "Média", kind: "manual" },
  { id: "plano-revisao-final", monthsBefore: 1, title: "Revisão final com todos os fornecedores", description: "Confirme horários, entregas e detalhes de cada contrato.", category: "Fornecedores", priority: "Alta", kind: "sistema" },
  { id: "plano-cronograma-dia", monthsBefore: 1, title: "Montar cronograma do dia do casamento", description: "Defina o horário de cada momento da cerimônia e festa.", category: "Cerimonial", priority: "Alta", kind: "sofia" },
];

function buildPlan(data: OnboardingData, existingTasks: PlanTask[]): PlanTask[] {
  if (!data.weddingDate) return [];

  const weddingDate = new Date(`${data.weddingDate}T12:00:00`);
  const today = new Date();
  const tasks: PlanTask[] = [];
  const existingStatusMap = new Map(existingTasks.map((t) => [t.id, t.status]));
  const highPriority = new Set(data.priorities);

  function makeTask(id: string, title: string, description: string, category: string, monthsBefore: number, priority: "Alta" | "Média" | "Baixa", kind: "manual" | "sofia" | "sistema"): PlanTask {
    const due = subtractMonths(weddingDate, monthsBefore);
    const naturalStatus: PlanTask["status"] = due < today ? "Atrasada" : "Pendente";
    const status = existingStatusMap.get(id) ?? naturalStatus;
    return {
      id,
      title,
      description,
      category,
      dueDate: formatDueLabel(due, naturalStatus),
      dueDateIso: toIso(due),
      day: due.getDate(),
      status,
      priority,
      kind,
    };
  }

  // General tasks for all weddings
  for (const cfg of GENERAL_TASKS) {
    tasks.push(makeTask(cfg.id, cfg.title, cfg.description, cfg.category, cfg.monthsBefore, cfg.priority, cfg.kind));
  }

  // Vendor-specific tasks
  for (const vendorType of data.vendorTypes) {
    const cfg = VENDOR_CONFIG[vendorType];
    if (!cfg) continue;
    const priority: "Alta" | "Média" = highPriority.has(vendorType) ? "Alta" : "Média";
    const slug = vendorType.toLowerCase().replace(/[\s/]+/g, "-");

    // Quote task (2 months before contract deadline)
    tasks.push(makeTask(
      `plano-cotacao-${slug}`,
      cfg.quoteTitle,
      cfg.quoteDescription,
      vendorType,
      cfg.monthsBefore + 2,
      priority,
      "sofia",
    ));

    // Contract task
    tasks.push(makeTask(
      `plano-contratar-${slug}`,
      cfg.contractTitle,
      cfg.description,
      vendorType,
      cfg.monthsBefore,
      priority,
      "sistema",
    ));
  }

  // Preserve any manual tasks created by the user
  const generatedIds = new Set(tasks.map((t) => t.id));
  const manualTasks = existingTasks.filter((t) => t.kind === "manual" && !generatedIds.has(t.id));
  tasks.push(...manualTasks);

  return tasks.sort((a, b) => a.dueDateIso.localeCompare(b.dueDateIso));
}

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDueLabel(date: Date, status: "Pendente" | "Atrasada"): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(date);
  return status === "Atrasada" ? `Atrasado — era ${formatted}` : `Até ${formatted}`;
}
