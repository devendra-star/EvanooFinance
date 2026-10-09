import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from './index';

type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeContextType = {
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_mode';

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
          setThemeModeState(storedTheme as ThemeMode);
        }
      } catch (e) {
        console.error('Failed to load theme mode', e);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.error('Failed to save theme mode', e);
    }
  }, []);

  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  
  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  const theme = isDark ? darkTheme : lightTheme;

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, toggleTheme, setThemeMode }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
