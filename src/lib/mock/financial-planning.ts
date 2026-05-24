import type { FinancialPlanningMock } from "@/types/financial-planning";

export const financialPlanningMock: FinancialPlanningMock = {
  totalPlanned: 80000,
  guestCount: 140,
  selectedPriorities: ["Fotografia", "Experiência dos convidados", "Gastronomia", "Estética"],
  availablePriorities: [
    "Fotografia",
    "Experiência dos convidados",
    "Gastronomia",
    "Decoração",
    "Espaco",
    "Musica/Festa",
    "Vestido",
    "Beleza",
    "Cerimônia",
    "Lua de mel",
    "Conforto",
    "Estetica",
    "Praticidade",
    "Exclusividade"
  ],
  safetyReservePercent: 10,
  sofiaText:
    "Mari, antes de olhar só para números, vamos entender o que realmente importa para vocês. Assim fica mais fácil decidir onde investir e onde economizar com tranquilidade.",
  sofiaSuggestions: [
    "Com 140 convidados, buffet e espaço naturalmente precisam de mais respiro.",
    "Como fotografia foi marcada como prioridade, eu protegeria esse investimento antes de reduzir valores.",
    "Reservar uma margem para imprevistos evita sustos perto do casamento.",
    "Não comprometam tudo antes das primeiras cotações importantes."
  ],
  categories: [
    {
      id: "espaco",
      name: "Espaco",
      plannedAmount: 18000,
      percentage: 22.5,
      priority: "Alta",
      reason: "Conforto, plano B chuva e experiência de chegada dos convidados.",
      note: "Priorizar local acolhedor, com natureza e logística simples.",
      status: "Sugerido pela Sofia",
      color: "#D4537E"
    },
    {
      id: "buffet",
      name: "Buffet",
      plannedAmount: 18000,
      percentage: 22.5,
      priority: "Alta",
      reason: "Impacta diretamente a experiência dos convidados.",
      note: "Manter qualidade, mas observar taxas extras.",
      status: "Sugerido pela Sofia",
      color: "#C8A96A"
    },
    {
      id: "fotografia",
      name: "Fotografia",
      plannedAmount: 9000,
      percentage: 11.25,
      priority: "Alta",
      reason: "Memória afetiva do dia e prioridade declarada do casal.",
      note: "Buscar cobertura completa, making of até festa e pré-wedding.",
      status: "Ajustado pela noiva",
      color: "#993556"
    },
    {
      id: "filmagem",
      name: "Filmagem",
      plannedAmount: 5500,
      percentage: 6.875,
      priority: "Media",
      reason: "Complementa as lembrancas, sem competir com fotografia.",
      note: "Avaliar teaser, filme completo e reels.",
      status: "Sugerido pela Sofia",
      color: "#E6A0B9"
    },
    {
      id: "decoracao",
      name: "Decoração",
      plannedAmount: 12000,
      percentage: 15,
      priority: "Media",
      reason: "Define a atmosfera visual, mas pode ser equilibrada.",
      note: "Focar em flores naturais, mesa delicada e luz quente.",
      status: "Ajustado pela noiva",
      color: "#7A8A65"
    },
    {
      id: "cerimonial",
      name: "Cerimonial",
      plannedAmount: 6500,
      percentage: 8.125,
      priority: "Media",
      reason: "Ajuda a manter o dia leve e organizado.",
      note: "Priorizar equipe com presença no dia.",
      status: "Sugerido pela Sofia",
      color: "#A46A7D"
    },
    {
      id: "musica",
      name: "Musica",
      plannedAmount: 4800,
      percentage: 6,
      priority: "Media",
      reason: "Importante para festa, mas com margem para escolha.",
      note: "Comparar DJ, banda e cerimônia separadamente.",
      status: "Sugerido pela Sofia",
      color: "#D9905F"
    },
    {
      id: "vestido",
      name: "Vestido",
      plannedAmount: 7200,
      percentage: 9,
      priority: "Alta",
      reason: "Parte emocional importante para a noiva.",
      note: "Considerar vestido, ajustes e acessórios.",
      status: "Ajustado pela noiva",
      color: "#F0B7C8"
    },
    {
      id: "traje-noivo",
      name: "Traje do noivo",
      plannedAmount: 2200,
      percentage: 2.75,
      priority: "Baixa",
      reason: "Pode ser bem resolvido com escolha objetiva.",
      note: "Priorizar conforto e tecido adequado ao clima.",
      status: "Sugerido pela Sofia",
      color: "#9A8066"
    },
    {
      id: "beleza",
      name: "Beleza",
      plannedAmount: 2800,
      percentage: 3.5,
      priority: "Media",
      reason: "Ajuda a noiva a se sentir segura no dia.",
      note: "Incluir prova de cabelo e maquiagem.",
      status: "Sugerido pela Sofia",
      color: "#D5A3A7"
    },
    {
      id: "doces-bolo",
      name: "Doces/Bolo",
      plannedAmount: 3000,
      percentage: 3.75,
      priority: "Media",
      reason: "Detalhe afetivo para convidados.",
      note: "Definir quantidade depois do RSVP.",
      status: "Sugerido pela Sofia",
      color: "#C07B85"
    },
    {
      id: "outros",
      name: "Outros",
      plannedAmount: 1000,
      percentage: 1.25,
      priority: "Baixa",
      reason: "Reserva para pequenos itens que aparecem no caminho.",
      note: "Evitar transformar extras em impulso.",
      status: "Sugerido pela Sofia",
      color: "#B8A99A"
    }
  ],
  simulations: [
    {
      id: "mais-convidados",
      title: "Aumentar de 140 para 160 convidados",
      description: "Uma festa maior pede mais cuidado com buffet, doces e possivelmente espaço.",
      impacts: ["buffet sobe estimado", "doces e lembranças aumentam", "espaço pode precisar de revisão"]
    },
    {
      id: "decoracao-prioridade",
      title: "Priorizar decoração",
      description: "A atmosfera visual fica mais forte, mas talvez seja preciso reduzir itens extras.",
      impacts: ["flores ganham mais margem", "iluminacao pode entrar no plano", "lembrancinhas podem ser reduzidas"]
    },
    {
      id: "reduzir-lua-mel",
      title: "Reduzir lua de mel",
      description: "Libera margem para fornecedores do dia sem mexer nas prioridades emocionais.",
      impacts: ["mais folga para fotografia", "maior reserva de seguranca", "decisao pode ficar para depois"]
    }
  ],
  comparison: {
    planned: 80000,
    committed: 52300,
    open: 27700
  }
};
