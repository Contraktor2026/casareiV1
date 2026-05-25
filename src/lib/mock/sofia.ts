import type { SofiaMockData } from "@/types/sofia";

export const sofiaMockData: SofiaMockData = {
  status: "calm",
  context: {
    brideName: "",
    partnerName: "",
    coupleName: "Seu casamento",
    weddingDate: "Data a definir",
    location: "",
    style: "",
    guestCount: 0,
    plannedBudget: 0,
    committedBudget: 0,
    priorities: []
  },
  heroMessage: "Preencha seu casamento para que a Sofia possa orientar os próximos passos com dados reais.",
  capabilities: [
    { title: "Cronograma", description: "Organize tarefas por fase do casamento.", href: "/app/cronograma" },
    { title: "Convidados", description: "Cadastre convidados e acompanhe confirmações.", href: "/app/convidados" },
    { title: "Fornecedores", description: "Controle contatos, contratos e pagamentos.", href: "/app/fornecedores" },
    { title: "Orçamento", description: "Acompanhe valores cadastrados.", href: "/app/orcamento" }
  ],
  initialMessages: [
    {
      id: "welcome",
      role: "sofia",
      text: "Quando você cadastrar tarefas, convidados, fornecedores e orçamento, eu ajudo a priorizar o que merece atenção."
    }
  ],
  quickPrompts: [],
  priorities: [],
  alerts: [],
  decisions: [],
  preparedMessages: [],
  guidance: {
    title: "Comece com dados reais",
    text: "Cadastre as primeiras informações para transformar o painel em um planejamento personalizado.",
    steps: ["Preencher onboarding", "Cadastrar convidados", "Adicionar fornecedores", "Registrar pagamentos"]
  }
};
