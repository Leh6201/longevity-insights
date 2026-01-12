import React from 'react';
import { motion } from 'framer-motion';
import { Target, Scale, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OnboardingData {
  daily_water_intake: number | null;
  health_goals: string[] | null;
  weight: number | null;
  height: number | null;
}

interface ProfileSummaryProps {
  onboardingData: OnboardingData | null;
}

interface SummaryItem {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ onboardingData }) => {
  const { t } = useTranslation();

  if (!onboardingData) return null;

  const items: SummaryItem[] = [];

  // Primary health goal
  if (onboardingData.health_goals && onboardingData.health_goals.length > 0) {
    const primaryGoal = onboardingData.health_goals[0];
    items.push({
      icon: Target,
      label: t('primaryGoal'),
      value: t(primaryGoal) || t('healthFocus'),
      iconColor: 'text-blue-500',
    });
  }

  // BMI status
  if (onboardingData.weight && onboardingData.height) {
    const heightInMeters = onboardingData.height / 100;
    const bmi = onboardingData.weight / (heightInMeters * heightInMeters);
    
    let bmiStatus: string;
    let bmiIconColor: string;
    
    if (bmi < 18.5) {
      bmiStatus = t('bmiUnderweight');
      bmiIconColor = 'text-amber-500';
    } else if (bmi < 25) {
      bmiStatus = t('bmiNormal');
      bmiIconColor = 'text-emerald-500';
    } else if (bmi < 30) {
      bmiStatus = t('bmiOverweight');
      bmiIconColor = 'text-amber-500';
    } else {
      bmiStatus = t('bmiObese');
      bmiIconColor = 'text-orange-500';
    }
    
    items.push({
      icon: Scale,
      label: t('bmiStatus'),
      value: bmiStatus,
      iconColor: bmiIconColor,
    });
  }

  // Hydration status
  if (onboardingData.daily_water_intake) {
    const hydrationStatus = onboardingData.daily_water_intake >= 2 
      ? t('goodWaterIntake') 
      : t('increaseWaterIntake');
    items.push({
      icon: Droplets,
      label: t('hydration'),
      value: hydrationStatus,
      iconColor: 'text-sky-500',
    });
  }

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-2"
    >
      <h3 className="text-sm font-medium text-muted-foreground">{t('profileSummary')}</h3>
      <div className="space-y-1.5">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="flex items-center gap-3 py-1.5"
            >
              <Icon className={`w-4 h-4 ${item.iconColor} shrink-0`} />
              <span className="text-sm text-muted-foreground">{item.label}:</span>
              <span className="text-sm font-medium text-foreground">{item.value}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProfileSummary;