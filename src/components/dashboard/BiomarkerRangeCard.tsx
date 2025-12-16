import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BiomarkerRangeCardProps {
  name: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  delay?: number;
}

const BiomarkerRangeCard: React.FC<BiomarkerRangeCardProps> = ({
  name,
  value,
  unit,
  min,
  max,
  optimalMin,
  optimalMax,
  delay = 0,
}) => {
  const { t } = useTranslation();
  
  const isInRange = value !== null && value >= optimalMin && value <= optimalMax;
  const position = value !== null 
    ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
    : 50;

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
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{name}</span>
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${isInRange ? 'text-primary' : 'text-warning'}`}>
            {value ?? '--'}
          </span>
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>
      
      {/* Gradient Range Bar */}
      <div className="relative h-3 rounded-full overflow-hidden mb-2">
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to right, hsl(142 71% 45%), hsl(142 71% 45%) 30%, hsl(48 96% 53%) 50%, hsl(38 92% 50%) 70%, hsl(0 84% 60%))'
          }}
        />
        {/* Position indicator */}
        {value !== null && (
          <motion.div
            initial={{ left: '50%' }}
            animate={{ left: `${position}%` }}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-card rounded-full border-2 border-foreground shadow-md"
          />
        )}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} {unit}</span>
        <span className="text-primary font-medium">{t('normal')}</span>
        <span>{max} {unit}</span>
      </div>
    </motion.div>
  );
};

export default BiomarkerRangeCard;
