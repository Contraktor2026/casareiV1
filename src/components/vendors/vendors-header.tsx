import { Download, FileWarning, Plus, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VendorsHeader({ onAdd, onSummary }: { onAdd: () => void; onSummary: () => void }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,253,249,0.98),rgba(251,234,240,0.78))] p-5 shadow-[0_20px_60px_rgba(114,36,62,0.10)] md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-casarei-primary">Time do grande dia</p>
          <h1 className="mt-2 font-serif text-4xl font-medium text-casarei-primary-deep md:text-5xl">Fornecedores</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-casarei-text md:text-base">
            Organize contratos, contatos, pagamentos e entregas de quem vai fazer parte do grande dia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onAdd}><Plus className="h-4 w-4" aria-hidden />Adicionar fornecedor</Button>
          <Button type="button" variant="outline" className="bg-white"><FileWarning className="h-4 w-4" aria-hidden />Contratos pendentes</Button>
          <Button type="button" variant="outline" className="bg-white"><WalletCards className="h-4 w-4" aria-hidden />Próximos pagamentos</Button>
          <Button type="button" variant="outline" className="bg-white" onClick={onSummary}><Download className="h-4 w-4" aria-hidden />Exportar resumo</Button>
        </div>
      </div>
    </section>
  );
}
