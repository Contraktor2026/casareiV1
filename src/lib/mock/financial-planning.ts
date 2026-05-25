import type { FinancialPlanningMock } from "@/types/financial-planning";

export const financialPlanningMock: FinancialPlanningMock = {
  totalPlanned: 0,
  guestCount: 0,
  selectedPriorities: [],
  availablePriorities: [
    "Fotografia",
    "Experiência dos convidados",
    "Gastronomia",
    "Decoração",
    "Espaço",
    "Música/Festa",
    "Vestido",
    "Beleza",
    "Cerimônia",
    "Lua de mel",
    "Conforto",
    "Praticidade"
  ],
  safetyReservePercent: 10,
  sofiaText: "Preencha seu orçamento planejado para iniciar uma distribuição real.",
  sofiaSuggestions: [],
  categories: [],
  simulations: [],
  comparison: {
    planned: 0,
    committed: 0,
    open: 0
  }
};
