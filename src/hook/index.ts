import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { AppTheme } from '../theme';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppTheme = () => useTheme<AppTheme>();

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
