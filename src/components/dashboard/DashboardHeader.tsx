import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  lastUpdate?: string;
  isGuest?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
  isGuest = false,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-card flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">{t('dashboard')}</h1>
          <p className="text-xs text-muted-foreground">
            {lastUpdate ? `${t('updatedAt')} ${lastUpdate}` : t('updatedNow')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isGuest && (
          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
            {t('guestMode')}
          </span>
        )}
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-warning" />
          <div className="w-2 h-2 rounded-full bg-destructive" />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
