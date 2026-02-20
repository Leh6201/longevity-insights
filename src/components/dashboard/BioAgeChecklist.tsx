import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dna } from 'lucide-react';
import type { RequiredBiomarker } from '@/hooks/useRequiredBiomarkers';

interface BioAgeChecklistProps {
  biomarkers: RequiredBiomarker[];
  presentCount: number;
}

const BioAgeChecklist: React.FC<BioAgeChecklistProps> = ({ biomarkers, presentCount }) => {
  const total = biomarkers.length;
  const progress = Math.round((presentCount / total) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Dna className="w-4 h-4 text-primary" />
          </div>
          Exames necessários para calcular sua Idade Biológica
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {presentCount} de {total} exames essenciais enviados
            </span>
            <span className="text-sm font-semibold text-primary">
              {presentCount}/{total}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Checklist */}
        <TooltipProvider delayDuration={200}>
          <ul className="space-y-2">
            {biomarkers.map((bm, i) => (
              <motion.li
                key={bm.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full text-left group"
                    >
                      {bm.present ? (
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={`text-sm transition-colors ${
                          bm.present
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      >
                        {bm.label}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[260px] text-xs leading-snug">
                    {bm.description}
                  </TooltipContent>
                </Tooltip>
              </motion.li>
            ))}
          </ul>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default BioAgeChecklist;
