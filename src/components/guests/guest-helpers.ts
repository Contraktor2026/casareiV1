import type { Guest, GuestRsvpStatus } from "@/types/guests";

export function getGuestName(guest: Guest) {
  return `${guest.firstName} ${guest.lastName}`;
}

export function getGuestInitials(guest: Guest) {
  return `${guest.firstName[0] ?? ""}${guest.lastName[0] ?? ""}`.toUpperCase();
}

export const rsvpStatusLabel: Record<GuestRsvpStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  declined: "Recusou",
  viewed: "Visualizou"
};

export const rsvpStatusClass: Record<GuestRsvpStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  declined: "bg-rose-50 text-rose-700 ring-rose-100",
  viewed: "bg-casarei-primary-bg text-casarei-primary-deep ring-casarei-primary-light/50"
};

export function buildWhatsappLink(guest: Guest, message?: string) {
  const phone = guest.phone.replace(/\D/g, "");
  const text =
    message ??
    `Oi, ${guest.firstName}. Mariana & Rafael querem celebrar esse dia especial com você. Confirme sua presença aqui: http://localhost:3000/rsvp/${guest.rsvp.token}`;

  return `https://wa.me/55${phone}?text=${encodeURIComponent(text)}`;
}
