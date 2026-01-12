import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardHeaderProps {
  lastUpdate?: string;
  isGuest?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdate,
  isGuest = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();
      
      if (data?.name) {
        setUserName(data.name);
      }
    };

    if (!isGuest && user) {
      fetchUserName();
    }
  }, [user, isGuest]);

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
          <h1 className="font-bold text-foreground">
            {userName ? t('helloUser', { name: userName }) : t('dashboard')}
          </h1>
          <p className="text-xs text-muted-foreground">
            {lastUpdate ? `${t('updatedAt')} ${lastUpdate}` : t('updatedNow')}
          </p>
        </div>
      </div>
      
      {isGuest && (
        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
          {t('guestMode')}
        </span>
      )}
    </motion.div>
  );
};

export default DashboardHeader;