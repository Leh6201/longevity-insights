import React from 'react';
import { motion } from 'framer-motion';

interface BiomarkerProgressCardProps {
  name: string;
  percentage: number;
  isNormal: boolean;
  delay?: number;
}

const BiomarkerProgressCard: React.FC<BiomarkerProgressCardProps> = ({
  name,
  percentage,
  isNormal,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isNormal ? 'bg-primary' : 'bg-warning'}`} />
          <span className="text-sm font-medium text-foreground">{name}</span>
        </div>
        <span className={`text-sm font-semibold ${isNormal ? 'text-primary' : 'text-warning'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${isNormal ? 'bg-primary' : 'bg-warning'}`}
        />
      </div>
    </motion.div>
  );
};

export default BiomarkerProgressCard;
