import React from 'react';
import { motion } from 'framer-motion';

interface BiomarkerRangeIndicatorProps {
  value: number;
  min: number;
  max: number;
  animate?: boolean;
  animationDelay?: number;
}

const BiomarkerRangeIndicator: React.FC<BiomarkerRangeIndicatorProps> = ({
  value,
  min,
  max,
  animate = true,
  animationDelay = 0.5,
}) => {
  // Calculate position as percentage (clamped between 0 and 100)
  const range = max - min;
  const position = Math.min(Math.max(((value - min) / range) * 100, 0), 100);

  return (
    <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-success via-warning to-destructive">
      {animate ? (
        <motion.div
          initial={{ left: "0%" }}
          whileInView={{ left: `${position}%` }}
          viewport={{ once: true }}
          transition={{ delay: animationDelay, duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-card border-2 border-foreground rounded-full shadow-lg"
          style={{ left: `${position}%` }}
        />
      ) : (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-card border-2 border-foreground rounded-full shadow-lg"
          style={{ left: `${position}%` }}
        />
      )}
    </div>
  );
};

export default BiomarkerRangeIndicator;
