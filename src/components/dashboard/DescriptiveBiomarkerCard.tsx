import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  translateBiomarkerName, 
  getBiomarkerExplanation,
  normalizeToResult,
  getExplanatoryText,
} from '@/lib/biomarkerLocalization';

interface DescriptiveBiomarkerCardProps {
  name: string;
  value: string;
  isNormal: boolean;
  delay?: number;
}

const DescriptiveBiomarkerCard: React.FC<DescriptiveBiomarkerCardProps> = ({
  name,
  value,
  isNormal,
  delay = 0,
}) => {
  const translatedName = translateBiomarkerName(name);
  
  // Normalize long explanatory text to concise result
  const displayValue = normalizeToResult(value);
  
  // Get explanatory text for tooltip (if value was long/explanatory)
  const explanatoryText = getExplanatoryText(value);
  
  // Combine standard explanation with any explanatory text from the value
  const biomarkerExplanation = getBiomarkerExplanation(name);
  const tooltipContent = explanatoryText 
    ? (biomarkerExplanation ? `${biomarkerExplanation}\n\n📋 Resultado: ${explanatoryText}` : explanatoryText)
    : biomarkerExplanation;

  const hasTooltip = !!tooltipContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 ${
        isNormal ? 'bg-muted/30' : 'bg-warning/5 ring-1 ring-warning/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isNormal ? 'bg-primary/10' : 'bg-warning/10'
          }`}
          animate={!isNormal ? { 
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1]
          } : {}}
          transition={!isNormal ? { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        >
          {isNormal ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertCircle className="w-4 h-4 text-warning" />
            </motion.div>
          )}
        </motion.div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{translatedName}</span>
          {hasTooltip && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 transition-colors flex-shrink-0"
                  aria-label={`Informação sobre ${translatedName}`}
                >
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start" side="top">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {tooltipContent}
                </p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <span className={`text-xs flex-shrink-0 ml-2 ${isNormal ? 'text-muted-foreground' : 'text-warning font-medium'}`}>
        {displayValue}
      </span>
    </motion.div>
  );
};

export default DescriptiveBiomarkerCard;
