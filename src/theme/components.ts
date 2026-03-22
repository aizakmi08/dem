import type { ColorTokens } from './colors';
import type { Radius } from './radius';
import type { Spacing } from './spacing';

export function createComponentTokens(
  colors: ColorTokens,
  radius: Radius,
  spacing: Spacing
) {
  return {
    button: {
      primary: {
        height: spacing['5xl'],
        borderRadius: radius.xl,
        backgroundColor: colors.primary,
        color: colors.white,
      },
      secondary: {
        height: spacing['5xl'],
        borderRadius: radius.xl,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
      },
      outline: {
        height: spacing['4xl'],
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.textSecondary,
      },
      dark: {
        height: spacing['5xl'],
        borderRadius: radius.xl,
        backgroundColor: colors.text,
        color: colors.white,
      },
      icon: {
        size: spacing['5xl'],
        borderRadius: radius.full,
        backgroundColor: colors.background,
        color: colors.text,
      },
      iconLarge: {
        size: spacing['6xl'],
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        color: colors.white,
      },
    },

    card: {
      default: {
        borderRadius: radius['2xl'],
        padding: spacing['2xl'],
        backgroundColor: colors.surface,
      },
      small: {
        borderRadius: radius.xl,
        padding: spacing.lg,
        backgroundColor: colors.surface,
      },
      list: {
        borderRadius: radius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
      },
    },

    searchBar: {
      height: 48,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
      backgroundColor: colors.surface,
      placeholderColor: colors.textSecondary,
    },

    tabBar: {
      height: 80,
      backgroundColor: colors.background,
      iconSize: 22,
      gap: spacing.sm,
      activeColor: colors.primary,
      inactiveColor: colors.textSecondary,
    },

    chip: {
      borderRadius: radius['2xl'],
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.surface,
      activeBackgroundColor: colors.primary,
      color: colors.text,
      activeColor: colors.white,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
    },

    avatar: {
      small: { size: 36, borderRadius: radius.full },
      medium: { size: 44, borderRadius: radius.full },
      large: { size: 56, borderRadius: radius.full },
      xlarge: { size: 88, borderRadius: radius.full },
    },

    progressBar: {
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.border,
      fillColor: colors.accent,
    },
  } as const;
}

export type ComponentTokens = ReturnType<typeof createComponentTokens>;
