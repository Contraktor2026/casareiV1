export type SofiaRole = "sofia" | "bride";
export type SofiaStatus = "calm" | "attention" | "decision" | "almost";

export type SofiaWeddingContext = {
  brideName: string;
  partnerName: string;
  coupleName: string;
  weddingDate: string;
  location: string;
  style: string;
  guestCount: number;
  plannedBudget: number;
  committedBudget: number;
  priorities: string[];
};

export type SofiaMessage = {
  id: string;
  role: SofiaRole;
  text: string;
};

export type SofiaQuickPrompt = {
  id: string;
  label: string;
  response: string;
};

export type SofiaAction = {
  label: string;
  href?: string;
  kind?: "primary" | "secondary" | "whatsapp";
  copyText?: string;
};

export type SofiaPriority = {
  id: string;
  title: string;
  detail: string;
  action: SofiaAction;
};

export type SofiaAlert = {
  id: string;
  title: string;
  text: string;
  action: SofiaAction;
};

export type SofiaDecision = {
  id: string;
  title: string;
  reason: string;
  impact: string;
  action: SofiaAction;
};

export type SofiaPreparedMessage = {
  id: string;
  title: string;
  description: string;
  text: string;
};

export type SofiaCapability = {
  title: string;
  description: string;
  href: string;
};

export type SofiaMockData = {
  status: SofiaStatus;
  context: SofiaWeddingContext;
  heroMessage: string;
  capabilities: SofiaCapability[];
  initialMessages: SofiaMessage[];
  quickPrompts: SofiaQuickPrompt[];
  priorities: SofiaPriority[];
  alerts: SofiaAlert[];
  decisions: SofiaDecision[];
  preparedMessages: SofiaPreparedMessage[];
  guidance: {
    title: string;
    text: string;
    steps: string[];
  };
};
