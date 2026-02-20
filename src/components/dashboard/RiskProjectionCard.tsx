import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Flame, Pill, Sparkles, TrendingUp, TrendingDown, HelpCircle, Lock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskProjectionCardProps {
  title: string;
  subtitle: string;
  percentage: number;
  monthlyChange: number;
  icon: 'metabolic' | 'cardiovascular' | 'inflammation' | 'liver' | 'longevity';
  delay?: number;
  infoText?: string;
  locked?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  metabolic: Activity,
  cardiovascular: Heart,
  inflammation: Flame,
  liver: Pill,
  longevity: Sparkles,
};

const RiskProjectionCard: React.FC<RiskProjectionCardProps> = ({
  title,
  subtitle,
  percentage,
  monthlyChange,
  icon,
  delay = 0,
  infoText,
  locked = false,
}) => {
  const Icon = iconMap[icon];
  const isPositive = percentage > 0;
  const isMonthlyPositive = monthlyChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-hover transition-shadow overflow-hidden w-full relative ${locked ? 'opacity-60' : ''}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${locked ? 'bg-muted/50' : 'bg-primary/10'}`}>
        {locked ? (
          <Lock className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Icon className="w-5 h-5 text-primary" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-foreground text-sm truncate">{title}</h3>
          {infoText && !locked && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 transition-colors shrink-0"
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
        {locked ? (
          <p className="text-xs text-muted-foreground truncate">Envie 5+ exames para desbloquear</p>
        ) : (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      <div className="text-right shrink-0">
        {locked ? (
          <div className="text-base font-bold text-muted-foreground">--</div>
        ) : (
          <>
            <div className={`text-base font-bold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{percentage}%
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground whitespace-nowrap">
              {isMonthlyPositive ? (
                <TrendingUp className="w-3 h-3 text-primary" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span>{isMonthlyPositive ? '+' : ''}{monthlyChange}% mês</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RiskProjectionCard;
