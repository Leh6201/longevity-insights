import React, { createContext, useContext, useCallback } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always light — no dark mode
  const theme: Theme = 'light';

  // Ensure dark class is never present
  document.documentElement.classList.remove('dark');

  const setTheme = useCallback((_: Theme) => {
    // No-op: dark mode is permanently disabled
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = useCallback(() => {
    // No-op: dark mode is permanently disabled
  }, []);

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
