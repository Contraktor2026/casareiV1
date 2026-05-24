import type { OnboardingData } from "@/types/onboarding";

export type FakeSession = {
  name: string;
  email: string;
  createdAt: string;
};

export const fakeAuthKeys = {
  session: "casarei.fakeSession",
  onboarding: "casarei.onboardingData"
} as const;

export function saveFakeSession(session: FakeSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(fakeAuthKeys.session, JSON.stringify(session));
}

export function getFakeSession(): FakeSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(fakeAuthKeys.session);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as FakeSession;
  } catch {
    return null;
  }
}

export function saveOnboardingData(data: OnboardingData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(fakeAuthKeys.onboarding, JSON.stringify(data));
}

export function getOnboardingData(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(fakeAuthKeys.onboarding);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export function clearFakeTestData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(fakeAuthKeys.session);
  window.localStorage.removeItem(fakeAuthKeys.onboarding);
}
