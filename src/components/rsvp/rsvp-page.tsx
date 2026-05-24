"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { defaultRsvpSettings, getStoredRsvpSettings, type StoredRsvpSettings } from "@/lib/client/guests-rsvp-store";
import { mockGuestsRich, rsvpDemo } from "@/lib/mock/guests";
import { RSVPConfirmationCard } from "./rsvp-confirmation-card";
import { RSVPHero } from "./rsvp-hero";

export function RSVPPage({ token }: { token: string }) {
  const [settings, setSettings] = useState<StoredRsvpSettings>(defaultRsvpSettings);
  const guest = useMemo(() => mockGuestsRich.find((item) => item.rsvp.token === token) ?? rsvpDemo.guest, [token]);
  const data = { ...rsvpDemo, token, guest };

  useEffect(() => {
    setSettings(getStoredRsvpSettings());
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fffaf7,#fbeaf0)] pb-10">
      <RSVPHero coupleName={data.coupleName} date={data.date} place={data.place} phrase={data.phrase} cover={settings.coverImageUrl || data.cover} />
      <div className="mx-auto -mt-8 max-w-xl px-4 md:mt-8">
        <RSVPConfirmationCard guest={data.guest} settings={settings} />
        <div className="mt-6 text-center text-xs text-casarei-muted">
          Convite #{data.token} · feito com <Link href="/" className="font-semibold text-casarei-primary">Casarei</Link>
        </div>
      </div>
    </main>
  );
}
