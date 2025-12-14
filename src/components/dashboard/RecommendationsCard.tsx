import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ChevronRight } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: string[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          {t('personalizedRecommendations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-foreground">{idx + 1}</span>
                </div>
                <p className="text-sm text-foreground flex-1">{rec}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">
              {t('uploadForRecommendations')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
