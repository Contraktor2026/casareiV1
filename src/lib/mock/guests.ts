import type { Guest } from "@/types/guests";

const groups = ["Família da noiva", "Família do noivo", "Madrinhas", "Padrinhos", "Amigos do casal", "Trabalho"];

export const mockGuestsRich: Guest[] = [
  guest("1", "Carla", "Oliveira", "Carlinha", "Família da noiva", "Prima", "bride", "confirmed", true, 1, ["João"], 0, "Vegetariana", "Mesa 2"),
  guest("2", "Bruno", "Santos", "Bru", "Amigos do casal", "Amigo da faculdade", "couple", "pending", false, 1, [], 0, "", ""),
  guest("3", "Ana", "Pereira", "Ana", "Trabalho", "Colega da noiva", "bride", "declined", true, 0, [], 0, "", ""),
  guest("4", "Helena", "Martins", "Helena", "Família do noivo", "Tia", "groom", "confirmed", true, 0, [], 0, "Sem lactose", "Mesa 4"),
  guest("5", "Paula", "Nogueira", "Paulinha", "Madrinhas", "Madrinha", "bride", "confirmed", true, 1, ["Rafa"], 0, "", "Mesa 1"),
  guest("6", "Diego", "Almeida", "Di", "Amigos do casal", "Amigo", "couple", "viewed", true, 1, [], 0, "Vegano", ""),
  guest("7", "Renata", "Lima", "Re", "Família da noiva", "Tia", "bride", "confirmed", true, 1, ["Marcos"], 2, "Alergia a camarão", "Mesa 3"),
  guest("8", "Marcos", "Lima", "Marcos", "Família da noiva", "Tio", "bride", "confirmed", true, 0, [], 0, "", "Mesa 3"),
  guest("9", "Julia", "Rocha", "Ju", "Madrinhas", "Madrinha", "bride", "pending", false, 0, [], 0, "", ""),
  guest("10", "Pedro", "Moraes", "Pedro", "Padrinhos", "Padrinho", "groom", "confirmed", true, 1, ["Lia"], 1, "", "Mesa 1"),
  guest("11", "Lia", "Moraes", "Lia", "Padrinhos", "Companheira", "groom", "confirmed", true, 0, [], 0, "Gestante", "Mesa 1"),
  guest("12", "Fernanda", "Costa", "Fê", "Trabalho", "Chefe", "bride", "viewed", true, 0, [], 0, "", ""),
  guest("13", "André", "Vieira", "Dedé", "Amigos do casal", "Amigo do noivo", "groom", "pending", false, 1, [], 0, "", ""),
  guest("14", "Camila", "Barros", "Cami", "Amigos do casal", "Amiga", "couple", "confirmed", true, 0, [], 0, "Intolerância a glúten", "Mesa 5"),
  guest("15", "Sofia", "Azevedo", "Sofi", "Família do noivo", "Prima", "groom", "declined", true, 0, [], 0, "", ""),
  guest("16", "Gustavo", "Ramos", "Gus", "Padrinhos", "Padrinho", "groom", "pending", true, 1, [], 0, "", ""),
  guest("17", "Beatriz", "Mello", "Bia", "Madrinhas", "Madrinha", "bride", "confirmed", true, 1, ["Caio"], 0, "", "Mesa 1"),
  guest("18", "Roberto", "Silva", "Beto", "Família da noiva", "Avô", "bride", "confirmed", true, 0, [], 0, "Dieta com pouco sal", "Mesa 2")
];

export const guestGroups = groups;

export const rsvpDemo = {
  token: "demo",
  coupleName: "Mariana & Rafael",
  date: "12 de outubro de 2026",
  place: "Fazenda Bela Vista — Campinas/SP",
  phrase: "Estamos muito felizes em compartilhar esse momento com você.",
  guest: mockGuestsRich[0],
  cover:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80"
};

function guest(
  id: string,
  firstName: string,
  lastName: string,
  nickname: string,
  group: string,
  relation: string,
  side: Guest["side"],
  status: Guest["rsvp"]["status"],
  hasPhone: boolean,
  allowedCount: number,
  companionNames: string[],
  childCount: number,
  foodNote: string,
  tableName: string
): Guest {
  const viewed = status === "confirmed" || status === "declined" || status === "viewed";
  const responded = status === "confirmed" || status === "declined";
  return {
    id,
    firstName,
    lastName,
    nickname,
    phone: hasPhone ? `1199999${id.padStart(4, "0")}` : "",
    email: `${firstName.toLowerCase()}@email.com`,
    group,
    relation,
    side,
    notes: "",
    rsvp: {
      status,
      invitationSent: viewed || Number(id) % 2 === 0,
      sentAt: "2026-05-01",
      viewed,
      viewedAt: viewed ? "2026-05-03" : undefined,
      responded,
      respondedAt: responded ? "2026-05-04" : undefined,
      remindersSent: status === "pending" ? 1 : 0,
      token: `guest-${id}`,
      lastInteraction: responded ? "Respondeu há 3 dias" : viewed ? "Visualizou há 2 dias" : "Ainda não visualizou"
    },
    companions: {
      allowed: allowedCount > 0,
      allowedCount,
      confirmedCount: companionNames.length,
      names: companionNames
    },
    children: {
      count: childCount,
      names: Array.from({ length: childCount }).map((_, index) => ({ name: `Criança ${index + 1}`, age: 4 + index }))
    },
    food: {
      vegetarian: foodNote.toLowerCase().includes("vegetar"),
      vegan: foodNote.toLowerCase().includes("vegano"),
      intolerance: foodNote.includes("lactose") || foodNote.includes("glúten") ? foodNote : "",
      allergies: foodNote.includes("Alergia") ? foodNote : "",
      buffetNotes: foodNote
    },
    table: {
      name: tableName,
      group: tableName ? "Família e amigos próximos" : "",
      affinities: [group],
      avoidWith: []
    },
    internalNote: "",
    ceremonialNote: tableName ? "Receber na entrada principal." : "",
    buffetNote: foodNote,
    history: [
      { label: "convite enviado", date: "01/05" },
      ...(viewed ? [{ label: "visualizou", date: "03/05" }] : []),
      ...(responded ? [{ label: status === "confirmed" ? "confirmou" : "recusou", date: "04/05" }] : []),
      ...(status === "pending" ? [{ label: "lembrete enviado", date: "08/05" }] : [])
    ]
  };
}
