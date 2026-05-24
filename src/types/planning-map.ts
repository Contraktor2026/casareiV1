export type PlanningMapCategory =
  | "Orçamento"
  | "Convidados"
  | "Local"
  | "Buffet"
  | "Fotografia"
  | "Decoração"
  | "Beleza"
  | "Vestido"
  | "Cerimônia"
  | "Música"
  | "Documentos"
  | "Cotações"
  | "Fornecedores"
  | "Lua de mel"
  | "Outros";

export type PlanningMapPriority = "Alta" | "Média" | "Baixa";

export type PlanningMapStatus = "Pendente" | "Concluída" | "Atrasada" | "Removida";

export type PlanningMapSource = "sofia" | "manual";

export type PlanningMonthId =
  | "14-meses"
  | "12-meses"
  | "9-meses"
  | "6-meses"
  | "3-meses"
  | "1-mes"
  | "semana"
  | "depois";

export type PlanningMapTask = {
  id: string;
  title: string;
  description: string;
  category: PlanningMapCategory;
  monthGroup: PlanningMonthId;
  priority: PlanningMapPriority;
  status: PlanningMapStatus;
  source: PlanningMapSource;
  suggestedBySofia: boolean;
  dueDate: string;
  notes: string;
};

export type PlanningMonthGroup = {
  id: PlanningMonthId;
  title: string;
  sofiaMessage: string;
  defaultExpanded: boolean;
};

export type PlanningMapFiltersState = {
  category: "Todas" | PlanningMapCategory;
  status: "Todas" | PlanningMapStatus;
  source: "Todas" | "Sofia" | "Manual";
  showRemoved: boolean;
};
