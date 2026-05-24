export type QuoteCategory = string;

export type QuoteProposal = {
  id: string;
  vendor: string;
  category: QuoteCategory;
  price: number;
  priceLabel: string;
  shortSummary: string;
  compatibility: number;
  compatibilityReasons: string[];
  sofiaNote: string;
  includes: string[];
  notIncluded: string[];
  strengths: string[];
  attentionPoints: string[];
  experienceDifference: string;
  emotionalReasons: string[];
  isFavorite: boolean;
  details: Record<string, string | boolean | number>;
};

export type QuoteCategoryGuide = {
  category: QuoteCategory;
  description: string;
  importantFields: string[];
};
