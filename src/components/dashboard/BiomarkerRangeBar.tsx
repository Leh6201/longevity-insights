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
 * The bar represents: [min - 20% buffer] [normal range] [max + 20% buffer]
 * This allows showing values outside the reference range.
 */
const calculatePosition = (
  value: number,
  min: number,
  max: number
): number => {
  const range = max - min;
  const buffer = range * 0.3; // 30% buffer on each side
  const extendedMin = min - buffer;
  const extendedMax = max + buffer;
  const extendedRange = extendedMax - extendedMin;
  
  // Calculate position as percentage
  const position = ((value - extendedMin) / extendedRange) * 100;
  
  // Clamp between 2% and 98% to keep indicator visible
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
  // Only show range bar if we have valid reference values
  const hasValidRange = referenceMin !== null && referenceMax !== null && referenceMin < referenceMax;
  const hasValue = value !== null;
  
  const position = hasValidRange && hasValue 
    ? calculatePosition(value, referenceMin!, referenceMax!) 
    : 50;
    
  const normalZone = hasValidRange 
    ? calculateNormalZone(referenceMin!, referenceMax!) 
    : { start: 30, end: 70 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`space-y-2 p-3 rounded-xl transition-all duration-300 ${
        !isNormal ? 'bg-warning/5 ring-1 ring-warning/20' : ''
      }`}
    >
      {/* Header with name, info, and value */}
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
            {infoText && (
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
            <span className={`text-sm font-semibold ${isNormal ? 'text-primary' : 'text-warning'}`}>
              {displayValue}
            </span>
          </div>
        </div>
      </div>

      {/* Range bar - only show if we have valid reference range */}
      {hasValidRange && hasValue && (
        <>
          <div className="relative h-2 rounded-full overflow-hidden bg-muted">
            {/* Normal zone highlight */}
            <div 
              className="absolute h-full bg-primary/20"
              style={{ 
                left: `${normalZone.start}%`, 
                width: `${normalZone.end - normalZone.start}%` 
              }}
            />
            
            {/* Position indicator */}
            <motion.div
              initial={{ left: '50%', opacity: 0 }}
              animate={{ left: `${position}%`, opacity: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.5, ease: 'easeOut' }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background shadow-md ${
                isNormal ? 'bg-primary' : 'bg-warning'
              }`}
            />
          </div>

          {/* Reference labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{referenceMin}{unit ? ` ${unit}` : ''}</span>
            <span className="text-primary/70 font-medium">Faixa normal</span>
            <span>{referenceMax}{unit ? ` ${unit}` : ''}</span>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default BiomarkerRangeBar;
