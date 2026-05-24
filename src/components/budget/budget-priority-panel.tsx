import { budgetPriorities } from "@/lib/mock/budget";

export function BudgetPriorityPanel() {
  return (
    <section className="rounded-[2rem] border border-white/90 bg-white/82 p-6 shadow-[0_16px_42px_rgba(114,36,62,0.075)] ring-1 ring-casarei-primary-light/15">
      <h2 className="font-serif text-2xl text-casarei-primary-deep">O que realmente importa para vocês</h2>
      <p className="mt-1 text-sm leading-6 text-casarei-muted">
        Isso ajuda a Sofia a orientar escolhas sem tratar tudo como número igual.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {budgetPriorities.map((priority) => (
          <span key={priority} className="rounded-full border border-casarei-primary-light/25 bg-casarei-primary-bg/80 px-4 py-2 text-sm font-medium text-casarei-primary-deep shadow-sm">
            {priority}
          </span>
        ))}
      </div>
    </section>
  );
}
