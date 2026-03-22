import { useSettingsStore } from '@/stores/use-settings-store';
import { lightColors, darkColors, type ColorTokens } from './colors';
import { typography, type Typography } from './typography';
import { spacing, type Spacing } from './spacing';

export interface Theme {
  colors: ColorTokens;
  typography: Typography;
  spacing: Spacing;
}

export function useTheme(): Theme {
  const theme = useSettingsStore((s) => s.theme);

  return {
    colors: theme === 'dark' ? darkColors : lightColors,
    typography,
    spacing,
  };
}

export { lightColors, darkColors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export type { ColorTokens } from './colors';
export type { Typography, TypographyVariant } from './typography';
export type { Spacing } from './spacing';
