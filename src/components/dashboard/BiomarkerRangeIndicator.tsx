import React from 'react';

interface BiomarkerRangeIndicatorProps {
  isNormal?: boolean;
  value?: number | null;
  referenceMin?: number | null;
  referenceMax?: number | null;
}

const BiomarkerRangeIndicator: React.FC<BiomarkerRangeIndicatorProps> = ({ 
  isNormal = true,
  value,
  referenceMin,
  referenceMax,
}) => {
  // Calculate proportional position within reference range
  const calculateProgress = (): number => {
    if (
      value === null || 
      value === undefined || 
      referenceMin === null || 
      referenceMin === undefined || 
      referenceMax === null || 
      referenceMax === undefined ||
      referenceMax === referenceMin
    ) {
      // Default to 50% if we can't calculate
      return 50;
    }

    // Calculate: (value - min) / (max - min) * 100
    const progress = ((value - referenceMin) / (referenceMax - referenceMin)) * 100;
    
    // Clamp between 0% and 100%
    return Math.max(0, Math.min(100, progress));
  };

  const progress = calculateProgress();

  return (
    <div className="relative h-1.5 rounded-full bg-muted/50 overflow-hidden">
      {/* Progress bar - proportional to value position in range */}
      <div 
        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
          isNormal 
            ? 'bg-[hsl(174,60%,50%)]' // Teal for normal
            : 'bg-warning' // Orange for attention
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default BiomarkerRangeIndicator;
