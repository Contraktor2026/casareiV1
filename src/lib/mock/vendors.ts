import type { Vendor, VendorCategory, VendorStatus } from "@/types/vendors";

export const vendorCategories: Array<"Todos" | VendorCategory> = [
  "Todos",
  "Fotografia",
  "Filmagem",
  "Buffet",
  "Decoração",
  "Cerimonial",
  "Música/DJ",
  "Espaço",
  "Vestido",
  "Traje do noivo",
  "Beleza",
  "Doces/Bolo",
  "Convites",
  "Transporte",
  "Bar",
  "Outros"
];

export const vendorStatuses: Array<"Todos" | VendorStatus> = [
  "Todos",
  "Fechado",
  "Em negociação",
  "Aguardando resposta",
  "Contrato pendente",
  "Pagamento pendente",
  "Finalizado"
];

export const mockVendorsFull: Vendor[] = [
  vendor("eduardo-fotografia", "Eduardo Fotografia", "Fotografia", "Fechado", 8500, 2500, "R$ 1.500 em 15/06", true, true, ["10h de cobertura", "making of até festa", "álbum", "reels", "segundo fotógrafo"], "Enviar lista de fotos importantes até 30 dias antes", "Pediu lista de fotos obrigatórias até 30 dias antes.", "foto-1"),
  vendor("buffet-amora", "Buffet Amora", "Buffet", "Pagamento pendente", 18000, 7000, "R$ 2.000 em 18/06", true, true, ["entradas", "jantar", "sobremesa", "staff", "bebidas não alcoólicas"], "Confirmar restrições alimentares após RSVP", "Revisar número final antes da última parcela.", "buffet-1"),
  vendor("flora-casa", "Flora Casa", "Decoração", "Contrato pendente", 15500, 3000, "R$ 1.200 em 05/07", true, false, ["flores naturais", "cerimônia", "recepção", "mesa posta"], "Confirmar iluminação e painel", "Iluminação ainda pode virar extra.", "decor-1"),
  vendor("casa-serena", "Casa Serena Cerimonial", "Cerimonial", "Contrato assinado", 5800, 1800, "R$ 1.000 em 22/06", true, true, ["cronograma do dia", "equipe no evento", "reuniões mensais"], "Reunião de fornecedores em agosto", "Cerimonial pediu contatos finais dos fornecedores."),
  vendor("fazenda-bela-vista", "Fazenda Bela Vista", "Espaço", "Fechado", 16000, 8000, "R$ 4.000 em 20/07", true, true, ["exclusividade", "mobiliário base", "plano B chuva", "estacionamento"], "Confirmar horário de montagem", "Plano B chuva já incluso."),
  vendor("som-da-serra", "Som da Serra DJ", "Música/DJ", "Em negociação", 4800, 0, "A definir", false, false, ["DJ", "som", "iluminação pista"], "Aguardando proposta revisada", "Confirmar se inclui microfone para cerimônia."),
  vendor("bella-make", "Bella Make Beauty", "Beleza", "Aguardando resposta", 3200, 0, "A definir", false, false, ["teste de cabelo", "teste de maquiagem", "dia da noiva"], "Enviar referências de maquiagem", "Sem contrato ainda."),
  vendor("atelie-luna", "Ateliê Luna", "Vestido", "Fechado", 6500, 3500, "R$ 1.000 em 10/07", true, true, ["vestido", "duas provas", "ajustes", "véu curto"], "Agendar próxima prova", "Levar sapato no próximo ajuste."),
  vendor("noivo-classic", "Noivo Classic", "Traje do noivo", "Cotando", 1800, 0, "A definir", false, false, ["terno completo", "ajustes", "gravata"], "Escolher tecido adequado ao clima", "Comparar aluguel e compra."),
  vendor("doce-aurora", "Doce Aurora", "Doces/Bolo", "Contrato assinado", 4200, 1200, "R$ 800 em 12/06", true, true, ["bolo", "600 doces", "mesa decorativa"], "Confirmar sabores finais", "Degustação aprovada."),
  vendor("luz-e-filme", "Luz & Filme", "Filmagem", "Em negociação", 7900, 0, "A definir", false, false, ["teaser", "filme completo", "drone", "reels"], "Confirmar prazo de entrega", "Boa estética, mas orçamento acima."),
  vendor("bar-jardim", "Bar Jardim", "Bar", "Aguardando resposta", 5200, 0, "A definir", false, false, ["bartenders", "drinks autorais", "insumos"], "Confirmar carta de drinks", "Sem WhatsApp alternativo cadastrado.")
];

function vendor(
  id: string,
  name: string,
  category: VendorCategory,
  status: VendorStatus,
  totalValue: number,
  paidValue: number,
  nextPayment: string,
  contractSent: boolean,
  contractSigned: boolean,
  included: string[],
  nextMilestone: string,
  importantNote: string,
  sourceQuoteId?: string
): Vendor {
  const paymentStatus = nextPayment === "A definir" ? "pendente" : status === "Pagamento pendente" ? "proximo" : "pendente";
  return {
    id,
    name,
    category,
    status,
    responsible: name.split(" ")[0],
    whatsapp: "5511999999999",
    phone: "(11) 99999-9999",
    email: `${id}@casarei.demo`,
    instagram: `@${id.replaceAll("-", "")}`,
    site: `https://${id}.com.br`,
    city: "Campinas - SP",
    address: "Endereço a confirmar",
    serviceHours: "Segunda a sexta, 9h às 18h",
    totalValue,
    paidValue,
    nextPayment,
    contract: {
      sent: contractSent,
      signed: contractSigned,
      signedAt: contractSigned ? "2026-05-04" : undefined,
      fileName: contractSent ? `${id}-contrato.pdf` : undefined,
      externalLink: contractSent ? "https://casarei.demo/contrato.pdf" : undefined,
      notes: contractSigned ? "Contrato guardado no Casarei." : "Aguardando assinatura ou envio do arquivo.",
      clauses: ["prazo de entrega", "cancelamento", "multa", "hora extra"]
    },
    included,
    nextMilestone,
    importantNote,
    payments: [
      { id: `${id}-p1`, name: "Entrada", amount: Math.round(totalValue * 0.3), dueDate: "2026-05-10", status: paidValue > 0 ? "pago" : paymentStatus, receipt: paidValue > 0 ? "comprovante.pdf" : undefined },
      { id: `${id}-p2`, name: "Parcela intermediária", amount: Math.round(totalValue * 0.35), dueDate: "2026-06-15", status: paymentStatus },
      { id: `${id}-p3`, name: "Parcela final", amount: Math.round(totalValue * 0.35), dueDate: "2026-09-15", status: "pendente" }
    ],
    deliveries: included.map((item, index) => ({
      id: `${id}-d${index}`,
      title: item,
      status: index === 0 && contractSigned ? "em andamento" : "pendente",
      dueDate: "2026-09-30",
      note: "Confirmar detalhes com o fornecedor.",
      responsible: name.split(" ")[0]
    })),
    notes: importantNote,
    ceremonialNote: `${category}: ${nextMilestone}`,
    history: [
      { label: "fornecedor adicionado", date: "01/05" },
      { label: "orçamento recebido", date: "03/05" },
      ...(contractSent ? [{ label: "contrato enviado", date: "05/05" }] : []),
      ...(contractSigned ? [{ label: "contrato assinado", date: "08/05" }] : []),
      ...(paidValue > 0 ? [{ label: "pagamento registrado", date: "10/05" }] : [])
    ],
    sourceQuoteId,
    budgetCategory: category
  };
}
