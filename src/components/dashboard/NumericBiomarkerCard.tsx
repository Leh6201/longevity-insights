import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BiomarkerRangeIndicator from './BiomarkerRangeIndicator';

interface NumericBiomarkerCardProps {
  name: string;
  displayValue: string;
  isNormal: boolean;
  delay?: number;
  infoText?: string;
  // For range bar (only used when showBar is true)
  value?: number | null;
  referenceMin?: number | null;
  referenceMax?: number | null;
  showBar?: boolean;
}

// Get status text based on value position relative to reference range
const getStatusText = (
  isNormal: boolean, 
  value: number | null | undefined, 
  referenceMin: number | null | undefined, 
  referenceMax: number | null | undefined
): string => {
  if (isNormal) {
    return 'Dentro do esperado';
  }
  
  if (value !== null && value !== undefined && referenceMin !== null && referenceMin !== undefined && referenceMax !== null && referenceMax !== undefined) {
    if (value < referenceMin) {
      const diff = referenceMin - value;
      const range = referenceMax - referenceMin;
      if (range > 0 && diff / range > 0.3) {
        return 'Abaixo do ideal';
      }
      return 'Um pouco abaixo';
    }
    if (value > referenceMax) {
      const diff = value - referenceMax;
      const range = referenceMax - referenceMin;
      if (range > 0 && diff / range > 0.3) {
        return 'Acima do ideal';
      }
      return 'Um pouco acima';
    }
  }
  
  return 'Atenção';
};

const NumericBiomarkerCard: React.FC<NumericBiomarkerCardProps> = ({
  name,
  displayValue,
  isNormal,
  delay = 0,
  infoText,
  value,
  referenceMin,
  referenceMax,
  showBar = false,
}) => {
  const statusText = getStatusText(isNormal, value, referenceMin, referenceMax);
  
  // Calculate range bar values with 30% buffer
  const hasValidRange = value !== null && value !== undefined && 
                        referenceMin !== null && referenceMin !== undefined && 
                        referenceMax !== null && referenceMax !== undefined;
  
  let barMin = referenceMin ?? 0;
  let barMax = referenceMax ?? 100;
  
  if (hasValidRange && referenceMin !== null && referenceMax !== null) {
    const range = referenceMax - referenceMin;
    const buffer = range * 0.3;
    barMin = referenceMin - buffer;
    barMax = referenceMax + buffer;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`space-y-2 p-3 rounded-xl transition-all duration-300 ${
        !isNormal ? 'bg-warning/5 ring-1 ring-warning/20' : ''
      }`}
    >
      {/* Header: name, value, status */}
      <div className="flex items-start gap-2">
        <motion.div 
          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isNormal ? 'bg-primary' : 'bg-warning'}`}
          animate={!isNormal ? { 
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          } : {}}
          transition={!isNormal ? { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">{name}</span>
            {/* Only show info tooltip for altered results */}
            {!isNormal && infoText && (
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0"
                    aria-label={`Informação sobre ${name}`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3" align="start" side="top">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Explicação AI</p>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {infoText}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          {/* Value and status on same line */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium ${isNormal ? 'text-muted-foreground' : 'text-warning'}`}>
              {displayValue}
            </span>
            <span className={`text-xs ${isNormal ? 'text-muted-foreground' : 'text-warning'}`}>
              · {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Proportional range bar - shows value position within reference range */}
      {showBar && (
        <BiomarkerRangeIndicator 
          isNormal={isNormal}
          value={value}
          referenceMin={referenceMin}
          referenceMax={referenceMax}
        />
      )}
    </motion.div>
  );
};

export default NumericBiomarkerCard;
