import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BioAgeUnlockCelebrationProps {
  biologicalAge: number | null;
  onComplete: () => void;
}

const BioAgeUnlockCelebration: React.FC<BioAgeUnlockCelebrationProps> = ({
  biologicalAge,
  onComplete,
}) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<'intro' | 'reveal' | 'done'>('intro');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('reveal'), 1500);
    const timer2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          {/* Particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  y: '100vh',
                  x: `${Math.random() * 100}vw`,
                  scale: 0.5
                }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  y: '-20vh',
                  scale: [0.5, 1, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  delay: Math.random() * 1,
                  ease: 'easeOut'
                }}
                className="absolute w-2 h-2 rounded-full bg-primary/60"
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative flex flex-col items-center gap-6 p-8"
          >
            {stage === 'intro' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  />
                  <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <PartyPopper className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-semibold text-foreground text-center"
                >
                  {t('bioAgeUnlocked')}
                </motion.p>
              </motion.div>
            )}

            {stage === 'reveal' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Glow ring */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute w-40 h-40 bg-primary/20 rounded-full blur-2xl"
                />
                
                {/* Main age display */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}
                  className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 border border-primary/20"
                >
                  <Sparkles className="absolute top-3 right-3 w-5 h-5 text-primary animate-pulse" />
                  <Sparkles className="absolute bottom-3 left-3 w-4 h-4 text-primary/60 animate-pulse" />
                  
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-1">{t('yourBiologicalAge')}</p>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="text-6xl font-bold text-primary"
                    >
                      {biologicalAge ?? '--'}
                    </motion.span>
                    <p className="text-sm text-muted-foreground mt-1">{t('yearsOld')}</p>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-muted-foreground text-center max-w-xs"
                >
                  {t('bioAgeUnlockedDesc')}
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BioAgeUnlockCelebration;
