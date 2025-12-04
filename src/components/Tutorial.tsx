import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, Activity, Lightbulb, ChevronRight, X } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Upload,
      title: t('tutorialStep1Title'),
      description: t('tutorialStep1Desc'),
    },
    {
      icon: Activity,
      title: t('tutorialStep2Title'),
      description: t('tutorialStep2Desc'),
    },
    {
      icon: Lightbulb,
      title: t('tutorialStep3Title'),
      description: t('tutorialStep3Desc'),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={onComplete}
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="max-w-md w-full mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-24 h-24 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-glow"
            >
              <Icon className="w-12 h-12 text-primary-foreground" />
            </motion.div>

            <div className="space-y-3">
              <h2 className="text-2xl font-display font-bold">{currentStep.title}</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="flex justify-center gap-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === step ? 'bg-primary w-8' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button variant="ghost" onClick={onComplete}>
                {t('skip')}
              </Button>
              <Button onClick={handleNext}>
                {step < steps.length - 1 ? t('next') : t('getStarted')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Tutorial;
