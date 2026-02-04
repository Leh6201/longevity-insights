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
    if (value === null || value === undefined) {
      return 50; // Default if no value
    }

    const hasMin = referenceMin !== null && referenceMin !== undefined;
    const hasMax = referenceMax !== null && referenceMax !== undefined;

    // Case 1: Both min and max available
    if (hasMin && hasMax && referenceMax !== referenceMin) {
      const progress = ((value - referenceMin!) / (referenceMax! - referenceMin!)) * 100;
      return Math.max(0, Math.min(100, progress));
    }

    // Case 2: Only min available (e.g., HDL > 40)
    // Show progress as percentage of how far above the minimum
    if (hasMin && !hasMax) {
      // Assume a reasonable max as 2x the min for visualization
      const assumedMax = referenceMin! * 2;
      if (assumedMax === 0) return 50;
      const progress = ((value - referenceMin!) / (assumedMax - referenceMin!)) * 100;
      // For "greater than" markers, being above min is good - show proportionally
      return Math.max(0, Math.min(100, 50 + progress * 0.5));
    }

    // Case 3: Only max available (e.g., LDL < 110)
    // Show progress as percentage of the max
    if (!hasMin && hasMax) {
      if (referenceMax === 0) return 0;
      const progress = (value / referenceMax!) * 100;
      return Math.max(0, Math.min(100, progress));
    }

    // No reference range - default to 50%
    return 50;
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
