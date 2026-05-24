export type VendorStatus =
  | "Cotando"
  | "Em negociação"
  | "Aguardando resposta"
  | "Fechado"
  | "Contrato pendente"
  | "Contrato assinado"
  | "Pagamento pendente"
  | "Pago"
  | "Finalizado"
  | "Descartado";

export type VendorCategory =
  | "Fotografia"
  | "Filmagem"
  | "Buffet"
  | "Decoração"
  | "Cerimonial"
  | "Música/DJ"
  | "Espaço"
  | "Vestido"
  | "Traje do noivo"
  | "Beleza"
  | "Doces/Bolo"
  | "Convites"
  | "Transporte"
  | "Bar"
  | "Outros";

export type VendorPayment = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "pago" | "pendente" | "proximo" | "atrasado";
  method?: string;
  receipt?: string;
};

export type VendorDelivery = {
  id: string;
  title: string;
  status: "pendente" | "em andamento" | "concluido";
  dueDate: string;
  note: string;
  responsible: string;
};

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  responsible: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  site: string;
  city: string;
  address: string;
  serviceHours: string;
  totalValue: number;
  paidValue: number;
  nextPayment: string;
  contract: {
    sent: boolean;
    signed: boolean;
    signedAt?: string;
    fileName?: string;
    externalLink?: string;
    notes: string;
    clauses: string[];
  };
  included: string[];
  nextMilestone: string;
  importantNote: string;
  payments: VendorPayment[];
  deliveries: VendorDelivery[];
  notes: string;
  ceremonialNote: string;
  history: Array<{ label: string; date: string }>;
  sourceQuoteId?: string;
  budgetCategory?: string;
};
