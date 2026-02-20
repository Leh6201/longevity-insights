import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Dna, TrendingDown, TrendingUp, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BiologicalAgeCardProps {
  biologicalAge: number;
  actualAge: number | null;
}

const BiologicalAgeCard: React.FC<BiologicalAgeCardProps> = ({ biologicalAge, actualAge }) => {
  const { t } = useTranslation();

  const difference = actualAge ? actualAge - biologicalAge : 0;
  const isYounger = difference >= 0; // bio <= chrono means younger/same

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <CardContent className="pt-6 pb-5 px-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Dna className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                Idade Biológica
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Modelo PhenoAge (Levine et al., 2018)
              </p>
            </div>
          </div>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Sobre o método PhenoAge"
                  className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[260px] text-xs leading-snug space-y-1.5">
                <p className="font-medium">Sobre o PhenoAge</p>
                <p>
                  Método científico validado que estima a idade biológica
                  a partir de biomarcadores clínicos (Glicose, HDL, LDL,
                  Triglicerídeos e PCR).
                </p>
                <p className="text-muted-foreground">
                  Referência: Levine ME et al., Aging Cell, 2018; 17(4): e12765.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Age value */}
        <div className="flex items-end justify-between">
          <div>
            <motion.div
              className="text-6xl font-bold text-primary leading-none"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              {biologicalAge}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-1.5">
              Estimativa baseada em biomarcadores clínicos validados.
            </p>
          </div>

          {actualAge && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold ${
                isYounger
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isYounger ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span>
                {Math.abs(difference)} {Math.abs(difference) === 1 ? 'ano' : 'anos'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-4 p-3 rounded-xl text-sm ${
            isYounger
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {isYounger
            ? actualAge
              ? `Ótimo! Seu organismo funciona como alguém ${Math.abs(difference)} ano${Math.abs(difference) !== 1 ? 's' : ''} mais jovem.`
              : 'Seus biomarcadores estão dentro de uma faixa saudável.'
            : actualAge
            ? `Atenção: seu organismo apresenta sinais de envelhecimento acelerado. Foque em hábitos saudáveis.`
            : 'Seus biomarcadores indicam oportunidades de melhoria.'}
        </motion.div>

        {/* Disclaimer */}
        <p className="text-[11px] text-muted-foreground mt-3 leading-snug">
          ⚠ Esta é uma estimativa baseada em modelos científicos publicados. Não constitui
          diagnóstico clínico. Consulte um profissional de saúde.
        </p>
      </CardContent>
    </Card>
  );
};

export default BiologicalAgeCard;
