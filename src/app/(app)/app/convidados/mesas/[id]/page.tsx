import { redirect } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  redirect(`/app/presenca-mesas/mesas/${params.id}`);
}
