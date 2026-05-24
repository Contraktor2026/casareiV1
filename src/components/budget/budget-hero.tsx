import { BudgetProgressBar } from "./budget-progress-bar";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function BudgetHero({ planned, committed, available }: { planned: number; committed: number; available: number }) {
  const progress = Math.round((committed / planned) * 100);

  return (
    <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#fffdf9_0%,#fff8f2_45%,#fbeaf0_100%)] p-5 shadow-[0_26px_80px_rgba(114,36,62,0.13)] ring-1 ring-casarei-primary-light/20 md:p-8">
      <p className="text-sm font-semibold text-casarei-primary">Cuidado financeiro</p>
      <div className="mt-3 grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-5xl">Orçamento</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-text md:text-base">
            Visualize gastos, prioridades e decisões do casamento de forma leve e organizada.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/90 bg-white/88 p-5 shadow-[0_22px_58px_rgba(114,36,62,0.12)] ring-1 ring-casarei-primary-light/25 backdrop-blur">
          <div className="grid gap-5 sm:grid-cols-[116px_1fr] sm:items-center">
            <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(232,220,215,0.8),0_16px_34px_rgba(114,36,62,0.12)] sm:mx-0">
              <div
                className="absolute inset-2 rounded-full"
                style={{
                  background: `conic-gradient(var(--casarei-primary) ${progress * 3.6}deg, #f3e8e5 0deg)`
                }}
              />
              <div className="relative grid h-[76px] w-[76px] place-items-center rounded-full bg-[#fffdf9] text-center">
                <strong className="font-serif text-3xl font-medium leading-none text-casarei-primary-deep">{progress}%</strong>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-casarei-primary">usado</span>
              </div>
            </div>
            <div>
              <p className="font-serif text-2xl leading-tight text-casarei-primary-deep">
                {progress}% do planejamento financeiro já está tomando forma.
              </p>
              <div className="mt-4">
                <BudgetProgressBar value={progress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <HeroNumber label="Valor planejado" value={money(planned)} />
        <HeroNumber label="Valor comprometido" value={money(committed)} />
        <HeroNumber label="Ainda disponível" value={money(available)} />
      </div>
    </section>
  );
}

function HeroNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/90 bg-white/88 p-5 shadow-[0_14px_34px_rgba(114,36,62,0.07)] ring-1 ring-casarei-primary-light/15">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-muted">{label}</p>
      <strong className="mt-3 block font-serif text-3xl font-medium text-casarei-primary-deep">{value}</strong>
    </div>
  );
}
