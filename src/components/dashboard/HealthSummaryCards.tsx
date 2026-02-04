import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Lightbulb, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HealthSummaryCardsProps {
  biologicalAge: number | null;
  riskLevel: 'low' | 'moderate' | 'high' | null;
  recommendationsCount: number;
  canShowBiologicalAge?: boolean;
  examCount?: number;
}

const HealthSummaryCards: React.FC<HealthSummaryCardsProps> = ({
  biologicalAge,
  riskLevel,
  recommendationsCount,
  canShowBiologicalAge = true,
  examCount = 0,
}) => {
  const { t } = useTranslation();

  const getRiskLabel = (risk: string | null) => {
    if (!risk) return '--';
    switch (risk) {
      case 'low': return t('low');
      case 'moderate': return t('moderate');
      case 'high': return t('high');
      default: return '--';
    }
  };

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'low': return 'bg-success/10 text-success';
      case 'moderate': return 'bg-warning/10 text-warning';
      case 'high': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Biological age card with conditional display
  const renderBiologicalAgeCard = () => {
    if (!canShowBiologicalAge) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-muted/50 rounded-xl px-6 py-3 flex flex-col items-center justify-center relative"
        >
          <Popover>
            <PopoverTrigger asChild>
              <button className="absolute top-1 right-1 p-1 rounded-full hover:bg-muted/80 transition-colors">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="center" side="top">
              <p className="text-xs font-medium text-foreground mb-1">{t('bioAgeNotAvailable')}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('bioAgeNotAvailableDesc')}
              </p>
              <p className="text-xs text-primary mt-2 font-medium">
                {t('bioAgeProgress', { count: examCount })}
              </p>
            </PopoverContent>
          </Popover>
          <div className="text-xl font-bold text-muted-foreground whitespace-nowrap leading-tight">
            --
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap leading-tight mt-0.5">
            {t('bioAge')}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="bg-primary/10 rounded-xl px-6 py-3 flex flex-col items-center justify-center"
      >
        <div className="text-xl font-bold text-primary whitespace-nowrap leading-tight">
          {biologicalAge ?? '--'}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap leading-tight mt-0.5">
          {t('bioAge')}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {/* Biological Age Card */}
      {renderBiologicalAgeCard()}
      
      {/* Risk Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${getRiskColor(riskLevel)} rounded-xl px-6 py-3 flex flex-col items-center justify-center`}
      >
        <div className="text-xl font-bold whitespace-nowrap leading-tight">
          {getRiskLabel(riskLevel)}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap leading-tight mt-0.5">
          {t('risk')}
        </div>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-warning/10 rounded-xl px-6 py-3 flex flex-col items-center justify-center"
      >
        <div className="text-xl font-bold text-warning whitespace-nowrap leading-tight">
          {recommendationsCount}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap leading-tight mt-0.5">
          {t('tips')}
        </div>
      </motion.div>
    </div>
  );
};

export default HealthSummaryCards;
