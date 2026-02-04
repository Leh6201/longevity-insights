import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY_PREFIX = 'bioage_unlocked_';

export const useBioAgeUnlock = (examCount: number, canShowAdvancedAnalysis: boolean) => {
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasSeenUnlock, setHasSeenUnlock] = useState(true);

  const storageKey = user ? `${STORAGE_KEY_PREFIX}${user.id}` : null;

  useEffect(() => {
    if (!storageKey) return;

    const seen = localStorage.getItem(storageKey);
    setHasSeenUnlock(seen === 'true');
  }, [storageKey]);

  useEffect(() => {
    // Show celebration when user just unlocked (5 exams) and hasn't seen it
    if (canShowAdvancedAnalysis && !hasSeenUnlock && storageKey) {
      setShowCelebration(true);
    }
  }, [canShowAdvancedAnalysis, hasSeenUnlock, storageKey]);

  const markAsSeen = useCallback(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, 'true');
      setHasSeenUnlock(true);
    }
    setShowCelebration(false);
  }, [storageKey]);

  return {
    showCelebration,
    markAsSeen,
  };
};
