import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type WhatsAppButtonProps = {
  phone?: string;
  message?: string;
  label?: string;
};

export function WhatsAppButton({ phone = "", message = "", label = "WhatsApp" }: WhatsAppButtonProps) {
  const cleanPhone = phone.replace(/\D/g, "");
  const href = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : "#";

  return (
    <Button asChild variant="whatsapp">
      <a href={href} aria-disabled={!cleanPhone}>
        <MessageCircle className="h-4 w-4" aria-hidden />
        {label}
      </a>
    </Button>
  );
}
