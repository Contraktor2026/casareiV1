import { GuestTableDetailPage } from "@/components/guests/guest-table-detail-page";

export default function PresenceTableDetailRoute({ params }: { params: { id: string } }) {
  return <GuestTableDetailPage tableId={params.id} />;
}
