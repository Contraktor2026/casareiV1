import type { SofiaMessage } from "@/types/sofia";

export function SofiaMessageBubble({ message }: { message: SofiaMessage }) {
  const isSofia = message.role === "sofia";

  return (
    <div className={isSofia ? "flex justify-start" : "flex justify-end"}>
      <div
        className={
          isSofia
            ? "max-w-[88%] rounded-[1.4rem] rounded-tl-sm border border-white/80 bg-white/86 px-4 py-3 text-sm leading-6 text-casarei-text shadow-[0_12px_30px_rgba(114,36,62,0.06)]"
            : "max-w-[88%] rounded-[1.4rem] rounded-tr-sm bg-casarei-primary px-4 py-3 text-sm leading-6 text-white shadow-[0_12px_30px_rgba(212,83,126,0.18)]"
        }
      >
        {message.text}
      </div>
    </div>
  );
}
