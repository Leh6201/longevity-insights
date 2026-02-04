import React from 'react';

interface BiomarkerRangeIndicatorProps {
  isNormal?: boolean;
}

const BiomarkerRangeIndicator: React.FC<BiomarkerRangeIndicatorProps> = ({ isNormal = true }) => {
  // Simple aesthetic bar - color based on status
  // Teal for normal results, orange/warning for attention
  return (
    <div 
      className={`h-1.5 rounded-full ${
        isNormal 
          ? 'bg-[hsl(174,60%,50%)]' // Teal for normal
          : 'bg-warning' // Orange for attention
      }`} 
    />
  );
};

export default BiomarkerRangeIndicator;
