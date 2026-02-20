import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Lightbulb, HelpCircle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HealthSummaryCardsProps {
  biologicalAge: number | null;
  riskLevel: 'low' | 'moderate' | 'high' | null;
  recommendationsCount: number;
  /** true = lock bio age (totalExams < 5) */
  isBiologicalAgeLocked?: boolean;
  totalExams?: number;
}

const HealthSummaryCards: React.FC<HealthSummaryCardsProps> = ({
  biologicalAge,
  riskLevel,
  recommendationsCount,
  isBiologicalAgeLocked = false,
  totalExams = 0,
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
    if (isBiologicalAgeLocked) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="bg-muted/50 rounded-xl px-6 py-3 flex flex-col items-center justify-center relative cursor-help"
              >
                <Lock className="absolute top-1.5 right-1.5 w-3 h-3 text-muted-foreground" />
                <div className="text-xl font-bold text-muted-foreground whitespace-nowrap leading-tight">
                  --
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap leading-tight mt-0.5">
                  {t('bioAge')}
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px] text-center text-xs leading-relaxed">
              <p className="font-medium mb-1">Envie pelo menos 5 exames para desbloquear sua Idade Biológica.</p>
              <p className="text-muted-foreground">A idade biológica é calculada usando múltiplos marcadores laboratoriais. Mais dados aumentam a precisão.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
