import type { PlanningMapCategory, PlanningMapFiltersState, PlanningMapTask, PlanningMonthGroup } from "@/types/planning-map";

export const planningMapCategories: Array<"Todas" | PlanningMapCategory> = [
  "Todas",
  "Orçamento",
  "Convidados",
  "Local",
  "Buffet",
  "Fotografia",
  "Decoração",
  "Beleza",
  "Vestido",
  "Cerimônia",
  "Música",
  "Documentos",
  "Cotações",
  "Fornecedores",
  "Lua de mel",
  "Outros"
];

export const defaultPlanningMapFilters: PlanningMapFiltersState = {
  category: "Todas",
  status: "Todas",
  source: "Todas",
  showRemoved: false
};

export const planningMonthGroups: PlanningMonthGroup[] = [];
export const mockPlanningMapTasks: PlanningMapTask[] = [];
