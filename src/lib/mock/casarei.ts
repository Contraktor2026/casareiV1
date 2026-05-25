export const mockCouple = {
  brideName: "",
  partnerName: "",
  coupleName: "Seu casamento",
  weddingDate: "Data a definir",
  city: "",
  state: "",
  venueName: "",
  daysToWedding: 0,
  progress: 0
};

export const mockRsvpGuest = {
  name: "",
  group: "",
  plusOnesAllowed: 0,
  dietaryRestriction: ""
};

export const mockStats: Array<{ label: string; value: string; detail: string }> = [];
export const mockSofiaMessages = [
  {
    title: "Comece pelo essencial.",
    message: "Preencha os dados do casamento para que o app organize tarefas, convidados e fornecedores com base na sua realidade."
  }
];
export const mockEmotionalMilestones: Array<{ label: string; value: number }> = [];
export const mockTasks: Array<{ title: string; meta: string; status: string }> = [];
export const mockBudgetCategories: Array<{ name: string; value: string; progress: number }> = [];
export const mockGuests: Array<{
  name: string;
  group: string;
  status: string;
  plusOnesAllowed: number;
  plusOnesConfirmed: number;
  dietaryRestriction: string;
  phone: string;
}> = [];
export const mockVendors: Array<{ id: string; name: string; category: string; value: string; status: string; phone: string }> = [];
