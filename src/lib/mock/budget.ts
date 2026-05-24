import type { BudgetCategory, BudgetCategoryPlan, BudgetOverview, BudgetPayment, BudgetProjection } from "@/types/budget";

export const budgetOverview: BudgetOverview = {
  planned: 80000,
  committed: 52300,
  available: 27700,
  freeAdjustmentSpace: 12500
};

export const budgetCategoryPlans: BudgetCategoryPlan[] = [
  {
    id: "plan-fotografia",
    category: "Fotografia",
    idealBudget: 9000,
    moment: "Fechar entre 10 e 12 meses antes",
    guide: "Priorizar cobertura completa, estilo que emocione vocês e clareza sobre álbum, drone e pré-wedding.",
    decisions: ["confirmar making of até festa", "ver se inclui ensaio pré-wedding", "entender prazo de entrega"],
    editableNote: "Queremos fotos românticas, espontâneas e com sensação leve."
  },
  {
    id: "plan-buffet",
    category: "Buffet",
    idealBudget: 19000,
    moment: "Comparar antes de fechar decoração final",
    guide: "Olhar valor por pessoa, experiência dos convidados, restrições alimentares e taxas extras.",
    decisions: ["validar degustação", "confirmar staff", "mapear vegetarianos e alergias"],
    editableNote: "A experiência dos convidados é prioridade para nós."
  },
  {
    id: "plan-decoracao",
    category: "Decoração",
    idealBudget: 14000,
    moment: "Ajustar depois de espaço e buffet",
    guide: "Definir o que realmente muda o clima visual: flores, cerimônia, mesa posta e iluminação.",
    decisions: ["separar essencial de extra", "confirmar iluminação", "revisar montagem e desmontagem"],
    editableNote: "Queremos romântico, delicado e sem exageros."
  },
  {
    id: "plan-espaco",
    category: "Espaço",
    idealBudget: 18000,
    moment: "Primeira grande decisão",
    guide: "Garantir conforto, plano B chuva, capacidade real e logística tranquila para convidados.",
    decisions: ["confirmar plano B", "checar acessibilidade", "validar horários de montagem"],
    editableNote: "O espaço precisa transmitir acolhimento e natureza."
  }
];

export const budgetPriorities = [
  "fotografia",
  "experiência dos convidados",
  "gastronomia",
  "estética",
  "conforto",
  "cerimônia"
];

export const budgetCategories: BudgetCategory[] = [
  {
    id: "espaco",
    name: "Espaço",
    planned: 18000,
    spent: 16000,
    status: "dentro",
    priority: "Alta",
    supplier: "Fazenda Bela Vista",
    contract: "Fechado",
    compatibility: 94,
    included: ["exclusividade do espaço", "mobiliário base", "plano B chuva", "estacionamento"],
    notes: "Confirmar horário final de montagem.",
    payments: ["pay-1", "pay-6"]
  },
  {
    id: "buffet",
    name: "Buffet",
    planned: 19000,
    spent: 18000,
    status: "dentro",
    priority: "Alta",
    supplier: "Buffet Amora",
    contract: "Fechado",
    compatibility: 90,
    included: ["entradas", "jantar", "sobremesa", "staff", "bebidas não alcoólicas"],
    notes: "Revisar restrições alimentares antes da parcela final.",
    payments: ["pay-2", "pay-7"]
  },
  {
    id: "fotografia",
    name: "Fotografia",
    planned: 9000,
    spent: 8500,
    status: "dentro",
    priority: "Alta",
    supplier: "Luz de Domingo",
    contract: "Pré-reservado",
    compatibility: 92,
    included: ["10h de cobertura", "making of até festa", "álbum", "drone", "reels"],
    notes: "Verificar se o ensaio pré-wedding entra no pacote final.",
    payments: ["pay-3"]
  },
  {
    id: "decoracao",
    name: "Decoração",
    planned: 14000,
    spent: 15500,
    status: "atencao",
    priority: "Media",
    supplier: "Flora Casa",
    contract: "Em ajuste",
    compatibility: 86,
    included: ["flores naturais", "cerimônia", "recepção", "mesa posta"],
    notes: "Iluminação pode virar custo extra.",
    payments: ["pay-4", "pay-8"]
  },
  {
    id: "cerimonial",
    name: "Cerimonial",
    planned: 6500,
    spent: 5800,
    status: "dentro",
    priority: "Media",
    supplier: "Casa Serena",
    contract: "Fechado",
    compatibility: 88,
    included: ["cronograma do dia", "equipe no evento", "alinhamento com fornecedores"],
    notes: "Boa margem dentro do previsto.",
    payments: ["pay-5"]
  },
  {
    id: "musica",
    name: "Música",
    planned: 4800,
    spent: 0,
    status: "aberta",
    priority: "Media",
    supplier: "A definir",
    contract: "Aberto",
    compatibility: 0,
    included: [],
    notes: "Categoria ainda aberta para cotações.",
    payments: []
  },
  {
    id: "vestido",
    name: "Vestido",
    planned: 7200,
    spent: 6500,
    status: "dentro",
    priority: "Alta",
    supplier: "Ateliê Luna",
    contract: "Fechado",
    compatibility: 91,
    included: ["duas provas", "ajustes", "véu curto"],
    notes: "Confirmar data da próxima prova.",
    payments: []
  },
  {
    id: "outros",
    name: "Outros",
    planned: 1500,
    spent: 2000,
    status: "acima",
    priority: "Baixa",
    supplier: "Diversos",
    contract: "Variável",
    compatibility: 62,
    included: ["lembrancinhas", "itens extras"],
    notes: "Separar o que é essencial do que é impulso.",
    payments: []
  }
];

export const budgetPayments: BudgetPayment[] = [
  { id: "pay-1", supplier: "Fazenda Bela Vista", category: "Espaço", amount: 4000, dueDate: "2026-06-10", month: "Junho", status: "proximo" },
  { id: "pay-2", supplier: "Buffet Amora", category: "Buffet", amount: 2000, dueDate: "2026-06-18", month: "Junho", status: "proximo" },
  { id: "pay-3", supplier: "Luz de Domingo", category: "Fotografia", amount: 2400, dueDate: "2026-06-25", month: "Junho", status: "proximo" },
  { id: "pay-4", supplier: "Flora Casa", category: "Decoração", amount: 1200, dueDate: "2026-07-05", month: "Julho", status: "pendente" },
  { id: "pay-5", supplier: "Casa Serena", category: "Cerimonial", amount: 1800, dueDate: "2026-05-09", month: "Maio", status: "pago" },
  { id: "pay-6", supplier: "Fazenda Bela Vista", category: "Espaço", amount: 4000, dueDate: "2026-07-20", month: "Julho", status: "pendente" },
  { id: "pay-7", supplier: "Buffet Amora", category: "Buffet", amount: 3000, dueDate: "2026-08-10", month: "Agosto", status: "pendente" },
  { id: "pay-8", supplier: "Flora Casa", category: "Decoração", amount: 1500, dueDate: "2026-05-01", month: "Maio", status: "atrasado" }
];

export const budgetProjection: BudgetProjection = {
  finalEstimate: 81200,
  remainingMargin: 11300,
  risk: "moderado",
  expensiveCategories: ["Buffet", "Espaço", "Decoração"],
  openCategories: ["Música", "Convites", "Bar"],
  sofiaNote: "Mari, talvez seja interessante revisar decoração antes de fechar novos detalhes."
};
