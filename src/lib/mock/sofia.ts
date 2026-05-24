import type { SofiaMockData } from "@/types/sofia";

export const sofiaMockData: SofiaMockData = {
  status: "attention",
  context: {
    brideName: "Mari",
    partnerName: "Rafael",
    coupleName: "Mariana & Rafael",
    weddingDate: "12 de outubro de 2026",
    location: "Fazenda Bela Vista, Campinas - SP",
    style: "romântico, leve e elegante",
    guestCount: 140,
    plannedBudget: 80000,
    committedBudget: 52300,
    priorities: ["Fotografia", "Experiência dos convidados", "Gastronomia", "Estética"]
  },
  heroMessage:
    "Oi, Mari. Eu estou aqui para te ajudar a transformar o planejamento em passos mais claros, sem carregar tudo sozinha.",
  capabilities: [
    { title: "Próximos passos", description: "Veja o que merece sua atenção agora.", href: "/app/cronograma" },
    { title: "Cronograma", description: "Organize tarefas por fase do casamento.", href: "/app/cronograma" },
    { title: "Convidados", description: "Acompanhe confirmações, pendências e lembretes.", href: "/app/convidados" },
    { title: "Cotações", description: "Compare propostas sem se perder nos PDFs.", href: "/app/cotacoes" },
    { title: "Orçamento", description: "Entenda o que já foi fechado e o que ainda falta.", href: "/app/orcamento" },
    { title: "Essência do casamento", description: "Transforme referências em direção visual.", href: "/app/inspiracoes" }
  ],
  initialMessages: [
    {
      id: "m1",
      role: "sofia",
      text:
        "Respira, Mari. Seu casamento está ganhando forma. Hoje eu olharia primeiro para convidados pendentes, próximo pagamento e cotações abertas."
    }
  ],
  quickPrompts: [
    {
      id: "semana",
      label: "O que devo fazer esta semana?",
      response:
        "Mari, essa semana eu cuidaria de três coisas: revisar convidados pendentes, confirmar o próximo pagamento do buffet e comparar as cotações de decoração. Você não precisa resolver tudo hoje. Vamos por partes."
    },
    {
      id: "atrasada",
      label: "Estou atrasada em algo?",
      response:
        "Nada precisa virar pressa agora. Alguns detalhes merecem carinho: RSVP pendente, decoração acima do planejado e contrato de fornecedor para revisar."
    },
    {
      id: "fornecedor",
      label: "Qual fornecedor falta fechar?",
      response:
        "Música ainda está em aberto e decoração parece em ajuste. Eu começaria por entender as propostas que mais combinam com a essência de vocês."
    },
    {
      id: "orcamento",
      label: "Meu orçamento está equilibrado?",
      response:
        "O plano está bem encaminhado. Espaço, buffet e fotografia fazem sentido como prioridades. Eu só reservaria margem antes de assumir novos extras."
    },
    {
      id: "rsvp",
      label: "Quem ainda não confirmou presença?",
      response:
        "Ainda existem 42 pessoas sem resposta. Um lembrete carinhoso agora ajuda buffet, mesas e organização a ficarem mais seguros."
    },
    {
      id: "priorizar",
      label: "O que devo priorizar agora?",
      response:
        "Eu priorizaria decisões que destravam outras: convidados, pagamentos próximos e cotações. O resto pode esperar um pouco."
    }
  ],
  priorities: [
    {
      id: "p1",
      title: "Revisar convidados pendentes",
      detail: "42 pessoas ainda não responderam ao RSVP.",
      action: { label: "Ver convidados", href: "/app/convidados", kind: "primary" }
    },
    {
      id: "p2",
      title: "Confirmar pagamento do buffet",
      detail: "Há um pagamento próximo que ajuda a manter tudo tranquilo.",
      action: { label: "Ver orçamento", href: "/app/orcamento", kind: "secondary" }
    },
    {
      id: "p3",
      title: "Comparar cotações de decoração",
      detail: "Essa escolha impacta visual, fornecedores e planejamento financeiro.",
      action: { label: "Comparar cotações", href: "/app/cotacoes", kind: "secondary" }
    }
  ],
  alerts: [
    {
      id: "a1",
      title: "Convidados pendentes",
      text: "Mari, 42 convidados ainda não responderam. Talvez seja um bom momento para enviar um lembrete carinhoso.",
      action: { label: "Enviar lembrete", href: "/app/convidados/enviar", kind: "primary" }
    },
    {
      id: "a2",
      title: "Contrato para revisar",
      text: "Alguns contratos e pagamentos merecem atenção nos próximos dias, sem pressa e sem susto.",
      action: { label: "Ver fornecedores", href: "/app/fornecedores", kind: "secondary" }
    },
    {
      id: "a3",
      title: "Cotação acima do planejado",
      text: "Uma proposta parece mais cara, mas pode entregar itens importantes para o estilo de vocês.",
      action: { label: "Ver cotações", href: "/app/cotacoes", kind: "secondary" }
    }
  ],
  decisions: [
    {
      id: "d1",
      title: "Escolher decoração",
      reason: "A essência de vocês pede algo romântico, leve e acolhedor.",
      impact: "Essa decisão influencia orçamento, cronograma e briefing dos fornecedores.",
      action: { label: "Comparar opções", href: "/app/cotacoes", kind: "primary" }
    },
    {
      id: "d2",
      title: "Aprovar briefing visual",
      reason: "As referências já mostram uma direção clara.",
      impact: "Ajuda decoradora, fotógrafo e cerimonial a acertarem o tom do casamento.",
      action: { label: "Ver essência", href: "/app/inspiracoes", kind: "secondary" }
    },
    {
      id: "d3",
      title: "Definir música",
      reason: "A categoria ainda está aberta no planejamento.",
      impact: "Impacta cerimônia, festa e experiência dos convidados.",
      action: { label: "Criar tarefa", href: "/app/cronograma", kind: "secondary" }
    }
  ],
  preparedMessages: [
    {
      id: "msg-rsvp",
      title: "Lembrete RSVP",
      description: "Para convidados que ainda não responderam.",
      text:
        "Oi, [nome]! Estamos organizando os últimos detalhes do casamento e gostaríamos muito de saber se você poderá estar com a gente nesse dia especial. Confirme aqui: [link]"
    },
    {
      id: "msg-fornecedor",
      title: "Mensagem para fornecedor",
      description: "Para confirmar detalhes de uma proposta.",
      text:
        "Oi! Tudo bem? Estamos revisando os detalhes do casamento e queríamos confirmar algumas informações sobre a proposta."
    },
    {
      id: "msg-padrinhos",
      title: "Mensagem para padrinhos",
      description: "Para lembrar próximos detalhes com carinho.",
      text: "Oi! Passando para lembrar com carinho sobre os próximos detalhes do casamento."
    }
  ],
  guidance: {
    title: "Seu próximo passo",
    text:
      "Mari, olhando seu planejamento, eu começaria por convidados e pagamentos. Isso vai ajudar vocês a tomar decisões mais seguras sobre buffet, mesas e fornecedores.",
    steps: ["Revisar convidados pendentes", "Confirmar próximo pagamento", "Comparar cotações abertas"]
  }
};
