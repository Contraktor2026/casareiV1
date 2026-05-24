export type PlannedPriority = "Alta" | "Media" | "Baixa";
export type PlannedCategoryStatus = "Sugerido pela Sofia" | "Ajustado pela noiva" | "Parcialmente comprometido";

export type PlannedCategory = {
  id: string;
  name: string;
  plannedAmount: number;
  percentage: number;
  priority: PlannedPriority;
  reason: string;
  note: string;
  status: PlannedCategoryStatus;
  color: string;
};

export type BudgetSimulation = {
  id: string;
  title: string;
  description: string;
  impacts: string[];
};

export type FinancialPlanningComparison = {
  planned: number;
  committed: number;
  open: number;
};

export type FinancialPlanningMock = {
  totalPlanned: number;
  guestCount: number;
  selectedPriorities: string[];
  availablePriorities: string[];
  safetyReservePercent: number;
  sofiaText: string;
  sofiaSuggestions: string[];
  categories: PlannedCategory[];
  simulations: BudgetSimulation[];
  comparison: FinancialPlanningComparison;
};

export type PlannedCategoryFormValues = {
  name: string;
  plannedAmount: number;
  priority: PlannedPriority;
  reason: string;
  note: string;
};
