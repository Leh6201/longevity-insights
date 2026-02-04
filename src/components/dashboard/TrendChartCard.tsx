import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, HelpCircle, Minus, BarChart3 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type TrendDisplayMode = 'full' | 'comparison' | 'none';

interface TrendChartCardProps {
  title: string;
  change: number;
  data: number[];
  delay?: number;
  infoText?: string;
  examCount?: number;
  displayMode?: TrendDisplayMode;
  previousValue?: number;
  currentValue?: number;
}

const TrendChartCard: React.FC<TrendChartCardProps> = ({
  title,
  change,
  data,
  delay = 0,
  infoText,
  examCount = 0,
  displayMode = 'full',
  previousValue,
  currentValue,
}) => {
  const { t } = useTranslation();
  const isPositive = change > 0;
  const maxValue = Math.max(...data);
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];

  // Mode: Not enough exams to show anything meaningful
  if (displayMode === 'none' || examCount < 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-card rounded-2xl p-5 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="font-semibold text-foreground">{title}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t('trendNotAvailableDesc')}
          </p>
          <p className="text-xs text-primary font-medium">
            {t('trendMinimumExams')}
          </p>
        </div>
      </motion.div>
    );
  }

  // Mode: Only 2 exams - show simple comparison without "trend" language
  if (displayMode === 'comparison' || examCount === 2) {
    const comparisonChange = previousValue && currentValue 
      ? ((currentValue - previousValue) / previousValue * 100).toFixed(1)
      : change;
    const numericChange = Number(comparisonChange);
    const isImproved = numericChange < 0; // Lower is usually better for most biomarkers
    const isStable = Math.abs(numericChange) < 2;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-card rounded-2xl p-5 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              {isStable ? (
                <Minus className="w-5 h-5 text-primary" />
              ) : isImproved ? (
                <TrendingDown className="w-5 h-5 text-primary" />
              ) : (
                <TrendingUp className="w-5 h-5 text-warning" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{t('comparison')} {title}</span>
              {infoText && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 transition-colors"
                      aria-label={`Info about ${title}`}
                    >
                      <HelpCircle className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="start" side="top">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {infoText}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">
            {t('comparisonWithPrevious')}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${
              isStable ? 'text-primary' : isImproved ? 'text-success' : 'text-warning'
            }`}>
              {numericChange > 0 ? '+' : ''}{numericChange}%
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isStable ? 'bg-primary/10 text-primary' : 
              isImproved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              {isStable ? t('comparisonStable') : isImproved ? t('comparisonImproved') : t('comparisonWorsened')}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Mode: Full trend chart (3+ exams)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{title}</span>
            {infoText && (
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 transition-colors"
                    aria-label={`Info about ${title}`}
                  >
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start" side="top">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {infoText}
                  </p>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-1 h-24 mb-3">
        {data.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ delay: delay + 0.1 * index, duration: 0.5 }}
            className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-md min-h-[4px]"
          />
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{months[0]}</span>
        <span>{months[months.length - 1]}</span>
      </div>
    </motion.div>
  );
};

export default TrendChartCard;
