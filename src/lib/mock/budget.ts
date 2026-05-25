import type { BudgetCategory, BudgetCategoryPlan, BudgetOverview, BudgetPayment, BudgetProjection } from "@/types/budget";

export const budgetOverview: BudgetOverview = {
  planned: 0,
  committed: 0,
  available: 0,
  freeAdjustmentSpace: 0
};

export const budgetCategoryPlans: BudgetCategoryPlan[] = [];
export const budgetPriorities: string[] = [];
export const budgetCategories: BudgetCategory[] = [];
export const budgetPayments: BudgetPayment[] = [];

export const budgetProjection: BudgetProjection = {
  finalEstimate: 0,
  remainingMargin: 0,
  risk: "leve",
  expensiveCategories: [],
  openCategories: [],
  sofiaNote: "Cadastre orçamento, fornecedores e pagamentos para gerar projeções reais."
};
