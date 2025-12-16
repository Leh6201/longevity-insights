import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HealthSummaryCardsProps {
  biologicalAge: number | null;
  riskLevel: 'low' | 'moderate' | 'high' | null;
  recommendationsCount: number;
}

const HealthSummaryCards: React.FC<HealthSummaryCardsProps> = ({
  biologicalAge,
  riskLevel,
  recommendationsCount,
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

  const cards = [
    {
      value: biologicalAge ?? '--',
      label: t('bioAge'),
      icon: Activity,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      value: getRiskLabel(riskLevel),
      label: t('risk'),
      icon: ShieldCheck,
      bgColor: getRiskColor(riskLevel),
      textColor: '',
    },
    {
      value: recommendationsCount,
      label: t('tips'),
      icon: Lightbulb,
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${card.bgColor} rounded-2xl p-4 text-center`}
        >
          <div className={`text-2xl sm:text-3xl font-bold ${card.textColor || ''}`}>
            {card.value}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
            {card.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HealthSummaryCards;
