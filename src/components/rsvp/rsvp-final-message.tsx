import { CheckCircle2 } from "lucide-react";

export function RSVPFinalMessage({ accepted }: { accepted: boolean }) {
  return (
    <section className="rounded-[2rem] border border-casarei-primary-light/50 bg-white/92 p-7 text-center shadow-[0_22px_60px_rgba(114,36,62,0.12)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-casarei-primary-bg text-casarei-primary">
        <CheckCircle2 className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-5 font-serif text-3xl font-medium text-casarei-primary-deep">
        {accepted ? "Presença confirmada com carinho" : "Sua resposta foi registrada com carinho"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-casarei-text">
        {accepted
          ? "O casal vai amar celebrar esse dia com você."
          : "Obrigada por avisar. Sua mensagem chega aos noivos com muito cuidado."}
      </p>
    </section>
  );
}
