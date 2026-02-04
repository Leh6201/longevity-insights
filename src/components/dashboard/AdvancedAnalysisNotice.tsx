import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdvancedAnalysisNoticeProps {
  examCount: number;
}

const AdvancedAnalysisNotice: React.FC<AdvancedAnalysisNoticeProps> = ({ examCount }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/50 border border-border/50 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-foreground leading-relaxed">
            {t('advancedAnalysisNotice')}
          </p>
          <p className="text-sm font-medium text-primary">
            {t('examProgress', { current: examCount, total: 5 })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedAnalysisNotice;
