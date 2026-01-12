import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Option<T> {
  value: T;
  label: ReactNode;
}

interface OptionGroupProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function OptionGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: OptionGroupProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);

  // Measure the widest button and set uniform width
  useEffect(() => {
    if (!containerRef.current) return;

    const buttons = containerRef.current.querySelectorAll('[data-option-button]');
    let maxWidth = 0;

    buttons.forEach((button) => {
      // Temporarily reset width to measure natural content width
      (button as HTMLElement).style.width = 'auto';
      const naturalWidth = button.getBoundingClientRect().width;
      if (naturalWidth > maxWidth) {
        maxWidth = naturalWidth;
      }
    });

    // Add a small buffer and set the width
    setButtonWidth(Math.ceil(maxWidth));
  }, [options]);

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          data-option-button
          onClick={() => onChange(option.value)}
          style={buttonWidth ? { width: `${buttonWidth}px` } : undefined}
          className={cn(
            'px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 text-center',
            'whitespace-nowrap overflow-visible',
            value === option.value
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
