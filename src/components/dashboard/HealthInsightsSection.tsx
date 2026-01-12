import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Scale,
  Droplets,
  Droplet,
  Moon,
  Bed,
  Flame,
  Footprints,
  Wine,
  Brain,
  Target,
  Stethoscope,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HealthInsight, OnboardingData, generateHealthInsights, calculateBMI } from '@/lib/healthInsights';

interface HealthInsightsSectionProps {
  onboardingData: OnboardingData | null;
}

const iconMap: Record<string, LucideIcon> = {
  'check-circle': CheckCircle2,
  'scale': Scale,
  'droplets': Droplets,
  'droplet': Droplet,
  'moon': Moon,
  'bed': Bed,
  'flame': Flame,
  'footprints': Footprints,
  'wine': Wine,
  'brain': Brain,
  'target': Target,
  'stethoscope': Stethoscope,
};

const typeStyles: Record<string, string> = {
  info: 'bg-primary/10 text-primary border-primary/20',
  tip: 'bg-accent/10 text-accent-foreground border-accent/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  goal: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
};

const HealthInsightsSection: React.FC<HealthInsightsSectionProps> = ({ onboardingData }) => {
  const { t } = useTranslation();

  if (!onboardingData) return null;

  const insights = generateHealthInsights(onboardingData, t);
  const bmi = calculateBMI(onboardingData.weight, onboardingData.height);

  if (insights.length === 0) return null;

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {t('personalizedInsights')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-2">
            {bmi.value !== null && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="px-3 py-1.5 text-xs font-medium cursor-help">
                      <Scale className="w-3 h-3 mr-1.5" />
                      IMC: {bmi.value}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">{t(`bmi${bmi.category.charAt(0).toUpperCase() + bmi.category.slice(1)}Desc`, { value: bmi.value })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onboardingData.health_goals && onboardingData.health_goals.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="px-3 py-1.5 text-xs font-medium cursor-help bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                      <Target className="w-3 h-3 mr-1.5" />
                      {onboardingData.health_goals.length} {t('goalsActive')}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">{onboardingData.health_goals.map(g => t(g)).join(', ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onboardingData.training_frequency && (
              <Badge variant="outline" className="px-3 py-1.5 text-xs font-medium">
                <Flame className="w-3 h-3 mr-1.5" />
                {t(`training${['0', '1-2', '3-4', '5+'].indexOf(onboardingData.training_frequency)}`)} {t('perWeek')}
              </Badge>
            )}
          </div>

          {/* Insight Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {insights.slice(0, 4).map((insight, index) => {
              const IconComponent = iconMap[insight.icon] || Sparkles;
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-xl border ${typeStyles[insight.type]} transition-colors`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-background/50 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium leading-tight mb-0.5">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthInsightsSection;
