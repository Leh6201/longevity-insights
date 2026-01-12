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
  Sparkles,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

interface CalculatedInsight {
  category: string;
  categoryTooltip?: string;
  categoryIcon: React.ReactNode;
  reportedValue: string;
  calculatedValue?: string;
  interpretation: string;
  reason: string;
  relatedGoals: string[];
  type: 'positive' | 'neutral' | 'attention';
  priority: number;
}

// ===== CALCULATION UTILITIES =====

const calculateBMI = (weight: number, heightCm: number): { value: number; status: string; statusKey: string } => {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  
  if (bmi < 18.5) {
    return { value: bmi, status: 'underweight', statusKey: 'bmiStatusUnderweight' };
  } else if (bmi < 25) {
    return { value: bmi, status: 'normal', statusKey: 'bmiStatusNormal' };
  } else if (bmi < 30) {
    return { value: bmi, status: 'overweight', statusKey: 'bmiStatusOverweight' };
  } else {
    return { value: bmi, status: 'obese', statusKey: 'bmiStatusObese' };
  }
};

const calculateRecommendedWaterIntake = (weight: number, age?: number | null): number => {
  // Base calculation: 35ml per kg of body weight
  let recommendedMl = weight * 35;
  
  // Age adjustment: older individuals need slightly more hydration
  if (age && age >= 50) {
    recommendedMl *= 1.1; // 10% increase for 50+
  } else if (age && age >= 65) {
    recommendedMl *= 1.15; // 15% increase for 65+
  }
  
  // Convert to liters
  return recommendedMl / 1000;
};

const getGoalRelations = (goalKey: string): string[] => {
  const relations: Record<string, string[]> = {
    'lose_weight': ['bmi', 'activity', 'hydration'],
    'improve_energy': ['sleep', 'hydration', 'activity', 'mental_health'],
    'improve_sleep': ['sleep', 'mental_health', 'alcohol'],
    'reduce_cholesterol': ['activity', 'alcohol', 'bmi'],
    'reduce_blood_sugar': ['bmi', 'activity', 'hydration'],
    'increase_longevity': ['bmi', 'activity', 'sleep', 'mental_health', 'hydration', 'alcohol'],
  };
  return relations[goalKey] || [];
};

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

  const getGoalDescription = (goal: string) => {
    const descriptions: Record<string, string> = {
      'lose_weight': t('goalDescLoseWeight', 'Foco em alcançar um peso saudável através de alimentação equilibrada e exercícios regulares'),
      'improve_energy': t('goalDescImproveEnergy', 'Aumentar seus níveis de energia diária com hábitos saudáveis e boa nutrição'),
      'improve_sleep': t('goalDescImproveSleep', 'Melhorar a qualidade e duração do sono para recuperação e bem-estar'),
      'reduce_cholesterol': t('goalDescReduceCholesterol', 'Reduzir níveis de colesterol para melhor saúde cardiovascular'),
      'reduce_blood_sugar': t('goalDescReduceBloodSugar', 'Controlar e estabilizar os níveis de glicose no sangue'),
      'increase_longevity': t('goalDescIncreaseLongevity', 'Adotar hábitos que promovam uma vida longa e saudável'),
    };
    return descriptions[goal] || '';
  };

  const getGoalIcon = (goal: string) => {
    const icons: Record<string, React.ReactNode> = {
      'lose_weight': <Scale className="w-3.5 h-3.5 text-orange-500" />,
      'improve_energy': <Sparkles className="w-3.5 h-3.5 text-yellow-500" />,
      'improve_sleep': <Moon className="w-3.5 h-3.5 text-indigo-500" />,
      'reduce_cholesterol': <Heart className="w-3.5 h-3.5 text-red-500" />,
      'reduce_blood_sugar': <Droplets className="w-3.5 h-3.5 text-blue-500" />,
      'increase_longevity': <Target className="w-3.5 h-3.5 text-emerald-500" />,
    };
    return icons[goal] || <Target className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  // Define consistent display order for goals
  const goalDisplayOrder = [
    'improve_sleep',
    'lose_weight',
    'improve_energy',
    'reduce_blood_sugar',
    'reduce_cholesterol',
    'increase_longevity',
  ];

  const getSortedGoals = (goals: string[]) => {
    return [...goals].sort((a, b) => {
      const indexA = goalDisplayOrder.indexOf(a);
      const indexB = goalDisplayOrder.indexOf(b);
      return indexA - indexB;
    });
  };

  const generateInsights = (): CalculatedInsight[] => {
    const insights: CalculatedInsight[] = [];
    if (!onboardingData) return insights;

    const { 
      age, weight, height, daily_water_intake, mental_health_level, 
      training_frequency, sleep_quality, alcohol_consumption, health_goals 
    } = onboardingData;

    const userGoals = health_goals || [];
    const allGoalRelations = userGoals.flatMap(g => getGoalRelations(g));

    // ===== BMI INSIGHT =====
    if (weight && height) {
      const bmiData = calculateBMI(weight, height);
      const bmiValue = bmiData.value.toFixed(1);
      const relatedGoals = userGoals.filter(g => getGoalRelations(g).includes('bmi'));
      
      let interpretation = '';
      let reason = '';
      let type: CalculatedInsight['type'] = 'neutral';
      let priority = 5;

      if (bmiData.status === 'underweight') {
        interpretation = t('insightBmiUnderweightInterpretation');
        reason = t('insightBmiUnderweightReason');
        type = 'attention';
        priority = 1;
      } else if (bmiData.status === 'normal') {
        interpretation = t('insightBmiNormalInterpretation');
        reason = t('insightBmiNormalReason');
        type = 'positive';
        priority = 8;
      } else if (bmiData.status === 'overweight') {
        interpretation = t('insightBmiOverweightInterpretation');
        reason = t('insightBmiOverweightReason');
        type = 'attention';
        priority = 2;
      } else {
        interpretation = t('insightBmiObeseInterpretation');
        reason = t('insightBmiObeseReason');
        type = 'attention';
        priority = 1;
      }

      insights.push({
        category: t('insightCategoryBmi'),
        categoryTooltip: t('insightCategoryBmiTooltip'),
        categoryIcon: <Scale className="w-5 h-5" />,
        reportedValue: `${weight} kg, ${height} cm`,
        calculatedValue: `IMC ${bmiValue} (${t(bmiData.statusKey)})`,
        interpretation,
        reason,
        relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
        type,
        priority: allGoalRelations.includes('bmi') ? priority - 3 : priority,
      });
    }

    // ===== HYDRATION INSIGHT =====
    if (weight && daily_water_intake !== null && daily_water_intake !== undefined) {
      const recommended = calculateRecommendedWaterIntake(weight, age);
      const difference = daily_water_intake - recommended;
      const relatedGoals = userGoals.filter(g => getGoalRelations(g).includes('hydration'));
      
      let interpretation = '';
      let reason = '';
      let type: CalculatedInsight['type'] = 'neutral';
      let priority = 5;

      if (difference >= 0) {
        interpretation = t('insightHydrationAdequateInterpretation');
        reason = t('insightHydrationAdequateReason');
        type = 'positive';
        priority = 8;
      } else if (difference >= -0.5) {
        interpretation = t('insightHydrationModerateInterpretation');
        reason = age && age >= 50 
          ? t('insightHydrationAgeReason')
          : t('insightHydrationModerateReason');
        type = 'neutral';
        priority = 5;
      } else {
        interpretation = t('insightHydrationLowInterpretation');
        reason = age && age >= 50 
          ? t('insightHydrationAgeLowReason')
          : t('insightHydrationLowReason');
        type = 'attention';
        priority = 2;
      }

      insights.push({
        category: t('insightCategoryHydration'),
        categoryIcon: <Droplets className="w-5 h-5" />,
        reportedValue: `${daily_water_intake.toFixed(1)} L/${t('insightDay')}`,
        calculatedValue: `${t('insightRecommended')}: ${recommended.toFixed(1)} L/${t('insightDay')}`,
        interpretation,
        reason,
        relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
        type,
        priority: allGoalRelations.includes('hydration') ? priority - 3 : priority,
      });
    }

    // ===== SLEEP INSIGHT =====
    if (sleep_quality) {
      const relatedGoals = userGoals.filter(g => getGoalRelations(g).includes('sleep'));
      
      let reportedValue = '';
      let interpretation = '';
      let reason = '';
      let type: CalculatedInsight['type'] = 'neutral';
      let priority = 5;

      if (sleep_quality === 'good') {
        reportedValue = t('sleepGood');
        interpretation = t('insightSleepGoodInterpretation');
        reason = t('insightSleepGoodReason');
        type = 'positive';
        priority = 8;
      } else if (sleep_quality === 'average') {
        reportedValue = t('sleepAverage');
        interpretation = t('insightSleepAverageInterpretation');
        reason = t('insightSleepAverageReason');
        type = 'neutral';
        priority = 5;
      } else if (sleep_quality === 'poor') {
        reportedValue = t('sleepPoor');
        interpretation = t('insightSleepPoorInterpretation');
        reason = t('insightSleepPoorReason');
        type = 'attention';
        priority = 1;
      }

      if (reportedValue) {
        insights.push({
          category: t('insightCategorySleep'),
          categoryIcon: <Moon className="w-5 h-5" />,
          reportedValue,
          interpretation,
          reason,
          relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
          type,
          priority: allGoalRelations.includes('sleep') ? priority - 3 : priority,
        });
      }
    }

    // ===== PHYSICAL ACTIVITY INSIGHT =====
    if (training_frequency) {
      const relatedGoals = userGoals.filter(g => getGoalRelations(g).includes('activity'));
      
      let reportedValue = '';
      let interpretation = '';
      let reason = '';
      let type: CalculatedInsight['type'] = 'neutral';
      let priority = 5;

      if (training_frequency === '5+') {
        reportedValue = t('training3');
        interpretation = t('insightActivityHighInterpretation');
        reason = t('insightActivityHighReason');
        type = 'positive';
        priority = 8;
      } else if (training_frequency === '3-4') {
        reportedValue = t('training2');
        interpretation = t('insightActivityModerateInterpretation');
        reason = t('insightActivityModerateReason');
        type = 'positive';
        priority = 7;
      } else if (training_frequency === '1-2') {
        reportedValue = t('training1');
        interpretation = t('insightActivityLowInterpretation');
        reason = t('insightActivityLowReason');
        type = 'neutral';
        priority = 4;
      } else if (training_frequency === '0') {
        reportedValue = t('training0');
        interpretation = t('insightActivityNoneInterpretation');
        reason = t('insightActivityNoneReason');
        type = 'attention';
        priority = 2;
      }

      if (reportedValue) {
        insights.push({
          category: t('insightCategoryActivity'),
          categoryIcon: <Dumbbell className="w-5 h-5" />,
          reportedValue,
          interpretation,
          reason,
          relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
          type,
          priority: allGoalRelations.includes('activity') ? priority - 3 : priority,
        });
      }
    }

    // ===== MENTAL HEALTH INSIGHT =====
    if (mental_health_level !== null && mental_health_level !== undefined) {
      const relatedGoals = userGoals.filter(g => getGoalRelations(g).includes('mental_health'));
      
      let interpretation = '';
      let reason = '';
      let type: CalculatedInsight['type'] = 'neutral';
      let priority = 5;

      if (mental_health_level >= 8) {
        interpretation = t('insightMentalHighInterpretation');
        reason = t('insightMentalHighReason');
        type = 'positive';
        priority = 8;
      } else if (mental_health_level >= 5) {
        interpretation = t('insightMentalModerateInterpretation');
        reason = t('insightMentalModerateReason');
        type = 'neutral';
        priority = 5;
      } else {
        interpretation = t('insightMentalLowInterpretation');
        reason = t('insightMentalLowReason');
        type = 'attention';
        priority = 1;
      }

      insights.push({
        category: t('insightCategoryMentalHealth'),
        categoryIcon: <Brain className="w-5 h-5" />,
        reportedValue: `${mental_health_level}/10`,
        interpretation,
        reason,
        relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
        type,
        priority: allGoalRelations.includes('mental_health') ? priority - 3 : priority,
      });
    }

    // ===== ALCOHOL INSIGHT =====
    if (alcohol_consumption && alcohol_consumption !== 'moderate' && alcohol_consumption !== 'low') {
      const relatedGoals = userGoals.filter(g => getGoalRelations(g).includes('alcohol'));
      
      let reportedValue = '';
      let interpretation = '';
      let reason = '';
      let type: CalculatedInsight['type'] = 'neutral';
      let priority = 6;

      if (alcohol_consumption === 'none') {
        reportedValue = t('alcoholNone');
        interpretation = t('insightAlcoholNoneInterpretation');
        reason = t('insightAlcoholNoneReason');
        type = 'positive';
        priority = 9;
      } else if (alcohol_consumption === 'high') {
        reportedValue = t('alcoholHigh');
        interpretation = t('insightAlcoholHighInterpretation');
        reason = t('insightAlcoholHighReason');
        type = 'attention';
        priority = 1;
      }

      if (reportedValue) {
        insights.push({
          category: t('insightCategoryAlcohol'),
          categoryIcon: <Wine className="w-5 h-5" />,
          reportedValue,
          interpretation,
          reason,
          relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
          type,
          priority: allGoalRelations.includes('alcohol') ? priority - 3 : priority,
        });
      }
    }

    // ===== AGE-BASED INSIGHT =====
    if (age && age >= 50) {
      const relatedGoals = userGoals.filter(g => 
        getGoalRelations(g).includes('hydration') || g === 'increase_longevity'
      );

      insights.push({
        category: t('insightCategoryAge'),
        categoryIcon: <Calendar className="w-5 h-5" />,
        reportedValue: `${age} ${t('insightYears')}`,
        interpretation: t('insightAgeInterpretation'),
        reason: t('insightAgeReason'),
        relatedGoals: relatedGoals.map(g => getGoalLabel(g)),
        type: 'neutral',
        priority: 6,
      });
    }

    // Sort by priority (lower number = higher priority)
    return insights.sort((a, b) => a.priority - b.priority);
  };

  const insights = generateInsights();

  const getTypeStyles = (type: CalculatedInsight['type']) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-success/10',
          border: 'border-success/20',
          icon: 'text-success',
          badge: 'bg-success/20 text-success border-success/30',
        };
      case 'attention':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          icon: 'text-warning',
          badge: 'bg-warning/20 text-warning border-warning/30',
        };
      default:
        return {
          bg: 'bg-muted/50',
          border: 'border-border',
          icon: 'text-muted-foreground',
          badge: 'bg-muted text-muted-foreground border-border',
        };
    }
  };

  const getTypeIcon = (type: CalculatedInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'attention':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
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
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              {t('yourGoals')}
            </CardTitle>
            <CardDescription>{t('goalsDriverDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              <TooltipProvider delayDuration={200}>
                {getSortedGoals(onboardingData.health_goals).map((goal, index) => (
                  <Tooltip key={goal}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 17 }}
                        className="cursor-pointer"
                      >
                        <Badge 
                          variant="secondary" 
                          className="px-2 py-1 text-xs flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 transition-shadow duration-200 hover:shadow-md"
                        >
                          {getGoalIcon(goal)}
                          {getGoalLabel(goal)}
                        </Badge>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[200px] text-center">
                      <p className="text-xs">{getGoalDescription(goal)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculated Insights Section */}
      <Card className="rounded-2xl shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="w-5 h-5 text-warning" />
            {t('calculatedInsights')}
          </CardTitle>
          <CardDescription>{t('calculatedInsightsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => {
              const styles = getTypeStyles(insight.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className={`w-full p-4 rounded-xl border ${styles.bg} ${styles.border} hover:opacity-90 transition-all text-left group`}
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={styles.icon}>
                          {insight.categoryIcon}
                        </div>
                        {insight.categoryTooltip ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-semibold text-foreground cursor-help underline decoration-dotted underline-offset-2">
                                  {insight.category}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{insight.categoryTooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="font-semibold text-foreground">
                            {insight.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                          {getTypeIcon(insight.type)}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Reported & Calculated Values */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{t('insightReported')}:</span>
                        <span className="font-medium text-foreground">{insight.reportedValue}</span>
                      </div>
                      {insight.calculatedValue && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{t('insightCalculated')}:</span>
                          <span className="font-medium text-foreground">{insight.calculatedValue}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-3 opacity-50" />

                    {/* Interpretation */}
                    <p className="text-sm text-foreground leading-relaxed mb-2">
                      {insight.interpretation}
                    </p>

                    {/* Reason */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.reason}
                    </p>

                    {/* Related Goals */}
                    {insight.relatedGoals.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">{t('insightRelatedTo')}:</span>
                          {insight.relatedGoals.map((goal, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs bg-background/50 px-2 py-0.5"
                            >
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                </motion.div>
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

      {/* Priority Focus Area - only show if goals exist and there are insights with attention type */}
      {onboardingData?.health_goals && onboardingData.health_goals.length > 0 && insights.some(i => i.type === 'attention') && (
        <Card className="rounded-2xl shadow-card bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
              {t('priorityFocus')}
            </CardTitle>
            <CardDescription>{t('priorityFocusDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.filter(i => i.type === 'attention').slice(0, 2).map((insight, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-background/80 rounded-lg border border-border/50"
                >
                  <div className="text-warning">
                    {insight.categoryIcon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">
                      {insight.category}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {insight.interpretation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default InsightsTab;
