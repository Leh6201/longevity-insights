import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { supabase } from '@/integrations/supabase/client';
import InsightChips from './InsightChips';

interface OnboardingData {
  daily_water_intake: number | null;
  health_goals: string[] | null;
  weight: number | null;
  height: number | null;
}

interface DashboardHeaderProps {
  lastUpdate?: string;
  isGuest?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
  isGuest = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { guestOnboarding } = useGuest();
  const [userName, setUserName] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isGuest && guestOnboarding) {
        setOnboardingData({
          daily_water_intake: guestOnboarding.daily_water_intake,
          health_goals: guestOnboarding.health_goals,
          weight: guestOnboarding.weight,
          height: guestOnboarding.height,
        });
        return;
      }
      
      if (!user) return;
      
      const [profileResult, onboardingResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('onboarding_data')
          .select('daily_water_intake, health_goals, weight, height')
          .eq('user_id', user.id)
          .single()
      ]);
      
      if (profileResult.data?.name) {
        setUserName(profileResult.data.name);
      }
      
      if (onboardingResult.data) {
        setOnboardingData(onboardingResult.data);
      }
    };

    fetchUserData();
  }, [user, isGuest, guestOnboarding]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-card flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">
            {userName ? t('helloUser', { name: userName }) : t('dashboard')}
          </h1>
          <p className="text-xs text-muted-foreground">
            {lastUpdate ? `${t('updatedAt')} ${lastUpdate}` : t('updatedNow')}
          </p>
          <InsightChips onboardingData={onboardingData} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isGuest && (
          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
            {t('guestMode')}
          </span>
        )}
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-warning" />
          <div className="w-2 h-2 rounded-full bg-destructive" />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;