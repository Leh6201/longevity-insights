import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  translateBiomarkerName, 
  translateBiomarkerValue, 
  getBiomarkerExplanation 
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
  const translatedValue = translateBiomarkerValue(value);
  const explanation = getBiomarkerExplanation(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isNormal ? 'bg-primary/10' : 'bg-warning/10'
        }`}>
          {isNormal ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <AlertCircle className="w-4 h-4 text-warning" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{translatedName}</span>
          {explanation && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 transition-colors"
                  aria-label={`Informação sobre ${translatedName}`}
                >
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3" align="start" side="top">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {explanation}
                </p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <span className={`text-xs ${isNormal ? 'text-muted-foreground' : 'text-warning font-medium'}`}>
        {translatedValue}
      </span>
    </motion.div>
  );
};

export default DescriptiveBiomarkerCard;
