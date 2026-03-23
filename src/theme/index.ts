import { useMemo } from 'react';
import { useSettingsStore } from '@/stores/use-settings-store';
import { lightColors, darkColors, type ColorTokens } from './colors';
import { typography, type Typography } from './typography';
import { spacing, type Spacing } from './spacing';
import { radius, type Radius } from './radius';
import { createComponentTokens, type ComponentTokens } from './components';

export interface Theme {
  colors: ColorTokens;
  typography: Typography;
  spacing: Spacing;
  radius: Radius;
  components: ComponentTokens;
}

export function useTheme(): Theme {
  const theme = useSettingsStore((s) => s.theme);

  return useMemo(() => {
    const colors = theme === 'dark' ? darkColors : lightColors;
    return {
      colors,
      typography,
      spacing,
      radius,
      components: createComponentTokens(colors, radius, spacing),
    };
  }, [theme]);
}

export { lightColors, darkColors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { radius } from './radius';
export { createComponentTokens } from './components';
export { decorativePalette } from './palette';
export type { ColorTokens } from './colors';
export type { Typography, TypographyVariant } from './typography';
export type { Spacing } from './spacing';
export type { Radius } from './radius';
export type { ComponentTokens } from './components';
