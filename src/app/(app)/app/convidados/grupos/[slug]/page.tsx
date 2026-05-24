import { GuestGroupPage } from "@/components/guests/guest-group-page";

export default function Page({ params }: { params: { slug: string } }) {
  return <GuestGroupPage slug={params.slug} />;
}
