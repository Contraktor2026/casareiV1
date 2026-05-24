import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type GuestsStatsGridProps = {
  onShowConfirmed: () => void;
  onOpenBuffet: () => void;
  onOrganizeTables: () => void;
};

export function GuestsStatsGrid({ onShowConfirmed, onOpenBuffet, onOrganizeTables }: GuestsStatsGridProps) {
  const cards = [
    {
      eyebrow: "Confirmados",
      number: "87 confirmados",
      sub: "72 adultos • 15 crianças",
      helper: "18 convidados vão acompanhados",
      action: "Ver confirmados",
      onClick: onShowConfirmed,
      tone: "from-[#fff0f5] to-[#fffdf9]"
    },
    {
      eyebrow: "Pendências de confirmação",
      number: "42 aguardando resposta",
      sub: "14 visualizaram • 28 ainda não abriram",
      helper: "Um lembrete carinhoso pode ajudar",
      action: "Enviar lembrete",
      href: "/app/convidados/enviar",
      tone: "from-[#fbeaf0] to-[#fff8f8]"
    },
    {
      eyebrow: "Buffet & Restrições",
      number: "9 restrições alimentares",
      sub: "4 vegetarianos • 2 lactose • 1 frutos do mar",
      helper: "Esses detalhes ajudam o buffet a cuidar bem de todos",
      action: "Ver resumo buffet",
      onClick: onOpenBuffet,
      tone: "from-[#fff7e9] to-[#fffdf9]"
    },
    {
      eyebrow: "Organização",
      number: "10 mesas organizadas",
      sub: "3 convidados sem mesa",
      helper: "Quase tudo pronto para desenhar os lugares",
      action: "Organizar mesas",
      onClick: onOrganizeTables,
      tone: "from-[#fff2f5] to-[#fdf7f1]"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.eyebrow}
          className={`surface-lift flex min-h-[236px] flex-col justify-between border-white/80 bg-gradient-to-br ${card.tone} p-5 ring-1 ring-casarei-primary-light/20 md:p-6`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-casarei-primary">{card.eyebrow}</p>
            <h3 className="mt-4 font-serif text-3xl font-medium leading-tight text-casarei-primary-deep">{card.number}</h3>
            <p className="mt-3 text-sm font-medium text-casarei-text">{card.sub}</p>
            <p className="mt-3 text-sm leading-6 text-casarei-muted">{card.helper}</p>
          </div>

          {card.href ? (
            <Button asChild variant="outline" className="mt-6 w-full bg-white/80">
              <Link href={card.href}>{card.action}</Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" className="mt-6 w-full bg-white/80" onClick={card.onClick}>
              {card.action}
            </Button>
          )}
        </Card>
      ))}
    </section>
  );
}
