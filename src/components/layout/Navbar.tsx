import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dna, LayoutDashboard, Settings, LogOut, Sun, Moon, ArrowLeft } from 'lucide-react';
import { changeLanguage } from '@/lib/i18n';
const Navbar: React.FC = () => {
  const {
    t
  } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const {
    isGuest,
    exitGuestMode
  } = useGuest();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang, isGuest);
  };
  const handleLogout = async () => {
    if (isGuest) {
      exitGuestMode();
      navigate('/auth');
    } else {
      await signOut();
      navigate('/auth');
    }
  };
  const handleBack = () => {
    // In guest mode on dashboard, go back to auth
    if (isGuest && location.pathname === '/dashboard') {
      navigate('/auth');
      return;
    }

    // Always try to go back, fallback to dashboard if at start of history
    navigate(-1);
  };

  // Show navbar for both logged-in users and guests
  if (!user && !isGuest) return null;

  // Pages that should show back button instead of logo
  const showBackButton = location.pathname !== '/dashboard';
  return <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {showBackButton && <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Dna className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">LongLife AI</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              
            </Link>

            <Link to="/settings">
              <Button variant={location.pathname === '/settings' ? 'secondary' : 'ghost'} size="sm">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('settings')}</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('pt')}>
                  Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            

            
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;