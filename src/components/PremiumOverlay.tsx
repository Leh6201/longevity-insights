import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Diamond, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PremiumOverlayProps {
  children: React.ReactNode;
  isPremiumUser?: boolean;
  showLabel?: boolean;
}

const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ 
  children, 
  isPremiumUser = false,
  showLabel = true 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isPremiumUser) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl cursor-pointer"
        onClick={() => navigate('/premium')}
      >
        <div className="flex flex-col items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          {showLabel && (
            <>
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-foreground">{t('premiumFeature')}</span>
              </div>
              <Button size="sm" className="mt-2">
                {t('unlockNow')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumOverlay;
