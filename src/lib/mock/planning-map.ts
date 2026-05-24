import type { PlanningMapCategory, PlanningMapFiltersState, PlanningMapTask, PlanningMonthGroup } from "@/types/planning-map";

export const planningMapCategories: Array<"Todas" | PlanningMapCategory> = [
  "Todas",
  "Orçamento",
  "Convidados",
  "Local",
  "Buffet",
  "Fotografia",
  "Decoração",
  "Beleza",
  "Vestido",
  "Cerimônia",
  "Música",
  "Documentos",
  "Cotações",
  "Fornecedores",
  "Lua de mel",
  "Outros"
];

export const defaultPlanningMapFilters: PlanningMapFiltersState = {
  category: "Todas",
  status: "Todas",
  source: "Todas",
  showRemoved: false
};

export const planningMonthGroups: PlanningMonthGroup[] = [
  {
    id: "14-meses",
    title: "14 meses antes",
    sofiaMessage: "Esse mês é sobre construir a base, sem pressa e com intenção.",
    defaultExpanded: true
  },
  {
    id: "12-meses",
    title: "12 meses antes",
    sofiaMessage: "Agora começamos a transformar o sonho em decisões importantes.",
    defaultExpanded: true
  },
  {
    id: "9-meses",
    title: "9 meses antes",
    sofiaMessage: "Vamos deixando o estilo de vocês aparecer nas escolhas.",
    defaultExpanded: false
  },
  {
    id: "6-meses",
    title: "6 meses antes",
    sofiaMessage: "Essa etapa ajuda a deixar o caminho mais claro.",
    defaultExpanded: false
  },
  {
    id: "3-meses",
    title: "3 meses antes",
    sofiaMessage: "Aqui o planejamento começa a ficar mais prático e gostoso de acompanhar.",
    defaultExpanded: false
  },
  {
    id: "1-mes",
    title: "1 mês antes",
    sofiaMessage: "Vamos por partes. A reta final precisa de calma, não de correria.",
    defaultExpanded: false
  },
  {
    id: "semana",
    title: "Semana do casamento",
    sofiaMessage: "Você não precisa resolver tudo hoje. Agora é cuidar dos últimos detalhes.",
    defaultExpanded: false
  },
  {
    id: "depois",
    title: "Depois do casamento",
    sofiaMessage: "Depois do sim, ainda há pequenos encerramentos feitos com carinho.",
    defaultExpanded: false
  }
];

export const mockPlanningMapTasks: PlanningMapTask[] = [
  task("pm-1", "Definir orçamento inicial", "Estabeleça uma faixa confortável para guiar as decisões.", "Orçamento", "14-meses", "Alta", "Concluída", "sofia", "2026-03-10"),
  task("pm-2", "Criar lista base de convidados", "Monte uma primeira lista para entender o tamanho do casamento.", "Convidados", "14-meses", "Alta", "Concluída", "sofia", "2026-03-15"),
  task("pm-3", "Escolher estilo do casamento", "Separe referências de clima, paleta e sensação desejada.", "Outros", "14-meses", "Média", "Pendente", "manual", "2026-03-25"),
  task("pm-4", "Começar pesquisa de locais", "Liste espaços que combinem com o número de convidados.", "Local", "14-meses", "Alta", "Pendente", "sofia", "2026-04-01"),
  task("pm-5", "Fechar local", "Escolha o espaço e confirme disponibilidade da data.", "Local", "12-meses", "Alta", "Pendente", "sofia", "2026-05-10"),
  task("pm-6", "Pesquisar buffet", "Compare cardápios, degustação, estrutura e orçamento.", "Buffet", "12-meses", "Alta", "Atrasada", "sofia", "2026-05-12"),
  task("pm-7", "Pesquisar fotografia", "Busque fotógrafos com estilo próximo ao que vocês imaginam.", "Fotografia", "12-meses", "Média", "Pendente", "manual", "2026-05-20"),
  task("pm-8", "Definir cerimonialista", "Avalie apoio profissional para conduzir fornecedores e prazos.", "Fornecedores", "12-meses", "Média", "Pendente", "sofia", "2026-06-02"),
  task("pm-9", "Começar pesquisa de vestido", "Salve referências e agende primeiras visitas.", "Vestido", "9-meses", "Média", "Pendente", "sofia", "2026-08-01"),
  task("pm-10", "Escolher padrinhos", "Conversem com calma sobre quem estará perto nesse momento.", "Cerimônia", "9-meses", "Baixa", "Pendente", "manual", "2026-08-12"),
  task("pm-11", "Salvar referências de decoração", "Organize imagens para alinhar estilo com fornecedores.", "Decoração", "9-meses", "Baixa", "Pendente", "sofia", "2026-08-20"),
  task("pm-12", "Comparar cotações de buffet", "Veja custo-benefício, atendimento e o que está incluso.", "Cotações", "9-meses", "Média", "Pendente", "sofia", "2026-09-01"),
  task("pm-13", "Enviar save the date", "Avise convidados próximos para reservarem a data.", "Convidados", "6-meses", "Média", "Pendente", "sofia", "2026-11-01"),
  task("pm-14", "Fechar decoração", "Confirme proposta, paleta, flores e itens inclusos.", "Decoração", "6-meses", "Alta", "Pendente", "sofia", "2026-11-12"),
  task("pm-15", "Definir música/DJ", "Escolha o fornecedor responsável pela trilha da festa.", "Música", "6-meses", "Média", "Pendente", "manual", "2026-11-20"),
  task("pm-16", "Revisar orçamento", "Atualize gastos previstos e valores já fechados.", "Orçamento", "6-meses", "Alta", "Pendente", "sofia", "2026-12-01"),
  task("pm-17", "Enviar convites", "Envie convites e acompanhe confirmações com carinho.", "Convidados", "3-meses", "Alta", "Pendente", "sofia", "2027-02-01"),
  task("pm-18", "Iniciar RSVP", "Comece a coletar confirmações para fechar números.", "Convidados", "3-meses", "Alta", "Pendente", "sofia", "2027-02-04"),
  task("pm-19", "Fazer prova de cabelo e maquiagem", "Teste visual completo para ajustar detalhes.", "Beleza", "3-meses", "Média", "Pendente", "sofia", "2027-02-12"),
  task("pm-20", "Organizar lista final", "Revise convidados confirmados, acompanhantes e restrições.", "Convidados", "3-meses", "Alta", "Pendente", "sofia", "2027-02-25"),
  task("pm-21", "Confirmar fornecedores", "Cheque horários, entregas e contatos principais.", "Fornecedores", "1-mes", "Alta", "Pendente", "sofia", "2027-04-05"),
  task("pm-22", "Fechar número com buffet", "Informe o número final de convidados confirmados.", "Buffet", "1-mes", "Alta", "Pendente", "sofia", "2027-04-10"),
  task("pm-23", "Organizar mesas", "Distribua convidados de forma confortável e afetiva.", "Convidados", "1-mes", "Média", "Pendente", "sofia", "2027-04-15"),
  task("pm-24", "Confirmar cronograma do dia", "Alinhe horários de cerimônia, fotos, entradas e festa.", "Cerimônia", "1-mes", "Alta", "Pendente", "sofia", "2027-04-20"),
  task("pm-25", "Separar documentos", "Deixe documentos e comprovantes essenciais em uma pasta.", "Documentos", "semana", "Média", "Pendente", "sofia", "2027-05-06"),
  task("pm-26", "Confirmar horários", "Faça uma última checagem com beleza, foto e cerimonial.", "Fornecedores", "semana", "Alta", "Pendente", "sofia", "2027-05-07"),
  task("pm-27", "Preparar kit emergência", "Separe itens úteis para pequenos imprevistos.", "Outros", "semana", "Baixa", "Pendente", "manual", "2027-05-08"),
  task("pm-28", "Respirar. Está chegando.", "Reserve um momento para você. O dia de vocês está perto.", "Outros", "semana", "Baixa", "Pendente", "sofia", "2027-05-09"),
  task("pm-29", "Conferir pagamentos finais", "Revise pagamentos pendentes e comprovantes.", "Orçamento", "depois", "Média", "Pendente", "sofia", "2027-05-20"),
  task("pm-30", "Agradecer convidados", "Envie mensagens de carinho para quem celebrou com vocês.", "Convidados", "depois", "Baixa", "Pendente", "sofia", "2027-05-24"),
  task("pm-31", "Separar fotos favoritas", "Escolha imagens para álbum, família e lembranças.", "Fotografia", "depois", "Baixa", "Pendente", "manual", "2027-06-01"),
  task("pm-32", "Avaliar fornecedores", "Registre sua experiência para ajudar outras noivas.", "Fornecedores", "depois", "Baixa", "Pendente", "sofia", "2027-06-10"),
  task("pm-33", "Planejar ensaio pré-wedding", "Depois de escolher fotografia, alinhe data, local, figurino e se o ensaio está incluso.", "Fotografia", "9-meses", "Média", "Pendente", "sofia", "2026-08-05")
];

function task(
  id: string,
  title: string,
  description: string,
  category: PlanningMapTask["category"],
  monthGroup: PlanningMapTask["monthGroup"],
  priority: PlanningMapTask["priority"],
  status: PlanningMapTask["status"],
  source: PlanningMapTask["source"],
  dueDate: string
): PlanningMapTask {
  return {
    id,
    title,
    description,
    category,
    monthGroup,
    priority,
    status,
    source,
    suggestedBySofia: source === "sofia",
    dueDate,
    notes: ""
  };
}
