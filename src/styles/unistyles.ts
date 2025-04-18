import { StyleSheet } from 'react-native-unistyles';
import { AppTheme, darkTheme } from './theme';
// Определяем брейкпоинты
const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
} as const;

// Определяем темы
const themes = {
  dark: darkTheme,
} as const;

// Определяем настройки
const settings = {
  initialTheme: 'dark',
  adaptiveThemes: false,
  CSSVars: true,
  nativeBreakpointsMode: 'pixels' as const,
};

// Типы для TypeScript
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    dark: AppTheme;
  }
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Конфигурируем Unistyles
StyleSheet.configure({
  themes,
  breakpoints,
  settings,
}); 

// Простые базовые стили без сложной структуры
export const stylesheet = StyleSheet.create((theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
})); 