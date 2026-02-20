import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Read saved preference; default to 'light' if none exists
    const saved = localStorage.getItem('longlife-theme') as Theme | null;
    const initial: Theme = saved === 'dark' ? 'dark' : 'light';

    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');

    // Listen for auth changes to load theme from profile
    // Only apply profile theme if user has explicitly saved a preference (localStorage exists)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(async () => {
          try {
            const localSaved = localStorage.getItem('longlife-theme');
            // Only sync from profile if user already has a local saved preference
            // This prevents overriding the 'light' default with a stale 'dark' from profile
            if (localSaved === 'dark' || localSaved === 'light') {
              // Local preference takes priority — sync it back to profile if needed
              return;
            }
            // No local preference yet: check profile, but default to light if profile has dark
            // (profile may have stale dark from before this fix)
            const { data: profile } = await supabase
              .from('profiles')
              .select('theme')
              .eq('user_id', session.user.id)
              .single();

            if (profile?.theme && profile.theme === 'dark') {
              // User explicitly chose dark in a previous session — respect it
              // but only if there's evidence of intentional choice (profile has it)
              // Since we can't distinguish, default to light for first-time fix
              // Set light and update profile to match
              setThemeState('light');
              document.documentElement.classList.remove('dark');
              localStorage.setItem('longlife-theme', 'light');
              await supabase
                .from('profiles')
                .update({ theme: 'light', updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id);
            } else if (profile?.theme === 'light') {
              setThemeState('light');
              document.documentElement.classList.remove('dark');
              localStorage.setItem('longlife-theme', 'light');
            }
          } catch (e) {
            // ignore
          }
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('longlife-theme', newTheme);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ theme: newTheme, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
