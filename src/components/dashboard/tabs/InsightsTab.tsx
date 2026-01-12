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
  Target,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface InsightsTabProps {
  onboardingData: OnboardingData | null;
}

interface Insight {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'attention';
}

const InsightsTab: React.FC<InsightsTabProps> = ({ onboardingData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getGoalLabel = (goal: string) => {
    const goalLabels: Record<string, string> = {
      'lose_weight': t('loseWeight'),
      'improve_energy': t('improveEnergy'),
      'improve_sleep': t('improveSleep'),
      'reduce_cholesterol': t('reduceCholesterol'),
      'reduce_blood_sugar': t('reduceBloodSugar'),
      'increase_longevity': t('increaseLongevity'),
    };
    return goalLabels[goal] || goal;
  };

  const getGoalIcon = (goal: string) => {
    const icons: Record<string, React.ReactNode> = {
      'lose_weight': <Scale className="w-4 h-4" />,
      'improve_energy': <Sparkles className="w-4 h-4" />,
      'improve_sleep': <Moon className="w-4 h-4" />,
      'reduce_cholesterol': <Heart className="w-4 h-4" />,
      'reduce_blood_sugar': <Droplets className="w-4 h-4" />,
      'increase_longevity': <Target className="w-4 h-4" />,
    };
    return icons[goal] || <Target className="w-4 h-4" />;
  };

  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    if (!onboardingData) return insights;

    const { 
      weight, height, daily_water_intake, mental_health_level, 
      training_frequency, sleep_quality, alcohol_consumption 
    } = onboardingData;

    // BMI-based insight with detailed explanation
    if (weight && height) {
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      
      if (bmi < 18.5) {
        insights.push({
          icon: <Scale className="w-5 h-5" />,
          title: t('bmiUnderweight'),
          description: t('insightUnderweight'),
          type: 'attention',
        });
      } else if (bmi >= 18.5 && bmi < 25) {
        insights.push({
          icon: <Scale className="w-5 h-5" />,
          title: t('bmiNormal'),
          description: t('insightHealthyWeight'),
          type: 'positive',
        });
      } else if (bmi >= 25 && bmi < 30) {
        insights.push({
          icon: <Scale className="w-5 h-5" />,
          title: t('bmiOverweight'),
          description: t('insightOverweight'),
          type: 'attention',
        });
      } else if (bmi >= 30) {
        insights.push({
          icon: <Scale className="w-5 h-5" />,
          title: t('bmiObese'),
          description: t('insightObesity'),
          type: 'attention',
        });
      }
    }

    // Hydration insight
    if (daily_water_intake !== null && daily_water_intake !== undefined) {
      if (daily_water_intake >= 2) {
        insights.push({
          icon: <Droplets className="w-5 h-5" />,
          title: t('goodWaterIntake'),
          description: t('insightGoodHydration'),
          type: 'positive',
        });
      } else if (daily_water_intake >= 1.5) {
        insights.push({
          icon: <Droplets className="w-5 h-5" />,
          title: t('hydration'),
          description: t('insightModerateHydration'),
          type: 'neutral',
        });
      } else {
        insights.push({
          icon: <Droplets className="w-5 h-5" />,
          title: t('increaseWaterIntake'),
          description: t('insightLowHydration'),
          type: 'attention',
        });
      }
    }

    // Sleep quality insight
    if (sleep_quality) {
      if (sleep_quality === 'good') {
        insights.push({
          icon: <Moon className="w-5 h-5" />,
          title: t('sleepGood'),
          description: t('insightGoodSleep'),
          type: 'positive',
        });
      } else if (sleep_quality === 'average') {
        insights.push({
          icon: <Moon className="w-5 h-5" />,
          title: t('sleepAverage'),
          description: t('insightAverageSleep'),
          type: 'neutral',
        });
      } else if (sleep_quality === 'poor') {
        insights.push({
          icon: <Moon className="w-5 h-5" />,
          title: t('sleepPoor'),
          description: t('insightPoorSleep'),
          type: 'attention',
        });
      }
    }

    // Physical activity insight
    if (training_frequency) {
      if (training_frequency === '5+') {
        insights.push({
          icon: <Dumbbell className="w-5 h-5" />,
          title: t('training3'),
          description: t('insightHighActivity'),
          type: 'positive',
        });
      } else if (training_frequency === '3-4') {
        insights.push({
          icon: <Dumbbell className="w-5 h-5" />,
          title: t('training2'),
          description: t('insightModerateActivity'),
          type: 'positive',
        });
      } else if (training_frequency === '1-2') {
        insights.push({
          icon: <Dumbbell className="w-5 h-5" />,
          title: t('training1'),
          description: t('insightLowActivity'),
          type: 'neutral',
        });
      } else if (training_frequency === '0') {
        insights.push({
          icon: <Dumbbell className="w-5 h-5" />,
          title: t('training0'),
          description: t('insightNoActivity'),
          type: 'attention',
        });
      }
    }

    // Mental health insight
    if (mental_health_level !== null && mental_health_level !== undefined) {
      if (mental_health_level >= 8) {
        insights.push({
          icon: <Brain className="w-5 h-5" />,
          title: t('mentalHealth'),
          description: t('insightGreatMentalHealth'),
          type: 'positive',
        });
      } else if (mental_health_level >= 5) {
        insights.push({
          icon: <Brain className="w-5 h-5" />,
          title: t('mentalHealth'),
          description: t('insightModerateMentalHealth'),
          type: 'neutral',
        });
      } else {
        insights.push({
          icon: <Brain className="w-5 h-5" />,
          title: t('mentalHealth'),
          description: t('insightLowMentalHealth'),
          type: 'attention',
        });
      }
    }

    // Alcohol insight
    if (alcohol_consumption) {
      if (alcohol_consumption === 'none') {
        insights.push({
          icon: <Wine className="w-5 h-5" />,
          title: t('alcoholNone'),
          description: t('insightNoAlcohol'),
          type: 'positive',
        });
      } else if (alcohol_consumption === 'high') {
        insights.push({
          icon: <Wine className="w-5 h-5" />,
          title: t('alcoholHigh'),
          description: t('insightHighAlcohol'),
          type: 'attention',
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  const getTypeStyles = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-success/10',
          border: 'border-success/20',
          icon: 'text-success',
        };
      case 'attention':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: 'text-warning',
        };
      default:
        return {
          bg: 'bg-muted/50',
          border: 'border-border',
          icon: 'text-muted-foreground',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Health Goals Section */}
      {onboardingData?.health_goals && onboardingData.health_goals.length > 0 && (
        <Card className="rounded-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              {t('yourGoals')}
            </CardTitle>
            <CardDescription>{t('healthFocus')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {onboardingData.health_goals.map((goal, index) => (
                <motion.div
                  key={goal}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-2 text-sm flex items-center gap-2 bg-primary/10 text-primary border-primary/20"
                  >
                    {getGoalIcon(goal)}
                    {getGoalLabel(goal)}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Insights Section */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-warning" />
            {t('personalizedInsights')}
          </CardTitle>
          <CardDescription>{t('insightsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => {
              const styles = getTypeStyles(insight.type);
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => navigate('/edit-profile')}
                  className={`w-full p-4 rounded-xl border ${styles.bg} ${styles.border} hover:opacity-90 transition-all text-left group`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${styles.icon}`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('noInsightsYet')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priority Focus Area */}
      {onboardingData?.health_goals && onboardingData.health_goals.length > 0 && (
        <Card className="rounded-2xl shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('priorityFocus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-background/80 rounded-xl border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {getGoalIcon(onboardingData.health_goals[0])}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {getGoalLabel(onboardingData.health_goals[0])}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('primaryGoal')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default InsightsTab;
