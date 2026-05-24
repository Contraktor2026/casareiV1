export type GuestTableSeat = {
  id: string;
  name: string;
  relation: string;
};

export type GuestTable = {
  id: string;
  name: string;
  capacity: number;
  guests: GuestTableSeat[];
  status: "Completa" | "Parcial" | "Disponível";
  suggestion: string;
};

export const guestTables: GuestTable[] = [
  table("mesa-01", "Mesa 01", 10, ["Maria Aparecida", "João Silva", "Fernanda Silva", "Carlos Eduardo", "Juliana Mendes", "Paulo Souza", "Ana Souza", "Luiza Mendes"], "Família próxima reunida com boa afinidade."),
  table("mesa-02", "Mesa 02", 10, ["Helena Martins", "Roberto Silva", "Renata Lima", "Marcos Lima", "Carla Oliveira", "Beatriz Mello", "Pedro Moraes", "Lia Moraes"], "Mesa familiar com convidados que já se conhecem."),
  table("mesa-03", "Mesa 03", 10, ["Camila Barros", "André Vieira", "Gustavo Ramos", "Bruno Santos", "Diego Almeida", "Paula Nogueira", "Julia Rocha", "Sofia Azevedo", "Ana Pereira", "Fernanda Costa"], "Completa, mas vale revisar restrições antes do buffet."),
  table("mesa-04", "Mesa 04", 10, ["Amigos da noiva", "Grupo do trabalho", "Vizinhos Casa 12", "Madrinhas", "Padrinhos", "Amigos do noivo"], "Pode receber mais quatro convidados com conforto."),
  table("mesa-05", "Mesa 05", 10, ["Família do noivo", "Tios", "Primos", "Amigos antigos", "Casal convidado", "Colegas próximos", "Acompanhante 1", "Acompanhante 2"], "Parcialmente organizada."),
  table("mesa-06", "Mesa 06", 10, ["Celebrante", "Cerimonial", "Fornecedor família", "Convidado especial", "Prima distante", "Amiga da mãe"], "Boa mesa para convidados de suporte e família."),
  table("mesa-07", "Mesa 07", 10, [], "Disponível para convidados pendentes."),
  table("mesa-08", "Mesa 08", 10, [], "Disponível para reorganização."),
  table("mesa-09", "Mesa 09", 10, ["Amigos do casal", "Casal da faculdade", "Grupo viagem", "Colegas do noivo", "Amiga da noiva", "Acompanhante"], "Ainda pode receber convidados sem mesa."),
  table("mesa-10", "Mesa 10", 10, ["Mesa do bolo", "Padrinhos próximos", "Madrinhas próximas", "Família central", "Casal especial", "Avós", "Pais", "Irmãos", "Cerimonial VIP", "Convidado honra"], "Mesa completa.")
];

export const unseatedGuests = ["Mariana e Bruno Costa", "Vizinhos - Casa 12", "Amigos do trabalho"];

export function getGuestTable(id: string) {
  return guestTables.find((item) => item.id === id) ?? guestTables[0];
}

function table(id: string, name: string, capacity: number, names: string[], suggestion: string): GuestTable {
  return {
    id,
    name,
    capacity,
    guests: names.map((guest, index) => ({
      id: `${id}-${index}`,
      name: guest,
      relation: index % 3 === 0 ? "Família" : index % 3 === 1 ? "Amigos" : "Convidado"
    })),
    status: names.length >= capacity ? "Completa" : names.length > 0 ? "Parcial" : "Disponível",
    suggestion
  };
}
