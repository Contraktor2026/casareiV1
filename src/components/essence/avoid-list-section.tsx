import { EditableChipSection } from "./editable-chip-section";

type AvoidListSectionProps = {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
};

export function AvoidListSection({ items, onAdd, onRemove }: AvoidListSectionProps) {
  return (
    <EditableChipSection
      title="O que queremos evitar"
      subtitle="Essa parte ajuda muito os fornecedores a acertarem o estilo sem depender de adivinhacao."
      sofiaText="Saber o que evitar ajuda muito os fornecedores a acertarem o estilo de vocês."
      items={items}
      tone="avoid"
      onAdd={onAdd}
      onRemove={onRemove}
    />
  );
}
