import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Target,
  ChevronDown,
  ChevronUp,
  Heart,
  TrendingUp,
  Lightbulb,
  Upload,
  UserCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { DetectedBiomarker } from '@/hooks/useDynamicBiomarkers';

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

interface LabResult {
  id: string;
  biological_age: number | null;
  metabolic_risk_score: string | null;
  inflammation_score: string | null;
  ai_recommendations: string[] | null;
  upload_date: string;
}

interface SmartSummaryCardProps {
  onboardingData: OnboardingData | null;
  labResult: LabResult | null;
  biomarkers: DetectedBiomarker[];
}

type SummaryTone = 'very_positive' | 'encouraging' | 'careful';

interface SummaryData {
  tone: SummaryTone;
  headline: string;
  body: string[];
  normalCount: number;
  attentionCount: number;
  positivePoints: string[];
  attentionPoints: string[];
  goalConnection: string | null;
  nextStep: string | null;
}

const SmartSummaryCard: React.FC<SmartSummaryCardProps> = ({ 
  onboardingData, 
  labResult, 
  biomarkers 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if we have enough data to show the summary
  const hasOnboardingData = onboardingData && (onboardingData.age || onboardingData.weight);
  const hasLabData = labResult !== null;
  const hasBiomarkers = biomarkers.length > 0;
  const hasAnyData = hasOnboardingData || hasLabData;

  // If no data at all, show CTA
  if (!hasAnyData) {
    return (
      <Card className="rounded-2xl shadow-card border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {t('smartSummaryNoDataTitle')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('smartSummaryNoDataDescription')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/edit-profile')}
              className="gap-2"
            >
              <UserCircle className="w-4 h-4" />
              {t('completeProfile')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary data
  const generateSummary = (): SummaryData => {
    const normalCount = biomarkers.filter(b => b.is_normal).length;
    const attentionCount = biomarkers.filter(b => !b.is_normal).length;
    const totalBiomarkers = biomarkers.length;
    
    const chronologicalAge = onboardingData?.age || null;
    const biologicalAge = labResult?.biological_age || null;
    const ageDifference = chronologicalAge && biologicalAge ? chronologicalAge - biologicalAge : null;
    
    const metabolicRisk = labResult?.metabolic_risk_score?.toLowerCase() || null;
    const inflammationScore = labResult?.inflammation_score?.toLowerCase() || null;
    
    const isHighRisk = metabolicRisk === 'alto' || metabolicRisk === 'high' || 
                       inflammationScore === 'alto' || inflammationScore === 'high';
    
    const allNormal = attentionCount === 0 && totalBiomarkers > 0;
    const mostNormal = totalBiomarkers > 0 && (normalCount / totalBiomarkers) >= 0.7;
    const youngerBioAge = ageDifference !== null && ageDifference > 0;

    // Determine tone
    let tone: SummaryTone = 'encouraging';
    if ((allNormal && !isHighRisk) || (youngerBioAge && mostNormal)) {
      tone = 'very_positive';
    } else if (isHighRisk || attentionCount > 3) {
      tone = 'careful';
    }

    // Generate headline
    let headline = '';
    switch (tone) {
      case 'very_positive':
        headline = t('smartSummaryHeadlinePositive');
        break;
      case 'encouraging':
        headline = t('smartSummaryHeadlineBalanced');
        break;
      case 'careful':
        headline = t('smartSummaryHeadlineAttention');
        break;
    }

    // Generate body sentences
    const body: string[] = [];
    
    // Age comparison insight
    if (ageDifference !== null) {
      if (ageDifference > 0) {
        body.push(t('smartSummaryAgeYounger', { years: ageDifference }));
      } else if (ageDifference < 0) {
        body.push(t('smartSummaryAgeOlder', { years: Math.abs(ageDifference) }));
      } else {
        body.push(t('smartSummaryAgeEqual'));
      }
    }

    // Biomarkers summary
    if (totalBiomarkers > 0) {
      if (allNormal) {
        body.push(t('smartSummaryAllNormal'));
      } else if (mostNormal) {
        body.push(t('smartSummaryMostNormal', { normal: normalCount, total: totalBiomarkers }));
      } else {
        body.push(t('smartSummarySomeAttention', { attention: attentionCount, total: totalBiomarkers }));
      }
    }

    // Lifestyle insights from onboarding
    const positivePoints: string[] = [];
    const attentionPoints: string[] = [];

    if (onboardingData) {
      // Sleep quality
      if (onboardingData.sleep_quality === 'good') {
        positivePoints.push(t('smartSummaryGoodSleep'));
      } else if (onboardingData.sleep_quality === 'poor') {
        attentionPoints.push(t('smartSummaryPoorSleep'));
      }

      // Training frequency
      if (onboardingData.training_frequency === '5+' || onboardingData.training_frequency === '3-4') {
        positivePoints.push(t('smartSummaryGoodActivity'));
      } else if (onboardingData.training_frequency === '0') {
        attentionPoints.push(t('smartSummaryNoActivity'));
      }

      // Hydration
      const weight = onboardingData.weight || 70;
      const recommendedWater = (weight * 35) / 1000;
      const actualWater = onboardingData.daily_water_intake || 0;
      if (actualWater >= recommendedWater * 0.8) {
        positivePoints.push(t('smartSummaryGoodHydration'));
      } else if (actualWater < recommendedWater * 0.5 || actualWater === 0) {
        attentionPoints.push(t('smartSummaryLowHydration'));
      }

      // Mental health
      if (onboardingData.mental_health_level && onboardingData.mental_health_level >= 8) {
        positivePoints.push(t('smartSummaryGoodMentalHealth'));
      } else if (onboardingData.mental_health_level && onboardingData.mental_health_level < 5) {
        attentionPoints.push(t('smartSummaryLowMentalHealth'));
      }

      // Alcohol
      if (onboardingData.alcohol_consumption === 'none') {
        positivePoints.push(t('smartSummaryNoAlcohol'));
      } else if (onboardingData.alcohol_consumption === 'high') {
        attentionPoints.push(t('smartSummaryHighAlcohol'));
      }
    }

    // Goal connection
    let goalConnection: string | null = null;
    const primaryGoal = onboardingData?.health_goals?.[0];
    if (primaryGoal) {
      const goalLabel = getGoalLabel(primaryGoal);
      goalConnection = t('smartSummaryGoalConnection', { goal: goalLabel });
    }

    // Next step suggestion
    let nextStep: string | null = null;
    if (attentionPoints.length > 0) {
      nextStep = t('smartSummaryNextStepAttention');
    } else if (!hasLabData) {
      nextStep = t('smartSummaryNextStepUpload');
    } else if (positivePoints.length > 0) {
      nextStep = t('smartSummaryNextStepMaintain');
    }

    return {
      tone,
      headline,
      body,
      normalCount,
      attentionCount,
      positivePoints: positivePoints.slice(0, 3),
      attentionPoints: attentionPoints.slice(0, 2),
      goalConnection,
      nextStep,
    };
  };

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

  const summary = generateSummary();

  const getToneStyles = (tone: SummaryTone) => {
    switch (tone) {
      case 'very_positive':
        return {
          gradient: 'from-success/5 via-success/10 to-emerald-500/5',
          border: 'border-success/30',
          iconBg: 'bg-success/20',
          iconColor: 'text-success',
        };
      case 'encouraging':
        return {
          gradient: 'from-primary/5 via-primary/10 to-blue-500/5',
          border: 'border-primary/30',
          iconBg: 'bg-primary/20',
          iconColor: 'text-primary',
        };
      case 'careful':
        return {
          gradient: 'from-warning/5 via-warning/10 to-amber-500/5',
          border: 'border-warning/30',
          iconBg: 'bg-warning/20',
          iconColor: 'text-warning',
        };
    }
  };

  const styles = getToneStyles(summary.tone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`rounded-2xl shadow-card bg-gradient-to-br ${styles.gradient} ${styles.border} overflow-hidden`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
              <Sparkles className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            {t('smartSummaryTitle')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Headline */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground leading-tight">
              {summary.headline}
            </h3>
            
            {/* Body sentences */}
            <div className="space-y-1">
              {summary.body.map((sentence, index) => (
                <p key={index} className="text-sm text-muted-foreground leading-relaxed">
                  {sentence}
                </p>
              ))}
            </div>
          </div>

          {/* Biomarker Badges */}
          {hasBiomarkers && (
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className="px-3 py-1.5 text-sm bg-success/10 text-success border-success/30 gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {summary.normalCount} {t('smartSummaryNormal')}
              </Badge>
              {summary.attentionCount > 0 && (
                <Badge 
                  variant="outline" 
                  className="px-3 py-1.5 text-sm bg-warning/10 text-warning border-warning/30 gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {summary.attentionCount} {t('smartSummaryAttention')}
                </Badge>
              )}
            </div>
          )}

          {/* Goal Connection */}
          {summary.goalConnection && (
            <div className="flex items-start gap-2 p-3 bg-background/60 rounded-lg border border-border/50">
              <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">{summary.goalConnection}</p>
            </div>
          )}

          {/* Expandable Detailed Section */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? t('smartSummaryViewLess') : t('smartSummaryViewMore')}
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-4 space-y-4"
                  >
                    <Separator />
                    
                    {/* Positive Points */}
                    {summary.positivePoints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-success" />
                          {t('smartSummaryPositivePointsTitle')}
                        </h4>
                        <ul className="space-y-1.5">
                          {summary.positivePoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Attention Points */}
                    {summary.attentionPoints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          {t('smartSummaryAttentionPointsTitle')}
                        </h4>
                        <ul className="space-y-1.5">
                          {summary.attentionPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Heart className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Step */}
                    {summary.nextStep && (
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          {t('smartSummaryNextStepTitle')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {summary.nextStep}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartSummaryCard;
