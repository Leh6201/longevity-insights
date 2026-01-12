import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Droplets, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HydrationCardProps {
  reportedIntake: number | null | undefined;
  weight: number | null | undefined;
  age: number | null | undefined;
}

type HydrationStatus = 'adequate' | 'low' | 'critical' | 'unknown';

const calculateRecommendedWaterIntake = (weight: number, age?: number | null): number => {
  // Base calculation: 35ml per kg of body weight
  let recommendedMl = weight * 35;
  
  // Age adjustment: older individuals need slightly more hydration
  if (age && age >= 65) {
    recommendedMl *= 1.15; // 15% increase for 65+
  } else if (age && age >= 50) {
    recommendedMl *= 1.1; // 10% increase for 50+
  }
  
  // Convert to liters
  return recommendedMl / 1000;
};

const getHydrationStatus = (percentage: number): HydrationStatus => {
  if (percentage >= 90) return 'adequate';
  if (percentage >= 70) return 'low';
  return 'critical';
};

const HydrationCard: React.FC<HydrationCardProps> = ({ reportedIntake, weight, age }) => {
  const { t } = useTranslation();

  // Handle missing data
  const hasReportedData = reportedIntake !== null && reportedIntake !== undefined;
  const hasWeight = weight !== null && weight !== undefined;

  const recommendedIntake = hasWeight ? calculateRecommendedWaterIntake(weight, age) : null;
  
  const percentage = hasReportedData && recommendedIntake 
    ? Math.round((reportedIntake / recommendedIntake) * 100)
    : 0;

  const status: HydrationStatus = hasReportedData && recommendedIntake 
    ? getHydrationStatus(percentage)
    : 'unknown';

  const getStatusConfig = (status: HydrationStatus) => {
    switch (status) {
      case 'adequate':
        return {
          label: t('hydrationStatusAdequate', 'Adequate'),
          description: t('hydrationAdequateMessage', 'Great job! You\'re meeting your daily hydration needs. Staying well-hydrated supports energy, focus, and overall health.'),
          icon: CheckCircle2,
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30',
          iconColor: 'text-success',
          progressColor: 'bg-success',
          badgeBg: 'bg-success/20',
          badgeText: 'text-success',
        };
      case 'low':
        return {
          label: t('hydrationStatusLow', 'Low'),
          description: t('hydrationLowMessage', 'Your water intake is below the recommended level. Consider adding an extra glass or two throughout the day to support optimal hydration.'),
          icon: AlertTriangle,
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          iconColor: 'text-warning',
          progressColor: 'bg-warning',
          badgeBg: 'bg-warning/20',
          badgeText: 'text-warning',
        };
      case 'critical':
        return {
          label: t('hydrationStatusCritical', 'Critical'),
          description: t('hydrationCriticalMessage', 'Your hydration is significantly below the recommended level. Dehydration can affect energy, concentration, and physical performance. Please prioritize drinking more water.'),
          icon: AlertCircle,
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          iconColor: 'text-destructive',
          progressColor: 'bg-destructive',
          badgeBg: 'bg-destructive/20',
          badgeText: 'text-destructive',
        };
      default:
        return {
          label: t('hydrationStatusUnknown', 'Unknown'),
          description: t('hydrationUnknownMessage', 'We need your daily water intake and weight to calculate your hydration status. Please update your profile to see personalized insights.'),
          icon: Droplets,
          bgColor: 'bg-muted/50',
          borderColor: 'border-border',
          iconColor: 'text-muted-foreground',
          progressColor: 'bg-muted-foreground',
          badgeBg: 'bg-muted',
          badgeText: 'text-muted-foreground',
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className={`rounded-2xl shadow-card ${config.bgColor} ${config.borderColor} border`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Droplets className="w-5 h-5 text-blue-500" />
            {t('hydrationCardTitle', 'Hydration')}
          </CardTitle>
          <CardDescription>
            {t('hydrationCardDescription', 'Your daily water intake compared to the recommended amount')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.badgeBg}`}>
              <StatusIcon className={`w-4 h-4 ${config.badgeText}`} />
              <span className={`text-sm font-semibold ${config.badgeText}`}>
                {t('hydrationStatus', 'Status')}: {config.label}
              </span>
            </div>
            {status !== 'unknown' && (
              <span className={`text-lg font-bold ${config.badgeText}`}>
                {percentage}%
              </span>
            )}
          </div>

          {/* Values Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t('hydrationReported', 'Your Intake')}
              </span>
              <p className="text-xl font-bold text-foreground">
                {hasReportedData ? `${reportedIntake.toFixed(1)} L` : '—'}
              </p>
              <span className="text-xs text-muted-foreground">
                {t('hydrationPerDay', 'per day')}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t('hydrationRecommended', 'Recommended')}
              </span>
              <p className="text-xl font-bold text-foreground">
                {recommendedIntake ? `${recommendedIntake.toFixed(1)} L` : '—'}
              </p>
              <span className="text-xs text-muted-foreground">
                {t('hydrationPerDay', 'per day')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {status !== 'unknown' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-3 bg-muted/50"
                />
                <div 
                  className={`absolute inset-0 h-3 rounded-full ${config.progressColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Description Message */}
          <p className="text-sm text-foreground/80 leading-relaxed pt-2">
            {config.description}
          </p>

          {/* Weight-based calculation info */}
          {hasWeight && (
            <p className="text-xs text-muted-foreground italic">
              {t('hydrationCalculationNote', 'Recommendation based on your weight ({{weight}} kg) using 35ml per kg of body weight.', { weight })}
              {age && age >= 50 && ` ${t('hydrationAgeAdjustment', 'Adjusted for age.')}`}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HydrationCard;
