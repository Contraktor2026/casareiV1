"use client";

import { getSupabaseBrowserConfig } from "@/lib/supabase/config";
import type { OnboardingData } from "@/types/onboarding";

export type CasareiSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
};

const sessionKey = "casarei.supabaseSession";
const onboardingKey = "casarei.onboardingData";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user: CasareiSession["user"];
};

export async function signInWithEmail(email: string, password: string) {
  return authRequest("token?grant_type=password", { email, password });
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  return authRequest("signup", {
    email,
    password,
    data: { full_name: fullName }
  });
}

export function saveSession(response: AuthResponse) {
  const session: CasareiSession = {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_at: response.expires_in ? Math.floor(Date.now() / 1000) + response.expires_in : undefined,
    user: response.user
  };

  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

export function getSession(): CasareiSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CasareiSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(sessionKey);
}

export function saveOnboardingData(data: OnboardingData) {
  window.localStorage.setItem(onboardingKey, JSON.stringify(data));
}

export function getOnboardingData(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(onboardingKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

async function authRequest(path: string, body: Record<string, unknown>) {
  const config = getSupabaseBrowserConfig();
  const response = await fetch(`${config.url}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.msg || error?.message || "Não foi possível autenticar. Verifique os dados e tente novamente.");
  }

  return (await response.json()) as AuthResponse;
}
