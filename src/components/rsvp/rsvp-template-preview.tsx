import type { RsvpTemplate } from "@/types/guests";

export function RSVPTemplatePreview({ template }: { template: RsvpTemplate }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-casarei-border-soft bg-white shadow-[0_16px_40px_rgba(114,36,62,0.08)]">
      <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${template.cover})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className={template.serif ? "font-serif text-2xl" : "text-xl font-semibold"}>Mariana & Rafael</p>
          <p className="text-xs">12 de outubro de 2026</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2">
          {template.palette.map((color) => (
            <span key={color} className="h-6 w-6 rounded-full border border-white shadow" style={{ backgroundColor: color }} />
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-casarei-muted">{template.mood}</p>
      </div>
    </div>
  );
}
