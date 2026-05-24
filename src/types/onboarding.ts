export type OnboardingData = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  styles: string[];
  brideName: string;
  partnerName: string;
  weddingDate: string;
  weddingDateMode: "exact" | "month" | "unknown";
  guestRange: string;
  guestCount: number;
  weddingFormat: string;
  ceremonyType: string;
  partySize: string;
  vendorTypes: string[];
  priorities: string[];
  plannedBudget: string;
};

export type WeddingStyleOption = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};
