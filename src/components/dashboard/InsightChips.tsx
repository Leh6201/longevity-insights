import React from 'react';
import { motion } from 'framer-motion';
import { Target, Scale } from 'lucide-react';
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

interface ChipConfig {
  icon: React.ElementType;
  label: string;
  key: string;
  iconColor: string;
  labelColor?: string;
}

const InsightChips: React.FC<InsightChipsProps> = ({ onboardingData }) => {
  const { t } = useTranslation();

  if (!onboardingData) return null;

  const chips: ChipConfig[] = [];

  // Primary health goal (with target icon in blue accent)
  if (onboardingData.health_goals && onboardingData.health_goals.length > 0) {
    const primaryGoal = onboardingData.health_goals[0];
    chips.push({
      icon: Target,
      label: t(primaryGoal) || t('healthFocus'),
      key: 'goal',
      iconColor: 'text-blue-500',
    });
  }

  // BMI status with semantic colors
  if (onboardingData.weight && onboardingData.height) {
    const heightInMeters = onboardingData.height / 100;
    const bmi = onboardingData.weight / (heightInMeters * heightInMeters);
    
    let bmiStatus: string;
    let bmiIconColor: string;
    let bmiLabelColor: string;
    
    if (bmi < 18.5) {
      bmiStatus = t('bmiUnderweight');
      bmiIconColor = 'text-amber-500';
      bmiLabelColor = 'text-amber-600';
    } else if (bmi < 25) {
      bmiStatus = t('bmiNormal');
      bmiIconColor = 'text-emerald-500';
      bmiLabelColor = 'text-emerald-600';
    } else if (bmi < 30) {
      bmiStatus = t('bmiOverweight');
      bmiIconColor = 'text-amber-500';
      bmiLabelColor = 'text-amber-600';
    } else {
      bmiStatus = t('bmiObese');
      bmiIconColor = 'text-orange-500';
      bmiLabelColor = 'text-orange-600';
    }
    
    chips.push({
      icon: Scale,
      label: bmiStatus,
      key: 'bmi',
      iconColor: bmiIconColor,
      labelColor: bmiLabelColor,
    });
  }

  // Show max 2 chips
  const displayChips = chips.slice(0, 2);

  if (displayChips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-2 mt-2.5"
    >
      {displayChips.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <motion.span
            key={chip.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/40 text-xs font-medium"
          >
            <Icon className={`w-3.5 h-3.5 ${chip.iconColor}`} />
            <span className={chip.labelColor || 'text-foreground/80'}>
              {chip.label}
            </span>
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default InsightChips;
