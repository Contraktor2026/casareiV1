import { AlertCircle, CalendarClock, Heart, Music, Wallet } from "lucide-react";

export function BudgetAlerts() {
  const alerts = [
    { label: "Decoração", text: "Está um pouco acima do previsto, mas ainda dá para ajustar escolhas.", icon: AlertCircle },
    { label: "Pagamentos", text: "Há 3 pagamentos nos próximos 30 dias.", icon: CalendarClock },
    { label: "Música", text: "Ainda está sem orçamento definido.", icon: Music },
    { label: "Margem", text: "Existe margem, mas ela precisa ser preservada para decisões finais.", icon: Wallet }
  ];

  return (
    <section className="rounded-[2rem] border border-casarei-primary-light/40 bg-white/88 p-5 shadow-[0_18px_50px_rgba(114,36,62,0.07)]">
      <div className="flex items-center gap-2 text-casarei-primary">
        <Heart className="h-5 w-5" aria-hidden />
        <h2 className="font-serif text-2xl text-casarei-primary-deep">Cuidados importantes</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.label}
              className="rounded-2xl border border-casarei-primary-light/50 bg-[linear-gradient(135deg,#fff7fa,#fffdf9)] p-4 shadow-[0_12px_30px_rgba(114,36,62,0.08)] ring-1 ring-white/70"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-casarei-primary text-white shadow-[0_10px_22px_rgba(212,83,126,0.25)]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{alert.label}</p>
                  <p className="mt-1 text-sm leading-6 text-casarei-text">{alert.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
