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

export const guestTables: GuestTable[] = [];
export const unseatedGuests: string[] = [];

export function getGuestTable(id: string) {
  return (
    guestTables.find((item) => item.id === id) ?? {
      id,
      name: "Mesa",
      capacity: 0,
      guests: [],
      status: "Disponível",
      suggestion: ""
    }
  );
}
