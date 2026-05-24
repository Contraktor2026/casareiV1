import { RSVPPage } from "@/components/rsvp/rsvp-page";

export default function Page({ params }: { params: { token: string } }) {
  return <RSVPPage token={params.token} />;
}
