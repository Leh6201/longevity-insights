import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BiomarkerProgressCardProps {
  name: string;
  percentage: number;
  displayValue?: string;
  isNormal: boolean;
  delay?: number;
  infoText?: string;
}

const BiomarkerProgressCard: React.FC<BiomarkerProgressCardProps> = ({
  name,
  percentage,
  displayValue,
  isNormal,
  delay = 0,
  infoText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`space-y-2 p-3 rounded-xl transition-all duration-300 ${
        !isNormal ? 'bg-warning/5 ring-1 ring-warning/20' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div 
            className={`w-2 h-2 rounded-full ${isNormal ? 'bg-primary' : 'bg-warning'}`}
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
          <span className="text-sm font-medium text-foreground">{name}</span>
          {infoText && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
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
        <span className={`text-sm font-semibold ${isNormal ? 'text-primary' : 'text-warning'}`}>
          {displayValue || `${percentage}%`}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: `${percentage}%`,
            opacity: !isNormal ? [1, 0.7, 1] : 1
          }}
          transition={{ 
            width: { delay: delay + 0.2, duration: 0.8, ease: 'easeOut' },
            opacity: !isNormal ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
          }}
          className={`h-full rounded-full ${isNormal ? 'bg-primary' : 'bg-warning'}`}
        />
      </div>
    </motion.div>
  );
};

export default BiomarkerProgressCard;
