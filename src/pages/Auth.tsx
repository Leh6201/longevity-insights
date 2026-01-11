import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'forgot';

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  // Check onboarding status and redirect accordingly after session is confirmed
  useEffect(() => {
    const checkOnboardingAndRedirect = async () => {
      if (!user || checkingOnboarding || authLoading) return;
      
      // Wait for session to be fully established
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      setCheckingOnboarding(true);
      
      // Small delay to ensure session is persisted
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const { data: onboarding } = await supabase
          .from('onboarding_data')
          .select('completed')
          .eq('user_id', user.id)
          .single();

        // Use hard redirect for production compatibility
        if (onboarding?.completed) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/onboarding';
        }
      } catch (error) {
        // No onboarding data found, redirect to onboarding
        window.location.href = '/onboarding';
      }
    };

    if (user && !authLoading) {
      checkOnboardingAndRedirect();
    }
  }, [user, authLoading, checkingOnboarding]);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'register') setMode('signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        // Redirect will be handled by the useEffect above
      } else if (mode === 'signup') {
        await signUp(email, password, name);
        // Redirect will be handled by the useEffect above
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMode('signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  // Show loading while checking auth or onboarding
  if (authLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-border/50">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Dna className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-display">{t('welcome')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('tagline')}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === 'forgot' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode('signin')}
                    className="mb-2 -ml-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    {t('backToLogin')}
                  </Button>
                )}

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('forgotPassword')}
                  </button>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === 'signin' ? (
                    t('signIn')
                  ) : mode === 'signup' ? (
                    t('createAccount')
                  ) : (
                    t('sendResetLink')
                  )}
                </Button>

                {mode !== 'forgot' && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          {t('orContinueWith')}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="social"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {t('continueWithGoogle')}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      {mode === 'signin' ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-primary font-medium hover:underline"
                      >
                        {mode === 'signin' ? t('signUp') : t('signIn')}
                      </button>
                    </p>
                  </>
                )}
              </motion.form>
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-6 px-4">
          {t('disclaimer')}
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
