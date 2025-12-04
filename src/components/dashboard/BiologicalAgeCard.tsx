import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna, TrendingDown, TrendingUp } from 'lucide-react';

interface BiologicalAgeCardProps {
  biologicalAge: number | null;
  actualAge: number | null;
}

const BiologicalAgeCard: React.FC<BiologicalAgeCardProps> = ({ biologicalAge, actualAge }) => {
  const { t } = useTranslation();
  
  const isYounger = biologicalAge && actualAge ? biologicalAge <= actualAge : true;
  const difference = biologicalAge && actualAge ? actualAge - biologicalAge : 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Dna className="w-5 h-5 text-primary-foreground" />
          </div>
          {t('yourBiologicalAge')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <motion.div 
              className="text-5xl font-display font-bold text-gradient"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {biologicalAge || '--'}
            </motion.div>
            <p className="text-muted-foreground text-sm mt-1">
              {t('bodyFunctioning')} <span className="font-semibold text-foreground">{biologicalAge || '--'}</span> {t('yearsOld')}
            </p>
          </div>
          
          {biologicalAge && actualAge && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isYounger ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              {isYounger ? (
                <TrendingDown className="w-5 h-5" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
              <span className="font-semibold">{Math.abs(difference)} years</span>
            </div>
          )}
        </div>
        
        <div className={`mt-4 p-3 rounded-xl text-sm ${
          isYounger ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
        }`}>
          {isYounger ? t('greatNews') : t('roomForImprovement')}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiologicalAgeCard;
