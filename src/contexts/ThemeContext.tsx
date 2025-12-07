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
  const [theme, setThemeState] = useState<Theme>('dark');
  const [userId, setUserId] = useState<string | null>(null);

  // Get initial theme on mount
  useEffect(() => {
    const initTheme = () => {
      // Check sessionStorage for guest
      const sessionTheme = sessionStorage.getItem('longlife-theme-guest') as Theme;
      if (sessionTheme) {
        setThemeState(sessionTheme);
        document.documentElement.classList.toggle('dark', sessionTheme === 'dark');
        return;
      }
      
      // Fallback to localStorage
      const savedTheme = localStorage.getItem('longlife-theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        // Default to dark
        document.documentElement.classList.add('dark');
      }
    };

    initTheme();

    // Listen for auth changes - defer Supabase calls to avoid deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        // Defer profile fetch to avoid deadlock
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('theme')
              .eq('user_id', session.user.id)
              .single();
            
            if (profile?.theme) {
              setThemeState(profile.theme as Theme);
              document.documentElement.classList.toggle('dark', profile.theme === 'dark');
            }
          } catch (e) {
            console.log('Theme profile fetch error:', e);
          }
        }, 0);
      } else {
        setUserId(null);
      }
    });

    // Listen for storage events (from AuthContext)
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('longlife-theme') as Theme;
      if (savedTheme && savedTheme !== theme) {
        setThemeState(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Save to localStorage always (fallback)
    localStorage.setItem('longlife-theme', newTheme);
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Save to profile for logged-in users
      await supabase
        .from('profiles')
        .update({ theme: newTheme, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    } else {
      // Save to sessionStorage for guests
      sessionStorage.setItem('longlife-theme-guest', newTheme);
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
