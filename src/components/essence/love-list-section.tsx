import { EditableChipSection } from "./editable-chip-section";

type LoveListSectionProps = {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
};

export function LoveListSection({ items, onAdd, onRemove }: LoveListSectionProps) {
  return (
    <EditableChipSection
      title="O que amamos"
      subtitle="Os elementos que devem aparecer nas escolhas de fornecedores, decoração, fotos e experiência."
      items={items}
      tone="love"
      onAdd={onAdd}
      onRemove={onRemove}
    />
  );
}
