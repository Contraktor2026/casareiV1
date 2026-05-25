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
  "Cotando",
  "Em negociação",
  "Aguardando resposta",
  "Contrato pendente",
  "Pagamento pendente",
  "Finalizado"
];

export const mockVendorsFull: Vendor[] = [];
