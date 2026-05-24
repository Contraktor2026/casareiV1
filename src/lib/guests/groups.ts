import type { Guest } from "@/types/guests";

export type GuestGroupTone = "green" | "pink" | "blue" | "purple" | "terracotta" | "neutral";

export type GuestGroupDefinition = {
  name: string;
  slug: string;
  tone: GuestGroupTone;
  matches: (guest: Guest) => boolean;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function slugifyGroup(value: string) {
  return normalize(value)
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const guestGroupDefinitions: GuestGroupDefinition[] = [
  {
    name: "Família dos noivos",
    slug: "familia-dos-noivos",
    tone: "green",
    matches: (guest) => normalize(guest.group).includes("familia")
  },
  {
    name: "Família da noiva",
    slug: "familia-da-noiva",
    tone: "pink",
    matches: (guest) => normalize(guest.group) === "familia da noiva"
  },
  {
    name: "Família do noivo",
    slug: "familia-do-noivo",
    tone: "blue",
    matches: (guest) => normalize(guest.group) === "familia do noivo"
  },
  {
    name: "Amigos da noiva",
    slug: "amigos-da-noiva",
    tone: "purple",
    matches: (guest) => normalize(guest.group) === "amigos do casal" && ["bride", "couple"].includes(guest.side)
  },
  {
    name: "Amigos do noivo",
    slug: "amigos-do-noivo",
    tone: "terracotta",
    matches: (guest) => normalize(guest.group) === "amigos do casal" && ["groom", "couple"].includes(guest.side)
  },
  {
    name: "Amigos do casal",
    slug: "amigos-do-casal",
    tone: "green",
    matches: (guest) => normalize(guest.group) === "amigos do casal"
  },
  {
    name: "Madrinhas",
    slug: "madrinhas",
    tone: "pink",
    matches: (guest) => normalize(guest.group) === "madrinhas"
  },
  {
    name: "Padrinhos",
    slug: "padrinhos",
    tone: "blue",
    matches: (guest) => normalize(guest.group) === "padrinhos"
  },
  {
    name: "Trabalho",
    slug: "trabalho",
    tone: "neutral",
    matches: (guest) => normalize(guest.group) === "trabalho"
  }
];

export function getGuestGroupBySlug(slug: string) {
  return guestGroupDefinitions.find((group) => group.slug === slug);
}

export function getGuestsForGroup(guests: Guest[], slug: string) {
  const group = getGuestGroupBySlug(slug);
  if (!group) return [];
  return guests.filter(group.matches);
}

export function getGuestGroupStats(guests: Guest[]) {
  return guestGroupDefinitions
    .map((group) => {
      const groupGuests = guests.filter(group.matches);
      const companions = groupGuests.reduce((sum, guest) => sum + guest.companions.confirmedCount + guest.children.count, 0);
      const confirmed = groupGuests.filter((guest) => guest.rsvp.status === "confirmed").length;
      const pending = groupGuests.filter((guest) => ["pending", "viewed"].includes(guest.rsvp.status)).length;
      const restrictions = groupGuests.filter((guest) => guest.food.buffetNotes).length;

      return {
        ...group,
        count: groupGuests.length,
        confirmed,
        pending,
        companions,
        restrictions,
        confirmedPercent: groupGuests.length ? Math.round((confirmed / groupGuests.length) * 100) : 0
      };
    })
    .filter((group) => group.count > 0);
}
