import Link from "next/link";
import { ArrowRight, CalendarHeart, CheckCircle2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  { icon: CheckCircle2, label: "Tarefas organizadas por prazo" },
  { icon: Users, label: "RSVP simples para convidados" },
  { icon: CalendarHeart, label: "Orçamento e fornecedores no mesmo lugar" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="max-w-2xl space-y-5">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-casarei-primary-dark">Casarei</p>
          <h1 className="font-serif text-5xl font-medium leading-none text-casarei-primary-deep md:text-7xl">
            Planeje o casamento com calma, clareza e beleza.
          </h1>
          <p className="max-w-xl text-base leading-7 text-casarei-text">
            Uma base mobile-first para organizar tarefas, orçamento, convidados e fornecedores antes de conectar Supabase e automações.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Começar teste fake
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/app">Ver app</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.label} className="p-4">
              <item.icon className="h-5 w-5 text-casarei-primary" aria-hidden />
              <p className="mt-3 text-sm font-medium text-casarei-text">{item.label}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
