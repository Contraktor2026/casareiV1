import { MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type SofiaFocusHeroProps = {
  onGuide: () => void;
  onChat: () => void;
};

export function SofiaFocusHero({ onGuide, onChat }: SofiaFocusHeroProps) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,#fffdf9_0%,#fff8f2_42%,#fbeaf0_100%)] px-5 py-10 text-center shadow-[0_28px_90px_rgba(114,36,62,0.12)] ring-1 ring-casarei-primary-light/20 md:px-10 md:py-16">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-casarei-primary shadow-[0_18px_44px_rgba(114,36,62,0.12)]">
        <Sparkles className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-medium leading-tight text-casarei-primary-deep md:text-6xl">
        Respira, Mari. Seu casamento está ganhando forma.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-casarei-text">
        Hoje eu cuidaria apenas do próximo passo.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={onGuide}>
          <Sparkles className="h-4 w-4" aria-hidden />
          Me orientar agora
        </Button>
        <Button type="button" size="lg" variant="outline" className="bg-white/80" onClick={onChat}>
          <MessageCircle className="h-4 w-4" aria-hidden />
          Conversar com Sofia
        </Button>
      </div>
    </section>
  );
}
