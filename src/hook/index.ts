import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { AppTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { useContext } from 'react';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppTheme = () => {
  const paperTheme = useTheme<AppTheme>();
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  
  return {
    ...paperTheme,
    isDark: context.isDark,
    toggleTheme: context.toggleTheme,
    setThemeMode: context.setThemeMode,
    themeMode: context.themeMode,
  };
};

export const useAccessToken = () => {
  const token = useAppSelector((state: RootState) => state.auth.accessToken);
  return token;
};

export const useRefreshToken = () => {
  const token = useAppSelector((state: RootState) => state.auth.refreshToken);
  return token;
};

export const useAuth = () => {
  const auth = useAppSelector((state: RootState) => state.auth);
  return auth;
};
