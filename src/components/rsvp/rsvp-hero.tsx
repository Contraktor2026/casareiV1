import { CalendarDays, MapPin } from "lucide-react";

export function RSVPHero({ coupleName, date, place, phrase, cover }: { coupleName: string; date: string; place: string; phrase: string; cover: string }) {
  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-cover bg-center px-5 pb-10 pt-28 text-white shadow-[0_25px_70px_rgba(42,26,31,0.22)] md:mx-auto md:mt-6 md:max-w-5xl md:rounded-[2.5rem] md:px-10 md:pt-36" style={{ backgroundImage: `url(${cover})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a1f]/80 via-[#2a1a1f]/30 to-transparent" />
      <div className="relative max-w-2xl">
        <p className="text-sm font-medium tracking-wide">Convite de casamento</p>
        <h1 className="mt-3 font-serif text-5xl font-medium leading-none md:text-7xl">{coupleName}</h1>
        <div className="mt-5 grid gap-2 text-sm">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {date}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden />
            {place}
          </span>
        </div>
        <p className="mt-5 max-w-lg text-base leading-7 text-white/90">{phrase}</p>
      </div>
    </section>
  );
}
