export const mockCouple = {
  brideName: "Mariana",
  partnerName: "Rafael",
  coupleName: "Mariana & Rafael",
  weddingDate: "12 de outubro de 2026",
  city: "Campinas",
  state: "SP",
  venueName: "Fazenda Bela Vista",
  daysToWedding: 142,
  progress: 67
};

export const mockRsvpGuest = {
  name: "Carla Oliveira",
  group: "Família da noiva",
  plusOnesAllowed: 1,
  dietaryRestriction: ""
};

export const mockStats = [
  { label: "Tarefas", value: "23/48", detail: "8 para esta semana" },
  { label: "Orçamento", value: "62%", detail: "R$ 88.420 usado" },
  { label: "Confirmados", value: "87/140", detail: "42 pendentes" },
  { label: "Fornecedores", value: "9/14", detail: "2 contratos pendentes" }
];

export const mockSofiaMessages = [
  {
    title: "Respira, Mari. Você está no caminho.",
    message:
      "Hoje eu cuidaria só de duas coisas: revisar os convidados pendentes e mandar uma mensagem carinhosa para quem ainda não confirmou."
  },
  {
    title: "Um detalhe bonito para esta semana",
    message:
      "A lista de família está quase fechada. Quando ela terminar, o mapa das mesas vai ficar muito mais leve de organizar."
  }
];

export const mockEmotionalMilestones = [
  { label: "Sonho desenhado", value: 100 },
  { label: "Pessoas queridas", value: 72 },
  { label: "Fornecedores certos", value: 64 },
  { label: "Tranquilidade da semana", value: 58 }
];

export const mockTasks = [
  { title: "Confirmar degustacao do buffet", meta: "Hoje", status: "urgent" },
  { title: "Revisar lista de convidados", meta: "Esta semana", status: "normal" },
  { title: "Enviar referências para decoração", meta: "Próximo mês", status: "normal" }
];

export const mockBudgetCategories = [
  { name: "Buffet", value: "R$ 42.000", progress: 78 },
  { name: "Decoração", value: "R$ 18.500", progress: 54 },
  { name: "Foto e vídeo", value: "R$ 14.900", progress: 64 }
];

export const mockGuests = [
  {
    name: "Carla Oliveira",
    group: "Família da noiva",
    status: "confirmed",
    plusOnesAllowed: 1,
    plusOnesConfirmed: 1,
    dietaryRestriction: "Vegetariana",
    phone: "11999990001"
  },
  {
    name: "Bruno Santos",
    group: "Amigos do casal",
    status: "pending",
    plusOnesAllowed: 1,
    plusOnesConfirmed: 0,
    dietaryRestriction: "",
    phone: "11999990002"
  },
  {
    name: "Ana Pereira",
    group: "Trabalho",
    status: "declined",
    plusOnesAllowed: 0,
    plusOnesConfirmed: 0,
    dietaryRestriction: "",
    phone: "11999990003"
  },
  {
    name: "Helena Martins",
    group: "Família do noivo",
    status: "confirmed",
    plusOnesAllowed: 0,
    plusOnesConfirmed: 0,
    dietaryRestriction: "Sem lactose",
    phone: "11999990004"
  },
  {
    name: "Paula Nogueira",
    group: "Madrinhas",
    status: "confirmed",
    plusOnesAllowed: 1,
    plusOnesConfirmed: 1,
    dietaryRestriction: "",
    phone: "11999990005"
  },
  {
    name: "Diego Almeida",
    group: "Amigos do casal",
    status: "pending",
    plusOnesAllowed: 1,
    plusOnesConfirmed: 0,
    dietaryRestriction: "Vegano",
    phone: "11999990006"
  }
];

export const mockVendors = [
  {
    id: "buffet-amora",
    name: "Buffet Amora",
    category: "Buffet",
    value: "R$ 42.000",
    status: "Contrato ok",
    phone: "5511999999999"
  },
  {
    id: "flora-casa",
    name: "Flora Casa",
    category: "Decoração",
    value: "R$ 18.500",
    status: "Contrato pendente",
    phone: "5511988888888"
  }
];
