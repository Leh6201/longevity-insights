import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGuest } from '@/contexts/GuestContext';
import { Button } from '@/components/ui/button';
import { UserPlus, X } from 'lucide-react';

const GuestBanner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isGuest, showUpgradePrompt, setShowUpgradePrompt, exitGuestMode } = useGuest();

  if (!isGuest || !showUpgradePrompt) return null;

  const handleCreateAccount = () => {
    exitGuestMode();
    navigate('/auth?mode=signup');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40">
      <div className="relative p-4 rounded-xl bg-primary text-primary-foreground shadow-lg">
        <button
          onClick={() => setShowUpgradePrompt(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary-foreground/20"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('guestBannerTitle')}</p>
            <p className="text-xs opacity-90">{t('guestBannerDesc')}</p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={handleCreateAccount}
            >
              {t('createAccount')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestBanner;
