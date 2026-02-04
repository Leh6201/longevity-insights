import React from 'react';

interface BiomarkerRangeIndicatorProps {
  animate?: boolean;
  animationDelay?: number;
}

const BiomarkerRangeIndicator: React.FC<BiomarkerRangeIndicatorProps> = () => {
  // Simple neutral bar - purely aesthetic, no value positioning
  return <div className="h-1 rounded-full bg-primary/15" />;
};

export default BiomarkerRangeIndicator;