import type { Guest } from "@/types/guests";

export const mockGuestsRich: Guest[] = [];
export const guestGroups: string[] = [];

export const rsvpDemo = {
  token: "",
  coupleName: "Seu casamento",
  date: "Data a definir",
  place: "",
  phrase: "",
  guest: createBlankGuest(),
  cover: ""
};

function createBlankGuest(): Guest {
  return {
    id: "",
    firstName: "Convidado",
    lastName: "",
    nickname: "",
    phone: "",
    email: "",
    group: "",
    relation: "",
    side: "couple",
    notes: "",
    rsvp: {
      status: "pending",
      invitationSent: false,
      viewed: false,
      responded: false,
      remindersSent: 0,
      token: "",
      lastInteraction: ""
    },
    companions: { allowed: false, allowedCount: 0, confirmedCount: 0, names: [] },
    children: { count: 0, names: [] },
    food: { vegetarian: false, vegan: false, intolerance: "", allergies: "", buffetNotes: "" },
    table: { name: "", group: "", affinities: [], avoidWith: [] },
    internalNote: "",
    ceremonialNote: "",
    buffetNote: "",
    history: []
  };
}
