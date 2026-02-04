import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BiomarkerRangeBarProps {
  name: string;
  value: number | null;
  displayValue: string;
  referenceMin: number | null;
  referenceMax: number | null;
  unit: string | null;
  isNormal: boolean;
  delay?: number;
  infoText?: string;
}

/**
 * Calculates the position of a value within an extended range.
 */
const calculatePosition = (
  value: number,
  min: number,
  max: number
): number => {
  const range = max - min;
  const buffer = range * 0.3;
  const extendedMin = min - buffer;
  const extendedMax = max + buffer;
  const extendedRange = extendedMax - extendedMin;
  const position = ((value - extendedMin) / extendedRange) * 100;
  return Math.min(98, Math.max(2, position));
};

/**
 * Calculates the normal zone position within the extended range.
 */
const calculateNormalZone = (
  min: number,
  max: number
): { start: number; end: number } => {
  const range = max - min;
  const buffer = range * 0.3;
  const extendedMin = min - buffer;
  const extendedMax = max + buffer;
  const extendedRange = extendedMax - extendedMin;
  const start = ((min - extendedMin) / extendedRange) * 100;
  const end = ((max - extendedMin) / extendedRange) * 100;
  return { start, end };
};

/**
 * Gets status text based on value position relative to reference range.
 */
const getStatusText = (
  value: number | null,
  referenceMin: number | null,
  referenceMax: number | null,
  isNormal: boolean
): string => {
  if (value === null || referenceMin === null || referenceMax === null) {
    return isNormal ? 'Dentro do esperado' : 'Fora do ideal';
  }
  
  if (isNormal) return 'Dentro do esperado';
  
  const range = referenceMax - referenceMin;
  const tolerance = range * 0.15; // 15% tolerance for "um pouco"
  
  if (value < referenceMin) {
    return (referenceMin - value) <= tolerance ? 'Um pouco abaixo' : 'Abaixo do ideal';
  } else {
    return (value - referenceMax) <= tolerance ? 'Um pouco acima' : 'Acima do ideal';
  }
};

const BiomarkerRangeBar: React.FC<BiomarkerRangeBarProps> = ({
  name,
  value,
  displayValue,
  referenceMin,
  referenceMax,
  unit,
  isNormal,
  delay = 0,
  infoText,
}) => {
  const hasValidRange = referenceMin !== null && referenceMax !== null && referenceMin < referenceMax;
  const hasValue = value !== null;
  
  const position = hasValidRange && hasValue 
    ? calculatePosition(value, referenceMin!, referenceMax!) 
    : 50;
    
  const normalZone = hasValidRange 
    ? calculateNormalZone(referenceMin!, referenceMax!) 
    : { start: 30, end: 70 };

  const statusText = getStatusText(value, referenceMin, referenceMax, isNormal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`py-2.5 px-3 rounded-lg transition-all duration-300 ${
        !isNormal ? 'bg-warning/8 ring-1 ring-warning/20' : 'hover:bg-muted/30'
      }`}
    >
      {/* Hierarchy: name → value → status → bar */}
      <div className="flex items-center justify-between gap-3 mb-1.5">
        {/* Name with optional info */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className={`text-sm truncate ${isNormal ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
            {name}
          </span>
          {infoText && !isNormal && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-warning/15 hover:bg-warning/25 transition-colors flex-shrink-0"
                  aria-label={`Informação sobre ${name}`}
                >
                  <HelpCircle className="w-3 h-3 text-warning" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3" align="start" side="top">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">O que significa?</p>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {infoText}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        {/* Value and status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-sm font-semibold ${isNormal ? 'text-muted-foreground' : 'text-warning'}`}>
            {displayValue}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            isNormal 
              ? 'bg-primary/10 text-primary/70' 
              : 'bg-warning/15 text-warning font-medium'
          }`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Slim range bar - only for abnormal or when has valid range */}
      {hasValidRange && hasValue && (
        <div className={`relative overflow-hidden rounded-full ${isNormal ? 'h-1 bg-muted/50' : 'h-1.5 bg-muted'}`}>
          {/* Normal zone - subtle for normal results */}
          <div 
            className={`absolute h-full ${isNormal ? 'bg-primary/15' : 'bg-primary/25'}`}
            style={{ 
              left: `${normalZone.start}%`, 
              width: `${normalZone.end - normalZone.start}%` 
            }}
          />
          
          {/* Position indicator - smaller for normal */}
          <motion.div
            initial={{ left: '50%', opacity: 0 }}
            animate={{ left: `${position}%`, opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4, ease: 'easeOut' }}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full shadow-sm ${
              isNormal 
                ? 'w-2 h-2 bg-primary/60' 
                : 'w-2.5 h-2.5 bg-warning border border-background'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default BiomarkerRangeBar;
