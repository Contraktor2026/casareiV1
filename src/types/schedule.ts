export type ScheduleCategory =
  | "Cerimônia"
  | "Recepção"
  | "Convidados"
  | "Beleza"
  | "Fornecedores"
  | "Documentos"
  | "Orçamento"
  | "Cotações"
  | "Outros";

export type SchedulePeriod = "Esta semana" | "Este mês" | "Mais pra frente";

export type SchedulePriority = "Alta" | "Média" | "Baixa";

export type ScheduleStatus = "Pendente" | "Concluída" | "Atrasada" | "Removida";

export type ScheduleSource = "sofia" | "manual";

export type ScheduleTask = {
  id: string;
  title: string;
  description: string;
  category: ScheduleCategory;
  period: SchedulePeriod;
  priority: SchedulePriority;
  dueDate: string;
  status: ScheduleStatus;
  source: ScheduleSource;
  isSuggestedBySofia: boolean;
  isKept: boolean;
  notes: string;
  sofiaTip?: string;
  history?: string[];
};

export type PlanningMoment = "Agora" | "Próximas semanas" | "Próximos meses" | "Perto do casamento";

export type PlanningSuggestion = ScheduleTask & {
  moment: PlanningMoment;
  sofiaExplanation: string;
};

export type ScheduleFilters = {
  status: "Todas" | "Pendentes" | "Concluídas" | "Atrasadas";
  priority: "Todas" | SchedulePriority;
  source: "Todas" | "Sofia" | "Manual";
};
