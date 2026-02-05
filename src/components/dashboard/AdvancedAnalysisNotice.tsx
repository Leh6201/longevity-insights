import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AdvancedAnalysisNoticeProps {
  examCount: number;
}

const AdvancedAnalysisNotice: React.FC<AdvancedAnalysisNoticeProps> = ({ examCount }) => {
  const { t } = useTranslation();
  const requiredExams = 5;
  const progressPercentage = (examCount / requiredExams) * 100;
  const examsRemaining = requiredExams - examCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
        
        <CardContent className="p-5 relative">
          <div className="flex items-start gap-4">
            {/* Icon with lock */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-muted-foreground" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title and counter */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-foreground text-base">
                  {t('bioAgeNotAvailable')}
                </h3>
                <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  <span className="text-lg font-bold text-primary">{examCount}</span>
                  <span className="text-muted-foreground font-medium">/</span>
                  <span className="text-lg font-bold text-muted-foreground">{requiredExams}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {examsRemaining === 1 
                  ? t('bioAgeOneMoreExam')
                  : t('bioAgeExamsRemaining', { count: examsRemaining })
                }
              </p>
              
              {/* Progress bar */}
              <div className="space-y-1.5">
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t('bioAgeUnlockProgress')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedAnalysisNotice;
