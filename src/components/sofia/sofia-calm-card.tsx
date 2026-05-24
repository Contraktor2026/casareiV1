import { Card } from "@/components/ui/card";

export function SofiaCalmCard() {
  return (
    <Card className="border-white/90 bg-[linear-gradient(135deg,#fbeaf0,#fffdf9)] p-6 shadow-[0_20px_54px_rgba(114,36,62,0.09)]">
      <p className="font-serif text-3xl leading-tight text-casarei-primary-deep">
        Você não precisa organizar o casamento inteiro hoje.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-casarei-text">
        O importante é saber qual é o próximo passo. Eu te ajudo com isso. Vamos por partes.
      </p>
    </Card>
  );
}
