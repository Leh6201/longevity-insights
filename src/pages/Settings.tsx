import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Palette, Globe, Loader2, Sun, Moon } from 'lucide-react';
import i18n from '@/lib/i18n';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      setEmail(user.email || '');
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('name, language, theme')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setName(data.name || '');
      setLanguage(data.language || 'en');
      if (data.theme) {
        setTheme(data.theme as 'light' | 'dark');
      }
      if (data.language) {
        i18n.changeLanguage(data.language);
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          language,
          theme,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      i18n.changeLanguage(language);
      localStorage.setItem('longlife-language', language);

      toast({
        title: t('success'),
        description: "Settings saved successfully!",
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

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('profile')}
              </CardTitle>
              <CardDescription>{t('editProfile')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('language')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className="flex-1"
                >
                  English
                </Button>
                <Button
                  variant={language === 'pt' ? 'default' : 'outline'}
                  onClick={() => setLanguage('pt')}
                  className="flex-1"
                >
                  Português
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('theme')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex-1"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  {t('lightMode')}
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex-1"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  {t('darkMode')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full" size="lg" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {t('saveChanges')}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
