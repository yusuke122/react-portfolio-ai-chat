import create from 'zustand';
import { persist } from 'zustand/middleware';
import React, { createContext, useContext, ReactNode, useEffect } from 'react';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, toggleTheme } = useThemeStore();

  // Set initial dark theme immediately to prevent flash
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Check if user has a stored preference, otherwise default to dark
      const storedTheme = localStorage.getItem('theme-storage');
      let initialTheme = 'dark';
      
      if (storedTheme) {
        try {
          const parsed = JSON.parse(storedTheme);
          initialTheme = parsed.state?.theme || 'dark';
        } catch (e) {
          initialTheme = 'dark';
        }
      }
      
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Reflect theme changes to the document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
