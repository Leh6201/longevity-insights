import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BiomarkerProgressCardProps {
  name: string;
  percentage: number;
  isNormal: boolean;
  delay?: number;
  infoText?: string;
}

const BiomarkerProgressCard: React.FC<BiomarkerProgressCardProps> = ({
  name,
  percentage,
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
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 transition-colors"
                  aria-label={`Info about ${name}`}
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
        <span className={`text-sm font-semibold ${isNormal ? 'text-primary' : 'text-warning'}`}>
          {percentage}%
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
