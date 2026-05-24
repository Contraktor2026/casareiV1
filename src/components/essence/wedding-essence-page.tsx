"use client";

import { useMemo, useState } from "react";

import { AddReferenceModal } from "@/components/essence/add-reference-modal";
import { AvoidListSection } from "@/components/essence/avoid-list-section";
import { EssenceEmptyState } from "@/components/essence/essence-empty-state";
import { KeyReferencesGrid } from "@/components/essence/key-references-grid";
import { LoveListSection } from "@/components/essence/love-list-section";
import { VendorBriefingCard } from "@/components/essence/vendor-briefing-card";
import { WeddingEssenceHero } from "@/components/essence/wedding-essence-hero";
import { confirmPermanentDelete } from "@/lib/client/confirm-delete";
import { mockWeddingEssence } from "@/lib/mock/essence";
import type { KeyReference, ReferenceFormValues } from "@/types/essence";

const fallbackImage = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&auto=format&fit=crop";

export function WeddingEssencePage() {
  const [references, setReferences] = useState<KeyReference[]>(mockWeddingEssence.references);
  const [lovedItems, setLovedItems] = useState(mockWeddingEssence.lovedItems);
  const [avoidedItems, setAvoidedItems] = useState(mockWeddingEssence.avoidedItems);
  const [briefing, setBriefing] = useState(mockWeddingEssence.briefing);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<KeyReference | null>(null);

  const orderedReferences = useMemo(() => {
    return [...references].sort((a, b) => Number(b.isMain) - Number(a.isMain)).slice(0, 6);
  }, [references]);

  function openAddReference() {
    setEditingReference(null);
    setIsReferenceModalOpen(true);
  }

  function openEditReference(reference: KeyReference) {
    setEditingReference(reference);
    setIsReferenceModalOpen(true);
  }

  function saveReference(values: ReferenceFormValues, editingId?: string) {
    const reference: KeyReference = {
      id: editingId ?? `referencia-${Date.now()}`,
      title: values.title.trim(),
      category: values.category.trim(),
      reason: values.reason.trim() || "Referencia adicionada para orientar a direcao criativa do casamento.",
      emotionalTag: values.represents.trim() || values.tags[0] || "essencial",
      imageUrl: values.imageUrl.trim() || fallbackImage,
      tags: values.tags,
      origin: values.origin,
      relatedVendor: values.relatedVendor.trim() || undefined,
      isMain: editingReference?.isMain ?? false
    };

    setReferences((current) => {
      if (editingId) {
        return current.map((item) => (item.id === editingId ? reference : item));
      }
      return [reference, ...current].slice(0, 6);
    });
    setIsReferenceModalOpen(false);
    setEditingReference(null);
  }

  function removeReference(id: string) {
    const reference = references.find((item) => item.id === id);
    if (!confirmPermanentDelete({ itemName: reference?.title ?? "esta referência", context: "Ela será removida das inspirações do casamento." })) return;
    setReferences((current) => current.filter((reference) => reference.id !== id));
  }

  function removeLovedItem(item: string) {
    if (!confirmPermanentDelete({ itemName: item, context: "Esse item será removido da lista do que vocês amam." })) return;
    setLovedItems((current) => current.filter((value) => value !== item));
  }

  function removeAvoidedItem(item: string) {
    if (!confirmPermanentDelete({ itemName: item, context: "Esse item será removido da lista do que vocês querem evitar." })) return;
    setAvoidedItems((current) => current.filter((value) => value !== item));
  }

  function toggleMainReference(id: string) {
    setReferences((current) =>
      current.map((reference) => (reference.id === id ? { ...reference, isMain: !reference.isMain } : reference))
    );
  }

  return (
    <div className="space-y-7">
      <WeddingEssenceHero
        coupleName={mockWeddingEssence.coupleName}
        dominantStyle={mockWeddingEssence.dominantStyle}
        emotionalMood={mockWeddingEssence.emotionalMood}
        palette={mockWeddingEssence.palette}
        sofiaInsight={mockWeddingEssence.sofiaInsight}
      />

      {orderedReferences.length > 0 ? (
        <KeyReferencesGrid
          references={orderedReferences}
          onAdd={openAddReference}
          onEdit={openEditReference}
          onRemove={removeReference}
          onToggleMain={toggleMainReference}
        />
      ) : (
        <EssenceEmptyState onAdd={openAddReference} />
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        <LoveListSection
          items={lovedItems}
          onAdd={(item) => setLovedItems((current) => [...current, item])}
          onRemove={removeLovedItem}
        />
        <AvoidListSection
          items={avoidedItems}
          onAdd={(item) => setAvoidedItems((current) => [...current, item])}
          onRemove={removeAvoidedItem}
        />
      </section>

      <VendorBriefingCard briefing={briefing} onUpdate={setBriefing} />

      <section className="grid gap-3 rounded-[1.75rem] border border-white/80 bg-white/72 p-5 text-sm leading-6 text-casarei-text shadow-[0_14px_38px_rgba(114,36,62,0.06)] md:grid-cols-4">
        <Connection title="Cotações" text="Ajuda a Sofia a explicar se uma proposta combina com o estilo de vocês." />
        <Connection title="Fornecedores" text="Vira briefing visual para decoradora, fotógrafo, buffet e cerimonial." />
        <Connection title="Orçamento" text="Mostra quando uma referência pode pedir mais investimento ou ajustes." />
        <Connection title="Cronograma" text="Cria próximos passos como enviar briefing para fornecedores." />
      </section>

      <AddReferenceModal
        open={isReferenceModalOpen}
        reference={editingReference}
        onClose={() => setIsReferenceModalOpen(false)}
        onSave={saveReference}
      />
    </div>
  );
}

function Connection({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-casarei-primary-light/25 bg-white/78 p-4">
      <p className="font-serif text-xl text-casarei-primary-deep">{title}</p>
      <p className="mt-1 text-xs leading-5 text-casarei-muted">{text}</p>
    </div>
  );
}
