import Link from "next/link";

import { Button } from "@/components/ui/button";

type WelcomeHeroProps = {
  onStart: () => void;
};

export function WelcomeHero({ onStart }: WelcomeHeroProps) {
  return (
    <div className="grid min-h-[68vh] overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(90deg,rgba(255,253,249,0.96),rgba(255,253,249,0.78),rgba(255,253,249,0.18)),url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop')] bg-cover bg-center p-6 shadow-[0_30px_90px_rgba(114,36,62,0.14)] md:p-12">
      <div className="flex max-w-2xl flex-col justify-center">
        <p className="text-sm font-semibold text-casarei-primary">Bem-vinda ao Casarei</p>
        <h1 className="mt-3 font-serif text-5xl font-medium leading-tight text-casarei-primary-deep md:text-7xl">
          Organizar um casamento não precisa ser pesado.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-casarei-text">
          O Casarei transforma o planejamento em uma jornada mais leve, clara e bonita.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={onStart}>
            Começar minha jornada
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/80">
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
