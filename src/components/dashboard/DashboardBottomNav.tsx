import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Lightbulb, User } from 'lucide-react';
import { motion } from 'framer-motion';

export type DashboardTab = 'summary' | 'insights' | 'profile';

interface DashboardBottomNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const DashboardBottomNav: React.FC<DashboardBottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'summary' as DashboardTab, label: t('tabSummary'), icon: LayoutDashboard },
    { id: 'insights' as DashboardTab, label: t('tabInsights'), icon: Lightbulb },
    { id: 'profile' as DashboardTab, label: t('tabProfile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="w-full h-16 px-[max(16px,env(safe-area-inset-left),env(safe-area-inset-right))]">
        <div className="grid grid-cols-3 items-center h-full w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center w-full h-full min-w-0 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`w-5 h-5 mb-1 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-safe-area-inset-bottom bg-background/95" />
    </nav>
  );
};

export default DashboardBottomNav;
