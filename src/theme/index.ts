import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import type { MD3Typescale } from 'react-native-paper/lib/typescript/types';

export const ThemeFonts: MD3Typescale = {
  default: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
  displayMedium: {
    fontFamily: 'Inter-Regular',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displayLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  headlineSmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineMedium: {
    fontFamily: 'Inter-Regular',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  titleSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  titleMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleLarge: {
    fontFamily: 'Inter-Medium',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 28,
  },
  labelSmall: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelMedium: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  bodyMedium: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
};

const lightCustomColors = {
  mainGradientStart: '#0798DE',
  mainGradientEnd: '#45C4F4',
  buttonGradientStart: '#008FDB',
  buttonGradientEnd: '#55C4FE',
  borderColor: '#DCE6EE',
  cardIconBox: '#CCF1FF',
  cardShadow: 'rgba(0, 102, 193, 0.16)',
};

const darkCustomColors = {
  mainGradientStart: '#0798DE',
  mainGradientEnd: '#45C4F4',
  buttonGradientStart: '#008FDB',
  buttonGradientEnd: '#55C4FE',
  borderColor: '#34465C',
  cardIconBox: '#163B52',
  cardShadow: 'rgba(0, 0, 0, 0.32)',
};

export const lightTheme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 12,

  colors: {
    ...MD3LightTheme.colors,

    primary: '#0295DB',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4F0FF',
    onPrimaryContainer: '#00344D',

    secondary: '#526579',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#DCE8F2',
    onSecondaryContainer: '#192C3B',

    tertiary: '#6E5676',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#F7D8FF',
    onTertiaryContainer: '#271430',

    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    background: '#F1F6FC',
    onBackground: '#172033',

    surface: '#FFFFFF',
    onSurface: '#172033',
    surfaceVariant: '#E8EEF5',
    onSurfaceVariant: '#526174',

    outline: '#8292A5',
    outlineVariant: '#D7E0EA',

    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#293746',
    inverseOnSurface: '#F1F5F9',
    inversePrimary: '#85D1F5',

    elevation: {
      level0: 'transparent',
      level1: '#F8FAFD',
      level2: '#F2F7FC',
      level3: '#EAF2FA',
      level4: '#E7F0F9',
      level5: '#E1ECF7',
    },

    surfaceDisabled: 'rgba(23, 32, 51, 0.12)',
    onSurfaceDisabled: 'rgba(23, 32, 51, 0.38)',
    backdrop: 'rgba(7, 19, 33, 0.40)',

    ...lightCustomColors,
  },

  fonts: {
    ...MD3LightTheme.fonts,
    ...ThemeFonts,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 12,

  colors: {
    ...MD3DarkTheme.colors,

    primary: '#39B9F4',
    onPrimary: '#00344D',
    primaryContainer: '#004D70',
    onPrimaryContainer: '#D4F0FF',

    secondary: '#B8C9D9',
    onSecondary: '#253747',
    secondaryContainer: '#394D60',
    onSecondaryContainer: '#DCE8F2',

    tertiary: '#DABDE2',
    onTertiary: '#3D2846',
    tertiaryContainer: '#553F5D',
    onTertiaryContainer: '#F7D8FF',

    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    background: '#071321',
    onBackground: '#E6EDF5',

    surface: '#111F30',
    onSurface: '#E6EDF5',
    surfaceVariant: '#29394C',
    onSurfaceVariant: '#C1CDDA',

    outline: '#8D9CAF',
    outlineVariant: '#3B4B5E',

    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#E6EDF5',
    inverseOnSurface: '#293746',
    inversePrimary: '#006A9B',

    elevation: {
      level0: 'transparent',
      level1: '#152335',
      level2: '#19283B',
      level3: '#1D2D42',
      level4: '#1F3045',
      level5: '#24354B',
    },

    surfaceDisabled: 'rgba(230, 237, 245, 0.12)',
    onSurfaceDisabled: 'rgba(230, 237, 245, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.60)',

    ...darkCustomColors,
  },

  fonts: {
    ...MD3DarkTheme.fonts,
    ...ThemeFonts,
  },
};

export type AppTheme = typeof lightTheme;

export default lightTheme;
