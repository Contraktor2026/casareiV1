export type GuestRsvpStatus = "confirmed" | "pending" | "declined" | "viewed";

export type GuestSide = "bride" | "groom" | "couple";

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phone: string;
  email: string;
  group: string;
  relation: string;
  side: GuestSide;
  notes: string;
  rsvp: {
    status: GuestRsvpStatus;
    invitationSent: boolean;
    sentAt?: string;
    viewed: boolean;
    viewedAt?: string;
    responded: boolean;
    respondedAt?: string;
    remindersSent: number;
    token: string;
    lastInteraction: string;
  };
  companions: {
    allowed: boolean;
    allowedCount: number;
    confirmedCount: number;
    names: string[];
  };
  children: {
    count: number;
    names: Array<{ name: string; age: number }>;
  };
  food: {
    vegetarian: boolean;
    vegan: boolean;
    intolerance: string;
    allergies: string;
    buffetNotes: string;
  };
  table: {
    name: string;
    group: string;
    affinities: string[];
    avoidWith: string[];
  };
  internalNote: string;
  ceremonialNote: string;
  buffetNote: string;
  history: Array<{ label: string; date: string }>;
};

export type RsvpTemplate = {
  id: string;
  name: string;
  description: string;
  mood: string;
  palette: string[];
  serif: boolean;
  cover: string;
};

export type RsvpTemplateSettings = {
  coverPhoto: string;
  couplePhoto: string;
  primaryColor: string;
  backgroundColor: string;
  fontStyle: string;
  heroPhrase: string;
  message: string;
  buttonText: string;
  countdown: boolean;
  music: boolean;
  map: boolean;
  dressCode: boolean;
  extraMessage: boolean;
  limitCompanions: boolean;
  allowChildren: boolean;
  requirePhone: boolean;
  requireCompanionName: boolean;
  requireFoodRestriction: boolean;
  ceremonyConfirmation: boolean;
  partyConfirmation: boolean;
  dinnerConfirmation: boolean;
  customFinalMessage: boolean;
};
