import React, { createContext, useContext, useState, useCallback } from 'react';

interface GuestOnboardingData {
  age: number | null;
  biological_sex: string | null;
  weight: number | null;
  height: number | null;
  training_frequency: string | null;
  sleep_quality: string | null;
  alcohol_consumption: string | null;
  daily_water_intake: number | null;
  mental_health_level: number | null;
  health_goals: string[];
  current_medications: string | null;
  medical_history: string | null;
  completed: boolean;
}

interface GuestLabResult {
  id: string;
  biological_age: number | null;
  metabolic_risk_score: string | null;
  inflammation_score: string | null;
  ai_recommendations: string[] | null;
  total_cholesterol: number | null;
  hdl: number | null;
  ldl: number | null;
  triglycerides: number | null;
  glucose: number | null;
  hemoglobin: number | null;
  creatinine: number | null;
  ast: number | null;
  alt: number | null;
  ggt: number | null;
  vitamin_d: number | null;
  tsh: number | null;
  crp: number | null;
  upload_date: string;
  processing_time?: number;
}

interface GuestContextType {
  isGuest: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  guestOnboarding: GuestOnboardingData | null;
  setGuestOnboarding: (data: GuestOnboardingData) => void;
  guestLabResult: GuestLabResult | null;
  setGuestLabResult: (data: GuestLabResult) => void;
  showUpgradePrompt: boolean;
  setShowUpgradePrompt: (show: boolean) => void;
}

const defaultOnboarding: GuestOnboardingData = {
  age: null,
  biological_sex: null,
  weight: null,
  height: null,
  training_frequency: null,
  sleep_quality: null,
  alcohol_consumption: null,
  daily_water_intake: null,
  mental_health_level: null,
  health_goals: [],
  current_medications: null,
  medical_history: null,
  completed: false,
};

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [guestOnboarding, setGuestOnboarding] = useState<GuestOnboardingData | null>(null);
  const [guestLabResult, setGuestLabResult] = useState<GuestLabResult | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const enterGuestMode = useCallback(() => {
    setIsGuest(true);
    setGuestOnboarding(defaultOnboarding);
    setGuestLabResult(null);
  }, []);

  const exitGuestMode = useCallback(() => {
    setIsGuest(false);
    setGuestOnboarding(null);
    setGuestLabResult(null);
  }, []);

  return (
    <GuestContext.Provider value={{
      isGuest,
      enterGuestMode,
      exitGuestMode,
      guestOnboarding,
      setGuestOnboarding,
      guestLabResult,
      setGuestLabResult,
      showUpgradePrompt,
      setShowUpgradePrompt,
    }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};
