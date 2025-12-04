import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Flame } from 'lucide-react';

interface RiskScoreCardProps {
  title: string;
  score: 'low' | 'moderate' | 'high' | null;
  icon: 'metabolic' | 'inflammation';
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ title, score, icon }) => {
  const { t } = useTranslation();

  const getScoreColor = (score: string | null) => {
    switch (score) {
      case 'low': return 'text-success bg-success/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'high': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getBarWidth = (score: string | null) => {
    switch (score) {
      case 'low': return '33%';
      case 'moderate': return '66%';
      case 'high': return '100%';
      default: return '0%';
    }
  };

  const getBarColor = (score: string | null) => {
    switch (score) {
      case 'low': return 'bg-success';
      case 'moderate': return 'bg-warning';
      case 'high': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const Icon = icon === 'metabolic' ? Activity : Flame;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getScoreColor(score)}`}>
            <Icon className="w-5 h-5" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold ${getScoreColor(score)}`}>
          {score ? t(score) : '--'}
        </div>
        
        <div className="mt-4 h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${getBarColor(score)}`}
            initial={{ width: 0 }}
            animate={{ width: getBarWidth(score) }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{t('low')}</span>
          <span>{t('moderate')}</span>
          <span>{t('high')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreCard;
