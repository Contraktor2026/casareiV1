"use client";

import { useCallback, useEffect, useState } from "react";

import { getOnboardingData, getSession, saveOnboardingData } from "@/lib/client/supabase-auth";
import { budgetRanges, onboardingPriorities, weddingStyleOptions } from "@/lib/mock/onboarding";
import type { OnboardingData } from "@/types/onboarding";

import { BasicInfoStep } from "./basic-info-step";
import { CoupleNameStep } from "./couple-name-step";
import { FinancialPlanningStep } from "./financial-planning-step";
import { GuestCountStep } from "./guest-count-step";
import { MobileOnboardingLayout } from "./mobile-onboarding-layout";
import { OnboardingLayout } from "./onboarding-layout";
import { OnboardingResult } from "./onboarding-result";
import { SofiaIntro } from "./sofia-intro";
import { SofiaJourneyLoader } from "./sofia-journey-loader";
import { WeddingDateStep } from "./wedding-date-step";
import { WeddingPrioritiesStep } from "./wedding-priorities-step";
import { WeddingStructureStep } from "./wedding-structure-step";
import { WeddingStyleSelector } from "./wedding-style-selector";
import { WelcomeHero } from "./welcome-hero";

const initialData: OnboardingData = {
  fullName: "",
  phone: "",
  email: "",
  city: "Campinas",
  state: "SP",
  styles: [],
  brideName: "",
  partnerName: "",
  weddingDate: "",
  weddingDateMode: "exact",
  guestRange: "100-150",
  guestCount: 0,
  weddingFormat: "Tradicional",
  ceremonyType: "No mesmo local da festa",
  partySize: "Media",
  vendorTypes: [],
  priorities: [],
  plannedBudget: ""
};

const totalSteps = 12;

export function OnboardingExperience() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedData = getOnboardingData();
    const session = getSession();
    const fullName = String(session?.user.user_metadata?.full_name ?? "");

    setData({
      ...initialData,
      ...savedData,
      fullName: savedData?.fullName || fullName || initialData.fullName,
      email: savedData?.email || session?.user.email || initialData.email
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveOnboardingData(data);
  }, [data, hydrated]);

  const next = useCallback(() => setStep((current) => Math.min(current + 1, totalSteps - 1)), []);
  const back = useCallback(() => setStep((current) => Math.max(current - 1, 0)), []);

  function toggleStyle(id: string) {
    setData((current) => ({
      ...current,
      styles: current.styles.includes(id) ? current.styles.filter((style) => style !== id) : [...current.styles, id]
    }));
  }

  function togglePriority(priority: string) {
    setData((current) => ({
      ...current,
      priorities: current.priorities.includes(priority)
        ? current.priorities.filter((item) => item !== priority)
        : [...current.priorities, priority]
    }));
  }

  function toggleVendorType(vendor: string) {
    setData((current) => ({
      ...current,
      vendorTypes: current.vendorTypes.includes(vendor)
        ? current.vendorTypes.filter((item) => item !== vendor)
        : [...current.vendorTypes, vendor]
    }));
  }

  return (
    <OnboardingLayout step={step} total={totalSteps}>
      <MobileOnboardingLayout>
        {step === 0 ? <WelcomeHero onStart={next} /> : null}
        {step === 1 ? <SofiaIntro onNext={next} onBack={back} /> : null}
        {step === 2 ? (
          <BasicInfoStep
            fullName={data.fullName}
            phone={data.phone}
            email={data.email}
            city={data.city}
            state={data.state}
            onChange={(field, value) => setData((current) => ({ ...current, [field]: value }))}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 3 ? (
          <WeddingStyleSelector
            options={weddingStyleOptions}
            selected={data.styles}
            onToggle={toggleStyle}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 4 ? (
          <CoupleNameStep
            brideName={data.brideName}
            partnerName={data.partnerName}
            onChange={(field, value) => setData((current) => ({ ...current, [field]: value }))}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 5 ? (
          <WeddingDateStep
            date={data.weddingDate}
            mode={data.weddingDateMode}
            onDateChange={(value) => setData((current) => ({ ...current, weddingDate: value }))}
            onModeChange={(mode) =>
              setData((current) => ({ ...current, weddingDateMode: mode, weddingDate: mode === "unknown" ? "" : current.weddingDate }))
            }
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 6 ? (
          <GuestCountStep
            range={data.guestRange}
            onPick={(guestRange, guestCount) => setData((current) => ({ ...current, guestRange, guestCount }))}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 7 ? (
          <WeddingStructureStep
            weddingFormat={data.weddingFormat}
            ceremonyType={data.ceremonyType}
            partySize={data.partySize}
            vendorTypesSelected={data.vendorTypes}
            onChange={(field, value) => setData((current) => ({ ...current, [field]: value }))}
            onToggleVendor={toggleVendorType}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 8 ? (
          <WeddingPrioritiesStep
            options={onboardingPriorities}
            selected={data.priorities}
            onToggle={togglePriority}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 9 ? (
          <FinancialPlanningStep
            ranges={budgetRanges}
            selected={data.plannedBudget}
            onPick={(plannedBudget) => setData((current) => ({ ...current, plannedBudget }))}
            onNext={next}
            onBack={back}
          />
        ) : null}
        {step === 10 ? <SofiaJourneyLoader onFinish={next} /> : null}
        {step === 11 ? <OnboardingResult data={data} onBack={back} /> : null}
      </MobileOnboardingLayout>
    </OnboardingLayout>
  );
}
