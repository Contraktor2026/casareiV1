import { VendorDetailsPage } from "@/components/vendors/vendor-details-page";
import { mockVendorsFull } from "@/lib/mock/vendors";

export default function Page({ params }: { params: { id: string } }) {
  const vendor = mockVendorsFull.find((item) => item.id === params.id);

  return <VendorDetailsPage vendor={vendor ?? null} vendorId={params.id} />;
}
