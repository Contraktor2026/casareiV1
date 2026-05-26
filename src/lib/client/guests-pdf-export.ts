"use client";

import type { Guest } from "@/types/guests";

function rsvpLabel(status: Guest["rsvp"]["status"]): string {
  if (status === "confirmed") return "Confirmado";
  if (status === "declined") return "Recusou";
  if (status === "viewed") return "Visualizou";
  return "Pendente";
}

function guestName(g: Guest): string {
  return [g.firstName, g.lastName].filter(Boolean).join(" ");
}

export async function exportGuestsToPdf(guests: Guest[], coupleNames?: string, weddingDate?: string) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(75, 46, 43);
  doc.text("Lista de Convidados", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(138, 113, 109);
  const subtitle = [coupleNames, weddingDate].filter(Boolean).join(" · ");
  if (subtitle) doc.text(subtitle, 14, 25);

  const confirmed = guests.filter((g) => g.rsvp.status === "confirmed").length;
  const pending = guests.filter((g) => g.rsvp.status === "pending").length;
  const declined = guests.filter((g) => g.rsvp.status === "declined").length;
  doc.text(`Total: ${guests.length}  |  Confirmados: ${confirmed}  |  Pendentes: ${pending}  |  Recusaram: ${declined}`, 14, 31);

  autoTable(doc, {
    startY: 36,
    head: [["Nome", "Grupo", "WhatsApp", "E-mail", "Acompanhantes", "Cuidados / Restrições", "RSVP"]],
    body: guests.map((g) => [
      guestName(g),
      g.group || "—",
      g.phone || "—",
      g.email || "—",
      g.companions.allowedCount > 0 ? `${g.companions.allowedCount} permitido(s)` : "—",
      [
        g.food.vegetarian ? "Vegetariano" : "",
        g.food.vegan ? "Vegano" : "",
        g.food.intolerance || "",
        g.children.count > 0 ? `${g.children.count} criança(s)` : "",
      ].filter(Boolean).join(", ") || "—",
      rsvpLabel(g.rsvp.status),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [212, 83, 126], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [255, 248, 244] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 45 },
      4: { cellWidth: 28 },
      5: { cellWidth: 50 },
      6: { cellWidth: 25 },
    },
  });

  const dateStr = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
  doc.save(`convidados-${dateStr}.pdf`);
}
