export type BudgetCategoryStatus = "dentro" | "atencao" | "acima" | "aberta";
export type BudgetPaymentStatus = "pago" | "pendente" | "proximo" | "atrasado";
export type BudgetPriority = "Alta" | "Media" | "Baixa";

export type BudgetCategory = {
  id: string;
  name: string;
  planned: number;
  spent: number;
  status: BudgetCategoryStatus;
  priority: BudgetPriority;
  supplier: string;
  contract: string;
  compatibility: number;
  included: string[];
  notes: string;
  payments: string[];
};

export type BudgetPayment = {
  id: string;
  supplier: string;
  category: string;
  amount: number;
  dueDate: string;
  month: string;
  status: BudgetPaymentStatus;
  method?: string;
  source?: "mock" | "fornecedor";
  vendorId?: string;
};

export type BudgetProjection = {
  finalEstimate: number;
  remainingMargin: number;
  risk: "leve" | "moderado" | "alto";
  expensiveCategories: string[];
  openCategories: string[];
  sofiaNote: string;
};

export type BudgetOverview = {
  planned: number;
  committed: number;
  available: number;
  freeAdjustmentSpace: number;
};

export type BudgetCategoryPlan = {
  id: string;
  category: string;
  idealBudget: number;
  moment: string;
  guide: string;
  decisions: string[];
  editableNote: string;
};
