import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Target, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OnboardingData {
  daily_water_intake: number | null;
  health_goals: string[] | null;
  weight: number | null;
  height: number | null;
}

interface InsightChipsProps {
  onboardingData: OnboardingData | null;
}

const InsightChips: React.FC<InsightChipsProps> = ({ onboardingData }) => {
  const { t } = useTranslation();

  if (!onboardingData) return null;

  const chips: Array<{ icon: React.ElementType; label: string; key: string }> = [];

  // Water intake recommendation
  if (onboardingData.daily_water_intake) {
    const recommendedWater = onboardingData.daily_water_intake < 2 
      ? t('increaseWaterIntake') 
      : t('goodWaterIntake');
    chips.push({
      icon: Droplets,
      label: recommendedWater,
      key: 'water'
    });
  }

  // Primary health goal
  if (onboardingData.health_goals && onboardingData.health_goals.length > 0) {
    const primaryGoal = onboardingData.health_goals[0];
    chips.push({
      icon: Target,
      label: t(primaryGoal) || t('healthFocus'),
      key: 'goal'
    });
  }

  // BMI status
  if (onboardingData.weight && onboardingData.height) {
    const heightInMeters = onboardingData.height / 100;
    const bmi = onboardingData.weight / (heightInMeters * heightInMeters);
    let bmiStatus: string;
    
    if (bmi < 18.5) {
      bmiStatus = t('bmiUnderweight');
    } else if (bmi < 25) {
      bmiStatus = t('bmiNormal');
    } else if (bmi < 30) {
      bmiStatus = t('bmiOverweight');
    } else {
      bmiStatus = t('bmiObese');
    }
    
    chips.push({
      icon: Scale,
      label: bmiStatus,
      key: 'bmi'
    });
  }

  // Show max 3 chips
  const displayChips = chips.slice(0, 3);

  if (displayChips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-1.5 mt-2"
    >
      {displayChips.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <motion.span
            key={chip.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-medium"
          >
            <Icon className="w-2.5 h-2.5" />
            {chip.label}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default InsightChips;
