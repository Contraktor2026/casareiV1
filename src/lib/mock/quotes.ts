import type { QuoteCategory, QuoteCategoryGuide, QuoteProposal } from "@/types/quotes";

export const quoteCategories: QuoteCategory[] = [
  "Fotografia",
  "Filmagem",
  "Buffet",
  "Decoração",
  "Espaço",
  "Traje do noivo"
];

export const quoteCategoryGuides: QuoteCategoryGuide[] = [
  {
    category: "Fotografia",
    description: "Entenda cobertura, estilo e o que fica registrado para sempre.",
    importantFields: ["Valor", "Horas", "Álbum", "Drone", "Reels", "Segundo fotógrafo", "Prazo", "Estilo"]
  },
  {
    category: "Filmagem",
    description: "Compare a experiência do filme, teaser e lembranças em vídeo.",
    importantFields: ["Teaser", "Filme completo", "Drone", "Reels", "Horas", "Prazo", "Estilo"]
  },
  {
    category: "Buffet",
    description: "Veja o que muda na experiência dos convidados e no fechamento final.",
    importantFields: ["Valor por pessoa", "Entradas", "Jantar", "Sobremesa", "Bebidas", "Staff", "Taxas"]
  },
  {
    category: "Decoração",
    description: "Traduza estética, montagem e itens que realmente mudam o visual.",
    importantFields: ["Flores", "Cerimônia", "Recepção", "Iluminação", "Mesa posta", "Painel"]
  },
  {
    category: "Espaço",
    description: "Compare conforto, segurança e plano B para o grande dia.",
    importantFields: ["Capacidade", "Estacionamento", "Plano B", "Mobiliário", "Climatização", "Acessibilidade"]
  },
  {
    category: "Traje do noivo",
    description: "Entenda conforto, estilo e se o traje combina com o clima.",
    importantFields: ["Aluguel ou compra", "Completo", "Ajustes", "Conforto", "Estilo", "Tecido"]
  },
  {
    category: "Vestido da noiva",
    description: "Compare modelagem, ajustes e tudo que muda na experiência até o grande dia.",
    importantFields: ["Valor", "Modelo", "Ajustes", "Provas", "Prazo", "Acessórios", "Retirada", "Seguro"]
  },
  {
    category: "Beleza da noiva",
    description: "Veja maquiagem, cabelo, prova e suporte para a noiva se sentir segura.",
    importantFields: ["Make", "Cabelo", "Prova", "Deslocamento", "Equipe", "Duração", "Retoque", "Acompanhantes"]
  },
  {
    category: "Música e DJ",
    description: "Entenda repertório, estrutura de som e condução da festa.",
    importantFields: ["DJ ou banda", "Horas", "Som", "Iluminação", "Playlist", "Cerimônia", "Microfones", "Hora extra"]
  },
  {
    category: "Cerimonial",
    description: "Compare organização, equipe no dia e suporte para fornecedores e convidados.",
    importantFields: ["Assessoria", "Equipe", "Reuniões", "Roteiro", "Checklist", "Cerimônia", "Recepção", "Plantão"]
  },
  {
    category: "Convites",
    description: "Avalie papelaria impressa, convite digital e prazos de produção.",
    importantFields: ["Impresso", "Digital", "Quantidade", "Papel", "Envelope", "Lacre", "Arte", "Prazo"]
  },
  {
    category: "Doces e bolo",
    description: "Compare sabor, apresentação, quantidade e logística de entrega.",
    importantFields: ["Bolo", "Doces", "Quantidade", "Sabores", "Degustação", "Mesa", "Entrega", "Montagem"]
  },
  {
    category: "Bar e drinks",
    description: "Veja carta de drinks, bebidas inclusas e equipe para atendimento.",
    importantFields: ["Drinks", "Bebidas", "Bartenders", "Copos", "Gelo", "Insumos", "Horas", "Taxas"]
  },
  {
    category: "Lembrancinhas",
    description: "Entenda quantidade, personalização e prazo para entregar aos convidados.",
    importantFields: ["Quantidade", "Personalização", "Embalagem", "Arte", "Prazo", "Entrega", "Reserva", "Valor unitário"]
  },
  {
    category: "Transporte",
    description: "Compare conforto, pontualidade e logística para casal, família ou convidados.",
    importantFields: ["Veículo", "Motorista", "Rota", "Horários", "Espera", "Seguro", "Capacidade", "Hora extra"]
  },
  {
    category: "Hospedagem",
    description: "Veja quartos, bloqueio de datas e facilidades para convidados.",
    importantFields: ["Quartos", "Diária", "Bloqueio", "Café", "Check-in", "Cancelamento", "Transporte", "Cortesias"]
  },
  {
    category: "Lua de mel",
    description: "Compare roteiro, hospedagem, voos e suporte durante a viagem.",
    importantFields: ["Destino", "Voos", "Hotel", "Passeios", "Seguro", "Parcelamento", "Taxas", "Cancelamento"]
  },
  {
    category: "Alianças",
    description: "Entenda material, acabamento, medidas e prazo para entrega das alianças.",
    importantFields: ["Material", "Peso", "Largura", "Acabamento", "Gravação", "Medidas", "Garantia", "Prazo"]
  },
  {
    category: "Papelaria",
    description: "Compare identidade visual e peças usadas antes, durante e depois da festa.",
    importantFields: ["Identidade", "Menu", "Tags", "Lágrimas", "Placas", "Arte", "Impressão", "Prazo"]
  },
  {
    category: "Celebrante",
    description: "Veja estilo da cerimônia, personalização do texto e preparação do casal.",
    importantFields: ["Roteiro", "Reuniões", "Texto", "Ritual", "Duração", "Deslocamento", "Som", "Ensaio"]
  },
  {
    category: "Segurança",
    description: "Compare equipe, cobertura do evento e controle de entrada.",
    importantFields: ["Equipe", "Quantidade", "Horários", "Portaria", "Ronda", "Comunicação", "Uniforme", "Hora extra"]
  },
  {
    category: "Limpeza",
    description: "Entenda equipe, materiais e cobertura antes, durante e depois da festa.",
    importantFields: ["Equipe", "Materiais", "Banheiros", "Salão", "Cozinha", "Pré-evento", "Pós-evento", "Horas"]
  },
  {
    category: "Gerador",
    description: "Compare potência, autonomia e suporte técnico para evitar riscos no evento.",
    importantFields: ["Potência", "Autonomia", "Combustível", "Técnico", "Instalação", "Ruído", "Backup", "Horas"]
  }
];

export const mockQuoteProposals: QuoteProposal[] = [
  {
    id: "foto-1",
    vendor: "Luz de Domingo",
    category: "Fotografia",
    price: 14900,
    priceLabel: "R$ 14.900",
    shortSummary: "Cobertura completa do making of até a festa, com estética romântica, álbum e segundo fotógrafo.",
    compatibility: 92,
    compatibilityReasons: ["estilo romântico", "dentro do orçamento", "combina com referências salvas", "entrega leve"],
    sofiaNote: "Mari, esse fornecedor parece combinar bastante com o estilo delicado que vocês escolheram.",
    includes: ["cobertura completa: making of, cerimônia e festa", "10h de cobertura", "álbum 30x30", "drone", "reels", "segundo fotógrafo"],
    notIncluded: ["hospedagem fora de Campinas"],
    strengths: ["entrega premium", "olhar romântico", "boa cobertura para making of e festa"],
    attentionPoints: ["prazo de entrega um pouco maior"],
    experienceDifference: "Custa R$ 1.200 a mais, mas cobre do making of até a festa e inclui álbum, drone, reels e segundo fotógrafo.",
    emotionalReasons: ["estética", "segurança", "conexão"],
    isFavorite: true,
    details: {
      "Horas de cobertura": "10h",
      "Cobertura completa": true,
      "Making of até festa": true,
      "Fotos aproximadas": 650,
      "Álbum incluso": true,
      "Ensaio pré-wedding": false,
      Drone: true,
      Reels: true,
      "Segundo fotógrafo": true,
      "Prazo de entrega": "70 dias",
      "Estilo fotográfico": "romântico editorial"
    }
  },
  {
    id: "foto-2",
    vendor: "Casa Aurora Foto",
    category: "Fotografia",
    price: 13700,
    priceLabel: "R$ 13.700",
    shortSummary: "Proposta sensível, com cobertura da cerimônia e festa, mas sem making of completo.",
    compatibility: 84,
    compatibilityReasons: ["valor equilibrado", "estilo delicado", "boa conversa inicial"],
    sofiaNote: "Esse orçamento parece ótimo no valor, mas entrega menos cobertura em momentos paralelos.",
    includes: ["8h de cobertura", "galeria online", "reels"],
    notIncluded: ["making of completo", "ensaio pré-wedding", "álbum", "drone", "segundo fotógrafo"],
    strengths: ["preço mais leve", "prazo rápido", "atendimento acolhedor"],
    attentionPoints: ["sem segundo fotógrafo", "álbum cobrado à parte"],
    experienceDifference: "Sem making of completo e sem segundo fotógrafo, momentos paralelos podem não ser registrados com a mesma segurança.",
    emotionalReasons: ["atendimento", "custo-benefício"],
    isFavorite: false,
    details: {
      "Horas de cobertura": "8h",
      "Cobertura completa": false,
      "Making of até festa": false,
      "Fotos aproximadas": 480,
      "Álbum incluso": false,
      "Ensaio pré-wedding": false,
      Drone: false,
      Reels: true,
      "Segundo fotógrafo": false,
      "Prazo de entrega": "45 dias",
      "Estilo fotográfico": "natural e delicado"
    }
  },
  {
    id: "foto-3",
    vendor: "Olhar Sereno",
    category: "Fotografia",
    price: 16800,
    priceLabel: "R$ 16.800",
    shortSummary: "Experiência premium com cobertura completa, direção editorial e ensaio pré-wedding incluso.",
    compatibility: 88,
    compatibilityReasons: ["estética sofisticada", "entrega completa", "acima do orçamento planejado"],
    sofiaNote: "O diferencial aqui é a experiência premium e o álbum incluso, mas vale sentir se o investimento faz sentido.",
    includes: ["cobertura completa: making of, cerimônia e festa", "12h de cobertura", "álbum", "drone", "reels", "ensaio pré-wedding", "segundo fotógrafo"],
    notIncluded: ["deslocamento para pré-wedding fora da cidade"],
    strengths: ["experiência mais completa", "direção sofisticada", "ensaio incluso"],
    attentionPoints: ["acima do orçamento", "contrato mais rígido"],
    experienceDifference: "Entrega a experiência mais completa: making of até festa, ensaio pré-wedding e direção editorial, mas pede investimento maior.",
    emotionalReasons: ["estética", "segurança", "experiência premium"],
    isFavorite: false,
    details: {
      "Horas de cobertura": "12h",
      "Cobertura completa": true,
      "Making of até festa": true,
      "Fotos aproximadas": 800,
      "Álbum incluso": true,
      "Ensaio pré-wedding": true,
      Drone: true,
      Reels: true,
      "Segundo fotógrafo": true,
      "Prazo de entrega": "90 dias",
      "Estilo fotográfico": "editorial sofisticado"
    }
  },
  {
    id: "buffet-1",
    vendor: "Buffet Amora",
    category: "Buffet",
    price: 42000,
    priceLabel: "R$ 300 por pessoa",
    shortSummary: "Menu completo, bebidas inclusas e equipe bem avaliada para recepção elegante.",
    compatibility: 90,
    compatibilityReasons: ["dentro do orçamento por pessoa", "menu delicado", "inclui staff", "degustação inclusa"],
    sofiaNote: "Essa proposta deixa a experiência dos convidados bem redonda, especialmente por incluir bebidas e staff.",
    includes: ["entradas", "jantar", "sobremesa", "bebidas não alcoólicas", "staff", "degustação"],
    notIncluded: ["bebidas alcoólicas premium"],
    strengths: ["boa experiência para convidados", "sem muitas taxas surpresa", "flexibilidade no menu"],
    attentionPoints: ["confirmar rolha e taxa de hora extra"],
    experienceDifference: "Não é o menor preço, mas reduz bastante o risco de custos extras.",
    emotionalReasons: ["segurança", "custo-benefício", "atendimento"],
    isFavorite: true,
    details: {
      "Valor por pessoa": "R$ 300",
      Entradas: true,
      Jantar: true,
      Sobremesa: true,
      Bebidas: "não alcoólicas",
      Duração: "6h",
      Degustação: true,
      Staff: true,
      "Taxas extras": "hora extra e rolha"
    }
  },
  {
    id: "decor-1",
    vendor: "Flora Casa",
    category: "Decoração",
    price: 18500,
    priceLabel: "R$ 18.500",
    shortSummary: "Decoração floral delicada com cerimônia, recepção e mesa posta.",
    compatibility: 86,
    compatibilityReasons: ["visual romântico", "flores naturais", "combina com fazenda", "valor moderado"],
    sofiaNote: "A estética conversa muito com o clima romântico do casamento, mas iluminação precisa ser confirmada.",
    includes: ["flores naturais", "cerimônia", "recepção", "mesa posta", "desmontagem"],
    notIncluded: ["iluminação cênica completa"],
    strengths: ["visual delicado", "boa composição floral", "montagem e desmontagem inclusas"],
    attentionPoints: ["iluminação pode virar custo extra"],
    experienceDifference: "Entrega o visual principal, mas talvez precise complementar iluminação para a noite.",
    emotionalReasons: ["estética", "conexão", "custo-benefício"],
    isFavorite: false,
    details: {
      "Flores naturais": true,
      Cerimônia: true,
      Recepção: true,
      Iluminação: "parcial",
      "Mesa posta": true,
      Painel: true,
      Desmontagem: true,
      "Estilo visual": "romântico campestre"
    }
  }
];
