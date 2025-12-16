import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Palette, Globe, Loader2, Sun, Moon, LogOut, Trash2, 
  Diamond, MessageSquare, FileText, Shield, ChevronRight, KeyRound, Edit
} from 'lucide-react';
import { changeLanguage } from '@/lib/i18n';
import i18n from '@/lib/i18n';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isGuest, exitGuestMode } = useGuest();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguageState] = useState(i18n.language || 'en');
  const [saving, setSaving] = useState(false);

  // Sync language state with i18n
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setLanguageState(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user && !isGuest) {
      navigate('/auth');
      return;
    }

    if (user) {
      setEmail(user.email || '');
      fetchProfile();
    }
  }, [user, authLoading, isGuest, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('name, language, theme')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setName(data.name || '');
      if (data.language) {
        setLanguageState(data.language);
        i18n.changeLanguage(data.language);
      }
      if (data.theme) {
        setTheme(data.theme as 'light' | 'dark');
      }
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguageState(lang);
    changeLanguage(lang, isGuest);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          language: language,
          theme,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('settingsSaved'),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
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

  const handleDeleteAccount = () => {
    toast({
      title: t('deleteAccount'),
      description: t('featureComingSoon'),
    });
  };

  const handleChangePassword = () => {
    toast({
      title: t('changePassword'),
      description: t('featureComingSoon'),
    });
  };

  const handleFeedback = () => {
    toast({
      title: t('sendFeedback'),
      description: t('featureComingSoon'),
    });
  };

  const getUserStatus = () => {
    if (isGuest) return t('guest');
    return t('free');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-display font-bold text-foreground">{t('settings')}</h1>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('account')}
              </CardTitle>
              <CardDescription>{t('manageAccount')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isGuest ? (
                <>
                  <div className="space-y-2">
                    <Label>{t('name')}</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input value={email} disabled className="opacity-60" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/edit-profile')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('editHealthData')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleChangePassword}
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      {t('changePassword')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">{t('guestAccountMessage')}</p>
                  <Button onClick={() => navigate('/auth?mode=signup')}>
                    {t('createAccount')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('appPreferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('language')}
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('en')}
                    className="w-full text-sm"
                  >
                    English
                  </Button>
                  <Button
                    variant={language === 'pt' ? 'default' : 'outline'}
                    onClick={() => handleLanguageChange('pt')}
                    className="w-full text-sm"
                  >
                    Português
                  </Button>
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <Label>{t('theme')}</Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="w-full text-sm flex items-center justify-center gap-1.5 min-w-0"
                  >
                    <Sun className="w-4 h-4 shrink-0" />
                    <span>Claro</span>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="w-full text-sm flex items-center justify-center gap-1.5 min-w-0"
                  >
                    <Moon className="w-4 h-4 shrink-0" />
                    <span>Escuro</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Diamond className="w-5 h-5" />
                {t('premium')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <span className="text-sm">{t('currentStatus')}</span>
                <span className="font-semibold">{getUserStatus()}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/premium')}
              >
                {t('viewPremiumPlans')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Support & Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('supportLegal')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={handleFeedback}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t('sendFeedback')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={() => toast({ title: t('termsOfUse'), description: t('featureComingSoon') })}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('termsOfUse')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={() => toast({ title: t('privacyPolicy'), description: t('featureComingSoon') })}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t('privacyPolicy')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          {!isGuest && (
            <Button onClick={handleSave} className="w-full" size="lg" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t('saveChanges')}
            </Button>
          )}

          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
            {!isGuest && (
              <Button 
                variant="ghost" 
                onClick={handleDeleteAccount} 
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('deleteAccount')}
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
