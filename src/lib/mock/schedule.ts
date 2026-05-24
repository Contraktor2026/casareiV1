import type { PlanningSuggestion, ScheduleCategory, SchedulePeriod, SchedulePriority, ScheduleTask } from "@/types/schedule";

export const schedulePeriods = ["Visão geral", "Esta semana", "Este mês", "Mais pra frente"] as const;

export const scheduleCategories: Array<"Todas" | ScheduleCategory> = [
  "Todas",
  "Cerimônia",
  "Recepção",
  "Convidados",
  "Beleza",
  "Fornecedores",
  "Documentos",
  "Outros"
];

export const fullScheduleCategories: ScheduleCategory[] = [
  "Cerimônia",
  "Recepção",
  "Convidados",
  "Beleza",
  "Fornecedores",
  "Documentos",
  "Orçamento",
  "Cotações",
  "Outros"
];

export const schedulePriorities: SchedulePriority[] = ["Alta", "Média", "Baixa"];

export const schedulePeriodOptions: SchedulePeriod[] = ["Esta semana", "Este mês", "Mais pra frente"];

export const mockScheduleTasks: ScheduleTask[] = [
  {
    id: "1",
    title: "Revisar convidados pendentes",
    description: "Entre em contato com os convidados que ainda não responderam.",
    category: "Convidados",
    period: "Esta semana",
    priority: "Alta",
    dueDate: "2026-05-12",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "",
    sofiaTip: "Essa tarefa ajuda a fechar números com mais segurança antes de falar com buffet e decoração.",
    history: ["Sofia sugeriu esta tarefa", "Incluída no cronograma inicial"]
  },
  {
    id: "2",
    title: "Confirmar próximo pagamento",
    description: "Revise o pagamento agendado com o buffet.",
    category: "Orçamento",
    period: "Esta semana",
    priority: "Alta",
    dueDate: "2026-05-13",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "Checar se o comprovante já foi enviado.",
    sofiaTip: "Resolver isso agora deixa a semana mais leve.",
    history: ["Sofia identificou pagamento próximo"]
  },
  {
    id: "3",
    title: "Escolher músicas da cerimônia",
    description: "Monte a playlist especial para a entrada e momentos da cerimônia.",
    category: "Cerimônia",
    period: "Esta semana",
    priority: "Média",
    dueDate: "2026-05-16",
    status: "Pendente",
    source: "manual",
    isSuggestedBySofia: false,
    isKept: true,
    notes: "",
    history: ["Criada manualmente por Mariana"]
  },
  {
    id: "4",
    title: "Agendar prova do vestido",
    description: "Entre em contato com o ateliê para confirmar a data da prova.",
    category: "Beleza",
    period: "Esta semana",
    priority: "Média",
    dueDate: "2026-05-17",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "Preferência por sábado de manhã.",
    sofiaTip: "Você não precisa resolver tudo hoje, mas deixar a prova marcada traz tranquilidade.",
    history: ["Sofia sugeriu pela proximidade da data"]
  },
  {
    id: "5",
    title: "Revisar contrato da decoração",
    description: "Confira itens inclusos, cores, flores e prazos de montagem.",
    category: "Fornecedores",
    period: "Este mês",
    priority: "Alta",
    dueDate: "2026-05-25",
    status: "Atrasada",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "",
    sofiaTip: "Algumas tarefas precisam de carinho hoje. Sem pressão, vamos por partes.",
    history: ["Prazo passou sem conclusão"]
  },
  {
    id: "6",
    title: "Separar documentos do civil",
    description: "Organize RG, certidões e documentos necessários para o cartório.",
    category: "Documentos",
    period: "Este mês",
    priority: "Média",
    dueDate: "2026-05-30",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "",
    history: ["Incluída no plano mensal"]
  },
  {
    id: "7",
    title: "Comparar cotações de fotografia",
    description: "Veja preço, entrega, estilo e disponibilidade dos fotógrafos.",
    category: "Cotações",
    period: "Este mês",
    priority: "Baixa",
    dueDate: "2026-06-02",
    status: "Pendente",
    source: "manual",
    isSuggestedBySofia: false,
    isKept: true,
    notes: "",
    history: ["Criada a partir do módulo de cotações"]
  },
  {
    id: "8",
    title: "Agendar ensaio pré-wedding",
    description: "Combine data, local, horário e estilo do ensaio com o fotógrafo escolhido.",
    category: "Cotações",
    period: "Mais pra frente",
    priority: "Média",
    dueDate: "2026-07-20",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "Verificar se o ensaio está incluso na proposta de fotografia.",
    sofiaTip: "Se vocês escolherem uma proposta com pré-wedding, deixar essa data reservada traz leveza para depois.",
    history: ["Incluída a partir dos critérios de fotografia em Cotações"]
  },
  {
    id: "9",
    title: "Definir lembrancinhas",
    description: "Escolha uma opção simples, útil e coerente com o estilo do casamento.",
    category: "Recepção",
    period: "Mais pra frente",
    priority: "Baixa",
    dueDate: "2026-08-10",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "",
    sofiaTip: "Isso pode ficar para mais tarde sem culpa.",
    history: ["Planejada para etapa futura"]
  },
  {
    id: "10",
    title: "Revisar mapa de mesas",
    description: "Organize famílias, amigos e convidados com restrições alimentares.",
    category: "Convidados",
    period: "Mais pra frente",
    priority: "Média",
    dueDate: "2026-09-01",
    status: "Pendente",
    source: "sofia",
    isSuggestedBySofia: true,
    isKept: true,
    notes: "",
    history: ["Será melhor revisar após o RSVP"]
  },
  {
    id: "11",
    title: "Enviar referências para maquiadora",
    description: "Separe imagens de cabelo e maquiagem para alinhar expectativas.",
    category: "Beleza",
    period: "Este mês",
    priority: "Baixa",
    dueDate: "2026-06-05",
    status: "Concluída",
    source: "manual",
    isSuggestedBySofia: false,
    isKept: true,
    notes: "Referências salvas no mural.",
    history: ["Concluída por Mariana"]
  }
];

export const mockPlanningSuggestions: PlanningSuggestion[] = [
  {
    ...mockScheduleTasks[0],
    id: "s1",
    moment: "Agora",
    title: "Enviar lembrete de confirmação para convidados pendentes",
    sofiaExplanation:
      "Como ainda existem convidados sem resposta, essa tarefa ajuda você a fechar números com mais segurança antes de falar com buffet e decoração."
  },
  {
    ...mockScheduleTasks[1],
    id: "s2",
    moment: "Agora",
    title: "Confirmar próximo pagamento do buffet",
    sofiaExplanation: "Resolver o próximo pagamento evita ruído com fornecedor e deixa sua semana mais leve."
  },
  {
    ...mockScheduleTasks[3],
    id: "s3",
    moment: "Próximas semanas",
    title: "Agendar prova do vestido",
    sofiaExplanation: "Essa etapa merece calma. Deixar a prova marcada evita decisões apressadas mais perto do casamento."
  },
  {
    ...mockScheduleTasks[5],
    id: "s4",
    moment: "Próximas semanas",
    title: "Separar documentos do civil",
    sofiaExplanation: "Documentos são chatinhos, então é melhor cuidar aos poucos, sem virar correria."
  },
  {
    ...mockScheduleTasks[7],
    id: "s5",
    moment: "Próximos meses",
    title: "Definir lembrancinhas",
    sofiaExplanation: "Não é urgente, mas já deixar uma direção ajuda o orçamento e a identidade visual."
  },
  {
    ...mockScheduleTasks[8],
    id: "s6",
    moment: "Perto do casamento",
    title: "Revisar mapa de mesas",
    sofiaExplanation: "Quando o RSVP estiver mais fechado, essa tarefa ajuda a receber todo mundo com cuidado."
  }
];
