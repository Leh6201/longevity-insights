import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { translateBiomarkerName } from '@/lib/biomarkerLocalization';

interface DescriptiveBiomarkerCardProps {
  name: string;
  value: string;
  isNormal: boolean;
  explanation?: string | null;
  delay?: number;
}

const DescriptiveBiomarkerCard: React.FC<DescriptiveBiomarkerCardProps> = ({
  name,
  value,
  isNormal,
  explanation,
  delay = 0,
}) => {
  const translatedName = translateBiomarkerName(name);
  const hasTooltip = !!explanation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex items-start gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
        isNormal ? 'bg-muted/30' : 'bg-warning/5 ring-1 ring-warning/20'
      }`}
    >
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
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">{translatedName}</span>
          {hasTooltip && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0"
                  aria-label={`Informação sobre ${translatedName}`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start" side="top">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">Explicação AI</p>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {explanation}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <span className={`text-xs ${isNormal ? 'text-muted-foreground' : 'text-warning font-medium'}`}>
            {value}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DescriptiveBiomarkerCard;
