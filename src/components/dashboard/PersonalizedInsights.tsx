import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Droplets, 
  Moon, 
  Dumbbell, 
  Heart, 
  Scale,
  Brain,
  Wine,
  ChevronRight
} from 'lucide-react';

interface OnboardingData {
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  daily_water_intake?: number | null;
  mental_health_level?: number | null;
  health_goals?: string[] | null;
  training_frequency?: string | null;
  sleep_quality?: string | null;
  alcohol_consumption?: string | null;
  biological_sex?: string | null;
}

interface PersonalizedInsightsProps {
  onboardingData: OnboardingData | null;
}

interface Insight {
  icon: React.ReactNode;
  text: string;
  type: 'positive' | 'neutral' | 'attention';
  navigateTo: string;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ onboardingData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!onboardingData) return null;

  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    const { 
      weight, height, daily_water_intake, mental_health_level, 
      health_goals, training_frequency, sleep_quality, alcohol_consumption 
    } = onboardingData;

    // BMI-based insight
    if (weight && height) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      
      if (bmi < 18.5) {
        insights.push({
          icon: <Scale className="w-4 h-4" />,
          text: t('insightUnderweight'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      } else if (bmi >= 18.5 && bmi < 25) {
        insights.push({
          icon: <Scale className="w-4 h-4" />,
          text: t('insightHealthyWeight'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (bmi >= 25 && bmi < 30) {
        insights.push({
          icon: <Scale className="w-4 h-4" />,
          text: t('insightOverweight'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      } else if (bmi >= 30) {
        insights.push({
          icon: <Scale className="w-4 h-4" />,
          text: t('insightObesity'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Hydration insight
    if (daily_water_intake !== null && daily_water_intake !== undefined) {
      if (daily_water_intake >= 2) {
        insights.push({
          icon: <Droplets className="w-4 h-4" />,
          text: t('insightGoodHydration'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (daily_water_intake >= 1.5) {
        insights.push({
          icon: <Droplets className="w-4 h-4" />,
          text: t('insightModerateHydration'),
          type: 'neutral',
          navigateTo: '/edit-profile'
        });
      } else {
        insights.push({
          icon: <Droplets className="w-4 h-4" />,
          text: t('insightLowHydration'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Sleep quality insight
    if (sleep_quality) {
      if (sleep_quality === 'good') {
        insights.push({
          icon: <Moon className="w-4 h-4" />,
          text: t('insightGoodSleep'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (sleep_quality === 'average') {
        insights.push({
          icon: <Moon className="w-4 h-4" />,
          text: t('insightAverageSleep'),
          type: 'neutral',
          navigateTo: '/edit-profile'
        });
      } else if (sleep_quality === 'poor') {
        insights.push({
          icon: <Moon className="w-4 h-4" />,
          text: t('insightPoorSleep'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Physical activity insight
    if (training_frequency) {
      if (training_frequency === '5+') {
        insights.push({
          icon: <Dumbbell className="w-4 h-4" />,
          text: t('insightHighActivity'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (training_frequency === '3-4') {
        insights.push({
          icon: <Dumbbell className="w-4 h-4" />,
          text: t('insightModerateActivity'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (training_frequency === '1-2') {
        insights.push({
          icon: <Dumbbell className="w-4 h-4" />,
          text: t('insightLowActivity'),
          type: 'neutral',
          navigateTo: '/edit-profile'
        });
      } else if (training_frequency === '0') {
        insights.push({
          icon: <Dumbbell className="w-4 h-4" />,
          text: t('insightNoActivity'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Mental health insight
    if (mental_health_level !== null && mental_health_level !== undefined) {
      if (mental_health_level >= 8) {
        insights.push({
          icon: <Brain className="w-4 h-4" />,
          text: t('insightGreatMentalHealth'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (mental_health_level >= 5) {
        insights.push({
          icon: <Brain className="w-4 h-4" />,
          text: t('insightModerateMentalHealth'),
          type: 'neutral',
          navigateTo: '/edit-profile'
        });
      } else {
        insights.push({
          icon: <Brain className="w-4 h-4" />,
          text: t('insightLowMentalHealth'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Alcohol insight
    if (alcohol_consumption) {
      if (alcohol_consumption === 'none') {
        insights.push({
          icon: <Wine className="w-4 h-4" />,
          text: t('insightNoAlcohol'),
          type: 'positive',
          navigateTo: '/edit-profile'
        });
      } else if (alcohol_consumption === 'high') {
        insights.push({
          icon: <Wine className="w-4 h-4" />,
          text: t('insightHighAlcohol'),
          type: 'attention',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Health goals insight
    if (health_goals && health_goals.length > 0) {
      const goalKey = health_goals[0];
      const goalMap: Record<string, string> = {
        'lose_weight': t('insightGoalLoseWeight'),
        'improve_energy': t('insightGoalImproveEnergy'),
        'improve_sleep': t('insightGoalImproveSleep'),
        'reduce_cholesterol': t('insightGoalReduceCholesterol'),
        'reduce_blood_sugar': t('insightGoalReduceBloodSugar'),
        'increase_longevity': t('insightGoalIncreaseLongevity')
      };
      
      if (goalMap[goalKey]) {
        insights.push({
          icon: <Heart className="w-4 h-4" />,
          text: goalMap[goalKey],
          type: 'neutral',
          navigateTo: '/edit-profile'
        });
      }
    }

    // Return top 4 most relevant insights
    return insights.slice(0, 4);
  };

  const insights = generateInsights();

  if (insights.length === 0) return null;

  const getTypeStyles = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'attention':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lightbulb className="w-4 h-4" />
        <span className="text-sm font-medium">{t('personalizedInsights')}</span>
      </div>
      
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleClick(insight.navigateTo)}
            className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border transition-colors text-left group"
          >
            <span className={getTypeStyles(insight.type)}>
              {insight.icon}
            </span>
            <p className="text-sm text-foreground/80 leading-relaxed flex-1">
              {insight.text}
            </p>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalizedInsights;
