import { CalendarDays } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const events = [
  { title: "Enviar RSVP para pendentes", date: "Esta semana" },
  { title: "Confirmar degustacao do buffet", date: "Em 12 dias" },
  { title: "Revisar contrato da decoração", date: "Próximo mês" }
];

export default function TimelinePage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Caminho até o sim" title="Timeline" description="Acompanhe os próximos momentos importantes do seu planejamento." />
      <section className="space-y-3">
        {events.map((event) => (
          <Card key={event.title} className="border-0 bg-white p-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
                <CalendarDays className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <p className="font-medium text-casarei-text">{event.title}</p>
                <p className="text-sm text-casarei-muted">{event.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
