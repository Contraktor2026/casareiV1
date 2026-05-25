import type { PlanningSuggestion, ScheduleCategory, SchedulePeriod, SchedulePriority, ScheduleTask } from "@/types/schedule";

export const schedulePeriods = ["Visão geral", "Esta semana", "Este mês", "Mais pra frente"] as const;

export const scheduleCategories: Array<"Todas" | ScheduleCategory> = [
  "Todas",
  "Cerimônia",
  "Recepção",
  "Convidados",
  "Beleza",
  "Fornecedores",
  "Documentos",
  "Outros"
];

export const fullScheduleCategories: ScheduleCategory[] = [
  "Cerimônia",
  "Recepção",
  "Convidados",
  "Beleza",
  "Fornecedores",
  "Documentos",
  "Orçamento",
  "Cotações",
  "Outros"
];

export const schedulePriorities: SchedulePriority[] = ["Alta", "Média", "Baixa"];
export const schedulePeriodOptions: SchedulePeriod[] = ["Esta semana", "Este mês", "Mais pra frente"];
export const mockScheduleTasks: ScheduleTask[] = [];
export const mockPlanningSuggestions: PlanningSuggestion[] = [];
