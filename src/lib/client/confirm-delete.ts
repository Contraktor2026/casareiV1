"use client";

type ConfirmPermanentDeleteOptions = {
  itemName?: string;
  context?: string;
};

export function confirmPermanentDelete({ itemName = "esta informação", context }: ConfirmPermanentDeleteOptions = {}) {
  const contextLine = context ? `\n\n${context}` : "";
  return window.confirm(`Tem certeza que deseja excluir ${itemName}?${contextLine}\n\nEssa ação não pode ser desfeita. Depois de excluir, não dá para voltar atrás.`);
}
